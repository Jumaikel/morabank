import { HmacKey } from '@/models/entities';

const BASE_URL = '/api/hmac-keys';

export interface NewHmacKey {
  originBank: string;
  destinationBank: string;
  secretKey: string; // Base64 string
}

export interface UpdateHmacKey {
  secretKey: string; // Base64 string
}

export async function getAllHmacKeys(): Promise<HmacKey[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`Error fetching HMAC keys: ${res.statusText}`);
  }
  const data: HmacKey[] = await res.json();
  return data;
}

export async function getHmacKey(
  originBank: string,
  destinationBank: string
): Promise<HmacKey> {
  const url = `${BASE_URL}/${encodeURIComponent(
    originBank
  )}/${encodeURIComponent(destinationBank)}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        `HMAC key for ${originBank} -> ${destinationBank} not found`
      );
    }
    throw new Error(`Error fetching HMAC key: ${res.statusText}`);
  }
  const data: HmacKey = await res.json();
  return data;
}

export async function createHmacKey(key: NewHmacKey): Promise<HmacKey> {
  const payload = {
    origin_bank: key.originBank,
    destination_bank: key.destinationBank,
    secret_key: key.secretKey,
  };

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error creating HMAC key: ${errorData.error || res.statusText}`
    );
  }

  const data: HmacKey = await res.json();
  return data;
}

export async function updateHmacKey(
  originBank: string,
  destinationBank: string,
  update: UpdateHmacKey
): Promise<HmacKey> {
  const payload = {
    secret_key: update.secretKey,
  };
  const url = `${BASE_URL}/${encodeURIComponent(
    originBank
  )}/${encodeURIComponent(destinationBank)}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error updating HMAC key: ${errorData.error || res.statusText}`
    );
  }

  const data: HmacKey = await res.json();
  return data;
}

export async function deleteHmacKey(
  originBank: string,
  destinationBank: string
): Promise<void> {
  const url = `${BASE_URL}/${encodeURIComponent(
    originBank
  )}/${encodeURIComponent(destinationBank)}`;
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    const errorData = await res.json();
    throw new Error(
      `Error deleting HMAC key: ${errorData.error || res.statusText}`
    );
  }
}
