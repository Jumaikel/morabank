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
  token: string; // JWT or session token
  userType: string; // A for Admin, C for Client
}

export interface SendOtpRequest {
  identification: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface ChangePasswordRequest {
  identification: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
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

  async sendOtp(
    payload: SendOtpRequest
  ): Promise<SendOtpResponse | string> {
    try {
      const response = await fetch(`${URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identification: payload.identification,
        }),
      });

      if (!response.ok) {
        console.error("[SEND_OTP_ERROR]", response);
        const errData = await response.json().catch(() => null);
        return errData?.error || "Error al enviar OTP";
      }

      return await response.json();
    } catch (error: any) {
      console.error("[SEND_OTP_ERROR]", error);
      return "Error al enviar OTP";
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

  async changePassword(
    payload: ChangePasswordRequest
  ): Promise<ChangePasswordResponse | string> {
    try {
      const response = await fetch(`${URL}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identification: payload.identification,
          otp: payload.otp,
          newPassword: payload.newPassword,
        }),
      });

      if (!response.ok) {
        console.error("[CHANGE_PASSWORD_ERROR]", response);
        const errData = await response.json().catch(() => null);
        return errData?.error || "Error al cambiar la contraseña";
      }

      return await response.json();
    } catch (error: any) {
      console.error("[CHANGE_PASSWORD_ERROR]", error);
      return "Error al cambiar la contraseña";
    }
  },
};
