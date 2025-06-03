import { v4 as uuidv4 } from "uuid";
import {
  ExternalTransferRequest,
  ExternalTransferResponse,
} from "@/services/externalTransactionService";
import { BANK_ENDPOINTS } from "@/config/bankEndpoints";

export interface SinpeTransferRequest {
  originIban: string;
  destinationPhone: string;
  amount: number;
  currency?: string;
  reason?: string;
}

export interface SinpeTransferResponse {
  transactionId: string;
  createdAt: string;
  originIban: string;
  destinationIban: string;
  amount: number;
  currency: string;
  state: string;
  reason?: string | null;
  updatedAt: string;
}

export async function sendSinpeTransfer(
  payload: SinpeTransferRequest
): Promise<SinpeTransferResponse> {
  const body = {
    origin_iban: payload.originIban,
    destination_phone: payload.destinationPhone,
    amount: payload.amount,
    currency: payload.currency ?? "CRC",
    reason: payload.reason ?? null,
  };

  // Intento de SINPE local
  const localRes = await fetch("/api/transactions/sinpe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (localRes.ok) {
    // Si pasó local, retornamos la respuesta
    const data: SinpeTransferResponse = await localRes.json();
    return data;
  }

  // Extraer mensaje de error local
  const localError = await localRes.json();
  const errorMsg: string = localError.error || localRes.statusText;

  // Si el error es “No se encontró usuario con teléfono”, se reenvía externamente
  if (errorMsg.includes("No se encontró usuario con teléfono")) {
    // Construcción del payload base para cada banco externo
    const baseExternal: Omit<ExternalTransferRequest, "receiver" | "sender"> = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      transaction_id: uuidv4(),
      amount: {
        value: payload.amount,
        currency: body.currency,
      },
      description: payload.reason ?? "",
      hmac_md5: "", // Será calculado por el otro banco
    };

    // Recorremos cada banco mapeado
    for (const [bankCode, endpoint] of Object.entries(BANK_ENDPOINTS)) {
      // Armar payload completo
      const externalPayload: ExternalTransferRequest = {
        ...baseExternal,
        sender: {
          account_number: payload.originIban,
          bank_code: "", // Se omite; el endpoint receptor no lo necesita para verificar HMAC
          name: "",
        },
        receiver: {
          account_number: payload.destinationPhone,
          bank_code: bankCode,
          name: "",
        },
        hmac_md5: "", // Se calcula en backend remoto usando su clave HMAC
      };

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(externalPayload),
        });
        if (!res.ok) {
          // Si falla en este banco, continuamos con el siguiente
          continue;
        }
        // Si tiene éxito, devolvemos la respuesta transformada
        const extData: ExternalTransferResponse = await res.json();
        return {
          transactionId: extData.transactionId,
          createdAt: extData.createdAt,
          originIban: extData.originIban,
          destinationIban: extData.destinationIban,
          amount: extData.amount,
          currency: extData.currency,
          state: extData.state,
          reason: extData.reason,
          updatedAt: extData.updatedAt,
        };
      } catch {
        // Ignorar errores de red y pasar al siguiente banco
        continue;
      }
    }

    throw new Error(
      "Usuario no encontrado en banco local ni en ninguno de los bancos mapeados."
    );
  }

  // Si el error local no es por usuario no encontrado, se propaga
  throw new Error(`Error en transferencia SINPE: ${errorMsg}`);
}
