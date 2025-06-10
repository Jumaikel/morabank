import { NextRequest, NextResponse } from "next/server";
import { BANK_ENDPOINTS } from "@/config/bankEndpoints";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { account_number_remote, monto, cedula, destinationIban } = body;

  if (!account_number_remote || !monto || !cedula || !destinationIban) {
    return NextResponse.json({ error: "Campos faltantes" }, { status: 400 });
  }

  const codigoBanco = account_number_remote.slice(4, 8);
  const remoteBaseUrl = BANK_ENDPOINTS[codigoBanco];
  if (!remoteBaseUrl) {
    return NextResponse.json({ error: "Banco no encontrado" }, { status: 404 });
  }

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

    if (!response.ok) {
      return NextResponse.json({ error: data.razon || "Error remoto" }, { status: response.status });
    }

    // Acreditar en cuenta local
    const cuentaDestino = await prisma.accounts.findUnique({ where: { iban: destinationIban } });
    if (!cuentaDestino) {
      return NextResponse.json({ error: "Cuenta destino no existe" }, { status: 404 });
    }

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

    return NextResponse.json({ success: true, mensaje: "Fondos recibidos exitosamente" });
  } catch (err: any) {
    console.error("[PULL-EXTERNAL] Error:", err);
    return NextResponse.json({ error: "Error de conexión o interno" }, { status: 500 });
  }
}
