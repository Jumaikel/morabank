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
    const response = await mfaCodeService.getAll();
    if (typeof response === "string") {
      set({ error: response, loading: false });
    } else {
      set({ mfaCodes: response, loading: false });
    }
  },

  fetchMfaCode: async (id) => {
    set({ loading: true, error: null });
    const response = await mfaCodeService.getById(id);
    if (typeof response === "string") {
      set({ error: response, loading: false });
    } else {
      set({ selectedMfaCode: response, loading: false });
    }
  },

  addMfaCode: async (newCode) => {
    set({ loading: true, error: null });
    const response = await mfaCodeService.create(newCode);
    if (typeof response === "string") {
      set({ error: response, loading: false });
    } else {
      const { mfaCodes } = get();
      set({
        mfaCodes: [...mfaCodes, response],
        loading: false,
      });
    }
  },

  editMfaCode: async (id, updates) => {
    set({ loading: true, error: null });
    const response = await mfaCodeService.update(id, updates);
    if (typeof response === "string") {
      set({ error: response, loading: false });
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
    } else {
      const { mfaCodes, selectedMfaCode } = get();
      const filtered = mfaCodes.filter((c) => c.id !== id);
      set({
        mfaCodes: filtered,
        selectedMfaCode:
          selectedMfaCode?.id === id ? null : selectedMfaCode,
        loading: false,
      });
    }
  },
}));

export default useMfaCodeStore;
