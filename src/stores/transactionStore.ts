// stores/transactionStore.ts

import { create } from "zustand";
import { Transaction } from "@/models/entities";
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  NewTransaction,
  UpdateTransaction,
} from "@/services/transactionService";

interface TransactionStore {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  loading: boolean;
  error: string | null;

  fetchTransactions: () => Promise<void>;
  fetchTransaction: (transactionId: string) => Promise<void>;
  addTransaction: (newTx: NewTransaction) => Promise<void>;
  editTransaction: (
    transactionId: string,
    updates: UpdateTransaction
  ) => Promise<void>;
  removeTransaction: (transactionId: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  selectedTransaction: null,
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllTransactions();
      set({ transactions: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Error fetching transactions",
        loading: false,
      });
    }
  },

  fetchTransaction: async (transactionId) => {
    set({ loading: true, error: null });
    try {
      const tx = await getTransactionById(transactionId);
      set({ selectedTransaction: tx, loading: false });
    } catch (err: any) {
      set({
        error: err.message || `Error fetching transaction ${transactionId}`,
        loading: false,
      });
    }
  },

  addTransaction: async (newTx) => {
    set({ loading: true, error: null });
    try {
      const created = await createTransaction(newTx);
      const { transactions } = get();
      set({
        transactions: [...transactions, created],
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Error creating transaction",
        loading: false,
      });
    }
  },

  editTransaction: async (transactionId, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateTransaction(transactionId, updates);
      const { transactions, selectedTransaction } = get();
      const updatedList = transactions.map((tx) =>
        tx.transactionId === transactionId ? updated : tx
      );
      set({
        transactions: updatedList,
        selectedTransaction:
          selectedTransaction?.transactionId === transactionId
            ? updated
            : selectedTransaction,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || `Error updating transaction ${transactionId}`,
        loading: false,
      });
    }
  },

  removeTransaction: async (transactionId) => {
    set({ loading: true, error: null });
    try {
      await deleteTransaction(transactionId);
      const { transactions, selectedTransaction } = get();
      const filtered = transactions.filter(
        (tx) => tx.transactionId !== transactionId
      );
      set({
        transactions: filtered,
        selectedTransaction:
          selectedTransaction?.transactionId === transactionId
            ? null
            : selectedTransaction,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || `Error deleting transaction ${transactionId}`,
        loading: false,
      });
    }
  },
}));
