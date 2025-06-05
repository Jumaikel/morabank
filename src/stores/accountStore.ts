import { create } from "zustand";
import { Account } from "@/models/entities";
import {
  accountService,
  NewAccount,
  UpdateAccount,
} from "@/services/accountService";

interface AccountStore {
  accounts: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;

  fetchAccounts: () => Promise<boolean>;
  fetchAccount: (iban: string) => Promise<boolean>;
  addAccount: (newAccount: NewAccount) => Promise<boolean>;
  editAccount: (iban: string, updates: UpdateAccount) => Promise<boolean>;
  removeAccount: (iban: string) => Promise<boolean>;
}

export const useAccountStore = create<AccountStore>((set, get) => ({
  accounts: [],
  selectedAccount: null,
  loading: false,
  error: null,

  fetchAccounts: async () => {
    set({ loading: true, error: null });
    const response = await accountService.getAll();
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      set({ accounts: response, loading: false });
      return true;
    }
  },

  fetchAccount: async (iban: string) => {
    set({ loading: true, error: null });
    const response = await accountService.getByIban(iban);
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      set({ selectedAccount: response, loading: false });
      return true;
    }
  },

  addAccount: async (newAccount) => {
    set({ loading: true, error: null });
    const response = await accountService.create(newAccount);
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      const { accounts } = get();
      set({
        accounts: [...accounts, response],
        loading: false,
      });
      return true;
    }
  },

  editAccount: async (iban, updates) => {
    set({ loading: true, error: null });
    const response = await accountService.update(iban, updates);
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      const { accounts, selectedAccount } = get();
      const updatedList = accounts.map((acc) =>
        acc.iban === iban ? response : acc
      );
      set({
        accounts: updatedList,
        selectedAccount:
          selectedAccount?.iban === iban ? response : selectedAccount,
        loading: false,
      });
      return true;
    }
  },

  removeAccount: async (iban) => {
    set({ loading: true, error: null });
    const success = await accountService.remove(iban);
    if (!success) {
      set({
        error: `Error al eliminar la cuenta con IBAN ${iban}`,
        loading: false,
      });
      return false;
    } else {
      const { accounts, selectedAccount } = get();
      const filtered = accounts.filter((acc) => acc.iban !== iban);
      set({
        accounts: filtered,
        selectedAccount:
          selectedAccount?.iban === iban ? null : selectedAccount,
        loading: false,
      });
      return true;
    }
  },
}));

export default useAccountStore;
