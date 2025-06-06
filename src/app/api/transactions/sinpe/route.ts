// app/api/transfers/sinpe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import {
  generateHmacForPhoneTransfer,
} from "@/lib/hmac";

// Validar números de teléfono de Costa Rica (p. ej. "+50671234567" o 8 dígitos)
const PHONE_REGEX = /^(\+506)?[1-9]\d{7}$/;

// Validar IBAN de Costa Rica: "CR" + 2 dígitos + 20 dígitos (longitud total 24)
const IBAN_REGEX = /^CR\d{2}\d{20}$/;

interface CreateSinpeBody {
  origin_iban: string;
  destination_phone: string;
  amount: number;
  currency?: string;
  reason?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateSinpeBody;
    let { origin_iban, destination_phone, amount, currency, reason } = body;

    // 1) Validación básica de entrada
    if (
      typeof origin_iban !== "string" ||
      typeof destination_phone !== "string" ||
      typeof amount !== "number"
    ) {
      console.error("Formato inválido en origin_iban:", origin_iban);
      console.error("Formato inválido en destination_phone:", destination_phone);
      console.error("Formato inválido en amount:", amount);
      return NextResponse.json(
        {
          error:
            "Los campos origin_iban, destination_phone y amount son obligatorios.",
        },
        { status: 400 }
      );
    }

    origin_iban = origin_iban.trim().toUpperCase();
    destination_phone = destination_phone.trim();

    // 2) Validar formato IBAN
    if (!IBAN_REGEX.test(origin_iban)) {
      console.error("Formato IBAN inválido:", origin_iban);
      return NextResponse.json(
        { error: "Formato inválido para origin_iban." },
        { status: 400 }
      );
    }

    // 3) Validar formato de teléfono
    if (!PHONE_REGEX.test(destination_phone)) {
      console.error("Formato teléfono inválido:", destination_phone);
      return NextResponse.json(
        { error: "Formato inválido para destination_phone." },
        { status: 400 }
      );
    }

    // 4) Validar monto
    if (isNaN(amount) || amount <= 0) {
      console.error("Monto inválido:", amount);
      return NextResponse.json(
        { error: "El campo amount debe ser un número mayor que 0." },
        { status: 400 }
      );
    }

    // 5) Validar código de moneda (opcional, por defecto "CRC")
    const txCurrency = currency?.trim().toUpperCase() ?? "CRC";
    if (!/^[A-Z]{3}$/.test(txCurrency)) {
      console.error("Formato moneda inválido:", txCurrency);
      return NextResponse.json(
        { error: "Moneda inválida; debe ser un código de 3 letras." },
        { status: 400 }
      );
    }

    // 6) Verificar existencia de cuenta de origen
    const originAccount = await prisma.accounts.findUnique({
      where: { iban: origin_iban },
    });
    if (!originAccount) {
      return NextResponse.json(
        { error: `No se encontró la cuenta de origen: ${origin_iban}` },
        { status: 404 }
      );
    }
    if (originAccount.status !== "ACTIVO") {
      console.error("La cuenta de origen no está ACTIVO:", originAccount.status);
      return NextResponse.json(
        { error: "La cuenta de origen no está ACTIVO." },
        { status: 400 }
      );
    }

    // 7) Buscar usuario destino por teléfono
    const destinationUser = await prisma.users.findUnique({
      where: { phone: destination_phone },
    });
    if (!destinationUser) {
      return NextResponse.json(
        { error: `No existe usuario con teléfono: ${destination_phone}` },
        { status: 404 }
      );
    }

    // 8) Buscar cuenta destino asociada a ese usuario
    const destinationAccount = await prisma.accounts.findUnique({
      where: { iban: destinationUser.account_iban },
    });
    if (!destinationAccount) {
      console.error(
        "Cuenta destino no encontrada para el usuario:",
        destinationUser.identification
      );
      return NextResponse.json(
        { error: "La cuenta destino no existe para ese usuario." },
        { status: 404 }
      );
    }
    if (destinationAccount.status !== "ACTIVO") {
      console.error(
        "La cuenta destino no está ACTIVO:",
        destinationAccount.status
      );
      return NextResponse.json(
        { error: "La cuenta destino no está ACTIVO." },
        { status: 400 }
      );
    }

    // 9) Verificar fondos suficientes
    const originBalance = Number(originAccount.balance);
    if (originBalance < amount) {
      console.error(
        "Fondos insuficientes en la cuenta de origen:",
        originBalance,
        "solicitado:",
        amount
      );
      return NextResponse.json(
        { error: "Fondos insuficientes en la cuenta de origen." },
        { status: 400 }
      );
    }

    // 10) Generar transactionId y timestamp para el HMAC
    const transactionId = uuidv4();
    const timestamp = new Date().toISOString();

    // 11) Generar HMAC usando la función de hmac.ts
    const hmac_md5 = generateHmacForPhoneTransfer(
      destination_phone,
      timestamp,
      transactionId,
      amount
    );

    // 12) Ejecutar transacción atómica
    const createdTx = await prisma.$transaction(async (tx) => {
      // Restar saldo en la cuenta de origen
      await tx.accounts.update({
        where: { iban: origin_iban },
        data: {
          balance: { decrement: amount },
        },
      });

      // Sumar saldo en la cuenta de destino
      await tx.accounts.update({
        where: { iban: destinationAccount.iban },
        data: {
          balance: { increment: amount },
        },
      });

      // Crear el registro de transacción con HMAC y timestamp explícito
      const record = await tx.transactions.create({
        data: {
          transaction_id: transactionId,
          created_at: new Date(timestamp),
          origin_iban,
          destination_iban: destinationAccount.iban,
          amount,
          currency: txCurrency,
          description: reason?.trim() || null,
          hmac_md5,
          status: "COMPLETED",
          updated_at: new Date(timestamp),
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

    // 13) Formatear la respuesta al cliente
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
    console.error("Error en POST /api/transfers/sinpe:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la transferencia SINPE." },
      { status: 500 }
    );
  }
}
