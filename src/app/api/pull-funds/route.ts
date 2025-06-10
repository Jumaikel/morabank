import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
  console.log("📥 [PULL-FUNDS] Solicitud recibida");

  try {
    const body = await req.json();
    const { account_number, cedula, monto } = body;
    console.log("🧾 [PULL-FUNDS] Payload recibido:", body);

    if (!account_number || !cedula || monto == null) {
      console.warn("⚠️ [PULL-FUNDS] Campos faltantes");
      return NextResponse.json(
        { status: "NACK", error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const montoDecimal = new Decimal(monto);
    if (montoDecimal.lte(0)) {
      console.warn("⚠️ [PULL-FUNDS] Monto inválido:", monto);
      return NextResponse.json(
        { status: "NACK", error: "Monto inválido" },
        { status: 400 }
      );
    }

    console.log("🔍 [PULL-FUNDS] Buscando cuenta:",  account_number);
    const account = await prisma.accounts.findUnique({
      where: { iban:  account_number },
    });

    if (!account) {
      console.warn("❌ [PULL-FUNDS] Cuenta no encontrada:",  account_number);
      return NextResponse.json(
        { status: "NACK", error: "Cuenta no encontrada" },
        { status: 404 }
      );
    }

    console.log("🔍 [PULL-FUNDS] Validando cédula del usuario...");
    const user = await prisma.users.findFirst({
      where: {
        account_iban:  account_number,
        identification: cedula,
      },
    });

    if (!user) {
      console.warn("❌ [PULL-FUNDS] Cédula no coincide con la cuenta");
      return NextResponse.json(
        { status: "NACK", error: "Cédula no coincide con la cuenta" },
        { status: 403 }
      );
    }

    console.log("💰 [PULL-FUNDS] Verificando fondos...");
    if (Number(account.balance) < Number(monto)) {
      console.warn("❌ [PULL-FUNDS] Fondos insuficientes:", {
        actual: account.balance,
        requerido: monto,
      });
      return NextResponse.json(
        { status: "NACK", error: "Fondos insuficientes" },
        { status: 400 }
      );
    }

    console.log("🔄 [PULL-FUNDS] Actualizando saldo...");
    await prisma.accounts.update({
      where: { iban:  account_number },
      data: {
        balance: new Decimal(account.balance).minus(montoDecimal),
      },
    });

    console.log("📝 [PULL-FUNDS] Registrando transacción...");
    await prisma.transactions.create({
      data: {
        transaction_id: crypto.randomUUID(),
        origin_iban:  account_number,
        destination_iban: null,
        origin_phone: null,
        destination_phone: null,
        transaction_type: "EXTERNA",
        amount: montoDecimal,
        currency: "CRC",
        description: "Pull externo autorizado",
        hmac_md5: "",
        status: "COMPLETED",
      },
    });

    console.log("✅ [PULL-FUNDS] Proceso completado exitosamente");
    return NextResponse.json(
      { status: "ACK", mensaje: "Fondos transferidos" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ [PULL-FUNDS] Error inesperado:", err);
    return NextResponse.json(
      { status: "NACK", error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
