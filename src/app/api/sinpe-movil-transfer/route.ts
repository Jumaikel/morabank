import { NextRequest, NextResponse } from "next/server";
import { getSinpeSubscription } from "@/app/api/services/sinpeSubscriptionService";
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
  let payload: SinpeMobilePayload;

  // 1) Parsear y loguear el payload
  try {
    payload = (await req.json()) as SinpeMobilePayload;
    console.log("✅ [SINPE-Móvil] Payload recibido:", payload);
  } catch (err) {
    console.error("❌ [SINPE-Móvil] Error al parsear JSON:", err);
    return NextResponse.json(
      { error: "JSON inválido en el body." },
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

  // 2) Validar campos obligatorios
  if (
    !version ||
    !timestamp ||
    !transaction_id ||
    !sender.phone_number ||
    !receiver.phone_number ||
    !amount.value ||
    !hmac_md5
  ) {
    console.warn("⚠️ [SINPE-Móvil] Faltan campos:", {
      senderPhone: sender.phone_number,
      receiverPhone: receiver.phone_number,
      amount: amount.value,
      hasHmac: !!hmac_md5,
    });
    return NextResponse.json(
      { error: "Faltan campos requeridos o identificadores de teléfono." },
      { status: 400 }
    );
  }
  console.log("✅ [SINPE-Móvil] Validación de campos exitosa");

  // 3) Verificar la suscripción del remitente en la base global
  try {
    const sub = await getSinpeSubscription(sender.phone_number);
    console.log("ℹ️ [SINPE-Móvil] Subscripción remitente:", sub);

    if (sub.sinpe_bank_code !== sender.bank_code) {
      console.warn(
        "⚠️ [SINPE-Móvil] Bank code mismatch:",
        sub.sinpe_bank_code,
        sender.bank_code
      );
      return NextResponse.json(
        { error: "Bank code del remitente no coincide con suscripción." },
        { status: 403 }
      );
    }
  } catch (err: any) {
    console.error(
      "❌ [SINPE-Móvil] No existe subscripción para remitente:",
      sender.phone_number
    );
    return NextResponse.json(
      { error: `Número remitente no suscrito: ${sender.phone_number}` },
      { status: 404 }
    );
  }

  // 4) Verificar HMAC
  const expectedHmac = generateHmacForPhoneTransfer(
    sender.phone_number,
    timestamp,
    transaction_id,
    amount.value
  );
  console.log(
    `🔐 [SINPE-Móvil] HMAC generado=${expectedHmac}, enviado=${hmac_md5}`
  );
  if (expectedHmac !== hmac_md5) {
    return NextResponse.json(
      { error: "HMAC inválido. Transacción rechazada." },
      { status: 401 }
    );
  }
  console.log("✅ [SINPE-Móvil] HMAC válido");

  // 5) Realizar el crédito en nuestra BD
  try {
    console.log(
      "➡️ [SINPE-Móvil] Acreditando a:",
      receiver.phone_number,
      "monto:",
      amount.value
    );

    await createExternalCredit({
      version,
      timestamp,
      transaction_id,
      sender: {
        phone_number: sender.phone_number,
        bank_code: sender.bank_code,
        name: sender.name,
      },
      receiver: {
        phone_number: receiver.phone_number,
        bank_code: receiver.bank_code,
        name: receiver.name,
      },
      amount,
      description,
      hmac_md5,
    });

    console.log("✅ [SINPE-Móvil] Crédito externo completado");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("❌ [SINPE-Móvil] Error creando crédito externo:", err);
    return NextResponse.json(
      { error: err.message || "Error interno procesando SINPE-Móvil." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.next();
}
