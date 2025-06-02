import { MfaCode } from '@/models/entities';

const BASE_URL = '/api/mfa-codes';

export interface NewMfaCode {
  userId: string;
  mfaCode: string;
  expiresAt: string; // ISO string
}

export interface UpdateMfaCode {
  mfaCode?: string;
  expiresAt?: string; // ISO string
  used?: boolean;
}

export async function getAllMfaCodes(): Promise<MfaCode[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`Error fetching MFA codes: ${res.statusText}`);
  }
  const data: MfaCode[] = await res.json();
  return data;
}

export async function getMfaCodeById(id: number): Promise<MfaCode> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`MFA code with ID ${id} not found`);
    }
    throw new Error(`Error fetching MFA code: ${res.statusText}`);
  }
  const data: MfaCode = await res.json();
  return data;
}

export async function createMfaCode(code: NewMfaCode): Promise<MfaCode> {
  const payload = {
    user_id: code.userId,
    mfa_code: code.mfaCode,
    expires_at: code.expiresAt,
  };

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Error creating MFA code: ${errorData.error || res.statusText}`);
  }

  const data: MfaCode = await res.json();
  return data;
}

export async function updateMfaCode(id: number, updates: UpdateMfaCode): Promise<MfaCode> {
  const payload: Record<string, unknown> = {};

  if (updates.mfaCode !== undefined) {
    payload.mfa_code = updates.mfaCode;
  }
  if (updates.expiresAt !== undefined) {
    payload.expires_at = updates.expiresAt;
  }
  if (updates.used !== undefined) {
    payload.used = updates.used;
  }

  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Error updating MFA code: ${errorData.error || res.statusText}`);
  }

  const data: MfaCode = await res.json();
  return data;
}

export async function deleteMfaCode(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok && res.status !== 204) {
    const errorData = await res.json();
    throw new Error(`Error deleting MFA code: ${errorData.error || res.statusText}`);
  }
}
