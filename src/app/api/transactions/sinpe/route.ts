import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface SinpeTransferBody {
  origin_iban: string;
  destination_phone: string;
  amount: number;
  currency?: string; // default "CRC"
  reason?: string;
}

// Validar teléfono Costa Rica (ej. +50671234567 o 8 dígitos)
const PHONE_REGEX = /^(\+506)?[1-9]\d{7}$/;

export async function POST(req: NextRequest) {
  try {
    const body: SinpeTransferBody = await req.json();
    let { origin_iban, destination_phone, amount, currency, reason } = body;

    // 1) Validaciones básicas de entrada
    if (
      typeof origin_iban !== "string" ||
      typeof destination_phone !== "string" ||
      typeof amount !== "number"
    ) {
      return NextResponse.json(
        { error: "origin_iban, destination_phone y amount son obligatorios" },
        { status: 400 }
      );
    }

    // Normalizar IBAN y teléfono
    origin_iban = origin_iban.trim().toUpperCase();
    destination_phone = destination_phone.trim();

    // Validar formato IBAN mínimo (ej. 24 chars, empieza con "CR")
    if (!/^CR\d{2}[A-Z0-9]{4}\d{14}$/.test(origin_iban)) {
      return NextResponse.json(
        { error: "Formato de IBAN inválido para origin_iban" },
        { status: 400 }
      );
    }

    // Validar teléfono
    if (!PHONE_REGEX.test(destination_phone)) {
      return NextResponse.json(
        { error: "Formato de teléfono destino inválido" },
        { status: 400 }
      );
    }

    // Validar monto
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "El amount debe ser un número mayor que 0" },
        { status: 400 }
      );
    }

    const txCurrency = currency?.trim().toUpperCase() || "CRC";
    if (!/^[A-Z]{3}$/.test(txCurrency)) {
      return NextResponse.json(
        { error: "currency inválido (debe ser código de 3 letras)" },
        { status: 400 }
      );
    }

    // 2) Buscar cuenta origin
    const originAccount = await prisma.accounts.findUnique({
      where: { iban: origin_iban },
    });
    if (!originAccount) {
      return NextResponse.json(
        { error: `Cuenta origen no existe: ${origin_iban}` },
        { status: 404 }
      );
    }
    if (originAccount.state !== "ACTIVE") {
      return NextResponse.json(
        { error: "Cuenta origen no está en estado ACTIVE" },
        { status: 400 }
      );
    }

    // 3) Buscar usuario destino por teléfono
    const userDest = await prisma.users.findUnique({
      where: { phone: destination_phone },
    });
    if (!userDest) {
      return NextResponse.json(
        { error: `No se encontró usuario con teléfono: ${destination_phone}` },
        { status: 404 }
      );
    }

    // 4) Obtener cuenta destino del usuario encontrado
    const destinationAccount = await prisma.accounts.findUnique({
      where: { iban: userDest.account_iban },
    });
    if (!destinationAccount) {
      return NextResponse.json(
        { error: "Cuenta destino no existe para ese usuario" },
        { status: 404 }
      );
    }
    if (destinationAccount.state !== "ACTIVE") {
      return NextResponse.json(
        { error: "Cuenta destino no está en estado ACTIVE" },
        { status: 400 }
      );
    }

    // 5) Verificar fondos suficientes
    const originBalance = Number(originAccount.balance);
    if (originBalance < amount) {
      return NextResponse.json(
        { error: "Fondos insuficientes en cuenta origen" },
        { status: 400 }
      );
    }

    // 6) Iniciar transacción atómica para actualizar saldos y crear registro
    const nuevaTransaccion = await prisma.$transaction(
      async (tx) => {
        // Restar saldo a cuenta origen
        await tx.accounts.update({
          where: { iban: origin_iban },
          data: { balance: { decrement: amount } },
        });

        // Sumar saldo a cuenta destino
        await tx.accounts.update({
          where: { iban: destinationAccount.iban },
          data: { balance: { increment: amount } },
        });

        // Crear registro en transactions
        const created = await tx.transactions.create({
          data: {
            origin_iban,
            destination_iban: destinationAccount.iban,
            amount,
            currency: txCurrency,
            reason: reason?.trim() || null,
            hmac_md5: "", // Se puede completar si hay HMAC entre bancos
          },
          select: {
            transaction_id: true,
            created_at: true,
            origin_iban: true,
            destination_iban: true,
            amount: true,
            currency: true,
            state: true,
            reason: true,
            updated_at: true,
          },
        });

        return created;
      },
      { isolationLevel: "Serializable" }
    );

    // 7) Formatear response a camelCase
    const response = {
      transactionId: nuevaTransaccion.transaction_id,
      createdAt: nuevaTransaccion.created_at.toISOString(),
      originIban: nuevaTransaccion.origin_iban,
      destinationIban: nuevaTransaccion.destination_iban,
      amount: Number(nuevaTransaccion.amount),
      currency: nuevaTransaccion.currency,
      state: nuevaTransaccion.state,
      reason: nuevaTransaccion.reason,
      updatedAt: nuevaTransaccion.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error en POST /api/transactions/sinpe:", error);
    return NextResponse.json(
      { error: "Error interno al procesar transferencia SINPE" },
      { status: 500 }
    );
  }
}
