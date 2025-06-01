import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    origin_bank: string;
    destination_bank: string;
  };
}

interface HmacKeyResponse {
  origin_bank: string;
  destination_bank: string;
  secret_key: string;
  created_at: string;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { origin_bank, destination_bank } = params;
  try {
    const registro = await prisma.hmac_keys.findUnique({
      where: {
        origin_bank_destination_bank: {
          origin_bank: origin_bank,
          destination_bank: destination_bank,
        },
      },
    });

    if (!registro) {
      return NextResponse.json(
        { error: 'HMAC key no encontrada' },
        { status: 404 }
      );
    }

    const respuesta: HmacKeyResponse = {
      origin_bank: registro.origin_bank,
      destination_bank: registro.destination_bank,
      secret_key: registro.secret_key.toString('base64'),
      created_at: registro.created_at.toISOString(),
    };

    return NextResponse.json(respuesta, { status: 200 });
  } catch (error) {
    console.error(
      `Error en GET /api/hmac-keys/${origin_bank}/${destination_bank}:`,
      error
    );
    return NextResponse.json(
      { error: 'Error al obtener la HMAC key' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { origin_bank, destination_bank } = params;
  try {
    const body = await req.json();
    const { secret_key } = body;

    if (!secret_key || typeof secret_key !== 'string') {
      return NextResponse.json(
        { error: 'Falta campo secret_key o no es un string' },
        { status: 400 }
      );
    }

    let bufferKey: Buffer;
    try {
      bufferKey = Buffer.from(secret_key, 'base64');
    } catch (err) {
      return NextResponse.json(
        { error: 'Secret_key debe ser un Base64 válido' },
        { status: 400 }
      );
    }

    const actualizado = await prisma.hmac_keys.update({
      where: {
        origin_bank_destination_bank: {
          origin_bank: origin_bank,
          destination_bank: destination_bank,
        },
      },
      data: {
        secret_key: bufferKey,
      },
    });

    const respuesta: HmacKeyResponse = {
      origin_bank: actualizado.origin_bank,
      destination_bank: actualizado.destination_bank,
      secret_key: actualizado.secret_key.toString('base64'),
      created_at: actualizado.created_at.toISOString(),
    };

    return NextResponse.json(respuesta, { status: 200 });
  } catch (error) {
    console.error(
      `Error en PUT /api/hmac-keys/${origin_bank}/${destination_bank}:`,
      error
    );

    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'HMAC key no encontrada para actualizar' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'No se pudo actualizar la HMAC key' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { origin_bank, destination_bank } = params;
  try {
    await prisma.hmac_keys.delete({
      where: {
        origin_bank_destination_bank: {
          origin_bank: origin_bank,
          destination_bank: destination_bank,
        },
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(
      `Error en DELETE /api/hmac-keys/${origin_bank}/${destination_bank}:`,
      error
    );

    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'HMAC key no encontrada para eliminar' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'No se pudo eliminar la HMAC key' },
      { status: 500 }
    );
  }
}
