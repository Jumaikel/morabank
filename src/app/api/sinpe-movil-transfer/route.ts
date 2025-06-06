import { NextRequest, NextResponse } from "next/server";
import { sendSinpeTransfer } from "@/app/api/services/sinpe.service";
import { verifyHmac } from "@/app/api/services/transaction.service";

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
  try {
    const payload = (await req.json()) as SinpeMobilePayload;
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

    // 1) Validar campos obligatorios
    if (
      !version ||
      !timestamp ||
      !transaction_id ||
      !sender?.phone_number ||
      !receiver?.phone_number ||
      !amount?.value ||
      !hmac_md5
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos o identificadores de teléfono." },
        { status: 400 }
      );
    }

    // 2) Verificar HMAC (generateHmacForPhoneTransfer internamente)
    const isValid = verifyHmac(
      {
        sender: {
          account_number: undefined,
          phone_number: sender.phone_number,
        },
        timestamp,
        transaction_id,
        amount,
      },
      hmac_md5
    );
    if (!isValid) {
      return NextResponse.json(
        { error: "HMAC inválido. Transacción rechazada." },
        { status: 401 }
      );
    }

    // 3) Ejecutar la transferencia móvil interna o crédito externo
    //    En sendSinpeTransfer ya se asegura de debitar/acreditar en este banco
    const createdTx = await sendSinpeTransfer(
      sender.phone_number,
      receiver.phone_number,
      amount.value,
      amount.currency,
      description
    );

    return NextResponse.json(
      { message: "Transferencia móvil realizada.", transfer: createdTx },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ Error en POST /api/sinpe-movil-transfer:", err);
    return NextResponse.json(
      {
        error: err?.message || "Error interno procesando SINPE-Móvil transfer.",
      },
      { status: 500 }
    );
  }
}
