import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: { transaction_id: string };
}

interface UpdateTransactionBody {
  state?: "PENDING" | "COMPLETED" | "REJECTED";
  description?: string | null;
  currency?: string;
}

interface TransactionResponse {
  transactionId: string;
  createdAt: string;
  originIban: string;
  destinationIban: string;
  originPhone: string | null;
  destinationPhone: string | null;
  transactionType: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  hmacMd5: string;
  updatedAt: string;
}

export async function GET(
  _req: NextRequest,
  { params }: Params
) {
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
      transactionId:   tx.transaction_id,
      createdAt:       tx.created_at.toISOString(),
      originIban:      tx.origin_iban!,
      destinationIban: tx.destination_iban!,
      originPhone:     tx.origin_phone,
      destinationPhone:tx.destination_phone,
      transactionType: tx.transaction_type,
      amount:          Number(tx.amount),
      currency:        tx.currency,
      status:          tx.status,
      description:     tx.description,
      hmacMd5:         tx.hmac_md5,
      updatedAt:       tx.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`GET /api/transactions/${transaction_id} error:`, error);
    return NextResponse.json(
      { error: "Unable to retrieve transaction." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  const { transaction_id } = params;

  try {
    const body = (await req.json()) as UpdateTransactionBody;
    const { state, description, currency } = body;

    if (state === undefined && description === undefined && currency === undefined) {
      return NextResponse.json(
        {
          error:
            "Must provide at least one of: state, description, or currency.",
        },
        { status: 400 }
      );
    }

    // If updating state, fetch previous to log
    let previousStatus: string | null = null;
    if (state !== undefined) {
      const existing = await prisma.transactions.findUnique({
        where: { transaction_id },
        select: { status: true },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Transaction not found for update." },
          { status: 404 }
        );
      }
      previousStatus = existing.status;
    }

    // Build update payload
    const dataToUpdate: any = {};
    if (state !== undefined) {
      const validStates = ["PENDING", "COMPLETED", "REJECTED"];
      if (!validStates.includes(state)) {
        return NextResponse.json(
          { error: 'Invalid state; must be "PENDING", "COMPLETED", or "REJECTED".' },
          { status: 400 }
        );
      }
      dataToUpdate.status = state;
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

    let updatedTx;
    if (state !== undefined) {
      // Atomic update + audit log
      const [txResult] = await prisma.$transaction([
        prisma.transactions.update({
          where: { transaction_id },
          data: dataToUpdate,
        }),
        prisma.audit_logs.create({
          data: {
            transaction_id,
            previous_status: previousStatus as any,
            new_status: state,
            changed_by: "system",
          },
        }),
      ]);
      updatedTx = txResult;
    } else {
      // Only update fields
      updatedTx = await prisma.transactions.update({
        where: { transaction_id },
        data: dataToUpdate,
      });
    }

    const response: TransactionResponse = {
      transactionId:   updatedTx.transaction_id,
      createdAt:       updatedTx.created_at.toISOString(),
      originIban:      updatedTx.origin_iban!,
      destinationIban: updatedTx.destination_iban!,
      originPhone:     updatedTx.origin_phone,
      destinationPhone:updatedTx.destination_phone,
      transactionType: updatedTx.transaction_type,
      amount:          Number(updatedTx.amount),
      currency:        updatedTx.currency,
      status:          updatedTx.status,
      description:     updatedTx.description,
      hmacMd5:         updatedTx.hmac_md5,
      updatedAt:       updatedTx.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error(`PUT /api/transactions/${transaction_id} error:`, error);
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

export async function DELETE(
  _req: NextRequest,
  { params }: Params
) {
  const { transaction_id } = params;
  try {
    await prisma.transactions.delete({
      where: { transaction_id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`DELETE /api/transactions/${transaction_id} error:`, error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Transaction not found for deletion." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Unable to delete transaction." },
      { status: 500 }
    );
  }
}
