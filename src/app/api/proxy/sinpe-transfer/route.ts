// Deshabilita la verificación de certificado autofirmado (solo para desarrollo)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { NextRequest, NextResponse } from "next/server";
import { BANK_ENDPOINTS } from "@/config/bankEndpoints";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const receiverBankCode = payload.receiver.bank_code;
    const base = BANK_ENDPOINTS[receiverBankCode];
    if (!base) {
      return NextResponse.json(
        { error: `No hay proxy configurado para el banco ${receiverBankCode}` },
        { status: 400 }
      );
    }
    const externalUrl = `${base}/api/sinpe-transfer`;

    const res = await fetch(externalUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("=== ERROR EN PROXY SINPE-IBAN ===", err);
    return NextResponse.json(
      { error: err.message || "Error interno en el proxy SINPE-IBAN" },
      { status: 500 }
    );
  }
}
