import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// Validate Costa Rica phone numbers (e.g., "+50671234567" or 8 digits)
const PHONE_REGEX = /^(\+506)?[1-9]\d{7}$/;

// Validate Costa Rica IBAN: "CR" + 2 digits + 20 digits (total length 24)
const IBAN_REGEX = /^CR\d{2}\d{20}$/;

// Helper para generar el HMAC MD5
const HMAC_SECRET = process.env.HMAC_SECRET || "default_hmac_secret";
function generateHmacMd5(data: {
  origin_iban: string;
  destination_iban: string;
  amount: number;
  currency: string;
}) {
  const payload = `${data.origin_iban}|${data.destination_iban}|${data.amount}|${data.currency}`;
  return crypto.createHmac("md5", HMAC_SECRET).update(payload).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { origin_iban, destination_phone, amount, currency, reason } = body;

    // 1) Validación básica de entrada
    if (
      typeof origin_iban !== "string" ||
      typeof destination_phone !== "string" ||
      typeof amount !== "number"
    ) {
      console.error("Invalid origin_iban format:", origin_iban);
      console.error("Invalid destination_phone format:", destination_phone);
      console.error("Invalid amount format:", amount);
      return NextResponse.json(
        {
          error:
            "origin_iban, destination_phone, and amount are required fields.",
        },
        { status: 400 }
      );
    }

    origin_iban = origin_iban.trim().toUpperCase();
    destination_phone = destination_phone.trim();

    // 2) Validar formato IBAN
    if (!IBAN_REGEX.test(origin_iban)) {
      console.error("Invalid origin_iban format:", origin_iban);
      return NextResponse.json(
        { error: "Invalid origin_iban format." },
        { status: 400 }
      );
    }

    // 3) Validar formato teléfono
    if (!PHONE_REGEX.test(destination_phone)) {
      console.error("Invalid destination_phone format:", destination_phone);
      return NextResponse.json(
        { error: "Invalid destination_phone format." },
        { status: 400 }
      );
    }

    // 4) Validar monto
    if (isNaN(amount) || amount <= 0) {
      console.error("Invalid amount format:", amount);
      return NextResponse.json(
        { error: "amount must be a number greater than 0." },
        { status: 400 }
      );
    }

    const txCurrency = currency?.trim().toUpperCase() ?? "CRC";
    if (!/^[A-Z]{3}$/.test(txCurrency)) {
      console.error("Invalid currency format:", txCurrency);
      return NextResponse.json(
        { error: "Invalid currency; must be a 3-letter code." },
        { status: 400 }
      );
    }

    // 5) Buscar cuenta origen
    const originAccount = await prisma.accounts.findUnique({
      where: { iban: origin_iban },
    });
    if (!originAccount) {
      return NextResponse.json(
        { error: `Origin account not found: ${origin_iban}` },
        { status: 404 }
      );
    }
    if (originAccount.status !== "ACTIVO") {
      console.error("Origin account is not ACTIVO:", originAccount.status);
      return NextResponse.json(
        { error: "Origin account is not ACTIVO." },
        { status: 400 }
      );
    }

    // 6) Buscar usuario destino por teléfono
    const destinationUser = await prisma.users.findUnique({
      where: { phone: destination_phone },
    });
    if (!destinationUser) {
      return NextResponse.json(
        { error: `No user found with phone: ${destination_phone}` },
        { status: 404 }
      );
    }

    // 7) Buscar cuenta destino
    const destinationAccount = await prisma.accounts.findUnique({
      where: { iban: destinationUser.account_iban },
    });
    if (!destinationAccount) {
      console.error("Destination account not found for user:", destinationUser.identification);
      return NextResponse.json(
        { error: "Destination account does not exist for that user." },
        { status: 404 }
      );
    }
    if (destinationAccount.status !== "ACTIVO") {
      console.error("Destination account is not ACTIVO:", destinationAccount.status);
      return NextResponse.json(
        { error: "Destination account is not ACTIVO." },
        { status: 400 }
      );
    }

    // 8) Revisar fondos suficientes
    const originBalance = Number(originAccount.balance);
    if (originBalance < amount) {
      console.error(
        "Insufficient funds in origin account:",
        originBalance,
        "requested:",
        amount
      );
      return NextResponse.json(
        { error: "Insufficient funds in origin account." },
        { status: 400 }
      );
    }

    // 9) Generar el HMAC para la transacción
    const hmac_md5 = generateHmacMd5({
      origin_iban,
      destination_iban: destinationAccount.iban,
      amount,
      currency: txCurrency,
    });

    // 10) Ejecutar transacción atómica
    const createdTx = await prisma.$transaction(async (tx) => {
      // Restar saldo a origen
      await tx.accounts.update({
        where: { iban: origin_iban },
        data: {
          balance: { decrement: amount },
        },
      });

      // Sumar saldo a destino
      await tx.accounts.update({
        where: { iban: destinationAccount.iban },
        data: {
          balance: { increment: amount },
        },
      });

      // Crear el registro de transacción con HMAC
      const record = await tx.transactions.create({
        data: {
          origin_iban,
          destination_iban: destinationAccount.iban,
          amount,
          currency: txCurrency,
          description: reason?.trim() || null,
          hmac_md5,
          status: "COMPLETED",
        },
        select: {
          transaction_id: true,
          created_at: true,
          origin_iban: true,
          destination_iban: true,
          amount: true,
          currency: true,
          status: true,
          description: true,
          updated_at: true,
          hmac_md5: true,
        },
      });

      return record;
    });

    // 11) Formatear respuesta
    const response = {
      transactionId: createdTx.transaction_id,
      createdAt: createdTx.created_at.toISOString(),
      originIban: createdTx.origin_iban,
      destinationIban: createdTx.destination_iban,
      amount: Number(createdTx.amount),
      currency: createdTx.currency,
      status: createdTx.status,
      reason: createdTx.description,
      updatedAt: createdTx.updated_at.toISOString(),
      hmacMd5: createdTx.hmac_md5,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/transactions/sinpe:", error);
    return NextResponse.json(
      { error: "Internal error processing SINPE transfer." },
      { status: 500 }
    );
  }
}
