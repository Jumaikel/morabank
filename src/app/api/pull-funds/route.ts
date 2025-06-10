import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { account_number_remote, cedula, monto } = body;

    if (!account_number_remote || !cedula || monto == null) {
      return NextResponse.json(
        { status: "NACK", error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const montoDecimal = new Decimal(monto);
    if (montoDecimal.lte(0)) {
      return NextResponse.json(
        { status: "NACK", error: "Monto inválido" },
        { status: 400 }
      );
    }

    const account = await prisma.accounts.findUnique({
      where: { iban: account_number_remote },
    });

    if (!account) {
      return NextResponse.json(
        { status: "NACK", error: "Cuenta no encontrada" },
        { status: 404 }
      );
    }

    const user = await prisma.users.findFirst({
      where: {
        account_iban: account_number_remote,
        identification: cedula,
      },
    });

    if (!user) {
      return NextResponse.json(
        { status: "NACK", error: "Cédula no coincide con la cuenta" },
        { status: 403 }
      );
    }

    if (Number(account.balance) < Number(monto)) {
      return NextResponse.json(
        { status: "NACK", error: "Fondos insuficientes" },
        { status: 400 }
      );
    }

    await prisma.accounts.update({
      where: { iban: account_number_remote },
      data: {
        balance: new Decimal(account.balance).minus(montoDecimal),
      },
    });

    await prisma.transactions.create({
      data: {
        transaction_id: crypto.randomUUID(),
        origin_iban: account_number_remote,
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

    return NextResponse.json(
      { status: "ACK", mensaje: "Fondos transferidos" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/pull-funds] Error:", err);
    return NextResponse.json(
      { status: "NACK", error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
