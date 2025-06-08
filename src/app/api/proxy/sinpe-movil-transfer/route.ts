// Deshabilita la verificación de certificado autofirmado (solo para desarrollo)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { NextRequest, NextResponse } from "next/server";
import { BANK_ENDPOINTS } from "@/config/bankEndpoints";

export async function POST(req: NextRequest) {
  let payload: any;
  try {
    payload = await req.json();
  } catch (err) {
    console.error("❌ [PROXY SINPE-MÓVIL] JSON inválido:", err);
    return NextResponse.json({ error: "JSON inválido en body" }, { status: 400 });
  }

  const bankCode = payload.receiver?.bank_code;
  const base = BANK_ENDPOINTS[bankCode];
  if (!base) {
    console.warn(`⚠️ [PROXY SINPE-MÓVIL] No hay endpoint para bank_code=${bankCode}`);
    return NextResponse.json(
      { error: `No hay proxy configurado para el banco ${bankCode}` },
      { status: 400 }
    );
  }

  const externalUrl = `${base}/api/sinpe-movil-transfer`;
  console.log("➡️ [PROXY SINPE-MÓVIL] Enviando a:", externalUrl);
  console.log("📨 [PROXY SINPE-MÓVIL] Payload:", JSON.stringify(payload));

  try {
    const res = await fetch(externalUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    console.log(`✅ [PROXY SINPE-MÓVIL] Respuesta ${res.status}:`, data);
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("❌ [PROXY SINPE-MÓVIL] Error al hacer fetch:", {
      message: err.message,
      cause: err.cause,
    });
    return NextResponse.json(
      { error: `fetch failed: ${err.message}` },
      { status: 500 }
    );
  }
}
