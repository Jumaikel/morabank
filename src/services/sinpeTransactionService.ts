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

export const sinpeService = {
  async send(
    payload: SinpeTransferRequest
  ): Promise<SinpeTransferResponse | string> {
    try {
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
        const data: SinpeTransferResponse = await localRes.json();
        return data;
      }

      // Extraer mensaje de error local
      let errorMsg = localRes.statusText;
      try {
        const localError = await localRes.json();
        errorMsg = localError.error || localRes.statusText;
      } catch {
        // Si la respuesta no es JSON, mantenemos statusText
      }

      // Si el error es “No se encontró usuario con teléfono”, reenviamos externamente
      if (errorMsg.includes("No se encontró usuario con teléfono")) {
        const baseExternal: Omit<ExternalTransferRequest, "receiver" | "sender"> = {
          version: "1.0",
          timestamp: new Date().toISOString(),
          transaction_id: uuidv4(),
          amount: {
            value: payload.amount,
            currency: body.currency,
          },
          description: payload.reason ?? "",
          hmac_md5: "", // Se calcula en backend remoto usando su clave HMAC
        };

        for (const [bankCode, endpoint] of Object.entries(BANK_ENDPOINTS)) {
          const externalPayload: ExternalTransferRequest = {
            ...baseExternal,
            sender: {
              account_number: payload.originIban,
              bank_code: "", // No se necesita para HMAC en receptor
              name: "",
            },
            receiver: {
              account_number: payload.destinationPhone,
              bank_code: bankCode,
              name: "",
            },
            hmac_md5: "", // Se calcula en backend remoto
          };

          try {
            const res = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(externalPayload),
            });

            if (!res.ok) {
              continue;
            }

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
            continue;
          }
        }

        return "Usuario no encontrado en banco local ni en ninguno de los bancos mapeados.";
      }

      return `Error en transferencia SINPE: ${errorMsg}`;
    } catch (err: any) {
      console.error("[SEND_SINPE_TRANSFER_ERROR]", err);
      return "Error al procesar la transferencia SINPE";
    }
  },
};
