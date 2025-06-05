import { create } from "zustand";
import { HmacKey } from "@/models/entities";
import {
  hmacKeyService,
  NewHmacKey,
  UpdateHmacKey,
} from "@/services/hmacKeyService";

interface HmacKeyStore {
  hmacKeys: HmacKey[];
  selectedHmacKey: HmacKey | null;
  loading: boolean;
  error: string | null;

  fetchHmacKeys: () => Promise<void>;
  fetchHmacKey: (originBank: string, destinationBank: string) => Promise<void>;
  addHmacKey: (newKey: NewHmacKey) => Promise<void>;
  editHmacKey: (
    originBank: string,
    destinationBank: string,
    updates: UpdateHmacKey
  ) => Promise<void>;
  removeHmacKey: (originBank: string, destinationBank: string) => Promise<void>;
}

export const useHmacKeyStore = create<HmacKeyStore>((set, get) => ({
  hmacKeys: [],
  selectedHmacKey: null,
  loading: false,
  error: null,

  fetchHmacKeys: async () => {
    set({ loading: true, error: null });
    const response = await hmacKeyService.getAll();
    if (typeof response === "string") {
      set({ error: response, loading: false });
    } else {
      set({ hmacKeys: response, loading: false });
    }
  },

  fetchHmacKey: async (originBank, destinationBank) => {
    set({ loading: true, error: null });
    const response = await hmacKeyService.get(originBank, destinationBank);
    if (typeof response === "string") {
      set({ error: response, loading: false });
    } else {
      set({ selectedHmacKey: response, loading: false });
    }
  },

  addHmacKey: async (newKey) => {
    set({ loading: true, error: null });
    const response = await hmacKeyService.create(newKey);
    if (typeof response === "string") {
      set({ error: response, loading: false });
    } else {
      const { hmacKeys } = get();
      set({
        hmacKeys: [...hmacKeys, response],
        loading: false,
      });
    }
  },

  editHmacKey: async (originBank, destinationBank, updates) => {
    set({ loading: true, error: null });
    const response = await hmacKeyService.update(
      originBank,
      destinationBank,
      updates
    );
    if (typeof response === "string") {
      set({ error: response, loading: false });
    } else {
      const { hmacKeys, selectedHmacKey } = get();
      const updatedList = hmacKeys.map((k) =>
        k.originBank === originBank && k.destinationBank === destinationBank
          ? response
          : k
      );
      set({
        hmacKeys: updatedList,
        selectedHmacKey:
          selectedHmacKey &&
          selectedHmacKey.originBank === originBank &&
          selectedHmacKey.destinationBank === destinationBank
            ? response
            : selectedHmacKey,
        loading: false,
      });
    }
  },

  removeHmacKey: async (originBank, destinationBank) => {
    set({ loading: true, error: null });
    const success = await hmacKeyService.remove(originBank, destinationBank);
    if (!success) {
      set({
        error: `Error al eliminar la clave HMAC para ${originBank} → ${destinationBank}`,
        loading: false,
      });
    } else {
      const { hmacKeys, selectedHmacKey } = get();
      const filtered = hmacKeys.filter(
        (k) =>
          !(
            k.originBank === originBank &&
            k.destinationBank === destinationBank
          )
      );
      set({
        hmacKeys: filtered,
        selectedHmacKey:
          selectedHmacKey &&
          selectedHmacKey.originBank === originBank &&
          selectedHmacKey.destinationBank === destinationBank
            ? null
            : selectedHmacKey,
        loading: false,
      });
    }
  },
}));

export default useHmacKeyStore;
