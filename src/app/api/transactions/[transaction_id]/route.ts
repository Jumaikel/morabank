import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: { transaction_id: string };
}

interface UpdateTransactionBody {
  state?: "PENDING" | "COMPLETED" | "REJECTED";
  description?: string | null;
  currency?: string;
  // We do NOT allow changing origin_iban, destination_iban, or amount here.
}

interface TransactionResponse {
  transaction_id: string;
  created_at: string;       // ISO string
  origin_iban: string;
  destination_iban: string;
  amount: number;
  currency: string;
  state: string;
  description: string | null;
  hmac_md5: string;
  updated_at: string;       // ISO string
}

export async function GET(req: NextRequest, { params }: Params) {
  const { transaction_id } = params;

  try {
    const tx = await prisma.transactions.findUnique({
      where: { transaction_id },
    });

    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found." },
        { status: 404 }
      );
    }

    const response: TransactionResponse = {
      transaction_id: tx.transaction_id,
      created_at: tx.created_at.toISOString(),
      origin_iban: tx.origin_iban,
      destination_iban: tx.destination_iban,
      amount: Number(tx.amount),
      currency: tx.currency,
      state: tx.state,
      description: tx.description,
      hmac_md5: tx.hmac_md5,
      updated_at: tx.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error in GET /api/transactions/${transaction_id}:`, error);
    return NextResponse.json(
      { error: "Unable to retrieve transaction." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { transaction_id } = params;

  try {
    const body: UpdateTransactionBody = await req.json();
    const { state, description, currency } = body;

    if (state === undefined && description === undefined && currency === undefined) {
      return NextResponse.json(
        {
          error:
            "Must provide at least one of these fields to update: state, description, or currency.",
        },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};

    if (state !== undefined) {
      const validStates = ["PENDING", "COMPLETED", "REJECTED"];
      if (!validStates.includes(state)) {
        return NextResponse.json(
          { error: 'Invalid state; must be "PENDING", "COMPLETED", or "REJECTED".' },
          { status: 400 }
        );
      }
      dataToUpdate.state = state;
    }

    if (description !== undefined) {
      if (description !== null && typeof description !== "string") {
        return NextResponse.json(
          { error: '"description" must be a string or null.' },
          { status: 400 }
        );
      }
      dataToUpdate.description = description;
    }

    if (currency !== undefined) {
      if (typeof currency !== "string" || currency.length !== 3) {
        return NextResponse.json(
          { error: '"currency" must be a 3-letter string.' },
          { status: 400 }
        );
      }
      dataToUpdate.currency = currency.toUpperCase();
    }

    // Prisma will update updated_at automatically via default now(6)
    const updatedTx = await prisma.transactions.update({
      where: { transaction_id },
      data: dataToUpdate,
    });

    const response: TransactionResponse = {
      transaction_id: updatedTx.transaction_id,
      created_at: updatedTx.created_at.toISOString(),
      origin_iban: updatedTx.origin_iban,
      destination_iban: updatedTx.destination_iban,
      amount: Number(updatedTx.amount),
      currency: updatedTx.currency,
      state: updatedTx.state,
      description: updatedTx.description,
      hmac_md5: updatedTx.hmac_md5,
      updated_at: updatedTx.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error(`Error in PUT /api/transactions/${transaction_id}:`, error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Transaction not found for update." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Unable to update transaction." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { transaction_id } = params;

  try {
    await prisma.transactions.delete({
      where: { transaction_id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`Error in DELETE /api/
