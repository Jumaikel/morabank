// Deshabilita la verificación de certificado autofirmado (solo para desarrollo)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { NextRequest, NextResponse } from "next/server";
import { BANK_ENDPOINTS } from "@/config/bankEndpoints";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

interface IbanTransferPayload {
  version: "1.0";
  timestamp: string;
  transaction_id: string;
  sender: {
    account_number: string;
    bank_code: string;
    name: string;
  };
  receiver: {
    account_number: string;
    bank_code: string;
    name: string;
  };
  amount: {
    value: number;
    currency: string;
  };
  description: string;
  hmac_md5: string;
}

export async function POST(req: NextRequest) {
  console.log(`▶️ [PROXY SINPE-IBAN] Inicio procesamiento: ${new Date().toISOString()}`);

  let payload: IbanTransferPayload;
  try {
    payload = await req.json();
    console.log("✅ [PROXY SINPE-IBAN] Payload parseado:", payload);
  } catch (err) {
    console.error("❌ [PROXY SINPE-IBAN] JSON inválido:", err);
    return NextResponse.json(
      { error: "Payload inválido." },
      { status: 400 }
    );
  }

  const {
    transaction_id,
    sender: { account_number: originIban },
    receiver: { account_number: destinationIban, bank_code: receiverBankCode },
    amount: { value, currency },
    description,
    hmac_md5,
  } = payload;

  // Validar proxy configurado
  const base = BANK_ENDPOINTS[receiverBankCode];
  console.log(`🔍 [PROXY SINPE-IBAN] Proxy configurado para bank_code=${receiverBankCode}: ${base}`);
  if (!base) {
    console.warn(`⚠️ [PROXY SINPE-IBAN] No hay proxy configurado para bank_code=${receiverBankCode}`);
    return NextResponse.json(
      { error: `No hay proxy configurado para el banco ${receiverBankCode}` },
      { status: 400 }
    );
  }

  // Cargar cuenta origen y validar saldo
  console.log(`🔍 [PROXY SINPE-IBAN] Cargando cuenta origen=${originIban}`);
  const originAccount = await prisma.accounts.findUnique({
    where: { iban: originIban },
  });
  if (!originAccount) {
    console.error(`❌ [PROXY SINPE-IBAN] Cuenta origen no encontrada: ${originIban}`);
    return NextResponse.json(
      { error: `Cuenta origen ${originIban} no encontrada.` },
      { status: 400 }
    );
  }
  console.log(`✅ [PROXY SINPE-IBAN] Cuenta origen encontrada. Balance=${originAccount.balance}`);

  if (Number(originAccount.balance) < value) {
    console.warn("⚠️ [PROXY SINPE-IBAN] Saldo insuficiente:", originAccount.balance, "<", value);
    return NextResponse.json(
      { error: "Saldo insuficiente en la cuenta de origen." },
      { status: 400 }
    );
  }

  // 1) Crear transacción PENDING
  console.log(`💾 [PROXY SINPE-IBAN] Creando transacción PENDING txID=${transaction_id}`);
  const tx = await prisma.transactions.create({
    data: {
      transaction_id,
      origin_iban: originIban,
      destination_iban: destinationIban,
      amount: new Decimal(value),
      currency,
      description,
      hmac_md5,
      status: "PENDING",
      transaction_type: "EXTERNA",
    },
  });
  console.log(`✅ [PROXY SINPE-IBAN] Transacción PENDING creada txID=${tx.transaction_id}`);

  // 2) Audit log inicial: NULL → PENDING
  console.log(`💾 [PROXY SINPE-IBAN] Creando audit_log inicial`);
  await prisma.audit_logs.create({
    data: {
      transaction_id: tx.transaction_id,
      previous_status: null,
      new_status: "PENDING",
      changed_by: originIban,
    },
  });
  console.log(`✅ [PROXY SINPE-IBAN] Audit log inicial creado`);

  // 3) Enviar al banco externo
  const externalUrl = `${base}/api/sinpe-transfer`;
  console.log(`➡️ [PROXY SINPE-IBAN] Enviando a ${externalUrl}`);
  try {
    const res = await fetch(externalUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let externalData: unknown;
    try {
      externalData = JSON.parse(text);
    } catch {
      externalData = text;
    }
    console.log(`📤 [PROXY SINPE-IBAN] Respuesta externa status=${res.status}`, externalData);

    // Determinar nuevo estado según respuesta
    const finalStatus = res.ok ? "COMPLETED" : "REJECTED";
    console.log(`🔄 [PROXY SINPE-IBAN] Nuevo estado determinado: ${finalStatus}`);

    // 4) Atomicidad: débito + estado + segundo audit log
    console.log(`🔄 [PROXY SINPE-IBAN] Aplicando débito y actualizando status`);
    await prisma.$transaction([
      prisma.accounts.update({
        where: { iban: originIban },
        data: {
          balance: new Decimal(Number(originAccount.balance) - value),
        },
      }),
      prisma.transactions.update({
        where: { transaction_id },
        data: { status: finalStatus },
      }),
      prisma.audit_logs.create({
        data: {
          transaction_id,
          previous_status: "PENDING",
          new_status: finalStatus,
          changed_by: originIban,
        },
      }),
    ]);
    console.log(`✅ [PROXY SINPE-IBAN] Transacción finalizada estado=${finalStatus}`);

    return NextResponse.json(externalData, { status: res.status });
  } catch (err: any) {
    console.error(`❌ [PROXY SINPE-IBAN] Error en proxy:`, err);

    // 5) En caso de fallo, marcar REJECTED y log
    console.log(`🔄 [PROXY SINPE-IBAN] Marcando REJECTED y creando audit_log`);
    await prisma.$transaction([
      prisma.transactions.update({
        where: { transaction_id },
        data: { status: "REJECTED" },
      }),
      prisma.audit_logs.create({
        data: {
          transaction_id,
          previous_status: "PENDING",
          new_status: "REJECTED",
          changed_by: originIban,
        },
      }),
    ]);
    console.log(`✅ [PROXY SINPE-IBAN] Audit log REJECTED creado`);

    return NextResponse.json(
      { error: err.message || "Error interno en el proxy SINPE-IBAN" },
      { status: 500 }
    );
  }
}
