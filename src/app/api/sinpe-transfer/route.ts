import { NextRequest, NextResponse } from "next/server";
import {
  logTransaction,
  verifyHmac,
  createExternalCredit,
} from "@/app/api/services/transaction.service";

const OUR_BANK_CODE = process.env.BANK_CODE!;

interface ExternalSinpeIbanPayload {
  version: string;
  timestamp: string;
  transaction_id: string;
  sender: {
    account_number?: string;
    bank_code: string;
    name: string;
  };
  receiver: {
    account_number: string;
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

export async function POST(req: NextRequest) {
  console.log(`\n▶️ [SINPE-EXTERNAL] Inicio procesamiento IBAN→IBAN: ${new Date().toISOString()}`);

  // 1) Parseo y validación de JSON
  let payload: ExternalSinpeIbanPayload;
  try {
    payload = (await req.json()) as ExternalSinpeIbanPayload;
    console.log("✅ [SINPE-EXTERNAL] Payload parseado:", payload);
  } catch (err) {
    console.error("❌ [SINPE-EXTERNAL] JSON inválido en body:", err);
    return NextResponse.json(
      { error: "JSON inválido en body." },
      { status: 400 }
    );
  }

  const {
    version,
    timestamp,
    transaction_id,
    sender,
    receiver,
    amount,
    description,
    hmac_md5,
  } = payload;

  // 2) Validación de campos obligatorios
  console.log("🔍 [SINPE-EXTERNAL] Validando campos obligatorios...");
  if (
    !version ||
    !timestamp ||
    !transaction_id ||
    !receiver.account_number ||
    !receiver.bank_code ||
    !amount?.value ||
    !hmac_md5
  ) {
    console.warn("⚠️ [SINPE-EXTERNAL] Faltan campos obligatorios:", {
      version,
      timestamp,
      transaction_id,
      receiver: receiver.account_number,
      receiverCode: receiver.bank_code,
      amount: amount?.value,
      hasHmac: !!hmac_md5,
    });
    return NextResponse.json(
      { error: "Faltan campos requeridos." },
      { status: 400 }
    );
  }
  console.log("✅ [SINPE-EXTERNAL] Campos obligatorios presentes.");

  // 3) Validar bank_code receptor
  console.log(`🔍 [SINPE-EXTERNAL] Verificando receptor.bank_code (${receiver.bank_code}) vs OUR_BANK_CODE (${OUR_BANK_CODE})`);
  if (receiver.bank_code !== OUR_BANK_CODE) {
    console.warn(
      "⚠️ [SINPE-EXTERNAL] Bank code receptor inválido:",
      receiver.bank_code
    );
    return NextResponse.json(
      { error: "Solo se aceptan créditos hacia este banco." },
      { status: 403 }
    );
  }
  console.log("✅ [SINPE-EXTERNAL] Bank code receptor válido.");

  // 4) Log raw en el servicio
  console.log("ℹ️ [SINPE-EXTERNAL] Registrando payload crudo...");
  await logTransaction(payload);
  console.log("✅ [SINPE-EXTERNAL] Payload registrado en logTransaction.");

  // 5) Verificar HMAC (IBAN)
  console.log("🔐 [SINPE-EXTERNAL] Verificando HMAC...");
  if (!verifyHmac(payload, hmac_md5)) {
    console.warn("🔐 [SINPE-EXTERNAL] HMAC inválido para transaction_id:", transaction_id);
    return NextResponse.json(
      { error: "HMAC inválido." },
      { status: 401 }
    );
  }
  console.log("✅ [SINPE-EXTERNAL] HMAC válido.");

  // 6) Ejecutar crédito externo
  console.log(`💸 [SINPE-EXTERNAL] Ejecutando createExternalCredit para tx ${transaction_id}...`);
  try {
    await createExternalCredit({
      version,
      timestamp,
      transaction_id,
      sender: {
        account_number: sender.account_number,
        bank_code: sender.bank_code,
        name: sender.name,
      },
      receiver: {
        account_number: receiver.account_number,
        bank_code: receiver.bank_code,
        name: receiver.name,
      },
      amount,
      description,
      hmac_md5,
    });
    console.log("✅ [SINPE-EXTERNAL] Crédito externo completado.");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("❌ [SINPE-EXTERNAL] Error al acreditar:", err);
    return NextResponse.json(
      { error: err.message || "Error interno procesando crédito externo." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  console.log("ℹ️ [SINPE-EXTERNAL] OPTIONS request recibida.");
  return NextResponse.next();
}
