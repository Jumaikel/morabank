import { create } from 'zustand';
import { User } from '@/models/entities';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  NewUser,
  UpdateUser,
} from '@/services/userService';

interface UserStore {
  users: Omit<User, 'passwordHash'>[];
  selectedUser: Omit<User, 'passwordHash'> | null;
  loading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  fetchUser: (identification: string) => Promise<void>;
  addUser: (newUser: NewUser) => Promise<void>;
  editUser: (identification: string, updates: UpdateUser) => Promise<void>;
  removeUser: (identification: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  selectedUser: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllUsers();
      set({ users: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error fetching users', loading: false });
    }
  },

  fetchUser: async (identification) => {
    set({ loading: true, error: null });
    try {
      const user = await getUserById(identification);
      set({ selectedUser: user, loading: false });
    } catch (err: any) {
      set({
        error: err.message || `Error fetching user ${identification}`,
        loading: false,
      });
    }
  },

  addUser: async (newUser) => {
    set({ loading: true, error: null });
    try {
      const created = await createUser(newUser);
      const { users } = get();
      set({ users: [...users, created], loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error creating user', loading: false });
    }
  },

  editUser: async (identification, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateUser(identification, updates);
      const { users, selectedUser } = get();
      const updatedList = users.map((u) =>
        u.identification === identification ? updated : u
      );
      set({
        users: updatedList,
        selectedUser:
          selectedUser?.identification === identification ? updated : selectedUser,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || `Error updating user ${identification}`,
        loading: false,
      });
    }
  },

  removeUser: async (identification) => {
    set({ loading: true, error: null });
    try {
      await deleteUser(identification);
      const { users, selectedUser } = get();
      const filtered = users.filter((u) => u.identification !== identification);
      set({
        users: filtered,
        selectedUser:
          selectedUser?.identification === identification ? null : selectedUser,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || `Error deleting user ${identification}`,
        loading: false,
      });
    }
  },
}));

export default useUserStore;