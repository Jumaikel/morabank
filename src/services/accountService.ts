import { Account } from "@/models/entities";

const BASE_URL = "/api/accounts";

export interface NewAccount {
  iban: string;
  bankCode: string;
  accountHolder: string;
  balance?: number;
  state?: "ACTIVE" | "BLOCKED" | "CLOSED";
}

export interface UpdateAccount {
  accountHolder?: string;
  balance?: number;
  state?: "ACTIVE" | "BLOCKED" | "CLOSED";
}

export async function getAllAccounts(): Promise<Account[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`Error fetching accounts: ${res.statusText}`);
  }
  const data: Account[] = await res.json();
  return data;
}

export async function getAccountByIban(iban: string): Promise<Account> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(iban)}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Account with IBAN ${iban} not found`);
    }
    throw new Error(`Error fetching account: ${res.statusText}`);
  }
  const data: Account = await res.json();
  return data;
}

export async function createAccount(account: NewAccount): Promise<Account> {
  const payload = {
    iban: account.iban,
    bank_code: account.bankCode,
    account_holder: account.accountHolder,
    balance: account.balance,
    state: account.state,
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error creating account: ${errorData.error || res.statusText}`
    );
  }

  const data: Account = await res.json();
  return data;
}

export async function updateAccount(
  iban: string,
  updates: UpdateAccount
): Promise<Account> {
  const payload: Record<string, unknown> = {};

  if (updates.accountHolder !== undefined) {
    payload.account_holder = updates.accountHolder;
  }
  if (updates.balance !== undefined) {
    payload.balance = updates.balance;
  }
  if (updates.state !== undefined) {
    payload.state = updates.state;
  }

  const res = await fetch(`${BASE_URL}/${encodeURIComponent(iban)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error updating account: ${errorData.error || res.statusText}`
    );
  }

  const data: Account = await res.json();
  return data;
}

export async function deleteAccount(iban: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(iban)}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    const errorData = await res.json();
    throw new Error(
      `Error deleting account: ${errorData.error || res.statusText}`
    );
  }
}
