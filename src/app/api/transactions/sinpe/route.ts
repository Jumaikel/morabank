import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface SinpeTransferBody {
  origin_iban: string;
  destination_phone: string;
  amount: number;
  currency?: string; // default "CRC"
  reason?: string;
}

// Validate Costa Rica phone numbers (e.g., "+50671234567" or 8 digits)
const PHONE_REGEX = /^(\+506)?[1-9]\d{7}$/;

// Validate Costa Rica IBAN: "CR" + 2 digits + 20 digits (total length 24)
const IBAN_REGEX = /^CR\d{2}\d{20}$/;

export async function POST(req: NextRequest) {
  try {
    const body: SinpeTransferBody = await req.json();
    let { origin_iban, destination_phone, amount, currency, reason } = body;

    // 1) Basic input validation
    if (
      typeof origin_iban !== "string" ||
      typeof destination_phone !== "string" ||
      typeof amount !== "number"
    ) {
      return NextResponse.json(
        { error: "origin_iban, destination_phone, and amount are required fields." },
        { status: 400 }
      );
    }

    origin_iban = origin_iban.trim().toUpperCase();
    destination_phone = destination_phone.trim();

    // 2) Validate IBAN format
    if (!IBAN_REGEX.test(origin_iban)) {
      return NextResponse.json(
        { error: "Invalid origin_iban format." },
        { status: 400 }
      );
    }

    // 3) Validate phone format
    if (!PHONE_REGEX.test(destination_phone)) {
      return NextResponse.json(
        { error: "Invalid destination_phone format." },
        { status: 400 }
      );
    }

    // 4) Validate amount
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "amount must be a number greater than 0." },
        { status: 400 }
      );
    }

    const txCurrency = currency?.trim().toUpperCase() ?? "CRC";
    if (!/^[A-Z]{3}$/.test(txCurrency)) {
      return NextResponse.json(
        { error: "Invalid currency; must be a 3-letter code." },
        { status: 400 }
      );
    }

    // 5) Fetch origin account
    const originAccount = await prisma.accounts.findUnique({
      where: { iban: origin_iban },
    });
    if (!originAccount) {
      return NextResponse.json(
        { error: `Origin account not found: ${origin_iban}` },
        { status: 404 }
      );
    }
    if (originAccount.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Origin account is not ACTIVE." },
        { status: 400 }
      );
    }

    // 6) Fetch destination user by phone
    const destinationUser = await prisma.users.findUnique({
      where: { phone: destination_phone },
    });
    if (!destinationUser) {
      return NextResponse.json(
        { error: `No user found with phone: ${destination_phone}` },
        { status: 404 }
      );
    }

    // 7) Fetch destination account from that user
    const destinationAccount = await prisma.accounts.findUnique({
      where: { iban: destinationUser.account_iban },
    });
    if (!destinationAccount) {
      return NextResponse.json(
        { error: "Destination account does not exist for that user." },
        { status: 404 }
      );
    }
    if (destinationAccount.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Destination account is not ACTIVE." },
        { status: 400 }
      );
    }

    // 8) Check sufficient funds
    const originBalance = Number(originAccount.balance);
    if (originBalance < amount) {
      return NextResponse.json(
        { error: "Insufficient funds in origin account." },
        { status: 400 }
      );
    }

    // 9) Perform atomic transaction: update balances and create record
    const createdTx = await prisma.$transaction(async (tx) => {
      // Deduct from origin
      await tx.accounts.update({
        where: { iban: origin_iban },
        data: {
          balance: { decrement: amount },
        },
      });

      // Add to destination
      await tx.accounts.update({
        where: { iban: destinationAccount.iban },
        data: {
          balance: { increment: amount },
        },
      });

      // Create transaction record
      const record = await tx.transactions.create({
        data: {
          origin_iban,
          destination_iban: destinationAccount.iban,
          amount,
          currency: txCurrency,
          description: reason?.trim() || null,
          hmac_md5: "", // Empty or placeholder if not used in SINPE
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
        },
      });

      return record;
    });

    // 10) Format response in camelCase
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
