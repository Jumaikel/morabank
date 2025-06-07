import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import {
  generateHmacForAccountTransfer,
  generateHmacForPhoneTransfer,
} from "@/lib/hmac";

const OUR_BANK_CODE = process.env.BANK_CODE || "111";

/**
 * 1) logTransaction:
 *    - Registra (en consola o en alguna tabla “logs”) el JSON completo que llega.
 *    - Para fines de este ejemplo, simplemente usaremos console.log.
 */
export async function logTransaction(payload: unknown) {
  console.log("Transacción entrante SINPE:", JSON.stringify(payload));
  // Si quisieras guardarlo en BD (por ejemplo, en una tabla `logs`):
  // await prisma.logs.create({ data: { event: "SINPE_RECEIVED", details: JSON.stringify(payload), created_at: new Date() } });
}

/**
 * 2) verifyHmac:
 *    - Reconstruye el HMAC con la función adecuada (cuenta vs. teléfono) y lo compara.
 *    - Si viene sender.account_number (IBAN), usa generateHmacForAccountTransfer.
 *    - Si viene sender.phone_number, usa generateHmacForPhoneTransfer.
 */
export function verifyHmac(
  payload: {
    sender: { account_number?: string; phone_number?: string };
    timestamp: string;
    transaction_id: string;
    amount: { value: number; currency: string };
  },
  hmac_md5: string
): boolean {
  const { sender, timestamp, transaction_id, amount } = payload;
  let generated: string;

  // Caso: transferencia por IBAN
  if (sender.account_number) {
    generated = generateHmacForAccountTransfer(
      sender.account_number,
      timestamp,
      transaction_id,
      amount.value
    );
  }
  // Caso: SINPE Móvil (por teléfono)
  else if (sender.phone_number) {
    generated = generateHmacForPhoneTransfer(
      sender.phone_number,
      timestamp,
      transaction_id,
      amount.value
    );
  } else {
    // No se proporcionó ni account_number ni phone_number
    return false;
  }

  return generated === hmac_md5;
}

/**
 * 3) processTransfer:
 *    - Flujo para transferencia interna por IBAN:
 *      1) Verificar que sender.account_number y receiver.account_number existan y sean de este banco.
 *      2) Verificar que sender tenga saldo suficiente.
 *      3) En una transacción atómica:
 *         a) Restar saldo a sender.
 *         b) Sumar saldo a receiver.
 *         c) Crear registro en tabla `transactions` con status = "COMPLETED".
 */
/*
export async function processTransfer(payload: {
  version: string;
  timestamp: string;
  transaction_id: string;
  sender: { account_number: string; bank_code: string; name: string };
  receiver: { account_number: string; bank_code: string; name: string };
  amount: { value: number; currency: string };
  description?: string;
  hmac_md5: string;
}) {
  const {
    transaction_id,
    timestamp,
    sender,
    receiver,
    amount,
    description,
    hmac_md5,
  } = payload;

  // 3.2) Buscar cuenta remitente por IBAN
  const fromAccount = await prisma.accounts.findUnique({
    where: { iban: sender.account_number },
  });
  if (!fromAccount) {
    throw new Error(
      `Cuenta de origen no existe en nuestro banco: ${sender.account_number}`
    );
  }
  if (fromAccount.status !== "ACTIVO") {
    throw new Error(
      `Cuenta de origen no está ACTIVO. status: ${fromAccount.status}`
    );
  }

  // 3.3) Buscar cuenta destinataria por IBAN
  const toAccount = await prisma.accounts.findUnique({
    where: { iban: receiver.account_number },
  });
  if (!toAccount) {
    throw new Error(
      `Cuenta de destino no existe en nuestro banco: ${receiver.account_number}`
    );
  }
  if (toAccount.status !== "ACTIVO") {
    throw new Error(
      `Cuenta de destino no está ACTIVO. status: ${toAccount.status}`
    );
  }

  // 3.4) Validar saldo suficiente
  const available = Number(fromAccount.balance);
  if (available < amount.value) {
    throw new Error(
      `Saldo insuficiente en cuenta de origen. Disponible: ${available}, solicitado: ${amount.value}`
    );
  }

  // 3.5) Ejecutar lógica atómica con prisma.$transaction
  await prisma.$transaction(async (tx) => {
    // a) Restar saldo a remitente
    await tx.accounts.update({
      where: { iban: sender.account_number },
      data: { balance: { decrement: amount.value } },
    });

    // b) Sumar saldo a destinatario
    await tx.accounts.update({
      where: { iban: receiver.account_number },
      data: { balance: { increment: amount.value } },
    });

    // c) Guardar registro en tabla transactions
    await tx.transactions.create({
      data: {
        transaction_id: transaction_id,
        created_at: new Date(timestamp),
        origin_iban: sender.account_number,
        destination_iban: receiver.account_number,
        amount: new Decimal(amount.value),
        currency: amount.currency,
        description: description?.trim() || null,
        hmac_md5: hmac_md5,
        status: "COMPLETED",
        updated_at: new Date(timestamp),
      },
    });
  });
}
  */

