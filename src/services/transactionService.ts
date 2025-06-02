import { Transaction } from '@/models/entities';

const BASE_URL = '/api/transactions';

export interface NewTransaction {
  originIban: string;
  destinationIban: string;
  amount: number;
  currency?: string;
  reason?: string;
  hmacMd5: string;
}

export interface UpdateTransaction {
  state?: 'PENDING' | 'COMPLETED' | 'REJECTED';
  reason?: string | null;
  currency?: string;
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`Error fetching transactions: ${res.statusText}`);
  }
  const data: Transaction[] = await res.json();
  return data;
}

export async function getTransactionById(
  transactionId: string
): Promise<Transaction> {
  const res = await fetch(
    `${BASE_URL}/${encodeURIComponent(transactionId)}`
  );
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Transaction ${transactionId} not found`);
    }
    throw new Error(`Error fetching transaction: ${res.statusText}`);
  }
  const data: Transaction = await res.json();
  return data;
}

export async function createTransaction(
  tx: NewTransaction
): Promise<Transaction> {
  const payload = {
    origin_iban: tx.originIban,
    destination_iban: tx.destinationIban,
    amount: tx.amount,
    currency: tx.currency,
    reason: tx.reason,
    hmac_md5: tx.hmacMd5,
  };

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error creating transaction: ${errorData.error || res.statusText}`
    );
  }

  const data: Transaction = await res.json();
  return data;
}

export async function updateTransaction(
  transactionId: string,
  updates: UpdateTransaction
): Promise<Transaction> {
  const payload: Record<string, unknown> = {};

  if (updates.state !== undefined) {
    payload.state = updates.state;
  }
  if (updates.reason !== undefined) {
    payload.reason = updates.reason;
  }
  if (updates.currency !== undefined) {
    payload.currency = updates.currency;
  }

  const res = await fetch(
    `${BASE_URL}/${encodeURIComponent(transactionId)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error updating transaction: ${
        errorData.error || res.statusText
      }`
    );
  }

  const data: Transaction = await res.json();
  return data;
}

export async function deleteTransaction(
  transactionId: string
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/${encodeURIComponent(transactionId)}`,
    {
      method: 'DELETE',
    }
  );
  if (!res.ok && res.status !== 204) {
    const errorData = await res.json();
    throw new Error(
      `Error deleting transaction: ${errorData.error || res.statusText}`
    );
  }
}
