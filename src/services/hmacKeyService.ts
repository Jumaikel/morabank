import { HmacKey } from "@/models/entities";

const URL = "/api/hmac-keys";

export interface NewHmacKey {
  originBank: string;
  destinationBank: string;
  secretKey: string; // Base64 string
}

export interface UpdateHmacKey {
  secretKey: string; // Base64 string
}

export const hmacKeyService = {
  async getAll(): Promise<HmacKey[] | string> {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        console.error("[GET_ALL_HMAC_KEYS_ERROR]", response);
        return "Error al obtener las claves HMAC";
      }
      return await response.json();
    } catch (error: any) {
      console.error("[GET_ALL_HMAC_KEYS_ERROR]", error);
      return "Error al obtener las claves HMAC";
    }
  },

  async get(
    originBank: string,
    destinationBank: string
  ): Promise<HmacKey | string> {
    try {
      const url = `${URL}/${encodeURIComponent(
        originBank
      )}/${encodeURIComponent(destinationBank)}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          console.error(
            "[GET_HMAC_KEY_NOT_FOUND]",
            originBank,
            destinationBank
          );
          return `Clave HMAC para ${originBank} → ${destinationBank} no encontrada`;
        }
        console.error("[GET_HMAC_KEY_ERROR]", response);
        return "Error al obtener la clave HMAC";
      }

      return await response.json();
    } catch (error: any) {
      console.error("[GET_HMAC_KEY_ERROR]", error);
      return "Error al obtener la clave HMAC";
    }
  },

  async create(data: NewHmacKey): Promise<HmacKey | string> {
    try {
      const payload = {
        origin_bank: data.originBank,
        destination_bank: data.destinationBank,
        secret_key: data.secretKey,
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("[CREATE_HMAC_KEY_ERROR]", response);
        return "Error al crear la clave HMAC";
      }

      return await response.json();
    } catch (error: any) {
      console.error("[CREATE_HMAC_KEY_ERROR]", error);
      return "Error al crear la clave HMAC";
    }
  },

  async update(
    originBank: string,
    destinationBank: string,
    update: UpdateHmacKey
  ): Promise<HmacKey | string> {
    try {
      const payload = { secret_key: update.secretKey };
      const url = `${URL}/${encodeURIComponent(
        originBank
      )}/${encodeURIComponent(destinationBank)}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("[UPDATE_HMAC_KEY_ERROR]", response);
        return "Error al actualizar la clave HMAC";
      }

      return await response.json();
    } catch (error: any) {
      console.error("[UPDATE_HMAC_KEY_ERROR]", error);
      return "Error al actualizar la clave HMAC";
    }
  },

  async remove(
    originBank: string,
    destinationBank: string
  ): Promise<boolean> {
    try {
      const url = `${URL}/${encodeURIComponent(
        originBank
      )}/${encodeURIComponent(destinationBank)}`;
      const response = await fetch(url, { method: "DELETE" });

      if (!response.ok && response.status !== 204) {
        console.error("[DELETE_HMAC_KEY_ERROR]", response);
        return false;
      }
      return true;
    } catch (error: any) {
      console.error("[DELETE_HMAC_KEY_ERROR]", error);
      return false;
    }
  },
};
