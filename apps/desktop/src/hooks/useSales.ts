/**
 * @file useSales - Hook para gerenciamento de vendas
 * @description Usa TanStack Query para vendas e sessões de caixa
 */

import { useToast } from '@/hooks/use-toast';
import {
  addCashMovement,
  cancelSale,
  closeCashSession,
  createSale,
  getCurrentCashSession,
  getDailySalesTotal,
  getSaleById,
  getSales,
  getSalesReport,
  getTodaySales,
  getTopProducts,
  openCashSession,
} from '@/lib/tauri';
import { usePDVStore } from '@/stores';
import type {
  CashMovementInput,
  CloseCashSessionInput,
  CreateSaleInput,
  OpenCashSessionInput,
  SaleFilter,
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ────────────────────────────────────────────────────────────────────────────
// QUERY KEYS
// ────────────────────────────────────────────────────────────────────────────

export const saleKeys = {
  all: ['sales'] as const,
  lists: () => [...saleKeys.all, 'list'] as const,
  list: (filter?: SaleFilter) => [...saleKeys.lists(), filter] as const,
  details: () => [...saleKeys.all, 'detail'] as const,
  detail: (id: string) => [...saleKeys.details(), id] as const,
  today: () => [...saleKeys.all, 'today'] as const,
  dailyTotal: () => [...saleKeys.all, 'dailyTotal'] as const,
};

export const cashSessionKeys = {
  all: ['cashSession'] as const,
  current: () => [...cashSessionKeys.all, 'current'] as const,
  history: () => [...cashSessionKeys.all, 'history'] as const,
};

// ────────────────────────────────────────────────────────────────────────────
// SALES QUERIES
// ────────────────────────────────────────────────────────────────────────────

/**
 * Lista vendas com filtro
 */
export function useSales(filter?: SaleFilter) {
  return useQuery({
    queryKey: saleKeys.list(filter),
    queryFn: () => getSales(filter),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}

/**
 * Busca venda por ID
 */
export function useSale(id: string) {
  return useQuery({
    queryKey: saleKeys.detail(id),
    queryFn: () => getSaleById(id),
    enabled: !!id,
  });
}

/**
 * Vendas de hoje
 */
export function useTodaySales() {
  return useQuery({
    queryKey: saleKeys.today(),
    queryFn: getTodaySales,
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // Atualiza a cada minuto
  });
}

/**
 * Total de vendas do dia
 */
export function useDailySalesTotal() {
  return useQuery({
    queryKey: saleKeys.dailyTotal(),
    queryFn: getDailySalesTotal,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

// ────────────────────────────────────────────────────────────────────────────
// SALES MUTATIONS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Finaliza uma venda
 */
export function useCreateSale() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const clearCart = usePDVStore((state) => state.clearCart);

  return useMutation({
    mutationFn: (input: CreateSaleInput) => createSale(input),
    onSuccess: (sale) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: saleKeys.today() });
      queryClient.invalidateQueries({ queryKey: saleKeys.dailyTotal() });
      queryClient.invalidateQueries({ queryKey: cashSessionKeys.current() });

      // Limpa o carrinho
      clearCart();

      success('Venda finalizada', `Venda #${sale.dailyNumber} concluída com sucesso`);
    },
    onError: (err) => {
      error('Erro ao finalizar venda', err.message);
    },
  });
}

/**
 * Cancela uma venda
 */
export function useCancelSale() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelSale(id, reason),
    onSuccess: (sale) => {
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: saleKeys.today() });
      queryClient.invalidateQueries({ queryKey: saleKeys.dailyTotal() });
      queryClient.invalidateQueries({ queryKey: saleKeys.detail(sale.id) });

      success('Venda cancelada', `Venda #${sale.dailyNumber} foi cancelada`);
    },
    onError: (err) => {
      error('Erro ao cancelar venda', err.message);
    },
  });
}

// ────────────────────────────────────────────────────────────────────────────
// CASH SESSION QUERIES
// ────────────────────────────────────────────────────────────────────────────

/**
 * Sessão de caixa atual
 */
