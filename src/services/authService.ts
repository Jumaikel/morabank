const URL = "/api/auth";

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

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<LoginResponse | string> {
    try {
      const response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identification: credentials.identification,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        console.error("[LOGIN_ERROR]", response);
        const errData = await response.json().catch(() => null);
        return errData?.error || "Error al iniciar sesión";
      }

      return await response.json();
    } catch (error: any) {
      console.error("[LOGIN_ERROR]", error);
      return "Error al iniciar sesión";
    }
  },

  async verifyMfa(
    payload: VerifyMfaRequest
  ): Promise<VerifyMfaResponse | string> {
    try {
      const response = await fetch(`${URL}/verify-mfa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identification: payload.identification,
          mfa_code: payload.mfaCode,
        }),
      });

      if (!response.ok) {
        console.error("[VERIFY_MFA_ERROR]", response);
        const errData = await response.json().catch(() => null);
        return errData?.error || "Error al verificar MFA";
      }

      return await response.json();
    } catch (error: any) {
      console.error("[VERIFY_MFA_ERROR]", error);
      return "Error al verificar MFA";
    }
  },
};
