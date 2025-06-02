// app/api/transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface CreateTransactionBody {
  origin_iban: string;
  destination_iban: string;
  amount: number; // valor numérico (hasta 2 decimales)
  currency?: string; // opcional, default “CRC”
  reason?: string; // opcional
  hmac_md5: string; // string de 32 caracteres (MD5 en hex o similar)
}

interface TransactionResponse {
  transaction_id: string;
  created_at: string; // ISO
  origin_iban: string;
  destination_iban: string;
  amount: number; // number en JS
  currency: string;
  state: string; // “PENDING” | “COMPLETED” | “REJECTED”
  reason: string | null;
  hmac_md5: string;
  updated_at: string; // ISO
}

export async function GET(req: NextRequest) {
  try {
    const allTx = await prisma.transactions.findMany({
      orderBy: { created_at: "desc" },
    });

    interface RawTransaction {
      transaction_id: string;
      created_at: Date;
      origin_iban: string;
      destination_iban: string;
      amount: number;
      currency: string;
      state: string;
      reason: string | null;
      hmac_md5: string;
      updated_at: Date;
    }

    const formatted: TransactionResponse[] = allTx.map(
      (tx: RawTransaction): TransactionResponse => ({
        transaction_id: tx.transaction_id,
        created_at: tx.created_at.toISOString(),
        origin_iban: tx.origin_iban,
        destination_iban: tx.destination_iban,
        amount: tx.amount,
        currency: tx.currency,
        state: tx.state,
        reason: tx.reason,
        hmac_md5: tx.hmac_md5,
        updated_at: tx.updated_at.toISOString(),
      })
    );

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/transactions:", error);
    return NextResponse.json(
      { error: "Error al listar transacciones" },
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

    if (
      !origin_iban ||
      !destination_iban ||
      amount === undefined ||
      !hmac_md5
    ) {
      return NextResponse.json(
        {
          error:
            "Faltan campos obligatorios: origin_iban, destination_iban, amount, hmac_md5",
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
        { error: "Tipos de datos inválidos en algunos campos" },
        { status: 400 }
      );
    }
    if (typeof amount !== "number" || isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { error: "El campo amount debe ser un número ≥ 0" },
        { status: 400 }
      );
    }
    if (hmac_md5.length !== 32) {
      return NextResponse.json(
        { error: "hmac_md5 debe ser una cadena de 32 caracteres" },
        { status: 400 }
      );
    }

    const cuentaOrigen = await prisma.accounts.findUnique({
      where: { iban: origin_iban },
    });
    if (!cuentaOrigen) {
      return NextResponse.json(
        { error: `Cuenta de origen ${origin_iban} no encontrada` },
        { status: 400 }
      );
    }
    const cuentaDestino = await prisma.accounts.findUnique({
      where: { iban: destination_iban },
    });
    if (!cuentaDestino) {
      return NextResponse.json(
        { error: `Cuenta de destino ${destination_iban} no encontrada` },
        { status: 400 }
      );
    }

    const newTx = await prisma.transactions.create({
      data: {
        origin_iban: origin_iban,
        destination_iban: destination_iban,
        amount: amount,
        currency: currency ? currency : "CRC",
        reason: reason ? reason : null,
        hmac_md5: hmac_md5,
        state: "COMPLETED",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    const response: TransactionResponse = {
      transaction_id: newTx.transaction_id,
      created_at: newTx.created_at.toISOString(),
      origin_iban: newTx.origin_iban,
      destination_iban: newTx.destination_iban,
      amount: Number(newTx.amount),
      currency: newTx.currency,
      state: newTx.state,
      reason: newTx.reason,
      hmac_md5: newTx.hmac_md5,
      updated_at: newTx.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/transactions:", error);
    if (
      typeof (error as any).code === "string" &&
      (error as any).code === "P2003"
    ) {
      return NextResponse.json(
        { error: "Alguna de las cuentas (origin/destination) no existe" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "No se pudo crear la transacción" },
      { status: 500 }
    );
  }
}
