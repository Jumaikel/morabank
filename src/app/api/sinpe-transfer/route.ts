// src/app/api/sinpe-transfer/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  logTransaction,
  verifyHmac,
  processTransfer,
  createExternalCredit,
} from "@/app/api/services/transaction.service";

interface SinpePayload {
  version: string;
  timestamp: string;
  transaction_id: string;
  sender: {
    account_number?: string;
    phone?: string;
    bank_code: string;
    name: string;
  };
  receiver: {
    account_number?: string;
    phone?: string;
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
  let payload: SinpePayload;

  try {
    payload = (await req.json()) as SinpePayload;
    console.log("✅ [SINPE] Payload recibido:", JSON.stringify(payload));
  } catch (err) {
    console.error("❌ [SINPE] No se pudo parsear JSON de la petición:", err);
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

  // 1) Validación de campos mínimos
  const missing =
    !version ||
    !timestamp ||
    !transaction_id ||
    !sender ||
    !receiver ||
    !amount ||
    !hmac_md5 ||
    !(sender.account_number || sender.phone);

  if (missing) {
    console.warn(
      "⚠️ [SINPE] Validación fallida, faltan campos:",
      {
        version,
        timestamp,
        transaction_id,
        hasSender: !!sender,
        hasReceiver: !!receiver,
        hasAmount: !!amount,
        hasHmac: !!hmac_md5,
        ident: sender?.account_number ?? sender?.phone,
      }
    );
    return NextResponse.json(
      { error: "Faltan campos requeridos o identificador de remitente." },
      { status: 400 }
    );
  }
  console.log("✅ [SINPE] Validación de campos exitosa");

  // 2) Loguear la transacción entrante (raw)
  await logTransaction(payload);
  console.log("ℹ️ [SINPE] Payload registrado en logTransaction");

  // 3) Verificar validez del HMAC
  const isValidHmac = verifyHmac(payload, hmac_md5);
  console.log(`🔐 [SINPE] HMAC verificado: ${isValidHmac ? "válido" : "inválido"}`);
  if (!isValidHmac) {
    return NextResponse.json(
      { error: "HMAC inválido. Transacción rechazada." },
      { status: 401 }
    );
  }

  try {
    // 4) Flujo interno vs externo
    if (sender.account_number && receiver.account_number) {
      console.log(
        "➡️ [SINPE] Procesando transferencia interna:",
        sender.account_number,
        "→",
        receiver.account_number
      );

      await processTransfer({
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
      console.log("✅ [SINPE] Transferencia interna completada");
    } else {
      console.log(
        "➡️ [SINPE] Procesando crédito externo a:",
        receiver.phone || receiver.account_number
      );

      await createExternalCredit(payload);
      console.log("✅ [SINPE] Crédito externo completado");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("❌ [SINPE] Error procesando transacción:", err);
    return NextResponse.json(
      { error: err.message || "Error interno procesando SINPE." },
      { status: 500 }
    );
  }
}
