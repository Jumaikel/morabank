// Deshabilita la verificación de certificado autofirmado (solo para desarrollo)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { NextRequest, NextResponse } from "next/server";
import { BANK_ENDPOINTS } from "@/config/bankEndpoints";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

interface PhoneTransferPayload {
  version: "1.0";
  timestamp: string;
  transaction_id: string;
  sender: {
    phone_number: string;
    bank_code: string;
    name: string;
  };
  receiver: {
    phone_number: string;
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
  console.log(`▶️ [PROXY SINPE-MÓVIL] Inicio procesamiento: ${new Date().toISOString()}`);

  let payload: PhoneTransferPayload;
  try {
    payload = await req.json();
    console.log("✅ [PROXY SINPE-MÓVIL] Payload parseado:", payload);
  } catch (err) {
    console.error("❌ [PROXY SINPE-MÓVIL] JSON inválido en body:", err);
    return NextResponse.json(
      { error: "JSON inválido en body" },
      { status: 400 }
    );
  }

  const {
    transaction_id,
    sender: { phone_number: originPhone },
    receiver: { phone_number: destinationPhone, bank_code: receiverBankCode },
    amount: { value, currency },
    description,
    hmac_md5,
  } = payload;

  // Validar proxy configurado para banco destino
  const base = BANK_ENDPOINTS[receiverBankCode];
  console.log(`🔍 [PROXY SINPE-MÓVIL] Proxy para bank_code=${receiverBankCode}: ${base}`);
  if (!base) {
    console.warn(`⚠️ [PROXY SINPE-MÓVIL] No hay proxy configurado para bank_code=${receiverBankCode}`);
    return NextResponse.json(
      { error: `No hay proxy configurado para el banco ${receiverBankCode}` },
      { status: 400 }
    );
  }

  // 1) Buscar usuario emisor por teléfono
  console.log(`🔍 [PROXY SINPE-MÓVIL] Buscando usuario emisor phone=${originPhone}`);
  const user = await prisma.users.findUnique({ where: { phone: originPhone } });
  if (!user) {
    console.error(`❌ [PROXY SINPE-MÓVIL] Usuario no encontrado para phone=${originPhone}`);
    return NextResponse.json(
      { error: `Usuario con teléfono ${originPhone} no encontrado.` },
      { status: 400 }
    );
  }
  console.log(`✅ [PROXY SINPE-MÓVIL] Usuario encontrado: ID=${user.identification}`);

  // 2) Cargar cuenta asociada y validar saldo
  console.log(`🔍 [PROXY SINPE-MÓVIL] Cargando cuenta asociada IBAN=${user.account_iban}`);
  const originAccount = await prisma.accounts.findUnique({ where: { iban: user.account_iban } });
  if (!originAccount) {
    console.error(`❌ [PROXY SINPE-MÓVIL] Cuenta asociada no encontrada IBAN=${user.account_iban}`);
    return NextResponse.json(
      { error: `Cuenta asociada al usuario ${originPhone} no encontrada.` },
      { status: 400 }
    );
  }
  console.log(`✅ [PROXY SINPE-MÓVIL] Cuenta origen encontrada. Balance=${originAccount.balance}`);
  if (Number(originAccount.balance) < value) {
    console.warn(`⚠️ [PROXY SINPE-MÓVIL] Saldo insuficiente: ${originAccount.balance} < ${value}`);
    return NextResponse.json(
      { error: "Saldo insuficiente en la cuenta de origen." },
      { status: 400 }
    );
  }

  // 3) Crear transacción PENDING
  console.log(`💾 [PROXY SINPE-MÓVIL] Creando transacción PENDING txID=${transaction_id}`);
  const tx = await prisma.transactions.create({
    data: {
      transaction_id,
      origin_phone: originPhone,
      origin_iban: originAccount.iban,
      destination_phone: destinationPhone,
      transaction_type: "SINPEMOVIL",
      amount: new Decimal(value),
      currency,
      description,
      hmac_md5,
      status: "PENDING",
    },
  });
  console.log(`✅ [PROXY SINPE-MÓVIL] Transacción PENDING creada txID=${tx.transaction_id}`);

  // 4) Primer audit log: NULL → PENDING
  console.log(`💾 [PROXY SINPE-MÓVIL] Creando audit_log inicial`);
  await prisma.audit_logs.create({
    data: {
      transaction_id: tx.transaction_id,
      previous_status: null,
      new_status: "PENDING",
      changed_by: originPhone,
    },
  });
  console.log(`✅ [PROXY SINPE-MÓVIL] Audit log inicial creado`);

  // 5) Envío al banco externo
  const externalUrl = `${base}/api/sinpe-movil-transfer`;
  console.log(`➡️ [PROXY SINPE-MÓVIL] Enviando a ${externalUrl}`);
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
    console.log(`📤 [PROXY SINPE-MÓVIL] Respuesta externa status=${res.status}`, externalData);

    // 6) Determinar estado final
    const finalStatus = res.ok ? "COMPLETED" : "REJECTED";
    console.log(`🔄 [PROXY SINPE-MÓVIL] Nuevo estado determinado: ${finalStatus}`);

    // 7) Atomicidad: débito, status y segundo audit log
    console.log(`🔄 [PROXY SINPE-MÓVIL] Aplicando débito y actualizando status`);
    await prisma.$transaction([
      prisma.accounts.update({
        where: { iban: originAccount.iban },
        data: { balance: new Decimal(Number(originAccount.balance) - value) },
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
          changed_by: originPhone,
        },
      }),
    ]);
    console.log(`✅ [PROXY SINPE-MÓVIL] Transacción finalizada estado=${finalStatus}`);

    return NextResponse.json(externalData, { status: res.status });
  } catch (err: any) {
    console.error(`❌ [PROXY SINPE-MÓVIL] Error al hacer fetch:`, err);

    // 8) En caso de fallo, marcar REJECTED y log
    console.log(`🔄 [PROXY SINPE-MÓVIL] Marcando REJECTED y creando audit_log`);
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
          changed_by: originPhone,
        },
      }),
    ]);
    console.log(`✅ [PROXY SINPE-MÓVIL] Audit log REJECTED creado`);

    return NextResponse.json(
      { error: `fetch failed: ${err.message}` },
      { status: 500 }
    );
  }
}
