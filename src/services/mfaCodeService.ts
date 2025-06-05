import { MfaCode } from "@/models/entities";

const URL = "/api/mfa-codes";

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

export const mfaCodeService = {
  async getAll(): Promise<MfaCode[] | string> {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        console.error("[GET_ALL_MFA_CODES_ERROR]", response);
        return "Error al obtener los códigos MFA";
      }
      return await response.json();
    } catch (error: any) {
      console.error("[GET_ALL_MFA_CODES_ERROR]", error);
      return "Error al obtener los códigos MFA";
    }
  },

  async getById(id: number): Promise<MfaCode | string> {
    try {
      const response = await fetch(`${URL}/${encodeURIComponent(id)}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.error("[GET_MFA_CODE_BY_ID_NOT_FOUND]", id);
          return `Código MFA con ID ${id} no encontrado`;
        }
        console.error("[GET_MFA_CODE_BY_ID_ERROR]", response);
        return "Error al obtener el código MFA";
      }
      return await response.json();
    } catch (error: any) {
      console.error("[GET_MFA_CODE_BY_ID_ERROR]", error);
      return "Error al obtener el código MFA";
    }
  },

  async create(data: NewMfaCode): Promise<MfaCode | string> {
    try {
      const payload = {
        user_id: data.userId,
        mfa_code: data.mfaCode,
        expires_at: data.expiresAt,
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("[CREATE_MFA_CODE_ERROR]", response);
        return "Error al crear el código MFA";
      }
      return await response.json();
    } catch (error: any) {
      console.error("[CREATE_MFA_CODE_ERROR]", error);
      return "Error al crear el código MFA";
    }
  },

  async update(
    id: number,
    updates: UpdateMfaCode
  ): Promise<MfaCode | string> {
    try {
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

      const response = await fetch(`${URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("[UPDATE_MFA_CODE_ERROR]", response);
        return "Error al actualizar el código MFA";
      }
      return await response.json();
    } catch (error: any) {
      console.error("[UPDATE_MFA_CODE_ERROR]", error);
      return "Error al actualizar el código MFA";
    }
  },

  async remove(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!response.ok && response.status !== 204) {
        console.error("[DELETE_MFA_CODE_ERROR]", response);
        return false;
      }
      return true;
    } catch (error: any) {
      console.error("[DELETE_MFA_CODE_ERROR]", error);
      return false;
    }
  },
};
