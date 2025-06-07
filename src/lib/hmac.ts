import crypto from "crypto";

/**
 * Genera un HMAC MD5 para transferencias normales (por número de cuenta).
 * @param accountNumber Número de cuenta del remitente
 * @param timestamp Timestamp ISO 8601
 * @param transactionId UUID de la transacción
 * @param amount Monto numérico de la transferencia
 * @returns HMAC en formato hexadecimal
 */
export function generateHmacForAccountTransfer(
  accountNumber: string,
  timestamp: string,
  transactionId: string,
  amount: number
): string {
  const secret = "supersecreta123";
  const message = `${accountNumber}${timestamp}${transactionId}${amount.toFixed(2)}`;
  return crypto
    .createHmac("md5", secret)
    .update(message)
    .digest("hex");
}

/**
 * Genera un HMAC MD5 para SINPE Móvil (por número de teléfono).
 * @param phoneNumber Número de teléfono del destinatario
 * @param timestamp Timestamp ISO 8601
 * @param transactionId UUID de la transacción
 * @param amount Monto numérico de la transferencia
 * @returns HMAC en formato hexadecimal
 */
export function generateHmacForPhoneTransfer(
  phoneNumber: string,
  timestamp: string,
  transactionId: string,
  amount: number
): string {
  const secret = "supersecreta123";
  const message = `${phoneNumber}${timestamp}${transactionId}${amount.toFixed(2)}`;
  return crypto
    .createHmac("md5", secret)
    .update(message)
    .digest("hex");
}
