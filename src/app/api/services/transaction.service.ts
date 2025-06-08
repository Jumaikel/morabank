import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import {
  generateHmacForAccountTransfer,
  generateHmacForPhoneTransfer,
} from "@/lib/hmac";
import { sendTransactionNotification } from "../sse/route";

/**
 * 1) logTransaction: registra el payload entrante.
 */
export async function logTransaction(payload: unknown) {
  console.log(
    `ℹ️ [TRANSACTION-SERVICE] Transacción entrante: ${new Date().toISOString()}`,
    payload
  );
}

/**
 * 2) verifyHmac: reconstruye y compara el HMAC.
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
  console.log(
    `🔐 [TRANSACTION-SERVICE] Verificando HMAC para tx=${payload.transaction_id}`
  );
  const { sender, timestamp, transaction_id, amount } = payload;
  let generated: string;

  if (sender.account_number) {
    generated = generateHmacForAccountTransfer(
      sender.account_number,
      timestamp,
      transaction_id,
      amount.value
    );
  } else if (sender.phone_number) {
    generated = generateHmacForPhoneTransfer(
      sender.phone_number,
      timestamp,
      transaction_id,
      amount.value
    );
  } else {
    console.warn(
      `⚠️ [TRANSACTION-SERVICE] No sender identifier for HMAC: tx=${transaction_id}`
    );
    return false;
  }

  const valid = generated === hmac_md5;
  console.log(
    `🔐 [TRANSACTION-SERVICE] HMAC generado=${generated}, recibido=${hmac_md5}, válido=${valid}`
  );
  return valid;
}

/**
 * 4) createExternalCredit:
 *    - Acredita al receptor (IBAN o teléfono) y registra transaction y audit_log.
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
  console.log(
    `▶️ [TRANSACTION-SERVICE] Iniciando createExternalCredit: tx=${
      payload.transaction_id
    } at ${new Date().toISOString()}`
  );

  // 1) log y verificación de HMAC
  await logTransaction(payload);
  if (!verifyHmac(payload, payload.hmac_md5)) {
    console.error(
      `❌ [TRANSACTION-SERVICE] HMAC inválido: tx=${payload.transaction_id}`
    );
    throw new Error("HMAC inválido");
  }

  const {
    transaction_id,
    timestamp,
    sender,
    receiver,
    amount,
    description,
    hmac_md5,
  } = payload;

  // 2) Determinar tipo de transacción y origen
  console.log(
    `ℹ️ [TRANSACTION-SERVICE] Determinando tipo/origen: tx=${transaction_id}`
  );
  let originIban: string | null = null;
  let originPhone: string | null = null;
  let transactionType: "EXTERNA" | "SINPEMOVIL";

  if (sender.account_number) {
    originIban = sender.account_number;
    transactionType = "EXTERNA";
    console.log(
      `ℹ️ [TRANSACTION-SERVICE] Tipo=EXTERNA, originIban=${originIban}`
    );
  } else {
    originPhone = sender.phone_number!;
    transactionType = "SINPEMOVIL";
    console.log(
      `ℹ️ [TRANSACTION-SERVICE] Tipo=SINPEMOVIL, originPhone=${originPhone}`
    );
  }

  // 3) Determinar destino (IBAN o teléfono → IBAN)
  console.log(
    `ℹ️ [TRANSACTION-SERVICE] Determinando destino: tx=${transaction_id}`
  );
  let destinationIban: string;
  let destinationPhone: string | null = null;

  if (receiver.account_number) {
    destinationIban = receiver.account_number;
    console.log(`ℹ️ [TRANSACTION-SERVICE] Destino IBAN=${destinationIban}`);
  } else {
    console.log(
      `ℹ️ [TRANSACTION-SERVICE] Buscando destino por teléfono=${receiver.phone_number}`
    );
    const userDest = await prisma.users.findUnique({
      where: { phone: receiver.phone_number! },
    });
    if (!userDest) {
      console.error(
        `❌ [TRANSACTION-SERVICE] No existe usuario con teléfono=${receiver.phone_number}`
      );
      throw new Error(
        `No existe usuario con teléfono: ${receiver.phone_number}`
      );
    }
    destinationIban = userDest.account_iban;
    destinationPhone = receiver.phone_number!;
    console.log(
      `ℹ️ [TRANSACTION-SERVICE] Destino encontrado IBAN=${destinationIban}`
    );
  }

  // 4) Validar cuenta destino
  console.log(
    `🔍 [TRANSACTION-SERVICE] Validando cuenta destino=${destinationIban}`
  );
  const toAccount = await prisma.accounts.findUnique({
    where: { iban: destinationIban },
  });
  if (!toAccount || toAccount.status !== "ACTIVO") {
    console.error(
      `❌ [TRANSACTION-SERVICE] Cuenta destino inválida: ${destinationIban}`
    );
    throw new Error(`Cuenta destino inválida o cerrada: ${destinationIban}`);
  }
  console.log(`✅ [TRANSACTION-SERVICE] Cuenta destino válida`);

  // 5) Acreditar saldo
  console.log(
    `💰 [TRANSACTION-SERVICE] Acreditando monto=${amount.value} ${amount.currency} a=${destinationIban}`
  );
  await prisma.accounts.update({
    where: { iban: destinationIban },
    data: { balance: { increment: amount.value } },
  });
  console.log(`✅ [TRANSACTION-SERVICE] Saldo actualizado`);

  // 6) Crear transacción y audit_log
  console.log(
    `💾 [TRANSACTION-SERVICE] Creando registro transaction y audit_log`
  );
  const tx = await prisma.transactions.create({
    data: {
      transaction_id,
      created_at: new Date(timestamp),
      updated_at: new Date(timestamp),
      origin_iban: originIban,
      origin_phone: originPhone,
      destination_iban: destinationIban,
      destination_phone: destinationPhone,
      transaction_type: transactionType,
      amount: new Decimal(amount.value),
      currency: amount.currency,
      description: description?.trim() || null,
      hmac_md5,
      status: "COMPLETED",
    },
  });
  console.log(
    `✅ [TRANSACTION-SERVICE] Transaction creada txID=${tx.transaction_id}`
  );

  await prisma.audit_logs.create({
    data: {
      transaction_id: tx.transaction_id,
      previous_status: null,
      new_status: "COMPLETED",
      changed_by: originIban ?? originPhone!,
    },
  });
  console.log(`✅ [TRANSACTION-SERVICE] Audit log creado`);

  console.log(
    `✔️ [TRANSACTION-SERVICE] Finalizado createExternalCredit: tx=${transaction_id}`
  );
  sendTransactionNotification({
    type: "NEW_TRANSACTION",
    txId: transaction_id,
    amount,
    to: destinationIban ,
    timestamp,
  });
  return tx;
}
