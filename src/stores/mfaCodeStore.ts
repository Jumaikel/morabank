import { create } from "zustand";
import { MfaCode } from "@/models/entities";
import {
  mfaCodeService,
  NewMfaCode,
  UpdateMfaCode,
} from "@/services/mfaCodeService";

interface MfaCodeStore {
  mfaCodes: MfaCode[];
  selectedMfaCode: MfaCode | null;
  loading: boolean;
  error: string | null;

  fetchMfaCodes: () => Promise<boolean>;
  fetchMfaCode: (id: number) => Promise<boolean>;
  addMfaCode: (newCode: NewMfaCode) => Promise<boolean>;
  editMfaCode: (id: number, updates: UpdateMfaCode) => Promise<boolean>;
  removeMfaCode: (id: number) => Promise<boolean>;
}

export const useMfaCodeStore = create<MfaCodeStore>((set, get) => ({
  mfaCodes: [],
  selectedMfaCode: null,
  loading: false,
  error: null,

  fetchMfaCodes: async () => {
    set({ loading: true, error: null });
    const response = await mfaCodeService.getAll();
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      set({ mfaCodes: response, loading: false });
      return true;
    }
  },

  fetchMfaCode: async (id) => {
    set({ loading: true, error: null });
    const response = await mfaCodeService.getById(id);
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      set({ selectedMfaCode: response, loading: false });
      return true;
    }
  },

  addMfaCode: async (newCode) => {
    set({ loading: true, error: null });
    const response = await mfaCodeService.create(newCode);
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      const { mfaCodes } = get();
      set({
        mfaCodes: [...mfaCodes, response],
        loading: false,
      });
      return true;
    }
  },

  editMfaCode: async (id, updates) => {
    set({ loading: true, error: null });
    const response = await mfaCodeService.update(id, updates);
    if (typeof response === "string") {
      set({ error: response, loading: false });
      return false;
    } else {
      const { mfaCodes, selectedMfaCode } = get();
      const updatedList = mfaCodes.map((c) =>
        c.id === id ? response : c
      );
      set({
        mfaCodes: updatedList,
        selectedMfaCode:
          selectedMfaCode?.id === id ? response : selectedMfaCode,
        loading: false,
      });
      return true;
    }
  },

  removeMfaCode: async (id) => {
    set({ loading: true, error: null });
    const success = await mfaCodeService.remove(id);
    if (!success) {
      set({
        error: `Error al eliminar el código MFA con ID ${id}`,
        loading: false,
      });
      return false;
    } else {
      const { mfaCodes, selectedMfaCode } = get();
      const filtered = mfaCodes.filter((c) => c.id !== id);
      set({
        mfaCodes: filtered,
        selectedMfaCode:
          selectedMfaCode?.id === id ? null : selectedMfaCode,
        loading: false,
      });
      return true;
    }
  },
}));

export default useMfaCodeStore;
