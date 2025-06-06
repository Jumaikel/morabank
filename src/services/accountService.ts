import { Account } from "@/models/entities";
import { Transaction } from "@/models/entities"; // <-- Importa el tipo Transaction

const URL = "/api/accounts";

export interface NewAccount {
  iban: string;
  accountNumber: string;
  accountType: "CORRIENTE" | "AHORROS";
  accountHolder: string;
  balance?: number;
  status?: "ACTIVE" | "BLOCKED" | "CLOSED";
}

export interface UpdateAccount {
  accountHolder?: string;
  balance?: number;
  status?: "ACTIVE" | "BLOCKED" | "CLOSED";
  accountType?: "CORRIENTE" | "AHORROS";
}

export const accountService = {
  async getAll(): Promise<Account[] | string> {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        console.error("[GET_ALL_ACCOUNTS_ERROR]", response);
        return "Error al obtener las cuentas";
      }
      return await response.json();
    } catch (error: any) {
      console.error("[GET_ALL_ACCOUNTS_ERROR]", error);
      return "Error al obtener las cuentas";
    }
  },

  async getByIban(iban: string): Promise<Account | string> {
    try {
      const response = await fetch(`${URL}/${encodeURIComponent(iban)}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.error("[GET_ACCOUNT_BY_IBAN_NOT_FOUND]", iban);
          return `Cuenta con IBAN ${iban} no encontrada`;
        }
        console.error("[GET_ACCOUNT_BY_IBAN_ERROR]", response);
        return "Error al obtener la cuenta";
      }
      return await response.json();
    } catch (error: any) {
      console.error("[GET_ACCOUNT_BY_IBAN_ERROR]", error);
      return "Error al obtener la cuenta";
    }
  },

  async getByUser(identification: string): Promise<Account[] | string> {
    try {
      const response = await fetch(
        `/api/accounts/by-user/${encodeURIComponent(identification)}`
      );
      if (!response.ok) {
        console.error("[GET_ACCOUNT_BY_USER_ERROR]", response);
        return "Error al obtener las cuentas del usuario";
      }
      return await response.json();
    } catch (error: any) {
      console.error("[GET_ACCOUNT_BY_USER_ERROR]", error);
      return "Error al obtener las cuentas del usuario";
    }
  },

  /** NUEVO: Obtener transacciones de la cuenta */
  async getTransactions(iban: string): Promise<Transaction[] | string> {
    try {
      const response = await fetch(
        `${URL}/${encodeURIComponent(iban)}/transactions`
      );
      if (!response.ok) {
        console.error("[GET_ACCOUNT_TRANSACTIONS_ERROR]", response);
        return "Error al obtener las transacciones de la cuenta";
      }
      return await response.json();
    } catch (error: any) {
      console.error("[GET_ACCOUNT_TRANSACTIONS_ERROR]", error);
      return "Error al obtener las transacciones de la cuenta";
    }
  },

  async create(data: NewAccount): Promise<Account | string> {
    try {
      const payload = {
        iban: data.iban,
        account_number: data.accountNumber,
        account_type: data.accountType,
        account_holder: data.accountHolder,
        balance: data.balance,
        status: data.status,
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("[CREATE_ACCOUNT_ERROR]", response);
        return "Error al crear la cuenta";
      }
      return await response.json();
    } catch (error: any) {
      console.error("[CREATE_ACCOUNT_ERROR]", error);
      return "Error al crear la cuenta";
    }
  },

  async update(
    iban: string,
    updates: UpdateAccount
  ): Promise<Account | string> {
    try {
      const payload: Record<string, unknown> = {};

      if (updates.accountHolder !== undefined) {
        payload.account_holder = updates.accountHolder;
      }
      if (updates.balance !== undefined) {
        payload.balance = updates.balance;
      }
      if (updates.status !== undefined) {
        payload.status = updates.status;
      }
      if (updates.accountType !== undefined) {
        payload.account_type = updates.accountType;
      }

      const response = await fetch(`${URL}/${encodeURIComponent(iban)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("[UPDATE_ACCOUNT_ERROR]", response);
        return "Error al actualizar la cuenta";
      }
      return await response.json();
    } catch (error: any) {
      console.error("[UPDATE_ACCOUNT_ERROR]", error);
      return "Error al actualizar la cuenta";
    }
  },

  async remove(iban: string): Promise<boolean> {
    try {
      const response = await fetch(`${URL}/${encodeURIComponent(iban)}`, {
        method: "DELETE",
      });
      if (!response.ok && response.status !== 204) {
        console.error("[DELETE_ACCOUNT_ERROR]", response);
        return false;
      }
      return true;
    } catch (error: any) {
      console.error("[DELETE_ACCOUNT_ERROR]", error);
      return false;
    }
  },
};
