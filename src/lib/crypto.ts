import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = process.env.ENCRYPTION_KEY!;
if (!KEY) {
  throw new Error("La variable de entorno ENCRYPTION_KEY no está definida");
}

function getKey(): Buffer {
  return crypto.createHash("sha256").update(KEY).digest();
}

export function encryptText(plainText: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  return iv.toString("base64") + ":" + encrypted;
}

export function decryptText(encryptedText: string): string {
  const [ivB64, encryptedB64] = encryptedText.split(":");
  if (!ivB64 || !encryptedB64) {
    throw new Error("Formato de texto encriptado inválido");
  }
  const iv = Buffer.from(ivB64, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  let decrypted = decipher.update(encryptedB64, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