/**
 * 4) createExternalCredit:
 *    - Flujo para crédito externo (p.ej. SINPE-Móvil entrante):
 *      1) Verificar que receiver.account_number (en caso que venga) o receiver.phone
 *         pertenezca a usuario local.
 *      2) Acreditar la cuenta destinataria (solo sumar saldo).
 *      3) Crear registro en tabla `transactions` con status = "COMPLETED".
 */
export async function createExternalCredit(payload: {
  version: string;
  timestamp: string;
  transaction_id: string;
  sender: {
    account_number?: string;
    phone_number?: string;
    bank_code?: string;
    name?: string;
  };
  receiver: {
    account_number?: string;
    phone_number?: string;
    bank_code?: string;
    name?: string;
  };
  amount: { value: number; currency: string };
  description?: string;
  hmac_md5: string;
}) {
  const {
    transaction_id,
    timestamp,
    sender,
    receiver,
    amount,
    description,
    hmac_md5,
  } = payload;

  // 4.1) Verificar que receiver.bank_code corresponde a nuestro banco
  /*if (receiver.bank_code !== OUR_BANK_CODE && !sender.account_number) {
    throw new Error(
      `Código de bank_code de destinatario inválido para crédito externo: ${receiver.bank_code}`
    );
  }*/

  // 4.2) Determinar la cuenta destino (puede venir por IBAN o por teléfono)
  let destinationIban: string | null = null;

  if (receiver.account_number) {
    destinationIban = receiver.account_number;
  } else if (receiver.phone_number) {
    const userDest = await prisma.users.findUnique({
      where: { phone: receiver.phone_number },
    });
    if (!userDest) {
      throw new Error(
        `No existe usuario local con teléfono: ${receiver.phone_number}`
      );
    }
    destinationIban = userDest.account_iban;
  }

  if (!destinationIban) {
    throw new Error(
      "No se proporcionó account_number ni phone válido en receiver."
    );
  }

  // 4.3) Buscar cuenta destino en BD
  const toAccount = await prisma.accounts.findUnique({
    where: { iban: destinationIban },
  });
  if (!toAccount) {
    throw new Error(`Cuenta destino no existe: ${destinationIban}`);
  }
  if (toAccount.status !== "ACTIVO") {
    throw new Error(
      `Cuenta destino no está ACTIVO. status: ${toAccount.status}`
    );
  }

  // 4.4) Acreditar saldo
  await prisma.accounts.update({
    where: { iban: destinationIban },
    data: { balance: { increment: amount.value } },
  });

  // 4.5) Guardar registro en tabla transactions
  const originIbanRecord = sender.account_number ?? "";

  await prisma.transactions.create({
    data: {
      transaction_id: transaction_id,
      created_at: new Date(timestamp),
      origin_iban: originIbanRecord,
      destination_iban: destinationIban,
      amount: new Decimal(amount.value),
      currency: amount.currency,
      description: description?.trim() || null,
      hmac_md5: hmac_md5,
      status: "COMPLETED",
      updated_at: new Date(timestamp),
    },
  });
}
