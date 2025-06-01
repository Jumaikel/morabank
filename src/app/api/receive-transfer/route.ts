import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

interface ReceiveTransferBody {
  version: string;
  timestamp: string;
  transaction_id: string;
  sender: {
    account_number: string; // puede ser IBAN o número de celular
    bank_code: string;
    name: string;
  };
  receiver: {
    account_number: string; // puede ser IBAN o número de celular
    bank_code: string;
    name: string;
  };
  amount: {
    value: number;
    currency: string;
  };
  description?: string;
  hmac_md5: string;
}

/**
 * Calcula el HMAC-MD5 usando la clave secreta compartida.
 * Debe concordar con la forma en que el banco emisor construyó el payload.
 */
function calculateHmacMd5(
  transaction_id: string,
  origin_bank: string,
  origin_account: string,
  destination_bank: string,
  destination_account: string,
  amount: number,
  currency: string,
  secretKey: Buffer
): string {
  // Concatenamos los campos con '|' en el mismo orden exacto
  const payload = [
    transaction_id,
    origin_bank,
    origin_account,
    destination_bank,
    destination_account,
    amount.toFixed(2),
    currency,
  ].join('|');
  return crypto
    .createHmac('md5', secretKey)
    .update(payload, 'utf8')
    .digest('hex');
}

/**
 * Dado un account_number (puede ser IBAN o número de celular),
 * intenta resolverlo a la cuenta local (objeto { iban, balance, bank_code }).
 * Primero busca en accounts. Si no existe, busca en users por phone y obtiene su account_iban.
 */
async function resolveLocalAccount(
  account_number: string
): Promise<{
  iban: string;
  balance: number;
  bank_code: string;
} | null> {
  // 1. Intentar como IBAN
  const acct = await prisma.accounts.findUnique({
    where: { iban: account_number },
  });
  if (acct) {
    return {
      iban: acct.iban,
      balance: Number(acct.balance),
      bank_code: acct.bank_code,
    };
  }
  // 2. Intentar como teléfono en users
  const user = await prisma.users.findUnique({
    where: { phone: account_number },
    select: { account_iban: true },
  });
  if (!user) return null;
  // Ahora buscamos la cuenta asociada
  const acct2 = await prisma.accounts.findUnique({
    where: { iban: user.account_iban },
  });
  if (!acct2) return null;
  return {
    iban: acct2.iban,
    balance: Number(acct2.balance),
    bank_code: acct2.bank_code,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: ReceiveTransferBody = await req.json();

    // 1. Validación básica del payload
    const {
      version,
      timestamp,
      transaction_id,
      sender,
      receiver,
      amount,
      description,
      hmac_md5,
    } = body;

    if (
      !version ||
      !timestamp ||
      !transaction_id ||
      !sender ||
      !receiver ||
      amount == null ||
      !hmac_md5
    ) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios en el payload' },
        { status: 400 }
      );
    }
    if (
      typeof version !== 'string' ||
      typeof timestamp !== 'string' ||
      typeof transaction_id !== 'string' ||
      typeof sender.account_number !== 'string' ||
      typeof sender.bank_code !== 'string' ||
      typeof receiver.account_number !== 'string' ||
      typeof receiver.bank_code !== 'string' ||
      typeof amount.value !== 'number' ||
      typeof amount.currency !== 'string' ||
      typeof hmac_md5 !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Algunos campos tienen tipo inválido' },
        { status: 400 }
      );
    }

    // 2. Recuperar clave HMAC compartida
    const hmacEntry = await prisma.hmac_keys.findUnique({
      where: {
        origin_bank_destination_bank: {
          origin_bank: sender.bank_code,
          destination_bank: receiver.bank_code,
        },
      },
    });
    if (!hmacEntry) {
      return NextResponse.json(
        { error: 'No existe clave HMAC configurada para estos bancos' },
        { status: 400 }
      );
    }
    const secretKey = hmacEntry.secret_key; // Buffer

    // 3. Calcular HMAC localmente y comparar
    const localHmac = calculateHmacMd5(
      transaction_id,
      sender.bank_code,
      sender.account_number,
      receiver.bank_code,
      receiver.account_number,
      amount.value,
      amount.currency,
      secretKey
    );
    if (localHmac !== hmac_md5) {
      return NextResponse.json(
        { error: 'HMAC inválido: posible manipulación de datos' },
        { status: 401 }
      );
    }

    // 4. Resolver cuentas locales (puede ser IBAN o phone)
    const originAcct = await resolveLocalAccount(sender.account_number);
    if (!originAcct || originAcct.bank_code !== sender.bank_code) {
      return NextResponse.json(
        { error: 'Cuenta de origen no encontrada o banco no coincide' },
        { status: 400 }
      );
    }
    const destAcct = await resolveLocalAccount(receiver.account_number);
    if (!destAcct || destAcct.bank_code !== receiver.bank_code) {
      return NextResponse.json(
        { error: 'Cuenta de destino no encontrada o banco no coincide' },
        { status: 400 }
      );
    }

    // 5. Verificar saldo suficiente en cuenta de origen
    if (originAcct.balance < amount.value) {
      return NextResponse.json(
        { error: 'Saldo insuficiente en la cuenta de origen' },
        { status: 400 }
      );
    }

    // 6. Realizar operación atómica: débito origen + crédito destino + crear transacción
    const createdTx = await prisma.$transaction(async (tx: any) => {
      await tx.accounts.update({
        where: { iban: originAcct.iban },
        data: {
          balance: { decrement: amount.value },
        },
      });
      await tx.accounts.update({
        where: { iban: destAcct.iban },
        data: {
          balance: { increment: amount.value },
        },
      });
      const newTransaction = await tx.transactions.create({
        data: {
          transaction_id,
          origin_iban: originAcct.iban,
          destination_iban: destAcct.iban,
          amount: amount.value,
          currency: amount.currency,
          reason: description ?? null,
          hmac_md5,
          state: 'COMPLETED',
        },
      });
      return newTransaction;
    });

    // 7. Responder con detalles de la transacción creada
    return NextResponse.json(
      {
        transaction_id: createdTx.transaction_id,
        created_at: createdTx.created_at.toISOString(),
        origin_iban: createdTx.origin_iban,
        destination_iban: createdTx.destination_iban,
        amount: Number(createdTx.amount),
        currency: createdTx.currency,
        state: createdTx.state,
        reason: createdTx.reason,
        hmac_md5: createdTx.hmac_md5,
        updated_at: createdTx.updated_at.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en POST /api/receive-transfer:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
