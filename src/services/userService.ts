import { User } from "@/models/entities";

const URL = "/api/users";
const SINPE_URL = process.env.NEXT_PUBLIC_SINPE_SUBSCRIPTIONS_API || "/api/sinpe-subscriptions";

export interface NewUser {
  identification: string;
  name: string;
  lastName: string;
  secondLastName?: string | null;
  phone: string;
  email: string;
  password: string;
  accountType: "CORRIENTE" | "AHORROS";
}

export interface UpdateUser {
  name?: string;
  lastName?: string;
  secondLastName?: string | null;
  phone?: string;
  email?: string;
  password?: string;
  accountType?: "CORRIENTE" | "AHORROS";
}

function mapRawToEntity(raw: any): Omit<User, "passwordHash"> {
  return {
    identification: raw.identification,
    name: raw.name,
    lastName: raw.last_name,
    secondLastName: raw.second_last_name ?? null,
    phone: raw.phone,
    accountIban: raw.account_iban,
    email: raw.email,
    userType: raw.user_type,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export const userService = {
  async getAll(): Promise<Omit<User, "passwordHash">[] | string> {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        console.error("[GET_ALL_USERS_ERROR]", response);
        return "Error al obtener los usuarios";
      }
      const rawList = await response.json();
      return rawList.map((raw: any) => mapRawToEntity(raw));
    } catch (error: any) {
      console.error("[GET_ALL_USERS_ERROR]", error);
      return "Error al obtener los usuarios";
    }
  },

  async getById(
    identification: string
  ): Promise<Omit<User, "passwordHash"> | string> {
    try {
      const response = await fetch(
        `${URL}/${encodeURIComponent(identification)}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          console.error("[GET_USER_BY_ID_NOT_FOUND]", identification);
          return `Usuario con ID ${identification} no encontrado`;
        }
        console.error("[GET_USER_BY_ID_ERROR]", response);
        return "Error al obtener el usuario";
      }
      const raw = await response.json();
      return mapRawToEntity(raw);
    } catch (error: any) {
      console.error("[GET_USER_BY_ID_ERROR]", error);
      return "Error al obtener el usuario";
    }
  },

  async create(
    user: NewUser
  ): Promise<Omit<User, "passwordHash"> | string> {
    try {
      const payload = {
        identification: user.identification,
        name: user.name,
        last_name: user.lastName,
        second_last_name: user.secondLastName ?? null,
        phone: user.phone,
        email: user.email,
        password: user.password,
        account_type: user.accountType,
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("[CREATE_USER_ERROR]", response);
        const errData = await response.json().catch(() => null);
        return errData?.error || "Error al crear el usuario";
      }

      const raw = await response.json();
      const newUser = mapRawToEntity(raw);

      try {
        await fetch(SINPE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sinpe_number: user.phone,
            sinpe_client_name: `${user.name} ${user.lastName} ${user.secondLastName}`,
            sinpe_bank_code: "111",
          }),
        });
      } catch (sinpeErr) {
        console.error("[CREATE_SINPE_SUBSCRIPTION_ERROR]", sinpeErr);
      }

      return newUser;
    } catch (error: any) {
      console.error("[CREATE_USER_ERROR]", error);
      return "Error al crear el usuario";
    }
  },

  async update(
    identification: string,
    updates: UpdateUser
  ): Promise<Omit<User, "passwordHash"> | string> {
    try {
      const payload: Record<string, unknown> = {};

      if (updates.name !== undefined) {
        payload.name = updates.name;
      }
      if (updates.lastName !== undefined) {
        payload.last_name = updates.lastName;
      }
      if (updates.secondLastName !== undefined) {
        payload.second_last_name = updates.secondLastName;
      }
      if (updates.phone !== undefined) {
        payload.phone = updates.phone;
      }
      if (updates.email !== undefined) {
        payload.email = updates.email;
      }
      if (updates.password !== undefined) {
        payload.password = updates.password;
      }
      if (updates.accountType !== undefined) {
        payload.account_type = updates.accountType;
      }

      const response = await fetch(
        `${URL}/${encodeURIComponent(identification)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.error("[UPDATE_USER_ERROR]", response);
        const errData = await response.json().catch(() => null);
        return errData?.error || "Error al actualizar el usuario";
      }

      const raw = await response.json();
      return mapRawToEntity(raw);
    } catch (error: any) {
      console.error("[UPDATE_USER_ERROR]", error);
      return "Error al actualizar el usuario";
    }
  },

  async remove(identification: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${URL}/${encodeURIComponent(identification)}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok && response.status !== 204) {
        console.error("[DELETE_USER_ERROR]", response);
        return false;
      }
      return true;
    } catch (error: any) {
      console.error("[DELETE_USER_ERROR]", error);
      return false;
    }
  },
};
