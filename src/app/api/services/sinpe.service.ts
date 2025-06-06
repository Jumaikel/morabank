import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { v4 as uuidv4 } from "uuid";
import { generateHmacForPhoneTransfer } from "@/lib/hmac";

const OUR_BANK_CODE = process.env.BANK_CODE || "0111";

/**
 * Dado un username (que en tu esquema es users.identification),
 * devuelve { phone, account } o null si no existe.
 */
export async function findPhoneLinkForUser(username: string) {
  const user = await prisma.users.findUnique({
    where: { identification: username },
  });
  if (!user) return null;
  return {
    phone: user.phone,
    account: user.account_iban,
  };
}

/**
 * Dado un número de teléfono, revisa si existe un usuario con ese phone.
 * Si existe, devuelve { name, bank_code }. Si no, devuelve null.
 */
export async function findPhoneSubscription(phone: string) {
  const user = await prisma.users.findUnique({
    where: { phone },
  });
  if (!user) return null;
  return {
    name: user.name,
    bank_code: OUR_BANK_CODE,
  };
}

/**
 * Realiza una transferencia interna "SINPE Móvil" dentro de este banco,
 * usando los phone numbers de sender y receiver.
 *
 * - Busca ambos usuarios (sender y receiver) por phone.
 * - Valida que existan, que sus cuentas (account_iban) existan y estén ACTIVO.
 * - Verifica que el balance del cuenta origen sea suficiente.
 * - En prisma.$transaction, debita al origen, acredita al destino y crea un registro en transactions.
 * - Retorna el objeto transaction creado.
 */
export async function sendSinpeTransfer(
  senderPhone: string,
  receiverPhone: string,
  value: number,
  currency: string,
  description?: string
) {
  // 1) Buscar usuario remitente por phone
  const userFrom = await prisma.users.findUnique({
    where: { phone: senderPhone },
  });
  if (!userFrom) {
    throw new Error(`Usuario remitente no existe (phone): ${senderPhone}`);
  }

  // 2) Buscar usuario destinatario por phone
  const userTo = await prisma.users.findUnique({
    where: { phone: receiverPhone },
  });
  if (!userTo) {
    throw new Error(`Usuario destinatario no existe (phone): ${receiverPhone}`);
  }

  // 3) Verificar que ambos usuarios pertenezcan a este banco
  //    En este escenario, asumimos que si el usuario existe en nuestra tabla ‘users’,
  //    entonces su bank_code es el nuestro (OUR_BANK_CODE).
  //    No hay un campo explícito de bank_code en users; por tanto,
  //    damos por hecho que cualquier usuario en `users` está en este banco.

  // 4) Obtener las cuentas (accounts) de cada uno, por account_iban
  const fromAccount = await prisma.accounts.findUnique({
    where: { iban: userFrom.account_iban },
  });
  if (!fromAccount) {
    throw new Error(`Cuenta de origen no existe: ${userFrom.account_iban}`);
  }
  if (fromAccount.status !== "ACTIVO") {
    throw new Error(
      `Cuenta de origen no está ACTIVO (status: ${fromAccount.status}).`
    );
  }

  const toAccount = await prisma.accounts.findUnique({
    where: { iban: userTo.account_iban },
  });
  if (!toAccount) {
    throw new Error(`Cuenta de destino no existe: ${userTo.account_iban}`);
  }
  if (toAccount.status !== "ACTIVO") {
    throw new Error(
      `Cuenta de destino no está ACTIVO (status: ${toAccount.status}).`
    );
  }

  // 5) Verificar saldo suficiente en fromAccount
  const balanceOrigen = Number(fromAccount.balance);
  if (balanceOrigen < value) {
    throw new Error(
      `Fondos insuficientes en cuenta origen. Disponible: ${balanceOrigen}, solicitado: ${value}`
    );
  }

  // 6) Generar transaction_id y timestamp
  const transactionId = uuidv4();
  const timestamp = new Date().toISOString();

  // 7) Generar HMAC MD5 para registro interno (opcional, aquí lo generamos para guardar en DB)
  const hmac_md5 = generateHmacForPhoneTransfer(
    senderPhone,
    timestamp,
    transactionId,
    value
  );

  // 8) En prisma.$transaction ejecutamos:
  //    a) Debitar saldo de remitente
  //    b) Acreditar saldo a destinatario
  //    c) Insertar en tabla transactions (con status = "COMPLETED")
  const createdTx = await prisma.$transaction(async (tx) => {
    // a) Debitar saldo
    await tx.accounts.update({
      where: { iban: userFrom.account_iban },
      data: {
        balance: { decrement: value },
      },
    });

    // b) Acreditar saldo
    await tx.accounts.update({
      where: { iban: userTo.account_iban },
      data: {
        balance: { increment: value },
      },
    });

    // c) Crear registro en transactions
    const record = await tx.transactions.create({
      data: {
        transaction_id: transactionId,
        created_at: new Date(timestamp),
        origin_iban: userFrom.account_iban,
        destination_iban: userTo.account_iban,
        amount: new Decimal(value),
        currency: currency.toUpperCase(),
        description: description?.trim() || null,
        hmac_md5,
        status: "COMPLETED",
        updated_at: new Date(timestamp),
      },
      select: {
        transaction_id: true,
        created_at: true,
        origin_iban: true,
        destination_iban: true,
        amount: true,
        currency: true,
        status: true,
        description: true,
        hmac_md5: true,
        updated_at: true,
      },
    });

    return record;
  });

  return createdTx;
}
