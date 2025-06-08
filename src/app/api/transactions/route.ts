import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { generateHmacForAccountTransfer } from "@/lib/hmac";

interface CreateTransactionBody {
  origin_iban: string;
  destination_iban: string;
  amount: number;
  currency?: string;
  description?: string;
}

interface TransactionResponse {
  transactionId: string;
  createdAt: string;
  originIban: string;
  destinationIban: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  hmacMd5: string;
  transactionType: string;
  updatedAt: string;
}

export async function POST(req: NextRequest) {
  console.log(
    `▶️ [TRANSFERS-INTERNAL] Inicio procesamiento: ${new Date().toISOString()}`
  );

  let body: CreateTransactionBody;
  try {
    body = (await req.json()) as CreateTransactionBody;
    console.log("✅ [TRANSFERS-INTERNAL] Body parseado:", body);
  } catch (err) {
    console.error("❌ [TRANSFERS-INTERNAL] JSON inválido:", err);
    return NextResponse.json(
      { error: "JSON inválido en body." },
      { status: 400 }
    );
  }

  const { origin_iban, destination_iban, amount, currency, description } = body;

  // Validaciones básicas
  console.log("🔍 [TRANSFERS-INTERNAL] Validando campos requeridos...");
  if (!origin_iban || !destination_iban || amount === undefined) {
    console.warn("⚠️ [TRANSFERS-INTERNAL] Faltan campos requeridos:", {
      origin_iban,
      destination_iban,
      amount,
    });
    return NextResponse.json(
      {
        error:
          "Faltan campos requeridos: origin_iban, destination_iban, amount.",
      },
      { status: 400 }
    );
  }
  if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
    console.warn("⚠️ [TRANSFERS-INTERNAL] Monto inválido:", amount);
    return NextResponse.json(
      { error: "El campo amount debe ser un número mayor que 0." },
      { status: 400 }
    );
  }
  console.log("✅ [TRANSFERS-INTERNAL] Validaciones básicas OK.");

  // Preparar datos
  const transactionId = uuidv4();
  const timestamp = new Date().toISOString();
  const txCurrency = currency ?? "CRC";
  const hmacMd5 = generateHmacForAccountTransfer(
    origin_iban,
    timestamp,
    transactionId,
    amount
  );
  console.log(
    `ℹ️ [TRANSFERS-INTERNAL] Datos preparados txID=${transactionId}, currency=${txCurrency}`
  );

  // Carga de cuentas
  console.log(`🔍 [TRANSFERS-INTERNAL] Cargando cuenta origen=${origin_iban}`);
  const originAccount = await prisma.accounts.findUnique({
    where: { iban: origin_iban },
  });
  if (!originAccount) {
    console.error(
      `❌ [TRANSFERS-INTERNAL] Cuenta origen no encontrada: ${origin_iban}`
    );
    return NextResponse.json(
      { error: `Cuenta origen ${origin_iban} no encontrada.` },
      { status: 400 }
    );
  }
  console.log(
    `✅ [TRANSFERS-INTERNAL] Cuenta origen encontrada. Balance=${originAccount.balance}`
  );

  console.log(
    `🔍 [TRANSFERS-INTERNAL] Cargando cuenta destino=${destination_iban}`
  );
  const destinationAccount = await prisma.accounts.findUnique({
    where: { iban: destination_iban },
  });
  if (!destinationAccount) {
    console.error(
      `❌ [TRANSFERS-INTERNAL] Cuenta destino no encontrada: ${destination_iban}`
    );
    return NextResponse.json(
      { error: `Cuenta destino ${destination_iban} no encontrada.` },
      { status: 400 }
    );
  }
  console.log(
    `✅ [TRANSFERS-INTERNAL] Cuenta destino encontrada. Balance=${destinationAccount.balance}`
  );

  if (Number(originAccount.balance) < amount) {
    console.warn(
      `⚠️ [TRANSFERS-INTERNAL] Saldo insuficiente: ${originAccount.balance} < ${amount}`
    );
    return NextResponse.json(
      { error: "Saldo insuficiente en la cuenta de origen." },
      { status: 400 }
    );
  }
  console.log("✅ [TRANSFERS-INTERNAL] Saldo suficiente.");

  // Crear transacción PENDING
  console.log(
    `💾 [TRANSFERS-INTERNAL] Creando transacción PENDING txID=${transactionId}`
  );
  const tx = await prisma.transactions.create({
    data: {
      transaction_id: transactionId,
      origin_iban,
      destination_iban,
      amount: new Decimal(amount),
      currency: txCurrency,
      description: description ?? null,
      hmac_md5: hmacMd5,
      status: "PENDING",
      transaction_type: "INTERNA",
    },
  });
  console.log(`✅ [TRANSFERS-INTERNAL] Transacción PENDING creada.`);

  // Primer audit log: NULL → PENDING
  console.log(`💾 [TRANSFERS-INTERNAL] Creando audit_log inicial.`);
  await prisma.audit_logs.create({
    data: {
      transaction_id: tx.transaction_id,
      previous_status: null,
      new_status: "PENDING",
      changed_by: origin_iban,
    },
  });
  console.log(`✅ [TRANSFERS-INTERNAL] Audit log inicial creado.`);

  // Actualizar balances y completar transacción
  console.log(
    `🔄 [TRANSFERS-INTERNAL] Ejecutando débito/crédito y completando transacción.`
  );
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
      where: { transaction_id: tx.transaction_id },
      data: { status: "COMPLETED" },
    }),
    prisma.audit_logs.create({
      data: {
        transaction_id: tx.transaction_id,
        previous_status: "PENDING",
        new_status: "COMPLETED",
        changed_by: origin_iban,
      },
    }),
  ]);
  console.log(
    `✅ [TRANSFERS-INTERNAL] Transacción COMPLETED y audit log creado.`
  );

  // Formatear y devolver respuesta
  const finalTx = await prisma.transactions.findUnique({
    where: { transaction_id: tx.transaction_id },
  });
  console.log(
    `✔️ [TRANSFERS-INTERNAL] Procesamiento finalizado txID=${transactionId}`
  );
  const response: TransactionResponse = {
    transactionId: finalTx!.transaction_id,
    createdAt: finalTx!.created_at.toISOString(),
    originIban: finalTx!.origin_iban!,
    destinationIban: finalTx!.destination_iban!,
    amount: Number(finalTx!.amount),
    currency: finalTx!.currency,
    status: finalTx!.status,
    description: finalTx!.description,
    hmacMd5: finalTx!.hmac_md5,
    transactionType: finalTx!.transaction_type,
    updatedAt: finalTx!.updated_at.toISOString(),
  };
  return NextResponse.json(response, { status: 201 });
}
