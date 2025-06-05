import { BANK_ENDPOINTS } from "@/config/bankEndpoints";

export interface ExternalTransferRequest {
  version: string;
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
  description?: string;
  hmac_md5: string;
}

export interface ExternalTransferResponse {
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

export const externalTransferService = {
  async send(
    payload: ExternalTransferRequest
  ): Promise<ExternalTransferResponse | string> {
    try {
      const destBank = payload.receiver.bank_code;
      const endpoint = BANK_ENDPOINTS[destBank];
      if (!endpoint) {
        console.error(
          "[SEND_EXTERNAL_TRANSFER_ERROR]",
          `No se encontró endpoint para banco ${destBank}`
        );
        return `No se encontró endpoint para banco ${destBank}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(
          "[SEND_EXTERNAL_TRANSFER_ERROR]",
          response
        );
        let errorMsg = response.statusText;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || response.statusText;
        } catch {
          // Mantener statusText si no es JSON
        }
        return `Error al enviar transferencia a banco ${destBank}: ${errorMsg}`;
      }

      return await response.json();
    } catch (error: any) {
      console.error("[SEND_EXTERNAL_TRANSFER_ERROR]", error);
      return "Error al procesar transferencia externa";
    }
  },
};
