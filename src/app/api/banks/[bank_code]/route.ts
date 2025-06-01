import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: { bank_code: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  const { bank_code } = params;
  try {
    const banco = await prisma.banks.findUnique({
      where: { bank_code },
    });

    if (!banco) {
      return NextResponse.json(
        { error: 'Banco no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(banco, { status: 200 });
  } catch (error) {
    console.error(`Error en GET /api/banks/${bank_code}:`, error);
    return NextResponse.json(
      { error: 'Error al buscar el banco' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { bank_code } = params;
  try {
    const body = await req.json();
    const { name, address } = body;

    if (name === undefined && address === undefined) {
      return NextResponse.json(
        { error: 'Se requiere name o address para actualizar' },
        { status: 400 }
      );
    }

    const datosAActualizar: any = {};
    if (name !== undefined) datosAActualizar.name = String(name);
    if (address !== undefined) datosAActualizar.address =
      address !== null ? String(address) : null;

    const bancoActualizado = await prisma.banks.update({
      where: { bank_code },
      data: datosAActualizar,
    });

    return NextResponse.json(bancoActualizado, { status: 200 });
  } catch (error) {
    console.error(`Error en PUT /api/banks/${bank_code}:`, error);

    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Banco no encontrado para actualizar' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'No se pudo actualizar el banco' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { bank_code } = params;
  try {
    await prisma.banks.delete({
      where: { bank_code },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error en DELETE /api/banks/${bank_code}:`, error);

    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Banco no encontrado para eliminar' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo eliminar el banco' },
      { status: 500 }
    );
  }
}
