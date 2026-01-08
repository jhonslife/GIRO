import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type FC, type ReactNode } from 'react';

/**
 * Cliente do TanStack Query configurado para uso com Tauri
 * - Retry desabilitado por padrão (operações locais)
 * - Stale time de 5 minutos
 * - Cache time de 30 minutos
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Não precisa retry em operações locais SQLite
      retry: false,
      // Dados ficam frescos por 5 minutos
      staleTime: 1000 * 60 * 5,
      // Cache mantido por 30 minutos
      gcTime: 1000 * 60 * 30,
      // Não refetch automaticamente (app desktop)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider: FC<QueryProviderProps> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

/**
 * Keys padronizadas para queries
 */
export const queryKeys = {
  // Produtos
  products: {
    all: ['products'] as const,
    list: (filters?: Record<string, unknown>) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    byBarcode: (barcode: string) => ['products', 'barcode', barcode] as const,
    search: (query: string) => ['products', 'search', query] as const,
  },

  // Categorias
  categories: {
    all: ['categories'] as const,
    list: () => ['categories', 'list'] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
  },

  // Vendas
  sales: {
    all: ['sales'] as const,
    list: (filters?: Record<string, unknown>) => ['sales', 'list', filters] as const,
    detail: (id: string) => ['sales', 'detail', id] as const,
    today: () => ['sales', 'today'] as const,
  },

  // Funcionários
  employees: {
    all: ['employees'] as const,
    list: () => ['employees', 'list'] as const,
    detail: (id: string) => ['employees', 'detail', id] as const,
  },

  // Sessões de caixa
  cashSessions: {
    all: ['cashSessions'] as const,
    current: () => ['cashSessions', 'current'] as const,
    list: (filters?: Record<string, unknown>) => ['cashSessions', 'list', filters] as const,
    detail: (id: string) => ['cashSessions', 'detail', id] as const,
  },

  // Estoque
  stock: {
    all: ['stock'] as const,
    movements: (productId?: string) => ['stock', 'movements', productId] as const,
    lots: (productId: string) => ['stock', 'lots', productId] as const,
  },

  // Alertas
  alerts: {
    all: ['alerts'] as const,
    unread: () => ['alerts', 'unread'] as const,
    byType: (type: string) => ['alerts', 'type', type] as const,
  },

  // Relatórios
  reports: {
    sales: (period: { start: string; end: string }) => ['reports', 'sales', period] as const,
    products: (type: 'top' | 'bottom') => ['reports', 'products', type] as const,
    stock: () => ['reports', 'stock'] as const,
  },

  // Configurações
  settings: {
    all: ['settings'] as const,
    byKey: (key: string) => ['settings', key] as const,
  },
} as const;
