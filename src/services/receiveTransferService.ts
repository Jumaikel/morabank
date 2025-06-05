import { Transaction } from "@/models/entities";

const URL = "/api/receive-transfer";

export interface ReceiveTransferSender {
  accountNumber: string; // IBAN o número de celular
  bankCode: string;
  name: string;
}

export interface ReceiveTransferReceiver {
  accountNumber: string; // IBAN o número de celular
  bankCode: string;
  name: string;
}

export interface ReceiveTransferAmount {
  value: number;
  currency: string;
}

export interface ReceiveTransferRequest {
  version: string;
  timestamp: string; // ISO string
  transactionId: string; // UUID generado por el emisor
  sender: ReceiveTransferSender;
  receiver: ReceiveTransferReceiver;
  amount: ReceiveTransferAmount;
  description?: string;
  hmacMd5: string; // hash en hex de 32 caracteres
}

export interface ReceiveTransferResponse extends Transaction {}

export const receiveTransferService = {
  async receive(
    payload: ReceiveTransferRequest
  ): Promise<ReceiveTransferResponse | string> {
    try {
      const body = {
        version: payload.version,
        timestamp: payload.timestamp,
        transaction_id: payload.transactionId,
        sender: {
          account_number: payload.sender.accountNumber,
          bank_code: payload.sender.bankCode,
          name: payload.sender.name,
        },
        receiver: {
          account_number: payload.receiver.accountNumber,
          bank_code: payload.receiver.bankCode,
          name: payload.receiver.name,
        },
        amount: {
          value: payload.amount.value,
          currency: payload.amount.currency,
        },
        description: payload.description ?? null,
        hmac_md5: payload.hmacMd5,
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error("[RECEIVE_TRANSFER_ERROR]", response);
        let errMsg = response.statusText;
        try {
          const errorData = await response.json();
          errMsg = errorData.error || response.statusText;
        } catch {
          // Si no es JSON, mantener statusText
        }
        return `Error al procesar transferencia externa: ${errMsg}`;
      }

      return await response.json();
    } catch (error: any) {
      console.error("[RECEIVE_TRANSFER_ERROR]", error);
      return "Error al procesar transferencia externa";
    }
  },
};
