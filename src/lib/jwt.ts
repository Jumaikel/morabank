import jwt from "jsonwebtoken";

// Asegúrate de que JWT_SECRET esté definido en las variables de entorno.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en las variables de entorno.");
}

// Estructura de datos que vamos a incluir en el payload
export interface JwtPayloadData {
  identification: string;
  // puedes agregar otros campos si lo necesitas, p. ej. role, email, etc.
}

// Opciones de expiración, p. ej. 1 hora
const EXPIRES_IN = "1h";

/**
 * Genera un JWT firmando el payload con la clave secreta.
 * @param data Objeto con la información que queremos incluir en el token.
 * @returns El token JWT como string.
 */
export function signToken(data: JwtPayloadData): string {
  return jwt.sign(data, JWT_SECRET!, { expiresIn: EXPIRES_IN });
}

/**
 * Verifica un token y devuelve el payload descifrado.
 * @param token El JWT a verificar.
 * @returns El payload con los datos firmados (de tipo JwtPayloadData).
 * @throws Error si el token no es válido o ha expirado.
 */
export function verifyToken(token: string): JwtPayloadData {
  // jwt.verify devuelve `any` o `string|object`, así que hacemos un cast
  const decoded = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload;
  // Aseguramos que el payload contenga lo que esperamos
  if (
    typeof decoded === "object" &&
    typeof decoded.identification === "string"
  ) {
    return { identification: decoded.identification };
  }
  throw new Error("Token inválido o payload no contiene identification.");
}
