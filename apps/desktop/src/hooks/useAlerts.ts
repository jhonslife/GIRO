/**
 * @file useAlerts - Hook para gerenciamento de alertas do sistema
 */

import {
  dismissAlert,
  getAlerts,
  getUnreadAlertsCount,
  markAlertAsRead,
  refreshAlerts,
} from '@/lib/tauri';
import { useAlertStore } from '@/stores';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

// ────────────────────────────────────────────────────────────────────────────
// QUERY KEYS
// ────────────────────────────────────────────────────────────────────────────

export const alertKeys = {
  all: ['alerts'] as const,
  list: () => [...alertKeys.all, 'list'] as const,
  unreadCount: () => [...alertKeys.all, 'unreadCount'] as const,
};

// ────────────────────────────────────────────────────────────────────────────
// QUERIES
// ────────────────────────────────────────────────────────────────────────────

/**
 * Lista todos os alertas
 */
export function useAlertsQuery() {
  const setAlerts = useAlertStore((state) => state.setAlerts);
  const setLoading = useAlertStore((state) => state.setLoading);

  return useQuery({
    queryKey: alertKeys.list(),
    queryFn: async () => {
      setLoading(true);
      try {
        const alerts = await getAlerts();
        setAlerts(alerts);
        return alerts;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Atualiza a cada 5 minutos
  });
}

/**
 * Contador de alertas não lidos
 */
export function useUnreadAlertsCount() {
  const setUnreadCount = useAlertStore((state) => state.setUnreadCount);

  return useQuery({
    queryKey: alertKeys.unreadCount(),
    queryFn: async () => {
      const count = await getUnreadAlertsCount();
      setUnreadCount(count);
      return count;
    },
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: 2 * 60 * 1000, // Atualiza a cada 2 minutos
  });
}

// ────────────────────────────────────────────────────────────────────────────
// MUTATIONS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Marca alerta como lido
 */
export function useMarkAlertAsRead() {
  const queryClient = useQueryClient();
  const markAsRead = useAlertStore((state) => state.markAsRead);

  return useMutation({
    mutationFn: (id: string) => markAlertAsRead(id),
    onSuccess: (_, id) => {
      markAsRead(id);
      queryClient.invalidateQueries({ queryKey: alertKeys.unreadCount() });
    },
  });
}

/**
 * Dispensa alerta
 */
export function useDismissAlert() {
  const queryClient = useQueryClient();
  const dismiss = useAlertStore((state) => state.dismissAlert);

  return useMutation({
    mutationFn: (id: string) => dismissAlert(id),
    onSuccess: (_, id) => {
      dismiss(id);
      queryClient.invalidateQueries({ queryKey: alertKeys.list() });
      queryClient.invalidateQueries({ queryKey: alertKeys.unreadCount() });
    },
  });
}

/**
 * Força atualização dos alertas (recalcula vencimentos, etc.)
 */
export function useRefreshAlerts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshAlerts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.list() });
      queryClient.invalidateQueries({ queryKey: alertKeys.unreadCount() });
    },
  });
}

// ────────────────────────────────────────────────────────────────────────────
// HOOKS COMPOSTOS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Hook principal para alertas - sincroniza com a store
 */
export function useAlertsSync() {
  const { data: alerts } = useAlertsQuery();
  const { data: unreadCount } = useUnreadAlertsCount();
  const refresh = useRefreshAlerts();

  // Atualiza alertas ao montar
  useEffect(() => {
    refresh.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    alerts: alerts ?? [],
    unreadCount: unreadCount ?? 0,
    refresh: () => refresh.mutate(),
    isRefreshing: refresh.isPending,
  };
}
