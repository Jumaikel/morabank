import { Transaction } from "@/models/entities";

const URL = "/api/transactions/sinpe";

export interface NewSinpeTransfer {
  originIban: string;
  destinationPhone: string;
  amount: number;
  currency?: string;
  reason?: string;
}

interface RawSinpeResponse {
  transactionId: string;
  createdAt: string;
  originIban: string;
  destinationIban: string;
  amount: number;
  currency: string;
  status: string;
  reason: string | null;
  updatedAt: string;
}

// Helper to map raw SINPE response to Transaction entity
function mapSinpeToEntity(raw: RawSinpeResponse): Transaction {
  return {
    transactionId: raw.transactionId,
    createdAt: raw.createdAt,
    originIban: raw.originIban,
    destinationIban: raw.destinationIban,
    amount: raw.amount,
    currency: raw.currency,
    status: raw.status as "PENDING" | "COMPLETED" | "REJECTED",
    reason: raw.reason,
    hmacMd5: "", // SINPE transfers do not return hmacMd5
    updatedAt: raw.updatedAt,
  };
}

export const sinpeService = {
  async create(transfer: NewSinpeTransfer): Promise<Transaction | string> {
    try {
      const payload = {
        origin_iban: transfer.originIban,
        destination_phone: transfer.destinationPhone,
        amount: transfer.amount,
        currency: transfer.currency,
        reason: transfer.reason,
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("[CREATE_SINPE_TRANSFER_ERROR]", response);
        const errData = await response.json().catch(() => null);
        return errData?.error || "Error al realizar transferencia SINPE";
      }

      const raw: RawSinpeResponse = await response.json();
      return mapSinpeToEntity(raw);
    } catch (error: any) {
      console.error("[CREATE_SINPE_TRANSFER_ERROR]", error);
      return "Error al realizar transferencia SINPE";
    }
  },
};
