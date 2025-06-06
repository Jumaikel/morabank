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
    account_number?: string; // Puede venir account_number (internas) o phone (SINPE-móvil)
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
  try {
    const payload = (await req.json()) as SinpePayload;

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
    if (
      !version ||
      !timestamp ||
      !transaction_id ||
      !sender ||
      !receiver ||
      !amount ||
      !hmac_md5 ||
      !(sender.account_number || sender.phone)
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos o identificador de remitente." },
        { status: 400 }
      );
    }

    // 2) Loguear la transacción entrante (raw)
    await logTransaction(payload);

    // 3) Verificar validez del HMAC
    const isValidHmac = verifyHmac(payload, hmac_md5);
    if (!isValidHmac) {
      return NextResponse.json(
        { error: "HMAC inválido. Transacción rechazada." },
        { status: 401 }
      );
    }

    // 4) Determinar flujo: ¿transferencia interna (si llega account_number válido) o crédito externo?
    if (sender.account_number && receiver.account_number) {
      // Caso: Transferencia interna → mover fondos de sender.account_number a receiver.account_number,
      // si existe en nuestra base de datos (es decir, si el origin es local)
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
    } else {
      // Caso: Crédito externo (p. ej. SINPE-Móvil entrante) → solo acreditamos al receptor local
      await createExternalCredit(payload);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Error en POST /api/sinpe-transfer:", err);
    return NextResponse.json(
      { error: err?.message || "Error interno procesando SINPE transfer." },
      { status: 500 }
    );
  }
}