export function useCurrentCashSession() {
  const setCashSession = usePDVStore((state) => state.setCashSession);

  return useQuery({
    queryKey: cashSessionKeys.current(),
    queryFn: async () => {
      const session = await getCurrentCashSession();
      setCashSession(session);
      return session;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

// ────────────────────────────────────────────────────────────────────────────
// CASH SESSION MUTATIONS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Abre o caixa
 */
export function useOpenCashSession() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const setCashSession = usePDVStore((state) => state.setCashSession);

  return useMutation({
    mutationFn: (input: OpenCashSessionInput) => openCashSession(input),
    onSuccess: (session) => {
      setCashSession(session);
      queryClient.invalidateQueries({ queryKey: cashSessionKeys.current() });
      success('Caixa aberto', 'Sessão de caixa iniciada com sucesso');
    },
    onError: (err) => {
      error('Erro ao abrir caixa', err.message);
    },
  });
}

/**
 * Fecha o caixa
 */
export function useCloseCashSession() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const setCashSession = usePDVStore((state) => state.setCashSession);

  return useMutation({
    mutationFn: (input: CloseCashSessionInput) => closeCashSession(input),
    onSuccess: (session) => {
      setCashSession(null);
      queryClient.invalidateQueries({ queryKey: cashSessionKeys.current() });
      queryClient.invalidateQueries({ queryKey: cashSessionKeys.history() });

      const diff = session.difference ?? 0;
      if (Math.abs(diff) < 0.01) {
        success('Caixa fechado', 'Fechamento conferido sem diferença');
      } else {
        success('Caixa fechado', `Diferença de R$ ${diff.toFixed(2)} registrada`);
      }
    },
    onError: (err) => {
      error('Erro ao fechar caixa', err.message);
    },
  });
}

/**
 * Sangria ou suprimento de caixa
 */
export function useCashMovement() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (input: CashMovementInput) => addCashMovement(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: cashSessionKeys.current() });

      const action = variables.type === 'WITHDRAWAL' ? 'Sangria' : 'Suprimento';
      success(action, `${action} de R$ ${variables.amount.toFixed(2)} registrado`);
    },
    onError: (err) => {
      error('Erro na movimentação', err.message);
    },
  });
}

// ────────────────────────────────────────────────────────────────────────────
// COMBINED HOOKS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Hook completo para o PDV
 */
export function usePDV() {
  const { data: session, isLoading: sessionLoading } = useCurrentCashSession();
  const createSale = useCreateSale();
  const { data: todaySales } = useTodaySales();
  const { data: dailyTotal } = useDailySalesTotal();

  return {
    session,
    sessionLoading,
    isCashOpen: !!session && session.status === 'OPEN',
    createSale,
    todaySales: todaySales ?? [],
    dailyTotal: dailyTotal ?? 0,
    todaySalesCount: todaySales?.length ?? 0,
  };
}

/**
 * Hook para relatório de vendas
 */
export function useSalesReport(params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: string;
}) {
  return useQuery({
    queryKey: ['sales', 'report', params],
    queryFn: async () => {
      // Default to today if not provided (though enabled check prevents execution)
      const start = params?.startDate ?? new Date().toISOString();
      const end = params?.endDate ?? new Date().toISOString();

      const [report, topProductsList] = await Promise.all([
        getSalesReport(start, end),
        getTopProducts(10),
      ]);

      const totalRevenue = report.totalRevenue;
      return {
        totalAmount: totalRevenue,
        salesCount: report.totalSales,
        averageTicket: report.averageTicket,
        totalItems: 0,
        grossProfit: 0,
        profitMargin: 0,
        periods: Object.entries(report.salesByHour).map(([hour, value], _index, arr) => {
          const total = arr.reduce((sum, [, v]) => sum + (v as number), 0);
          const percentage = total > 0 ? ((value as number) / total) * 100 : 0;
          return {
            label: `${hour}:00`,
            date: hour,
            salesCount: 0,
            revenue: value as number,
            count: 0,
            amount: value as number,
            averageTicket: 0,
            percentage,
          };
        }),
        topProducts: topProductsList.map((item, index) => ({
          id: `product-${index}`,
          name: item.product.name,
          quantity: item.quantity,
          amount: item.revenue,
        })),
        paymentBreakdown: Object.entries(report.salesByPaymentMethod).map(
          ([method, value], _idx, arr) => {
            const total = arr.reduce((sum, [, v]) => sum + (v as number), 0);
            const percentage = total > 0 ? ((value as number) / total) * 100 : 0;
            return {
              method,
              label: method,
              amount: value as number,
              count: 0,
              percentage,
            };
          }
        ),
      };
    },
    enabled: !!params?.startDate && !!params?.endDate,
  });
}
