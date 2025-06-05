import { User } from "@/models/entities";

const URL = "/api/users";

export interface NewUser {
  identification: string;
  name: string;
  lastName: string;
  phone: string;
  accountIban: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  name?: string;
  lastName?: string;
  phone?: string;
  accountIban?: string;
  email?: string;
  password?: string;
}

export const userService = {
  async getAll(): Promise<Omit<User, "passwordHash">[] | string> {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        console.error("[GET_ALL_USERS_ERROR]", response);
        return "Error al obtener los usuarios";
      }
      return await response.json();
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
      return await response.json();
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
        phone: user.phone,
        account_iban: user.accountIban,
        email: user.email,
        password: user.password,
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("[CREATE_USER_ERROR]", response);
        return "Error al crear el usuario";
      }
      return await response.json();
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
      if (updates.phone !== undefined) {
        payload.phone = updates.phone;
      }
      if (updates.accountIban !== undefined) {
        payload.account_iban = updates.accountIban;
      }
      if (updates.email !== undefined) {
        payload.email = updates.email;
      }
      if (updates.password !== undefined) {
        payload.password = updates.password;
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
        return "Error al actualizar el usuario";
      }

      return await response.json();
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
