import { v4 as uuidv4 } from "uuid";
import { generateHmacForAccountTransfer, generateHmacForPhoneTransfer } from "@/lib/hmac";

/**
 * Payload para transferencias por IBAN (SINPE).
 */
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

/**
 * Payload para transferencias por teléfono (SINPE Móvil).
 */
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

/**
 * Envía una transferencia SINPE por IBAN usando el proxy local.
 */
export async function sendIbanTransfer(
  senderIban: string,
  senderBankCode: string,
  senderName: string,
  receiverIban: string,
  receiverBankCode: string,
  receiverName: string,
  amount: number,
  currency: string,
  description: string
): Promise<any> {
  const timestamp = new Date().toISOString();
  const transaction_id = uuidv4();
  const hmac_md5 = generateHmacForAccountTransfer(
    senderIban,
    timestamp,
    transaction_id,
    amount
  );

  const payload: IbanTransferPayload = {
    version: "1.0",
    timestamp,
    transaction_id,
    sender: {
      account_number: senderIban,
      bank_code: senderBankCode,
      name: senderName,
    },
    receiver: {
      account_number: receiverIban,
      bank_code: receiverBankCode,
      name: receiverName,
    },
    amount: {
      value: amount,
      currency: currency.toUpperCase(),
    },
    description,
    hmac_md5,
  };

  // Llamamos al proxy local en Next.js (no usamos BANK_ENDPOINTS aquí)
  const url = "/api/proxy/sinpe-transfer";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status} en proxy SINPE-IBAN: ${text}`);
  }

  return res.json();
}

/**
 * Envía una transferencia SINPE Móvil usando el proxy local.
 */
export async function sendPhoneTransfer(
  senderPhone: string,
  senderBankCode: string,
  senderName: string,
  receiverPhone: string,
  receiverBankCode: string,
  receiverName: string,
  amount: number,
  currency: string,
  description: string
): Promise<any> {
  const timestamp = new Date().toISOString();
  const transaction_id = uuidv4();
  const hmac_md5 = generateHmacForPhoneTransfer(
    senderPhone,
    timestamp,
    transaction_id,
    amount
  );

  const payload: PhoneTransferPayload = {
    version: "1.0",
    timestamp,
    transaction_id,
    sender: {
      phone_number: senderPhone,
      bank_code: senderBankCode,
      name: senderName,
    },
    receiver: {
      phone_number: receiverPhone,
      bank_code: receiverBankCode,
      name: receiverName,
    },
    amount: {
      value: amount,
      currency: currency.toUpperCase(),
    },
    description,
    hmac_md5,
  };

  // Llamamos al proxy local en Next.js (no usamos BANK_ENDPOINTS aquí)
  const url = "/api/proxy/sinpe-movil-transfer";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status} en proxy SINPE-Móvil: ${text}`);
  }

  return res.json();
}
