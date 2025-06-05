import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

export async function GET(req: NextRequest) {
  try {
    const allTx = await prisma.transactions.findMany({
      orderBy: { created_at: "desc" },
    });

    const formatted: TransactionResponse[] = allTx.map((tx) => ({
      transaction_id: tx.transaction_id,
      created_at: tx.created_at.toISOString(),
      origin_iban: tx.origin_iban,
      destination_iban: tx.destination_iban,
      amount: Number(tx.amount),
      currency: tx.currency,
      status: tx.status,
      reason: tx.description,
      hmac_md5: tx.hmac_md5,
      updated_at: tx.updated_at.toISOString(),
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/transactions:", error);
    return NextResponse.json(
      { error: "Unable to list transactions." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateTransactionBody = await req.json();
    const {
      origin_iban,
      destination_iban,
      amount,
      currency,
      reason,
      hmac_md5,
    } = body;

    // Validate required fields
    if (
      !origin_iban ||
      !destination_iban ||
      amount === undefined ||
      !hmac_md5
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: origin_iban, destination_iban, amount, hmac_md5.",
        },
        { status: 400 }
      );
    }
    if (
      typeof origin_iban !== "string" ||
      typeof destination_iban !== "string" ||
      typeof hmac_md5 !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid data types for origin_iban, destination_iban, or hmac_md5." },
        { status: 400 }
      );
    }
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "The field amount must be a number > 0." },
        { status: 400 }
      );
    }
    if (hmac_md5.length !== 32) {
      return NextResponse.json(
        { error: "hmac_md5 must be a 32-character string." },
        { status: 400 }
      );
    }

    // Fetch origin and destination accounts
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

    // Verify sufficient balance
    if (Number(originAccount.balance) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance in origin account." },
        { status: 400 }
      );
    }

    // Use a transaction to create the record and update balances atomically
    const [createdTx] = await prisma.$transaction([
      prisma.transactions.create({
        data: {
          origin_iban,
          destination_iban,
          amount: new prisma.Decimal(amount),
          currency: currency ?? "CRC",
          description: reason ?? null,
          hmac_md5,
          status: "PENDING",
        },
      }),
      // Note: We will update balances and status in subsequent operations
    ]);

    // Update balances and set status = COMPLETED
    const updatedResults = await prisma.$transaction([
      prisma.accounts.update({
        where: { iban: origin_iban },
        data: {
          balance: new prisma.Decimal(
            Number(originAccount.balance) - amount
          ),
        },
      }),
      prisma.accounts.update({
        where: { iban: destination_iban },
        data: {
          balance: new prisma.Decimal(
            Number(destinationAccount.balance) + amount
          ),
        },
      }),
      prisma.transactions.update({
        where: { transaction_id: createdTx.transaction_id },
        data: { status: "COMPLETED" },
      }),
    ]);

    // Fetch the final transaction with updated status
    const finalTx = await prisma.transactions.findUnique({
      where: { transaction_id: createdTx.transaction_id },
    });

    if (!finalTx) {
      // This should not happen, but handle defensively
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

    // Foreign key violation if either account does not exist (should be caught earlier)
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
