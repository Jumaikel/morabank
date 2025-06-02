import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { use } from "react";

interface MfaCodeRequest {
  user_id: string;
  mfa_code: string;
  expires_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const allCodes = await prisma.mfa_codes.findMany({
      orderBy: { created_at: "desc" },
    });

    interface RawMfaCode {
      id: number;
      user_id: string;
      mfa_code: string;
      created_at: Date;
      expires_at: Date;
      used: boolean;
    }

    interface MfaCode {
      id: number;
      user_id: string;
      mfa_code: string;
      created_at: string;
      expires_at: string;
      used: boolean;
    }

    const formatted: MfaCode[] = allCodes.map(
      (item: RawMfaCode): MfaCode => ({
        id: item.id,
        user_id: item.user_id,
        mfa_code: item.mfa_code,
        created_at: item.created_at.toISOString(),
        expires_at: item.expires_at.toISOString(),
        used: item.used,
      })
    );

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/mfa-codes:", error);
    return NextResponse.json(
      { error: "Error al listar MFA codes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: MfaCodeRequest = await req.json();
    const { user_id, mfa_code, expires_at } = body;

    if (
      !user_id ||
      !mfa_code ||
      !expires_at ||
      typeof user_id !== "string" ||
      typeof mfa_code !== "string" ||
      typeof expires_at !== "string"
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios o tipos inválidos" },
        { status: 400 }
      );
    }

    const expiresDate = new Date(expires_at);
    if (isNaN(expiresDate.getTime())) {
      return NextResponse.json(
        { error: "expires_at debe ser una fecha ISO válida" },
        { status: 400 }
      );
    }

    const newMfa = await prisma.mfa_codes.create({
      data: {
        user_id: user_id,
        mfa_code: mfa_code,
        expires_at: expiresDate,
        used: false,
        created_at: new Date(),
      },
    });

    const response = {
      id: newMfa.id,
      user_id: newMfa.user_id,
      mfa_code: newMfa.mfa_code,
      created_at: newMfa.created_at.toISOString(),
      expires_at: newMfa.expires_at.toISOString(),
      used: newMfa.used,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/mfa-codes:", error);

    if (
      typeof (error as any).code === "string" &&
      (error as any).code === "P2003"
    ) {
      return NextResponse.json(
        { error: "El usuario indicado (user_id) no existe" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "No se pudo crear el MFA code" },
      { status: 500 }
    );
  }
}
