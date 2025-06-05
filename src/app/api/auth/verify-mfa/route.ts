import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

interface VerifyMfaRequest {
  identification: string;
  mfa_code: string;
}

export async function POST(req: NextRequest) {
  try {
    const { identification, mfa_code }: VerifyMfaRequest = await req.json();

    if (
      !identification ||
      !mfa_code ||
      typeof identification !== "string" ||
      typeof mfa_code !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Los campos identification y mfa_code son obligatorios y deben ser cadenas.",
        },
        { status: 400 }
      );
    }

    // 1) Verificar que el usuario exista (solo por robustez)
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

    // 2) Buscar un código MFA válido (no usado y no expirado)
    const now = new Date();
    const mfaRecord = await prisma.mfa_codes.findFirst({
      where: {
        user_id: identification,
        mfa_code,
        used: false,
        expires_at: { gt: now },
      },
      orderBy: { created_at: "desc" },
    });

    if (!mfaRecord) {
      return NextResponse.json(
        { error: "Código MFA inválido o expirado." },
        { status: 400 }
      );
    }

    // 3) Marcar el código como usado
    await prisma.mfa_codes.update({
      where: { id: mfaRecord.id },
      data: { used: true },
    });

    // 4) Generar un token JWT usando el helper
    const token = signToken({ identification });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Error en POST /api/auth/verify-mfa:", error);
    return NextResponse.json(
      { error: "Error interno al verificar MFA." },
      { status: 500 }
    );
  }
}
