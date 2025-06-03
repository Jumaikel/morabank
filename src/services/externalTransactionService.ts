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

export async function sendExternalTransfer(
  payload: ExternalTransferRequest
): Promise<ExternalTransferResponse> {
  const destBank = payload.receiver.bank_code;
  const endpoint = BANK_ENDPOINTS[destBank];
  if (!endpoint) {
    throw new Error(`No se encontró endpoint para banco ${destBank}`);
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error al enviar transferencia a banco ${destBank}: ${
        errorData.error || res.statusText
      }`
    );
  }

  const data: ExternalTransferResponse = await res.json();
  return data;
}
