import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { generateHmacForAccountTransfer } from "@/lib/hmac";

interface CreateTransactionBody {
  origin_iban: string;
  destination_iban: string;
  amount: number;       // number (hasta 2 decimales)
  currency?: string;    // opcional, por defecto "CRC"
  reason?: string;      // opcional
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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateTransactionBody;
    const {
      origin_iban,
      destination_iban,
      amount,
      currency,
      reason
    } = body;

    if (!origin_iban || !destination_iban || amount === undefined) {
      return NextResponse.json(
        {
          error: "Faltan campos requeridos: origin_iban, destination_iban, amount.",
        },
        { status: 400 }
      );
    }
    if (typeof origin_iban !== "string" || typeof destination_iban !== "string") {
      return NextResponse.json(
        { error: "Los campos origin_iban y destination_iban deben ser strings." },
        { status: 400 }
      );
    }
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "El campo amount debe ser un número mayor que 0." },
        { status: 400 }
      );
    }

    const transactionId = uuidv4();
    const timestamp = new Date().toISOString();
    const txCurrency = currency ?? "CRC";

    const hmac_md5 = generateHmacForAccountTransfer(
      origin_iban,
      timestamp,
      transactionId,
      amount
    );

    const originAccount = await prisma.accounts.findUnique({
      where: { iban: origin_iban },
    });
    if (!originAccount) {
      return NextResponse.json(
        { error: `Cuenta de origen ${origin_iban} no encontrada.` },
        { status: 400 }
      );
    }
    const destinationAccount = await prisma.accounts.findUnique({
      where: { iban: destination_iban },
    });
    if (!destinationAccount) {
      return NextResponse.json(
        { error: `Cuenta de destino ${destination_iban} no encontrada.` },
        { status: 400 }
      );
    }
    if (Number(originAccount.balance) < amount) {
      return NextResponse.json(
        { error: "Saldo insuficiente en la cuenta de origen." },
        { status: 400 }
      );
    }

    const createdTx = await prisma.transactions.create({
      data: {
        transaction_id: transactionId,
        origin_iban,
        destination_iban,
        amount: new Decimal(amount),
        currency: txCurrency,
        description: reason ?? null,
        hmac_md5,
        status: "PENDING",
      },
    });

    await prisma.$transaction([
      prisma.accounts.update({
        where: { iban: origin_iban },
        data: {
          balance: new Decimal(Number(originAccount.balance) - amount),
        },
      }),
      prisma.accounts.update({
        where: { iban: destination_iban },
        data: {
          balance: new Decimal(Number(destinationAccount.balance) + amount),
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
        { error: "Error al crear la transacción." },
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
    console.error("Error en POST /api/transfers/internal:", error);
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error: "Una o ambas cuentas (origen/destino) no existen en la base de datos.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "No fue posible crear la transacción." },
      { status: 500 }
    );
  }
}
