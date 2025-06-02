import { create } from 'zustand';
import { Account } from '@/models/entities';
import {
  getAllAccounts,
  getAccountByIban,
  createAccount,
  updateAccount,
  deleteAccount,
  NewAccount,
  UpdateAccount,
} from '@/services/accountService';

interface AccountStore {
  accounts: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;

  fetchAccounts: () => Promise<void>;
  fetchAccount: (iban: string) => Promise<void>;
  addAccount: (newAccount: NewAccount) => Promise<void>;
  editAccount: (iban: string, updates: UpdateAccount) => Promise<void>;
  removeAccount: (iban: string) => Promise<void>;
}

export const useAccountStore = create<AccountStore>((set, get) => ({
  accounts: [],
  selectedAccount: null,
  loading: false,
  error: null,

  fetchAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllAccounts();
      set({ accounts: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error fetching accounts', loading: false });
    }
  },

  fetchAccount: async (iban: string) => {
    set({ loading: true, error: null });
    try {
      const account = await getAccountByIban(iban);
      set({ selectedAccount: account, loading: false });
    } catch (err: any) {
      set({ error: err.message || `Error fetching account ${iban}`, loading: false });
    }
  },

  addAccount: async (newAccount) => {
    set({ loading: true, error: null });
    try {
      const created = await createAccount(newAccount);
      const { accounts } = get();
      set({
        accounts: [...accounts, created],
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Error creating account', loading: false });
    }
  },

  editAccount: async (iban, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateAccount(iban, updates);
      const { accounts, selectedAccount } = get();
      const updatedList = accounts.map((acc) =>
        acc.iban === iban ? updated : acc
      );
      set({
        accounts: updatedList,
        selectedAccount: selectedAccount?.iban === iban ? updated : selectedAccount,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || `Error updating account ${iban}`, loading: false });
    }
  },

  removeAccount: async (iban) => {
    set({ loading: true, error: null });
    try {
      await deleteAccount(iban);
      const { accounts, selectedAccount } = get();
      const filtered = accounts.filter((acc) => acc.iban !== iban);
      set({
        accounts: filtered,
        selectedAccount: selectedAccount?.iban === iban ? null : selectedAccount,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || `Error deleting account ${iban}`, loading: false });
    }
  },
}));
