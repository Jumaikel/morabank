import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import crypto from "crypto";

interface CreateTransactionBody {
  origin_iban: string;
  destination_iban: string;
  amount: number;       // number (up to 2 decimal places)
  currency?: string;    // optional, default "CRC"
  reason?: string;      // optional
  hmac_md5: string;     // 32-character hex string
}

interface TransactionResponse {
  transaction_id: string;
  created_at: string;        // ISO string
  origin_iban: string;
  destination_iban: string;
  amount: number;
  currency: string;
  status: string;            // "PENDING" | "COMPLETED" | "REJECTED"
  reason: string | null;
  hmac_md5: string;
  updated_at: string;        // ISO string
}

const HMAC_SECRET = process.env.HMAC_SECRET || "default_hmac_secret";

function generateHmacMd5(data: { origin_iban: string, destination_iban: string, amount: number, currency: string }) {
  // Puedes concatenar con | u otro delimitador para evitar ambigüedades
  const payload = `${data.origin_iban}|${data.destination_iban}|${data.amount}|${data.currency}`;
  return crypto.createHmac("md5", HMAC_SECRET).update(payload).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      origin_iban,
      destination_iban,
      amount,
      currency,
      reason
      // Ya no recibas hmac_md5 del frontend
    } = body;

    // Validaciones iguales que antes...
    if (
      !origin_iban ||
      !destination_iban ||
      amount === undefined
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields: origin_iban, destination_iban, amount.",
        },
        { status: 400 }
      );
    }
    if (
      typeof origin_iban !== "string" ||
      typeof destination_iban !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid data types for origin_iban or destination_iban." },
        { status: 400 }
      );
    }
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "The field amount must be a number > 0." },
        { status: 400 }
      );
    }

    // Cálculo del HMAC en el backend
    const txCurrency = currency ?? "CRC";
    const hmac_md5 = generateHmacMd5({
      origin_iban,
      destination_iban,
      amount,
      currency: txCurrency,
    });

    // Continúa igual, pero usa el hmac generado:
    const originAccount = await prisma.accounts.findUnique({
      where: { iban: origin_iban },
    });
    if (!originAccount) {
      return NextResponse.json(
        { error: `Origin account ${origin_iban} not found.` },
        { status: 400 }
      );
    }
    const destinationAccount = await prisma.accounts.findUnique({
      where: { iban: destination_iban },
    });
    if (!destinationAccount) {
      return NextResponse.json(
        { error: `Destination account ${destination_iban} not found.` },
        { status: 400 }
      );
    }
    if (Number(originAccount.balance) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance in origin account." },
        { status: 400 }
      );
    }

    // Prisma transaction...
    const [createdTx] = await prisma.$transaction([
      prisma.transactions.create({
        data: {
          origin_iban,
          destination_iban,
          amount: new Decimal(amount),
          currency: txCurrency,
          description: reason ?? null,
          hmac_md5, // Usa el generado
          status: "PENDING",
        },
      }),
    ]);
    // ...el resto igual...
    await prisma.$transaction([
      prisma.accounts.update({
        where: { iban: origin_iban },
        data: {
          balance: new Decimal(
            Number(originAccount.balance) - amount
          ),
        },
      }),
      prisma.accounts.update({
        where: { iban: destination_iban },
        data: {
          balance: new Decimal(
            Number(destinationAccount.balance) + amount
          ),
        },
      }),
      prisma.transactions.update({
        where: { transaction_id: createdTx.transaction_id },
        data: { status: "COMPLETED" },
      }),
    ]);

    const finalTx = await prisma.transactions.findUnique({
      where: { transaction_id: createdTx.transaction_id },
    });

    if (!finalTx) {
      return NextResponse.json(
        { error: "Transaction creation failed." },
        { status: 500 }
      );
    }

    const response: TransactionResponse = {
      transaction_id: finalTx.transaction_id,
      created_at: finalTx.created_at.toISOString(),
      origin_iban: finalTx.origin_iban,
      destination_iban: finalTx.destination_iban,
      amount: Number(finalTx.amount),
      currency: finalTx.currency,
      status: finalTx.status,
      reason: finalTx.description,
      hmac_md5: finalTx.hmac_md5,
      updated_at: finalTx.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/transactions:", error);
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "One or both accounts (origin/destination) do not exist." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to create transaction." },
      { status: 500 }
    );
  }
}
