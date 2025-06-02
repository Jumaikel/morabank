import { create } from 'zustand';
import { MfaCode } from '@/models/entities';
import {
  getAllMfaCodes,
  getMfaCodeById,
  createMfaCode,
  updateMfaCode,
  deleteMfaCode,
  NewMfaCode,
  UpdateMfaCode,
} from '@/services/mfaCodeService';

interface MfaCodeStore {
  mfaCodes: MfaCode[];
  selectedMfaCode: MfaCode | null;
  loading: boolean;
  error: string | null;

  fetchMfaCodes: () => Promise<void>;
  fetchMfaCode: (id: number) => Promise<void>;
  addMfaCode: (newCode: NewMfaCode) => Promise<void>;
  editMfaCode: (id: number, updates: UpdateMfaCode) => Promise<void>;
  removeMfaCode: (id: number) => Promise<void>;
}

export const useMfaCodeStore = create<MfaCodeStore>((set, get) => ({
  mfaCodes: [],
  selectedMfaCode: null,
  loading: false,
  error: null,

  fetchMfaCodes: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllMfaCodes();
      set({ mfaCodes: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error fetching MFA codes', loading: false });
    }
  },

  fetchMfaCode: async (id) => {
    set({ loading: true, error: null });
    try {
      const code = await getMfaCodeById(id);
      set({ selectedMfaCode: code, loading: false });
    } catch (err: any) {
      set({
        error: err.message || `Error fetching MFA code ${id}`,
        loading: false,
      });
    }
  },

  addMfaCode: async (newCode) => {
    set({ loading: true, error: null });
    try {
      const created = await createMfaCode(newCode);
      const { mfaCodes } = get();
      set({ mfaCodes: [...mfaCodes, created], loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error creating MFA code', loading: false });
    }
  },

  editMfaCode: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateMfaCode(id, updates);
      const { mfaCodes, selectedMfaCode } = get();
      const updatedList = mfaCodes.map((c) => (c.id === id ? updated : c));
      set({
        mfaCodes: updatedList,
        selectedMfaCode: selectedMfaCode?.id === id ? updated : selectedMfaCode,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || `Error updating MFA code ${id}`,
        loading: false,
      });
    }
  },

  removeMfaCode: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteMfaCode(id);
      const { mfaCodes, selectedMfaCode } = get();
      const filtered = mfaCodes.filter((c) => c.id !== id);
      set({
        mfaCodes: filtered,
        selectedMfaCode: selectedMfaCode?.id === id ? null : selectedMfaCode,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || `Error deleting MFA code ${id}`,
        loading: false,
      });
    }
  },
}));

export default useMfaCodeStore;