import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

interface ExternalTransferPayload {
  version: string;
  timestamp: string;           // ISO string
  transaction_id: string;      // UUID único generado por emisor
  sender: {
    account_number: string;    // IBAN o teléfono
    bank_code: string;         // p.ej. "BBVA"
    name: string;
  };
  receiver: {
    account_number: string;    // IBAN o teléfono local
    bank_code: string;         // Debe coincidir con el código de este banco
    name: string;
  };
  amount: {
    value: number;
    currency: string;
  };
  description?: string;
  hmac_md5: string;            // Hash MD5 en hex
}

// Construye la cadena canónica para HMAC
function buildHmacString(payload: ExternalTransferPayload): string {
  const {
    transaction_id,
    sender: { account_number: sAcc, bank_code: sBank, name: sName },
    receiver: { account_number: rAcc, bank_code: rBank, name: rName },
    amount: { value, currency },
    description = "",
  } = payload;

  return [
    transaction_id,
    sAcc,
    sBank,
    sName,
    rAcc,
    rBank,
    rName,
    value.toFixed(2),
    currency,
    description,
  ].join("|");
}

export async function POST(req: NextRequest) {
  try {
    const body: ExternalTransferPayload = await req.json();
    const {
      version,
      transaction_id,
      sender,
      receiver,
      amount: amt,
      description,
      hmac_md5,
    } = body;

    // 1) Validaciones básicas
    if (
      version !== "1.0" ||
      !transaction_id ||
      !sender?.account_number ||
      !sender?.bank_code ||
      !receiver?.account_number ||
      !receiver?.bank_code ||
      typeof amt.value !== "number" ||
      !amt.currency ||
      !hmac_md5
    ) {
      return NextResponse.json(
        { error: "Payload inválido o campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    // 2) Obtener el código de nuestro banco consultando el último banco registrado
    const lastBank = await prisma.banks.findFirst({
      orderBy: { created_at: "desc" },
    });
    if (!lastBank) {
      return NextResponse.json(
        { error: "No hay ningún banco registrado en el sistema" },
        { status: 500 }
      );
    }
    const OUR_BANK_CODE = lastBank.bank_code;

    // 3) Asegurar que receiver.bank_code coincide con este banco
    if (receiver.bank_code !== OUR_BANK_CODE) {
      return NextResponse.json(
        {
          error: `Este endpoint solo acepta transacciones para banco ${OUR_BANK_CODE}`,
        },
        { status: 400 }
      );
    }

    // 4) Obtener la clave compartida HMAC entre sender.bank_code y OUR_BANK_CODE
    const hmacRecord = await prisma.hmac_keys.findUnique({
      where: {
        origin_bank_destination_bank: {
          origin_bank: sender.bank_code,
          destination_bank: OUR_BANK_CODE,
        },
      },
    });
    if (!hmacRecord) {
      return NextResponse.json(
        {
          error: `No hay clave HMAC configurada para ${sender.bank_code} → ${OUR_BANK_CODE}`,
        },
        { status: 400 }
      );
    }
    const secretKey = hmacRecord.secret_key; // tipo Buffer

    // 5) Verificar HMAC-MD5
    const canonical = buildHmacString(body);
    const computedHmac = crypto
      .createHmac("md5", secretKey)
      .update(canonical)
      .digest("hex");
    if (computedHmac !== hmac_md5) {
      return NextResponse.json(
        { error: "HMAC inválido: payload modificado o clave incorrecta" },
        { status: 400 }
      );
    }

    // 6) Resolver account_number destino: puede ser IBAN o teléfono
    let destIban: string;
    if (/^\+?\d{8,15}$/.test(receiver.account_number)) {
      // Es teléfono → buscar usuario
      const user = await prisma.users.findUnique({
        where: { phone: receiver.account_number },
      });
      if (!user) {
        return NextResponse.json(
          {
            error: `No se encontró usuario con teléfono ${receiver.account_number}`,
          },
          { status: 404 }
        );
      }
      destIban = user.account_iban;
    } else {
      // Asumir es IBAN
      destIban = receiver.account_number;
    }

    // Verificar que la cuenta destino existe y está activa
    const destAccount = await prisma.accounts.findUnique({
      where: { iban: destIban },
    });
    if (!destAccount) {
      return NextResponse.json(
        { error: `Cuenta destino no existe: ${destIban}` },
        { status: 404 }
      );
    }
    if (destAccount.state !== "ACTIVE") {
      return NextResponse.json(
        { error: "Cuenta destino no está en estado ACTIVE" },
        { status: 400 }
      );
    }

    // 7) Creditar saldo en cuenta destino y crear transacción en BD
    const newTx = await prisma.$transaction(async (tx) => {
      // Actualizar balance destino
      await tx.accounts.update({
        where: { iban: destIban },
        data: { balance: { increment: amt.value } },
      });
      // Registrar transacción local
      const created = await tx.transactions.create({
        data: {
          origin_iban: destIban,             // origin local para registro “recibido”
          destination_iban: destIban,        // idem (no hay duplicado)
          amount: amt.value,
          currency: amt.currency,
          state: "COMPLETED",
          reason: description ?? null,
          hmac_md5, // guardamos el HMAC proveniente
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
    });

    // 8) Responder con datos camelCase
    const response = {
      transactionId: newTx.transaction_id,
      createdAt: newTx.created_at.toISOString(),
      originIban: newTx.origin_iban,
      destinationIban: newTx.destination_iban,
      amount: Number(newTx.amount),
      currency: newTx.currency,
      state: newTx.state,
      reason: newTx.reason,
      updatedAt: newTx.updated_at.toISOString(),
    };
    return NextResponse.json(response, { status: 201 });
  } catch (err: any) {
    console.error("Error en POST /api/external-transfer:", err);
    return NextResponse.json(
      { error: "Error interno al procesar transferencia externa" },
      { status: 500 }
    );
  }
}
