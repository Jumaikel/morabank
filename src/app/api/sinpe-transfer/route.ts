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

  let payload: ExternalSinpeIbanPayload;
  try {
    payload = await req.json();
    console.log("✅ [SINPE-EXTERNAL] Payload parseado:", payload);
  } catch (err) {
    console.error("❌ [SINPE-EXTERNAL] JSON inválido en body:", err);
    return NextResponse.json(
      { status: "NACK", message: "JSON inválido en body." },
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

  if (
    !version ||
    !timestamp ||
    !transaction_id ||
    !receiver.account_number ||
    !receiver.bank_code ||
    !amount?.value ||
    !hmac_md5
  ) {
    console.warn("⚠️ [SINPE-EXTERNAL] Faltan campos obligatorios");
    return NextResponse.json(
      { status: "NACK", message: "Faltan campos requeridos." },
      { status: 400 }
    );
  }
/*
  if (receiver.bank_code !== OUR_BANK_CODE) {
    console.warn("⚠️ [SINPE-EXTERNAL] Bank code receptor inválido:", receiver.bank_code);
    return NextResponse.json(
      { status: "NACK", message: "Solo se aceptan créditos hacia este banco." },
      { status: 403 }
    );
  }
*/
  await logTransaction(payload);

  if (!verifyHmac(payload, hmac_md5)) {
    console.warn("🔐 [SINPE-EXTERNAL] HMAC inválido para tx:", transaction_id);
    return NextResponse.json(
      { status: "NACK", message: "HMAC inválido." },
      { status: 401 }
    );
  }

  try {
    await createExternalCredit({
      version,
      timestamp,
      transaction_id,
      sender,
      receiver,
      amount,
      description,
      hmac_md5,
    });

    console.log("✅ [SINPE-EXTERNAL] Crédito externo completado.");
    return NextResponse.json({ status: "ACK", transaction_id }, { status: 200 });
  } catch (err: any) {
    console.error("❌ [SINPE-EXTERNAL] Error al acreditar:", err);
    return NextResponse.json(
      { status: "NACK", message: err.message || "Error interno procesando crédito externo." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  console.log("ℹ️ [SINPE-EXTERNAL] OPTIONS request recibida.");
  return NextResponse.next();
}
