import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: { transaction_id: string };
}

interface UpdateTransactionBody {
  state?: 'PENDING' | 'COMPLETED' | 'REJECTED';
  reason?: string | null;
  currency?: string;
  // NOTA: no permitimos cambiar origin_iban, destination_iban ni amount aquí.
}

interface TransactionResponse {
  transaction_id: string;
  created_at: string;       // ISO
  origin_iban: string;
  destination_iban: string;
  amount: number;
  currency: string;
  state: string;
  reason: string | null;
  hmac_md5: string;
  updated_at: string;       // ISO
}

export async function GET(req: NextRequest, { params }: Params) {
  const { transaction_id } = params;
  try {
    const tx = await prisma.transactions.findUnique({
      where: { transaction_id },
    });
    if (!tx) {
      return NextResponse.json(
        { error: 'Transacción no encontrada' },
        { status: 404 }
      );
    }

    const response: TransactionResponse = {
      transaction_id: tx.transaction_id,
      created_at: tx.created_at.toISOString(),
      origin_iban: tx.origin_iban,
      destination_iban: tx.destination_iban,
      amount: Number(tx.amount),
      currency: tx.currency,
      state: tx.state,
      reason: tx.reason,
      hmac_md5: tx.hmac_md5,
      updated_at: tx.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(
      `Error en GET /api/transactions/${transaction_id}:`,
      error
    );
    return NextResponse.json(
      { error: 'Error al buscar la transacción' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { transaction_id } = params;
  try {
    const body: UpdateTransactionBody = await req.json();
    const { state, reason, currency } = body;

    if (state === undefined && reason === undefined && currency === undefined) {
      return NextResponse.json(
        {
          error:
            'Debes enviar al menos uno de estos campos: state, reason, currency',
        },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};
    if (state !== undefined) {
      if (!['PENDING', 'COMPLETED', 'REJECTED'].includes(state)) {
        return NextResponse.json(
          { error: 'El campo state no tiene un valor válido' },
          { status: 400 }
        );
      }
      dataToUpdate.state = state;
    }
    if (reason !== undefined) {
      if (reason !== null && typeof reason !== 'string') {
        return NextResponse.json(
          { error: 'El campo reason debe ser string o null' },
          { status: 400 }
        );
      }
      dataToUpdate.reason = reason;
    }
    if (currency !== undefined) {
      if (typeof currency !== 'string' || currency.length !== 3) {
        return NextResponse.json(
          { error: 'El campo currency debe ser un string de 3 letras' },
          { status: 400 }
        );
      }
      dataToUpdate.currency = currency;
    }

    const updatedTx = await prisma.transactions.update({
      where: { transaction_id },
      data: dataToUpdate,
    });

    const response: TransactionResponse = {
      transaction_id: updatedTx.transaction_id,
      created_at: updatedTx.created_at.toISOString(),
      origin_iban: updatedTx.origin_iban,
      destination_iban: updatedTx.destination_iban,
      amount: Number(updatedTx.amount),
      currency: updatedTx.currency,
      state: updatedTx.state,
      reason: updatedTx.reason,
      hmac_md5: updatedTx.hmac_md5,
      updated_at: updatedTx.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(
      `Error en PUT /api/transactions/${transaction_id}:`,
      error
    );
    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Transacción no encontrada para actualizar' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo actualizar la transacción' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { transaction_id } = params;
  try {
    await prisma.transactions.delete({
      where: { transaction_id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(
      `Error en DELETE /api/transactions/${transaction_id}:`,
      error
    );
    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Transacción no encontrada para eliminar' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo eliminar la transacción' },
      { status: 500 }
    );
  }
}
