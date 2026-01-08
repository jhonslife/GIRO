/**
 * @file useCashSession - Hook para sessão de caixa
 * @description Gerencia abertura, fechamento e movimentações
 */

import {
  addCashMovement,
  closeCashSession,
  getCurrentCashSession,
  openCashSession,
} from '@/lib/tauri';
import type { CashMovementInput, CloseCashSessionInput, OpenCashSessionInput } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Busca sessão atual de caixa
 */
export function useCashSession() {
  return useQuery({
    queryKey: ['cashSession', 'current'],
    queryFn: getCurrentCashSession,
    staleTime: 1000 * 60, // 1 minuto
    refetchInterval: 1000 * 60 * 5, // Refetch a cada 5 minutos
  });
}

/**
 * Abre nova sessão de caixa
 */
export function useOpenCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: OpenCashSessionInput) => openCashSession(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashSession'] });
    },
  });
}

/**
 * Fecha sessão de caixa
 */
export function useCloseCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CloseCashSessionInput) => closeCashSession(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashSession'] });
    },
  });
}

/**
 * Adiciona movimentação de caixa (sangria/suprimento)
 */
export function useAddCashMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CashMovementInput) => addCashMovement(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashSession'] });
    },
  });
}
