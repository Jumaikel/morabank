import { NextRequest, NextResponse } from "next/server";
import { BANK_ENDPOINTS } from "@/config/bankEndpoints";

/**
 * Estructura esperada del payload para transferencia por teléfono (SINPE Móvil).
 */
interface PhoneTransferPayload {
  version: "1.0";
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
  description: string;
  hmac_md5: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1) Leer el JSON que envía el frontend
    const payload: PhoneTransferPayload = await req.json();

    // 2) Extraer el código de banco receptor desde el payload
    const receiverBankCode = payload.receiver.bank_code;
    if (!receiverBankCode) {
      return NextResponse.json(
        { error: "Falta receiver.bank_code en el payload" },
        { status: 400 }
      );
    }

    // 3) Buscar la URL base del banco externo en BANK_ENDPOINTS
    const endpointBase = BANK_ENDPOINTS[receiverBankCode];
    if (!endpointBase) {
      return NextResponse.json(
        { error: `No se encontró endpoint para el banco ${receiverBankCode}` },
        { status: 400 }
      );
    }

    // 4) Armar la URL completa (asumimos que el path es "/api/sinpe-movil-transfer")
    const externalUrl = `${endpointBase}/api/sinpe-movil-transfer`;

    // 5) Hacer la petición server-to-server al banco externo
    const res = await fetch(externalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 6) Leer la respuesta (éxito o error)
    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: `Error ${res.status} desde banco externo: ${text}` },
        { status: res.status }
      );
    }

    // 7) Parsear JSON si es válido, de lo contrario devolver texto crudo
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: 200 });
    } catch {
      return NextResponse.json({ data: text }, { status: 200 });
    }
  } catch (err: any) {
    console.error("=== ERROR EN PROXY SINPE-MÓVIL ===");
    console.error(err);
    console.error(err.stack);

    return NextResponse.json(
      { error: `Error interno en el proxy SINPE-Móvil: ${err.message}` },
      { status: 500 }
    );
  }
}

// Opcional: responder preflight CORS
export async function OPTIONS() {
  return NextResponse.next();
}
