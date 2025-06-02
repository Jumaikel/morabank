import { Transaction } from '@/models/entities';

const BASE_URL = '/api/receive-transfer';

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
  timestamp: string;         // ISO string
  transactionId: string;     // UUID generado por el emisor
  sender: ReceiveTransferSender;
  receiver: ReceiveTransferReceiver;
  amount: ReceiveTransferAmount;
  description?: string;
  hmacMd5: string;           // hash en hex de 32 caracteres
}

export interface ReceiveTransferResponse extends Transaction {}

export async function receiveTransfer(
  payload: ReceiveTransferRequest
): Promise<ReceiveTransferResponse> {
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

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error al procesar transferencia externa: ${errorData.error || res.statusText}`
    );
  }

  const data: ReceiveTransferResponse = await res.json();
  return data;
}
