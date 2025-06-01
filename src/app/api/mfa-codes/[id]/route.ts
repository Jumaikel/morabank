import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: { id: string };
}

interface MfaCodeUpdateRequest {
  mfa_code?: string;
  expires_at?: string;
  used?: boolean;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json(
      { error: "ID inválido; debe ser un número entero" },
      { status: 400 }
    );
  }

  try {
    const registro = await prisma.mfa_codes.findUnique({
      where: { id: idNum },
    });

    if (!registro) {
      return NextResponse.json(
        { error: "MFA code no encontrado" },
        { status: 404 }
      );
    }

    const response = {
      id: registro.id,
      user_id: registro.user_id,
      mfa_code: registro.mfa_code,
      created_at: registro.created_at.toISOString(),
      expires_at: registro.expires_at.toISOString(),
      used: registro.used,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error en GET /api/mfa-codes/${id}:`, error);
    return NextResponse.json(
      { error: "Error al buscar el MFA code" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json(
      { error: "ID inválido; debe ser un número entero" },
      { status: 400 }
    );
  }

  try {
    const body: MfaCodeUpdateRequest = await req.json();
    const { mfa_code, expires_at, used } = body;

    if (
      mfa_code === undefined &&
      expires_at === undefined &&
      used === undefined
    ) {
      return NextResponse.json(
        { error: "Debes enviar al menos mfa_code, expires_at o used" },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};
    if (mfa_code !== undefined) {
      if (typeof mfa_code !== "string") {
        return NextResponse.json(
          { error: "mfa_code debe ser un string" },
          { status: 400 }
        );
      }
      dataToUpdate.mfa_code = mfa_code;
    }
    if (expires_at !== undefined) {
      if (typeof expires_at !== "string") {
        return NextResponse.json(
          { error: "expires_at debe ser un string ISO de fecha" },
          { status: 400 }
        );
      }
      const dateObj = new Date(expires_at);
      if (isNaN(dateObj.getTime())) {
        return NextResponse.json(
          { error: "expires_at debe ser una fecha ISO válida" },
          { status: 400 }
        );
      }
      dataToUpdate.expires_at = dateObj;
    }
    if (used !== undefined) {
      if (typeof used !== "boolean") {
        return NextResponse.json(
          { error: "used debe ser booleano" },
          { status: 400 }
        );
      }
      dataToUpdate.used = used;
    }

    const updated = await prisma.mfa_codes.update({
      where: { id: idNum },
      data: dataToUpdate,
    });

    const response = {
      id: updated.id,
      user_id: updated.user_id,
      mfa_code: updated.mfa_code,
      created_at: updated.created_at.toISOString(),
      expires_at: updated.expires_at.toISOString(),
      used: updated.used,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error en PUT /api/mfa-codes/${id}:`, error);

    if (
      typeof (error as any).code === "string" &&
      (error as any).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "MFA code no encontrado para actualizar" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "No se pudo actualizar el MFA code" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json(
      { error: "ID inválido; debe ser un número entero" },
      { status: 400 }
    );
  }

  try {
    await prisma.mfa_codes.delete({
      where: { id: idNum },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error en DELETE /api/mfa-codes/${id}:`, error);

    // Si no existe, Prisma arroja P2025
    if (
      typeof (error as any).code === "string" &&
      (error as any).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "MFA code no encontrado para eliminar" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "No se pudo eliminar el MFA code" },
      { status: 500 }
    );
  }
}
