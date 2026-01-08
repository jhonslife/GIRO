/**
 * @file useCategories - Hook para gerenciamento de categorias
 * @description Usa TanStack Query para cache de categorias
 */

import { useToast } from '@/hooks/use-toast';
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/lib/tauri';
import type { Category } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ────────────────────────────────────────────────────────────────────────────
// QUERY KEYS
// ────────────────────────────────────────────────────────────────────────────

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
};

// ────────────────────────────────────────────────────────────────────────────
// QUERIES
// ────────────────────────────────────────────────────────────────────────────

/**
 * Lista todas as categorias
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutos - categorias mudam pouco
  });
}

// ────────────────────────────────────────────────────────────────────────────
// MUTATIONS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Cria uma nova categoria
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (input: { name: string; color?: string; icon?: string; parentId?: string }) =>
      createCategory(input),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      success('Categoria criada', `${category.name} foi cadastrada`);
    },
    onError: (err) => {
      error('Erro ao criar categoria', err.message);
    },
  });
}

/**
 * Atualiza uma categoria
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => updateCategory(id, data),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      success('Categoria atualizada', `${category.name} foi atualizada`);
    },
    onError: (err) => {
      error('Erro ao atualizar categoria', err.message);
    },
  });
}

/**
 * Remove uma categoria
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      success('Categoria removida', 'Categoria excluída com sucesso');
    },
    onError: (err) => {
      error('Erro ao remover categoria', err.message);
    },
  });
}

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Cores padrão para categorias
 */
export const CATEGORY_COLORS = [
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Âmbar', value: '#f59e0b' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Esmeralda', value: '#10b981' },
  { name: 'Ciano', value: '#06b6d4' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Violeta', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Cinza', value: '#6b7280' },
];

/**
 * Ícones padrão para categorias
 */
export const CATEGORY_ICONS = [
  'shopping-basket',
  'milk',
  'beef',
  'apple',
  'croissant',
  'spray-can',
  'pill',
  'cookie',
  'wine',
  'package',
];
