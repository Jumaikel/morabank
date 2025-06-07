import { NextRequest, NextResponse } from "next/server";
import { BANK_ENDPOINTS } from "@/config/bankEndpoints";

interface IbanTransferPayload {
  version: "1.0";
  timestamp: string;
  transaction_id: string;
  sender: {
    account_number: string;
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
  description: string;
  hmac_md5: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1) Leer el body JSON enviado por el frontend
    const payload = (await req.json()) as IbanTransferPayload;

    // 2) Extraer el código de banco receptor (4 dígitos)
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

    // 4) Construir la URL completa al endpoint remoto
    const externalUrl = `${endpointBase}/api/sinpe-transfer`;

    console.log("=== PROXY SINPE-IBAN ===");
    console.log("URL del banco externo:", externalUrl);
    console.log("Payload enviado:", JSON.stringify(payload, null, 2));

    // 5) Hacer la petición server-to-server (sin CORS) al banco externo
    const externalRes = await fetch(externalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 6) Leer la respuesta como texto
    const text = await externalRes.text();

    // 7) Si el banco externo devolvió un error (4xx o 5xx), reenviarlo tal cual
    if (!externalRes.ok) {
      return NextResponse.json(
        { error: `Error ${externalRes.status} desde banco externo: ${text}` },
        { status: externalRes.status }
      );
    }

    // 8) Intentar parsear como JSON; si no es JSON válido, devolver el texto crudo
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: 200 });
    } catch {
      return NextResponse.json({ data: text }, { status: 200 });
    }
  } catch (err: any) {
    console.error("=== ERROR EN PROXY SINPE-IBAN ===");
    console.error(err);
    return NextResponse.json(
      { error: `Error interno en el proxy: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // Responder preflight CORS (aunque el frontend no llama directamente a este proxy
  // con preflight, conviene dejarlo por si acaso).
  return NextResponse.next();
}
