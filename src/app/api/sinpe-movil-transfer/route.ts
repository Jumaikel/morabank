import { NextRequest, NextResponse } from "next/server";
import { createExternalCredit } from "@/app/api/services/transaction.service";
import { generateHmacForPhoneTransfer } from "@/lib/hmac";

interface SinpeMobilePayload {
  version: string;
  timestamp: string;
  transaction_id: string;
  sender: {
    phone_number: string;
    bank_code: string;
    name: string;
  };
  receiver: {
    phone_number: string;
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
  console.log(`\n▶️ [SINPE-MÓVIL] Inicio procesamiento: ${new Date().toISOString()}`);

  let payload: SinpeMobilePayload;
  try {
    payload = await req.json();
    console.log("✅ [SINPE-MÓVIL] Payload parseado:", payload);
  } catch (err) {
    console.error("❌ [SINPE-MÓVIL] Error al parsear JSON:", err);
    return NextResponse.json(
      { status: "NACK", message: "JSON inválido en el body." },
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
/*
  if (
    !version || !timestamp || !transaction_id ||
    !sender.phone_number || !sender.bank_code ||
    !receiver.phone_number || !receiver.bank_code ||
    !amount?.value || !hmac_md5
  ) {
    console.warn("⚠️ [SINPE-MÓVIL] Faltan campos requeridos");
    return NextResponse.json(
      {
        status: "NACK",
        message: "Faltan campos obligatorios o identificadores de teléfono.",
      },
      { status: 400 }
    );
  }
*/
  const expectedHmac = generateHmacForPhoneTransfer(
    sender.phone_number,
    timestamp,
    transaction_id,
    amount.value
  );

  if (expectedHmac !== hmac_md5) {
    console.warn("🔐 [SINPE-MÓVIL] HMAC inválido");
    return NextResponse.json(
      { status: "NACK", message: "HMAC inválido. Transacción rechazada." },
      { status: 401 }
    );
  }

  try {
    const tx = await createExternalCredit({
      version,
      timestamp,
      transaction_id,
      sender,
      receiver,
      amount,
      description,
      hmac_md5,
    });

    console.log("✅ [SINPE-MÓVIL] Transacción procesada:", tx.transaction_id);
    return NextResponse.json(
      {
        status: "ACK",
        transaction_id: tx.transaction_id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ [SINPE-MÓVIL] Error interno:", err);
    return NextResponse.json(
      {
        status: "NACK",
        message: err.message || "Error interno procesando SINPE-Móvil.",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.next();
}
