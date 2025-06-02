import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { encryptText, decryptText } from '@/lib/crypto';

interface Params {
  params: { iban: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  const { iban } = params;

  try {
    const cuenta = await prisma.accounts.findUnique({
      where: { iban },
    });

    if (!cuenta) {
      return NextResponse.json(
        { error: 'Cuenta no encontrada' },
        { status: 404 }
      );
    }

    let nombreTitular: string;
    try {
      nombreTitular = decryptText(cuenta.account_holder);
    } catch (e) {
      nombreTitular = cuenta.account_holder;
    }

    const respuesta = {
      iban: cuenta.iban,
      bank_code: cuenta.bank_code,
      account_holder: nombreTitular,
      balance: cuenta.balance,
      state: cuenta.state,
      created_at: cuenta.created_at,
      updated_at: cuenta.updated_at,
    };

    return NextResponse.json(respuesta, { status: 200 });
  } catch (error) {
    console.error(`Error en GET /api/accounts/${iban}:`, error);
    return NextResponse.json(
      { error: 'Error al buscar la cuenta' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { iban } = params;

  try {
    const body = await req.json();
    const { account_holder, balance, state } = body;

    const datosAActualizar: any = {};
    if (account_holder !== undefined) {
      datosAActualizar.account_holder = encryptText(String(account_holder));
    }
    if (balance !== undefined) {
      datosAActualizar.balance = Number(balance);
    }
    if (state !== undefined) {
      datosAActualizar.state = String(state);
    }

    datosAActualizar.updated_at = new Date();

    const cuentaActualizada = await prisma.accounts.update({
      where: { iban },
      data: datosAActualizar,
    });

    let nombreTitular: string;
    try {
      nombreTitular = account_holder !== undefined
        ? String(account_holder)
        : decryptText(cuentaActualizada.account_holder);
    } catch {
      nombreTitular = cuentaActualizada.account_holder;
    }

    const respuesta = {
      iban: cuentaActualizada.iban,
      bank_code: cuentaActualizada.bank_code,
      account_holder: nombreTitular,
      balance: cuentaActualizada.balance,
      state: cuentaActualizada.state,
      created_at: cuentaActualizada.created_at,
      updated_at: cuentaActualizada.updated_at,
    };

    return NextResponse.json(respuesta, { status: 200 });
  } catch (error) {
    console.error(`Error en PUT /api/accounts/${iban}:`, error);
    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Cuenta no encontrada para actualizar' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo actualizar la cuenta' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { iban } = params;

  try {
    await prisma.accounts.delete({
      where: { iban },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error en DELETE /api/accounts/${iban}:`, error);
    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Cuenta no encontrada para eliminar' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo eliminar la cuenta' },
      { status: 500 }
    );
  }
}
