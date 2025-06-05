import { create } from "zustand";
import { User } from "@/models/entities";
import {
  userService,
  NewUser,
  UpdateUser,
} from "@/services/userService";

interface UserStore {
  users: Omit<User, "passwordHash">[];
  selectedUser: Omit<User, "passwordHash"> | null;
  loading: boolean;
  error: string | null;

  fetchUsers: () => Promise<boolean>;
  fetchUser: (identification: string) => Promise<boolean>;
  addUser: (newUser: NewUser) => Promise<boolean>;
  editUser: (identification: string, updates: UpdateUser) => Promise<boolean>;
  removeUser: (identification: string) => Promise<boolean>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  selectedUser: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    const response = await userService.getAll();
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      set({ users: response, loading: false });
      return true;
    }
  },

  fetchUser: async (identification) => {
    set({ loading: true, error: null });
    const response = await userService.getById(identification);
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      set({ selectedUser: response, loading: false });
      return true;
    }
  },

  addUser: async (newUser) => {
    set({ loading: true, error: null });
    const response = await userService.create(newUser);
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      const { users } = get();
      set({
        users: [...users, response],
        loading: false,
      });
      return true;
    }
  },

  editUser: async (identification, updates) => {
    set({ loading: true, error: null });
    const response = await userService.update(identification, updates);
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      const { users, selectedUser } = get();
      const updatedList = users.map((u) =>
        u.identification === identification ? response : u
      );
      set({
        users: updatedList,
        selectedUser:
          selectedUser?.identification === identification
            ? response
            : selectedUser,
        loading: false,
      });
      return true;
    }
  },

  removeUser: async (identification) => {
    set({ loading: true, error: null });
    const success = await userService.remove(identification);
    if (!success) {
      set({
        error: `Error al eliminar el usuario con ID ${identification}`,
        loading: false,
      });
      return false;
    } else {
      const { users, selectedUser } = get();
      const filtered = users.filter((u) => u.identification !== identification);
      set({
        users: filtered,
        selectedUser:
          selectedUser?.identification === identification
            ? null
            : selectedUser,
        loading: false,
      });
      return true;
    }
  },
}));

export default useUserStore;
