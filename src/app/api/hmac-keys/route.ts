import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface HmacKeyResponse {
  origin_bank: string;
  destination_bank: string;
  secret_key: string;   // Base64
  created_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const allKeys = await prisma.hmac_keys.findMany({
      orderBy: {
        origin_bank: 'asc',
      },
    });

    interface RawHmacKey {
        origin_bank: string
        destination_bank: string
        secret_key: Buffer
        created_at: Date
    }

    const formatted: HmacKeyResponse[] = allKeys.map(
        (item: RawHmacKey): HmacKeyResponse => ({
            origin_bank: item.origin_bank,
            destination_bank: item.destination_bank,
            secret_key: item.secret_key.toString('base64'),
            created_at: item.created_at.toISOString(),
        })
    )

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/hmac-keys:', error);
    return NextResponse.json(
      { error: 'Error al listar HMAC keys' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin_bank, destination_bank, secret_key } = body;

    if (
      !origin_bank ||
      !destination_bank ||
      !secret_key ||
      typeof origin_bank !== 'string' ||
      typeof destination_bank !== 'string' ||
      typeof secret_key !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios o tipos inválidos' },
        { status: 400 }
      );
    }

    let bufferKey: Buffer;
    try {
      bufferKey = Buffer.from(secret_key, 'base64');
    } catch (err) {
      return NextResponse.json(
        { error: 'El campo secret_key debe ser un string Base64 válido' },
        { status: 400 }
      );
    }

    const nuevaHmac = await prisma.hmac_keys.create({
      data: {
        origin_bank: origin_bank,
        destination_bank: destination_bank,
        secret_key: bufferKey,
        created_at: new Date(),
      },
    });

    const respuesta = {
      origin_bank: nuevaHmac.origin_bank,
      destination_bank: nuevaHmac.destination_bank,
      secret_key: nuevaHmac.secret_key.toString('base64'),
      created_at: nuevaHmac.created_at.toISOString(),
    };

    return NextResponse.json(respuesta, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/hmac-keys:', error);

    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2002'
    ) {
      return NextResponse.json(
        {
          error:
            'Ya existe una clave HMAC para esa combinación origin_bank/destination_bank',
        },
        { status: 409 }
      );
    }

    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2003'
    ) {
      return NextResponse.json(
        { error: 'Uno o ambos bancos (origin/destination) no existen' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'No se pudo crear la HMAC key' },
      { status: 500 }
    );
  }
}
