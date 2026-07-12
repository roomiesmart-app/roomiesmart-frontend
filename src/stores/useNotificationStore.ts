import { create } from "zustand";

export interface AppNotification {
  id: string;
  user_id: string;
  type: "new_message" | "join_request" | "request_accepted" | "request_rejected";
  title: string;
  body: string | null;
  resource_id: string | null;
  is_read: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: AppNotification[];
  setAll: (notifications: AppNotification[]) => void;
  push: (notification: AppNotification) => void;
  markAllRead: () => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setAll: (notifications) => set({ notifications }),
  push: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 20),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
    })),
  clear: () => set({ notifications: [] }),
}));

export const selectUnreadCount = (state: NotificationState) =>
  state.notifications.filter((n) => !n.is_read).length;
