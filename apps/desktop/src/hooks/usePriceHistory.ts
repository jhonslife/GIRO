/**
 * @file usePriceHistory - Hooks para histórico de preços
 */

import {
  getPriceHistoryByProduct,
  getRecentPriceHistory,
  type PriceHistory,
  type PriceHistoryWithProduct,
} from '@/lib/tauri';
import { useQuery } from '@tanstack/react-query';

// ────────────────────────────────────────────────────────────────────────────
// QUERY KEYS
// ────────────────────────────────────────────────────────────────────────────

export const priceHistoryKeys = {
  all: ['priceHistory'] as const,
  byProduct: (productId: string) => [...priceHistoryKeys.all, 'product', productId] as const,
  recent: (limit?: number) => [...priceHistoryKeys.all, 'recent', limit] as const,
};

// ────────────────────────────────────────────────────────────────────────────
// QUERIES
// ────────────────────────────────────────────────────────────────────────────

/**
 * Busca histórico de preços de um produto específico
 */
export function usePriceHistoryByProduct(productId: string) {
  return useQuery<PriceHistory[]>({
    queryKey: priceHistoryKeys.byProduct(productId),
    queryFn: () => getPriceHistoryByProduct(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Busca histórico de preços recente
 */
export function useRecentPriceHistory(limit?: number) {
  return useQuery<PriceHistoryWithProduct[]>({
    queryKey: priceHistoryKeys.recent(limit),
    queryFn: () => getRecentPriceHistory(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Calcula a variação percentual entre o preço antigo e o novo
 */
export function calculatePriceChange(oldPrice: number, newPrice: number): number {
  if (oldPrice === 0) return 0;
  return ((newPrice - oldPrice) / oldPrice) * 100;
}

/**
 * Formata a variação de preço para exibição
 */
export function formatPriceChange(oldPrice: number, newPrice: number): string {
  const change = calculatePriceChange(oldPrice, newPrice);
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}
