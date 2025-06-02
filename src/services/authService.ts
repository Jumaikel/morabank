const AUTH_BASE_URL = '/api/auth';

export interface LoginCredentials {
  identification: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface VerifyMfaRequest {
  identification: string;
  mfaCode: string;
}

export interface VerifyMfaResponse {
  token: string; // JWT u otro token de sesión
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identification: credentials.identification,
      password: credentials.password,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || res.statusText);
  }

  const data: LoginResponse = await res.json();
  return data;
}

export async function verifyMfa(
  payload: VerifyMfaRequest
): Promise<VerifyMfaResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/verify-mfa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identification: payload.identification,
      mfa_code: payload.mfaCode,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || res.statusText);
  }

  const data: VerifyMfaResponse = await res.json();
  return data;
}
