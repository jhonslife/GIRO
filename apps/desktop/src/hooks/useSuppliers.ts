/**
 * @file useSuppliers - Hooks para gerenciamento de fornecedores
 */

import { useToast } from '@/hooks/use-toast';
import {
  createSupplier,
  deactivateSupplier,
  deleteSupplier,
  getAllSuppliers,
  getInactiveSuppliers,
  getSuppliers,
  reactivateSupplier,
  updateSupplier,
} from '@/lib/tauri';
import { type Supplier } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ────────────────────────────────────────────────────────────────────────────
// QUERY KEYS
// ────────────────────────────────────────────────────────────────────────────

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  listAll: () => [...supplierKeys.all, 'listAll'] as const,
  listInactive: () => [...supplierKeys.all, 'listInactive'] as const,
  detail: (id: string) => [...supplierKeys.all, 'detail', id] as const,
};

// ────────────────────────────────────────────────────────────────────────────
// QUERIES
// ────────────────────────────────────────────────────────────────────────────

/**
 * Lista todos os fornecedores ativos
 */
export function useSuppliers() {
  return useQuery({
    queryKey: supplierKeys.lists(),
    queryFn: getSuppliers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Lista todos os fornecedores (ativos e inativos)
 */
export function useAllSuppliers() {
  return useQuery({
    queryKey: supplierKeys.listAll(),
    queryFn: getAllSuppliers,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Lista apenas fornecedores inativos
 */
export function useInactiveSuppliers() {
  return useQuery({
    queryKey: supplierKeys.listInactive(),
    queryFn: getInactiveSuppliers,
    staleTime: 1000 * 60 * 5,
  });
}

// ────────────────────────────────────────────────────────────────────────────
// MUTATIONS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Cria um novo fornecedor
 */
export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (input: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => createSupplier(input),
    onSuccess: (supplier) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      success('Fornecedor criado', `${supplier.name} foi cadastrado`);
    },
    onError: (err) => {
      error('Erro ao criar fornecedor', err.message);
    },
  });
}

/**
 * Atualiza um fornecedor
 */
export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (input: { id: string; data: Partial<Supplier> }) =>
      updateSupplier(input.id, input.data),
    onSuccess: (supplier) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      success('Fornecedor atualizado', `${supplier.name} foi atualizado`);
    },
    onError: (err) => {
      error('Erro ao atualizar fornecedor', err.message);
    },
  });
}

/**
 * Remove um fornecedor (hard delete)
 */
export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      success('Fornecedor removido', 'Fornecedor excluído com sucesso');
    },
    onError: (err) => {
      error('Erro ao remover fornecedor', err.message);
    },
  });
}

/**
 * Desativa um fornecedor (soft delete)
 */
export function useDeactivateSupplier() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => deactivateSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      success('Fornecedor desativado', 'Fornecedor desativado com sucesso');
    },
    onError: (err) => {
      error('Erro ao desativar fornecedor', err.message);
    },
  });
}

/**
 * Reativa um fornecedor
 */
export function useReactivateSupplier() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => reactivateSupplier(id),
    onSuccess: (supplier) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      success('Fornecedor reativado', `${supplier.name} foi reativado`);
    },
    onError: (err) => {
      error('Erro ao reativar fornecedor', err.message);
    },
  });
}
