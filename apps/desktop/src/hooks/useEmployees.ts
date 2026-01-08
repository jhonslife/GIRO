/**
 * @file useEmployees - Hooks para gerenciamento de funcionários
 */

import { createEmployee, getEmployees, updateEmployee } from '@/lib/tauri';
import { type Employee } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ────────────────────────────────────────────────────────────────────────────
// QUERIES
// ────────────────────────────────────────────────────────────────────────────

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ────────────────────────────────────────────────────────────────────────────
// MUTATIONS
// ────────────────────────────────────────────────────────────────────────────

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => createEmployee(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; data: Partial<Employee> }) =>
      updateEmployee(input.id, input.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
