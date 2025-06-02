import { create } from 'zustand';
import { Bank } from '@/models/entities';
import {
  getLastBank,
  getBankByCode,
  createBank,
  updateBank,
  deleteBank,
  NewBank,
  UpdateBank,
} from '@/services/bankService';

interface BankStore {
  banks: Bank[];
  selectedBank: Bank | null;
  loading: boolean;
  error: string | null;

  getBank: () => Promise<void>;
  fetchBank: (bankCode: string) => Promise<void>;
  addBank: (newBank: NewBank) => Promise<void>;
  editBank: (bankCode: string, updates: UpdateBank) => Promise<void>;
  removeBank: (bankCode: string) => Promise<void>;
}

export const useBankStore = create<BankStore>((set, get) => ({
  banks: [],
  selectedBank: null,
  loading: false,
  error: null,

  getBank: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getLastBank();
      set({ selectedBank: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error fetching banks', loading: false });
    }
  },

  fetchBank: async (bankCode) => {
    set({ loading: true, error: null });
    try {
      const bank = await getBankByCode(bankCode);
      set({ selectedBank: bank, loading: false });
    } catch (err: any) {
      set({
        error: err.message || `Error fetching bank ${bankCode}`,
        loading: false,
      });
    }
  },

  addBank: async (newBank) => {
    set({ loading: true, error: null });
    try {
      const created = await createBank(newBank);
      const { banks } = get();
      set({ banks: [...banks, created], loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error creating bank', loading: false });
    }
  },

  editBank: async (bankCode, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateBank(bankCode, updates);
      const { banks, selectedBank } = get();
      const updatedList = banks.map((b) =>
        b.bankCode === bankCode ? updated : b
      );
      set({
        banks: updatedList,
        selectedBank:
          selectedBank?.bankCode === bankCode ? updated : selectedBank,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || `Error updating bank ${bankCode}`,
        loading: false,
      });
    }
  },

  removeBank: async (bankCode) => {
    set({ loading: true, error: null });
    try {
      await deleteBank(bankCode);
      const { banks, selectedBank } = get();
      const filtered = banks.filter((b) => b.bankCode !== bankCode);
      set({
        banks: filtered,
        selectedBank:
          selectedBank?.bankCode === bankCode ? null : selectedBank,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || `Error deleting bank ${bankCode}`,
        loading: false,
      });
    }
  },
}));

export default useBankStore;