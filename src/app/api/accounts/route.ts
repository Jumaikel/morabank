import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { encryptText, decryptText } from '@/lib/crypto';

export async function GET(req: NextRequest) {
  try {
    const cuentas = await prisma.accounts.findMany();

    interface DBAccount {
        iban: string
        bank_code: string
        account_holder: string
        balance?: number | null
        state?: string | null
        created_at: Date
        updated_at: Date
    }

    interface DecryptedAccount {
        iban: string
        bank_code: string
        account_holder: string
        balance?: number | null
        state?: string | null
        created_at: Date
        updated_at: Date
    }

    const cuentasDesencriptadas: DecryptedAccount[] = cuentas.map((c: DBAccount) => {
        let nombreTitular: string
        try {
            nombreTitular = decryptText(c.account_holder)
        } catch (e) {
            nombreTitular = c.account_holder
        }

        return {
            iban: c.iban,
            bank_code: c.bank_code,
            account_holder: nombreTitular,
            balance: c.balance,
            state: c.state,
            created_at: c.created_at,
            updated_at: c.updated_at,
        }
    })

    return NextResponse.json(cuentasDesencriptadas, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/accounts:', error);
    return NextResponse.json(
      { error: 'Error al leer cuentas' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { iban, bank_code, account_holder, balance, state } = body;
    if (!iban || !bank_code || !account_holder) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: iban, bank_code, account_holder' },
        { status: 400 }
      );
    }

    const cuentaCifrada = {
      iban: String(iban),
      bank_code: String(bank_code),
      account_holder: encryptText(String(account_holder)),
      balance: balance !== undefined ? Number(balance) : undefined,
      state: state !== undefined ? String(state) : undefined,
    };

    const nuevaCuenta = await prisma.accounts.create({
      data: cuentaCifrada as any,
    });

    const respuestaFinal = {
      iban: nuevaCuenta.iban,
      bank_code: nuevaCuenta.bank_code,
      account_holder: account_holder,
      balance: nuevaCuenta.balance,
      state: nuevaCuenta.state,
      created_at: nuevaCuenta.created_at,
      updated_at: nuevaCuenta.updated_at,
    };

    return NextResponse.json(respuestaFinal, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/accounts:', error);
    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con ese IBAN' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo crear la cuenta' },
      { status: 500 }
    );
  }
}
