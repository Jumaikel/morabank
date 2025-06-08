import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface TransactionResponse {
  transaction_id: string;
  created_at: string;
  origin_iban: string;
  destination_iban: string;
  amount: number;
  currency: string;
  status: string;
  reason: string | null;
  hmac_md5: string;
  updated_at: string;
}

interface Params {
  params: { iban: string };
}

export async function GET(
  req: NextRequest,
  { params }: Params
) {
  const { iban } = await params;

  if (!iban) {
    return NextResponse.json(
      { error: "El IBAN es requerido" },
      { status: 400 }
    );
  }

  try {
    const transactions = await prisma.transactions.findMany({
      where: {
        OR: [
          { origin_iban: iban },
          { destination_iban: iban }
        ],
      },
      orderBy: { created_at: "desc" },
    });

    const formatted: TransactionResponse[] = transactions.map((tx) => ({
      transaction_id: tx.transaction_id,
      created_at: tx.created_at.toISOString(),
      origin_iban: tx.origin_iban!,
      destination_iban: tx.destination_iban!,
      origin_phone: tx.origin_phone,
      destination_phone: tx.destination_phone,
      transaction_type: tx.transaction_type,
      amount: Number(tx.amount),
      currency: tx.currency,
      status: tx.status,
      reason: tx.description,
      hmac_md5: tx.hmac_md5,
      updated_at: tx.updated_at.toISOString(),
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error al obtener transacciones de la cuenta:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener las transacciones de la cuenta" },
      { status: 500 }
    );
  }
}
