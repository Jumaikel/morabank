import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

interface NotificationStore {
  notifications: Notification[];
  unread: number;
  add: (message: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unread: 0,
  add: (message) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: uuidv4(), message, timestamp: new Date().toISOString() },
      ],
      unread: state.unread + 1,
    })),
  clear: () =>
    set({
      unread: 0,
    }),
}));
