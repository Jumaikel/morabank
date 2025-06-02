import { create } from 'zustand';
import { Transaction } from '@/models/entities';
import {
  receiveTransfer as receiveTransferService,
  ReceiveTransferRequest,
} from '@/services/receiveTransferService';

interface ReceiveTransferStore {
  incomingTransfers: Transaction[];
  lastReceivedTransfer: Transaction | null;
  loading: boolean;
  error: string | null;

  processReceiveTransfer: (payload: ReceiveTransferRequest) => Promise<void>;
  clear: () => void;
}

export const useReceiveTransferStore = create<ReceiveTransferStore>((set, get) => ({
  incomingTransfers: [],
  lastReceivedTransfer: null,
  loading: false,
  error: null,

  processReceiveTransfer: async (payload) => {
    set({ loading: true, error: null });
    try {
      const tx = await receiveTransferService(payload);
      const { incomingTransfers } = get();
      set({
        incomingTransfers: [...incomingTransfers, tx],
        lastReceivedTransfer: tx,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Error processing external transfer',
        loading: false,
      });
    }
  },

  clear: () => {
    set({ error: null, lastReceivedTransfer: null });
  },
}));

export default useReceiveTransferStore;