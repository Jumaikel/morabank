// services/bankService.ts

import { Bank } from "@/models/entities";

const BASE_URL = "/api/banks";

export interface NewBank {
  bankCode: string;
  name: string;
  address?: string | null;
}

export interface UpdateBank {
  name?: string;
  address?: string | null;
}

function mapRawToBank(raw: any): Bank {
  return {
    bankCode: raw.bank_code,
    name: raw.name,
    address: raw.address,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export async function getLastBank(): Promise<Bank> {
  const res = await fetch(`${BASE_URL}`);
  if (!res.ok) {
    throw new Error(`Error fetching last bank: ${res.statusText}`);
  }
  const raw = await res.json();
  return mapRawToBank(raw);
}

export async function getBankByCode(bankCode: string): Promise<Bank> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(bankCode)}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Bank with code ${bankCode} not found`);
    }
    throw new Error(`Error fetching bank: ${res.statusText}`);
  }
  const raw = await res.json();
  return mapRawToBank(raw);
}

export async function createBank(bank: NewBank): Promise<Bank> {
  const payload = {
    bank_code: bank.bankCode,
    name: bank.name,
    address: bank.address ?? null,
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error creating bank: ${errorData.error || res.statusText}`
    );
  }

  const raw = await res.json();
  return mapRawToBank(raw);
}

export async function updateBank(
  bankCode: string,
  updates: UpdateBank
): Promise<Bank> {
  const payload: Record<string, unknown> = {};

  if (updates.name !== undefined) {
    payload.name = updates.name;
  }
  if (updates.address !== undefined) {
    payload.address = updates.address;
  }

  const res = await fetch(`${BASE_URL}/${encodeURIComponent(bankCode)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error updating bank: ${errorData.error || res.statusText}`
    );
  }

  const raw = await res.json();
  return mapRawToBank(raw);
}

export async function deleteBank(bankCode: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(bankCode)}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    const errorData = await res.json();
    throw new Error(
      `Error deleting bank: ${errorData.error || res.statusText}`
    );
  }
}
