import { v4 as uuidv4 } from "uuid";
import { generateHmacForAccountTransfer, generateHmacForPhoneTransfer } from "@/lib/hmac";
import { BANK_ENDPOINTS } from "@/config/bankEndpoints";

/**
 * Payload para transferencias por IBAN (SINPE).
 */
interface IbanTransferPayload {
  version: "1.0";
  timestamp: string;            // ISO string
  transaction_id: string;       // UUID v4
  sender: {
    account_number: string;     // IBAN completo de quien envía
    bank_code: string;          // 4 dígitos del banco emisor
    name: string;               // Nombre del titular emisor
  };
  receiver: {
    account_number: string;     // IBAN completo del receptor
    bank_code: string;          // 4 dígitos del banco receptor
    name: string;               // Nombre del titular receptor
  };
  amount: {
    value: number;              // Monto numérico
    currency: string;           // "CRC", "USD", etc.
  };
  description: string;
  hmac_md5: string;             // HMAC-MD5 del mensaje
}

/**
 * Payload para transferencias por teléfono (SINPE Móvil).
 */
interface PhoneTransferPayload {
  version: "1.0";
  timestamp: string;            // ISO string
  transaction_id: string;       // UUID v4
  sender: {
    phone_number: string;       // Teléfono del emisor (ej. "22223333")
    bank_code: string;          // 4 dígitos del banco emisor
    name: string;               // Nombre del titular emisor
  };
  receiver: {
    phone_number: string;       // Teléfono del receptor (ej. "11112222")
    bank_code: string;          // 4 dígitos del banco receptor
    name: string;               // Nombre del titular receptor
  };
  amount: {
    value: number;              // Monto numérico
    currency: string;           // "CRC", "USD", etc.
  };
  description: string;
  hmac_md5: string;             // HMAC-MD5 del mensaje
}

/**
 * Envía una transferencia SINPE por IBAN a un banco externo.
 *
 * @param senderIban     IBAN del emisor (ej. "CR2101110001571903865386")
 * @param senderBankCode 4 dígitos del banco emisor (ej. "0111")
 * @param senderName     Nombre completo del emisor
 * @param receiverIban   IBAN del receptor (ej. "CR2102450001123456789123")
 * @param receiverBankCode 4 dígitos del banco receptor (ej. "0245")
 * @param receiverName   Nombre completo del receptor
 * @param amount         Monto de la transferencia
 * @param currency       Código de moneda (por ejemplo, "CRC")
 * @param description    Descripción del movimiento
 *
 * @returns La respuesta del banco externo ya parseada como JSON
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
  // Generar timestamp y transaction_id
  const timestamp = new Date().toISOString();
  const transaction_id = uuidv4();

  // Generar el HMAC-MD5 para IBAN
  const hmac_md5 = generateHmacForAccountTransfer(
    senderIban,
    timestamp,
    transaction_id,
    amount
  );

  // Construir payload
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

  // Buscar endpoint del banco receptor
  const endpointBase = BANK_ENDPOINTS[receiverBankCode];
  if (!endpointBase) {
    throw new Error(`No se encontró endpoint para el banco ${receiverBankCode}`);
  }

  // Suponemos que el path para recibir SINPE por IBAN es "/api/sinpe-transfer"
  const url = `${endpointBase}/api/sinpe-transfer`;

  // Enviar request
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status} al transferir por IBAN: ${text}`);
  }

  return res.json();
}

/**
 * Envía una transferencia SINPE Móvil por número de teléfono a un banco externo.
 *
 * @param senderPhone      Teléfono del emisor (ej. "22223333")
 * @param senderBankCode   4 dígitos del banco emisor (ej. "0111")
 * @param senderName       Nombre completo del emisor
 * @param receiverPhone    Teléfono del receptor (ej. "11112222")
 * @param receiverBankCode 4 dígitos del banco receptor (ej. "0241")
 * @param receiverName     Nombre completo del receptor
 * @param amount           Monto de la transferencia
 * @param currency         Código de moneda (por ejemplo, "CRC")
 * @param description      Descripción del movimiento
 *
 * @returns La respuesta del banco externo ya parseada como JSON
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
  // Generar timestamp y transaction_id
  const timestamp = new Date().toISOString();
  const transaction_id = uuidv4();

  // Generar HMAC-MD5 para teléfono
  const hmac_md5 = generateHmacForPhoneTransfer(
    senderPhone,
    timestamp,
    transaction_id,
    amount
  );

  // Construir payload
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

  // Buscar endpoint del banco receptor
  const endpointBase = BANK_ENDPOINTS[receiverBankCode];
  if (!endpointBase) {
    throw new Error(`No se encontró endpoint para el banco ${receiverBankCode}`);
  }

  // Suponemos que el path para recibir SINPE Móvil es "/api/sinpe-movil-transfer"
  const url = `${endpointBase}/api/sinpe-movil-transfer`;

  // Enviar request
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status} al transferir por teléfono: ${text}`);
  }

  return res.json();
}
