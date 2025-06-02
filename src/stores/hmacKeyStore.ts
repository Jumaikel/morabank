import { create } from 'zustand';
import { HmacKey } from '@/models/entities';
import {
  getAllHmacKeys,
  getHmacKey,
  createHmacKey,
  updateHmacKey,
  deleteHmacKey,
  NewHmacKey,
  UpdateHmacKey,
} from '@/services/hmacKeyService';

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
    try {
      const data = await getAllHmacKeys();
      set({ hmacKeys: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error fetching HMAC keys', loading: false });
    }
  },

  fetchHmacKey: async (originBank, destinationBank) => {
    set({ loading: true, error: null });
    try {
      const key = await getHmacKey(originBank, destinationBank);
      set({ selectedHmacKey: key, loading: false });
    } catch (err: any) {
      set({
        error:
          err.message ||
          `Error fetching HMAC key for ${originBank} -> ${destinationBank}`,
        loading: false,
      });
    }
  },

  addHmacKey: async (newKey) => {
    set({ loading: true, error: null });
    try {
      const created = await createHmacKey(newKey);
      const { hmacKeys } = get();
      set({ hmacKeys: [...hmacKeys, created], loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error creating HMAC key', loading: false });
    }
  },

  editHmacKey: async (originBank, destinationBank, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateHmacKey(originBank, destinationBank, updates);
      const { hmacKeys, selectedHmacKey } = get();
      const updatedList = hmacKeys.map((k) =>
        k.originBank === originBank && k.destinationBank === destinationBank
          ? updated
          : k
      );
      set({
        hmacKeys: updatedList,
        selectedHmacKey:
          selectedHmacKey &&
          selectedHmacKey.originBank === originBank &&
          selectedHmacKey.destinationBank === destinationBank
            ? updated
            : selectedHmacKey,
        loading: false,
      });
    } catch (err: any) {
      set({
        error:
          err.message ||
          `Error updating HMAC key for ${originBank} -> ${destinationBank}`,
        loading: false,
      });
    }
  },

  removeHmacKey: async (originBank, destinationBank) => {
    set({ loading: true, error: null });
    try {
      await deleteHmacKey(originBank, destinationBank);
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
    } catch (err: any) {
      set({
        error:
          err.message ||
          `Error deleting HMAC key for ${originBank} -> ${destinationBank}`,
        loading: false,
      });
    }
  },
}));

export default useHmacKeyStore;