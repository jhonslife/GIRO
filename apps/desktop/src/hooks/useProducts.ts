import { invoke } from '@/lib/tauri';
import type { Category, Product } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ────────────────────────────────────────────────────────────────────────────
// QUERY KEYS
// ────────────────────────────────────────────────────────────────────────────

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: ProductFilter) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// ────────────────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────────────────

export interface ProductFilter {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateProductInput {
  name: string;
  barcode?: string;
  categoryId: string;
  salePrice: number;
  costPrice?: number;
  unit: string;
  isWeighted?: boolean;
  minStock?: number;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

// ────────────────────────────────────────────────────────────────────────────
// QUERIES
// ────────────────────────────────────────────────────────────────────────────

/**
 * Lista produtos com filtros opcionais
 */
export function useProducts(filter?: ProductFilter) {
  return useQuery({
    queryKey: ['products', filter],
    queryFn: () => invoke<Product[]>('get_products', { filter }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Busca produto por ID
 */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => invoke<Product>('get_product', { id }),
    enabled: !!id,
  });
}

/**
 * Busca produto por código de barras
 */
export function useProductByBarcode(barcode: string | null) {
  return useQuery({
    queryKey: ['product', 'barcode', barcode],
    queryFn: () => invoke<Product | null>('get_product_by_barcode', { barcode }),
    enabled: !!barcode && barcode.length > 0,
    staleTime: 1000 * 60, // 1 minuto
  });
}

/**
 * Busca produtos para autocomplete (lightweight)
 */
export function useProductSearch(search: string) {
  return useQuery({
    queryKey: ['products', 'search', search],
    queryFn: () => invoke<Product[]>('search_products', { search, limit: 10 }),
    enabled: search.length >= 2,
    staleTime: 1000 * 30, // 30 segundos
  });
}

/**
 * Lista categorias
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => invoke<Category[]>('get_categories'),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

/**
 * Busca categoria por ID
 */
export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => invoke<Category>('get_category', { id }),
    enabled: !!id,
  });
}

// ────────────────────────────────────────────────────────────────────────────
// MUTATIONS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Cria novo produto
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => invoke<Product>('create_product', { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/**
 * Atualiza produto existente
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProductInput) => invoke<Product>('update_product', { input }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
}

/**
 * Desativa produto (soft delete)
 */
export function useDeactivateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoke<void>('deactivate_product', { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/**
 * Cria nova categoria
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; color?: string; parentId?: string }) =>
      invoke<Category>('create_category', { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

/**
 * Atualiza categoria
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; name?: string; color?: string }) =>
      invoke<Category>('update_category', { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

/**
 * Deleta categoria
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoke<void>('delete_category', { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
