import { NextRequest, NextResponse } from "next/server";
import { getSinpeSubscription } from "@/app/api/services/sinpe_subscription.service";
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

  // 1) Parsear y loguear el payload
  let payload: SinpeMobilePayload;
  try {
    payload = (await req.json()) as SinpeMobilePayload;
    console.log("✅ [SINPE-MÓVIL] Payload parseado:", payload);
  } catch (err) {
    console.error("❌ [SINPE-MÓVIL] Error al parsear JSON:", err);
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
  console.log("🔍 [SINPE-MÓVIL] Validando campos obligatorios...");
  if (
    !version ||
    !timestamp ||
    !transaction_id ||
    !sender.phone_number ||
    !sender.bank_code ||
    !receiver.phone_number ||
    !receiver.bank_code ||
    !amount?.value ||
    !hmac_md5
  ) {
    console.warn("⚠️ [SINPE-MÓVIL] Faltan campos requeridos:", {
      senderPhone: sender.phone_number,
      senderCode: sender.bank_code,
      receiverPhone: receiver.phone_number,
      receiverCode: receiver.bank_code,
      amount: amount?.value,
      hasHmac: !!hmac_md5,
    });
    return NextResponse.json(
      { error: "Faltan campos obligatorios o identificadores de teléfono." },
      { status: 400 }
    );
  }
  console.log("✅ [SINPE-MÓVIL] Campos obligatorios presentes.");

  // 3) Verificar la suscripción del remitente
  console.log("ℹ️ [SINPE-MÓVIL] Verificando suscripción del remitente...");
  try {
    const sub = await getSinpeSubscription(sender.phone_number);
    console.log("ℹ️ [SINPE-MÓVIL] Subscripción encontrada:", sub);
    if (sub.sinpe_bank_code !== sender.bank_code) {
      console.warn(
        "⚠️ [SINPE-MÓVIL] Bank code mismatch:",
        sub.sinpe_bank_code,
        sender.bank_code
      );
      return NextResponse.json(
        { error: "Bank code del remitente no coincide con suscripción." },
        { status: 403 }
      );
    }
    console.log("✅ [SINPE-MÓVIL] Bank code de suscripción válido.");
  } catch (err: any) {
    console.error(
      "❌ [SINPE-MÓVIL] No existe suscripción para remitente:",
      sender.phone_number
    );
    return NextResponse.json(
      { error: `Número remitente no suscrito: ${sender.phone_number}` },
      { status: 404 }
    );
  }

  // 4) Verificar HMAC
  console.log("🔐 [SINPE-MÓVIL] Verificando HMAC...");
  const expectedHmac = generateHmacForPhoneTransfer(
    sender.phone_number,
    timestamp,
    transaction_id,
    amount.value
  );
  console.log(
    `🔐 [SINPE-MÓVIL] HMAC generado=${expectedHmac}, HMAC recibido=${hmac_md5}`
  );
  if (expectedHmac !== hmac_md5) {
    console.warn("🔐 [SINPE-MÓVIL] HMAC inválido para tx:", transaction_id);
    return NextResponse.json(
      { error: "HMAC inválido. Transacción rechazada." },
      { status: 401 }
    );
  }
  console.log("✅ [SINPE-MÓVIL] HMAC válido.");

  // 5) Realizar el crédito en nuestra BD
  console.log(
    `💸 [SINPE-MÓVIL] Acreditando monto ${amount.value} ${amount.currency} a ${receiver.phone_number}`
  );
  try {
    const tx = await createExternalCredit({
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
    console.log("✅ [SINPE-MÓVIL] Crédito externo completado. TxID:", tx.transaction_id);
    console.log("ℹ️ [SINPE-MÓVIL] Detalle transacción:", tx);
    return NextResponse.json({ success: true, transaction_id: tx.transaction_id }, { status: 200 });
  } catch (err: any) {
    console.error("❌ [SINPE-MÓVIL] Error creando crédito externo:", err);
    return NextResponse.json(
      { error: err.message || "Error interno procesando SINPE-Móvil." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  console.log("ℹ️ [SINPE-MÓVIL] OPTIONS recibido.");
  return NextResponse.next();
}
