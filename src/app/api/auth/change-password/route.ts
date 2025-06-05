import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface ChangePasswordRequest {
  identification: string;
  otp: string;
  newPassword: string;
}

export async function POST(req: NextRequest) {
  try {
    const { identification, otp, newPassword }: ChangePasswordRequest =
      await req.json();

    if (
      !identification ||
      !otp ||
      !newPassword ||
      typeof identification !== "string" ||
      typeof otp !== "string" ||
      typeof newPassword !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Los campos identification, otp y newPassword son obligatorios y deben ser cadenas.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { identification },
      select: { identification: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    // 2) Buscar OTP válido (no usado y no expirado)
    const now = new Date();
    const mfaRecord = await prisma.mfa_codes.findFirst({
      where: {
        user_id: identification,
        mfa_code: otp,
        used: false,
        expires_at: { gt: now },
      },
      orderBy: { created_at: "desc" },
    });

    if (!mfaRecord) {
      return NextResponse.json(
        { error: "Código OTP inválido o expirado." },
        { status: 400 }
      );
    }

    // 3) Hashear nueva contraseña
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    // 4) En una transacción: actualizar contraseña y marcar OTP como usado
    await prisma.$transaction([
      // Actualizar password
      prisma.users.update({
        where: { identification },
        data: { password_hash },
      }),
      // Marcar OTP como usado
      prisma.mfa_codes.update({
        where: { id: mfaRecord.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json(
      { message: "Contraseña actualizada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/auth/change-password:", error);
    return NextResponse.json(
      { error: "Error interno al cambiar la contraseña." },
      { status: 500 }
    );
  }
}
