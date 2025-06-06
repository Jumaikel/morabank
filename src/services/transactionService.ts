import { Transaction } from "@/models/entities";

const URL = "/api/transactions";

export interface NewTransaction {
  originIban: string;
  destinationIban: string;
  amount: number;
  currency?: string;
  reason?: string;
}

export interface UpdateTransaction {
  status?: "PENDING" | "COMPLETED" | "REJECTED";
  reason?: string | null;
  currency?: string;
}

// Helper to map raw API response to Transaction entity with camelCase keys
function mapRawToEntity(raw: any): Transaction {
  return {
    transactionId: raw.transaction_id,
    createdAt: raw.created_at,
    originIban: raw.origin_iban,
    destinationIban: raw.destination_iban,
    amount: Number(raw.amount),
    currency: raw.currency,
    status: raw.status,
    reason: raw.reason,
    hmacMd5: raw.hmac_md5,
    updatedAt: raw.updated_at,
  };
}

export const transactionService = {
  async getAll(): Promise<Transaction[] | string> {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        console.error("[GET_ALL_TRANSACTIONS_ERROR]", response);
        return "Error al obtener las transacciones";
      }
      const rawList = await response.json();
      return (rawList as any[]).map((raw) => mapRawToEntity(raw));
    } catch (error: any) {
      console.error("[GET_ALL_TRANSACTIONS_ERROR]", error);
      return "Error al obtener las transacciones";
    }
  },

  async getById(transactionId: string): Promise<Transaction | string> {
    try {
      const response = await fetch(
        `${URL}/${encodeURIComponent(transactionId)}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          console.error("[GET_TRANSACTION_BY_ID_NOT_FOUND]", transactionId);
          return `Transacción ${transactionId} no encontrada`;
        }
        console.error("[GET_TRANSACTION_BY_ID_ERROR]", response);
        return "Error al obtener la transacción";
      }
      const raw = await response.json();
      return mapRawToEntity(raw);
    } catch (error: any) {
      console.error("[GET_TRANSACTION_BY_ID_ERROR]", error);
      return "Error al obtener la transacción";
    }
  },

  async create(tx: NewTransaction): Promise<Transaction | string> {
    try {
      const payload = {
        origin_iban: tx.originIban,
        destination_iban: tx.destinationIban,
        amount: tx.amount,
        currency: tx.currency,
        reason: tx.reason,
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("[CREATE_TRANSACTION_ERROR]", response);
        return "Error al crear la transacción";
      }
      const raw = await response.json();
      return mapRawToEntity(raw);
    } catch (error: any) {
      console.error("[CREATE_TRANSACTION_ERROR]", error);
      return "Error al crear la transacción";
    }
  },

  async update(
    transactionId: string,
    updates: UpdateTransaction
  ): Promise<Transaction | string> {
    try {
      const payload: Record<string, unknown> = {};

      if (updates.status !== undefined) {
        payload.status = updates.status;
      }
      if (updates.reason !== undefined) {
        payload.reason = updates.reason;
      }
      if (updates.currency !== undefined) {
        payload.currency = updates.currency;
      }

      const response = await fetch(
        `${URL}/${encodeURIComponent(transactionId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.error("[UPDATE_TRANSACTION_ERROR]", response);
        return "Error al actualizar la transacción";
      }
      const raw = await response.json();
      return mapRawToEntity(raw);
    } catch (error: any) {
      console.error("[UPDATE_TRANSACTION_ERROR]", error);
      return "Error al actualizar la transacción";
    }
  },

  async remove(transactionId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${URL}/${encodeURIComponent(transactionId)}`,
        { method: "DELETE" }
      );
      if (!response.ok && response.status !== 204) {
        console.error("[DELETE_TRANSACTION_ERROR]", response);
        return false;
      }
      return true;
    } catch (error: any) {
      console.error("[DELETE_TRANSACTION_ERROR]", error);
      return false;
    }
  },
};
