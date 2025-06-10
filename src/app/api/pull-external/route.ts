import { NextRequest, NextResponse } from "next/server";
import { BANK_ENDPOINTS } from "@/config/bankEndpoints";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  console.log("📥 [PULL-EXTERNAL] Solicitud recibida");

  const body = await req.json();
  const { account_number_remote, monto, cedula, destinationIban } = body;
  console.log("🧾 [PULL-EXTERNAL] Payload recibido:", body);

  if (!account_number_remote || !monto || !cedula || !destinationIban) {
    console.warn("⚠️ [PULL-EXTERNAL] Campos faltantes");
    return NextResponse.json({ error: "Campos faltantes" }, { status: 400 });
  }

  const codigoBanco = account_number_remote.slice(5, 8);
  const remoteBaseUrl = BANK_ENDPOINTS[codigoBanco];
  if (!remoteBaseUrl) {
    console.warn(`❌ [PULL-EXTERNAL] Banco ${codigoBanco} no encontrado`);
    return NextResponse.json({ error: "Banco no encontrado" }, { status: 404 });
  }

  console.log(`🌐 [PULL-EXTERNAL] Realizando solicitud a ${remoteBaseUrl}/api/pull-funds`);

  try {
    const response = await fetch(`${remoteBaseUrl}/api/pull-funds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_number: account_number_remote,
        cedula,
        monto,
      }),
    });

    const data = await response.json();
    console.log("📬 [PULL-EXTERNAL] Respuesta del banco remoto:", data);

    if (!response.ok) {
      console.warn("⚠️ [PULL-EXTERNAL] Error remoto:", data.razon || data.error);
      return NextResponse.json(
        { error: data.razon || "Error remoto" },
        { status: response.status }
      );
    }

    console.log(`🔍 [PULL-EXTERNAL] Buscando cuenta destino: ${destinationIban}`);
    const cuentaDestino = await prisma.accounts.findUnique({ where: { iban: destinationIban } });

    if (!cuentaDestino) {
      console.warn("❌ [PULL-EXTERNAL] Cuenta destino no encontrada");
      return NextResponse.json({ error: "Cuenta destino no existe" }, { status: 404 });
    }

    console.log(`💳 [PULL-EXTERNAL] Acreditando ₡${monto} a ${destinationIban}...`);
    await prisma.$transaction([
      prisma.accounts.update({
        where: { iban: destinationIban },
        data: {
          balance: { increment: new Decimal(monto) },
        },
      }),
      prisma.transactions.create({
        data: {
          origin_iban: account_number_remote,
          destination_iban: destinationIban,
          amount: new Decimal(monto),
          currency: "CRC",
          description: "Pull desde banco externo",
          status: "COMPLETED",
          transaction_type: "EXTERNA",
          hmac_md5: "",
        },
      }),
    ]);

    console.log("✅ [PULL-EXTERNAL] Pull completado exitosamente");
    return NextResponse.json({ success: true, mensaje: "Fondos recibidos exitosamente" });
  } catch (err: any) {
    console.error("❌ [PULL-EXTERNAL] Error inesperado:", err);
    return NextResponse.json({ error: "Error de conexión o interno" }, { status: 500 });
  }
}
