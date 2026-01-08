import { create } from 'zustand';

export type AlertType =
  | 'EXPIRATION_CRITICAL'
  | 'EXPIRATION_WARNING'
  | 'EXPIRATION_NOTICE'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'NEGATIVE_MARGIN'
  | 'SLOW_MOVING';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  productId?: string;
  productName?: string;
  lotId?: string;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
}

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  isLoading: boolean;

  // Ações
  setAlerts: (alerts: Alert[]) => void;
  setLoading: (loading: boolean) => void;
  setUnreadCount: (count: number) => void;
  addAlert: (alert: Alert) => void;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
  dismissAlert: (alertId: string) => void;
  clearDismissed: () => void;

  // Filtros
  getByType: (type: AlertType) => Alert[];
  getBySeverity: (severity: AlertSeverity) => Alert[];
  getCritical: () => Alert[];
}

export const useAlertStore = create<AlertState>()((set, get) => ({
  alerts: [],
  unreadCount: 0,
  isLoading: false,

  setAlerts: (alerts) => {
    const unreadCount = alerts.filter((a) => !a.isRead && !a.isDismissed).length;
    set({ alerts, unreadCount });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setUnreadCount: (count) => {
    set({ unreadCount: count });
  },

  addAlert: (alert) => {
    set((state) => {
      const alerts = [alert, ...state.alerts];
      const unreadCount = alerts.filter((a) => !a.isRead && !a.isDismissed).length;
      return { alerts, unreadCount };
    });
  },

  markAsRead: (alertId) => {
    set((state) => {
      const alerts = state.alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a));
      const unreadCount = alerts.filter((a) => !a.isRead && !a.isDismissed).length;
      return { alerts, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const alerts = state.alerts.map((a) => ({ ...a, isRead: true }));
      return { alerts, unreadCount: 0 };
    });
  },

  dismissAlert: (alertId) => {
    set((state) => {
      const alerts = state.alerts.map((a) => (a.id === alertId ? { ...a, isDismissed: true } : a));
      const unreadCount = alerts.filter((a) => !a.isRead && !a.isDismissed).length;
      return { alerts, unreadCount };
    });
  },

  clearDismissed: () => {
    set((state) => {
      const alerts = state.alerts.filter((a) => !a.isDismissed);
      const unreadCount = alerts.filter((a) => !a.isRead).length;
      return { alerts, unreadCount };
    });
  },

  getByType: (type) => {
    return get().alerts.filter((a) => a.type === type && !a.isDismissed);
  },

  getBySeverity: (severity) => {
    return get().alerts.filter((a) => a.severity === severity && !a.isDismissed);
  },

  getCritical: () => {
    return get().alerts.filter((a) => a.severity === 'CRITICAL' && !a.isDismissed);
  },
}));
