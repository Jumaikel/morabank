import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const lastBank = await prisma.banks.findFirst({
      orderBy: { created_at: 'desc' },
    });
    if (!lastBank) {
      return NextResponse.json({ error: 'No existen bancos registrados' }, { status: 404 });
    }
    return NextResponse.json(lastBank, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/banks/last:', error);
    return NextResponse.json(
      { error: 'Error al obtener el último banco' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bank_code, name, address } = body;

    if (!bank_code || !name) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: bank_code y name" },
        { status: 400 }
      );
    }

    const nuevoBanco = await prisma.banks.create({
      data: {
        bank_code: String(bank_code),
        name: String(name),
        address: address !== undefined ? String(address) : null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(nuevoBanco, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/banks:", error);

    if (
      typeof (error as any).code === "string" &&
      (error as any).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ya existe un banco con ese bank_code" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "No se pudo crear el banco" },
      { status: 500 }
    );
  }
}
