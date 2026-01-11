import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEmployees } from '../useEmployees';

// Mock Tauri
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useEmployees', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simular ambiente Tauri para usar o mock do invoke
    Object.defineProperty(window, '__TAURI__', {
      value: {},
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Limpar simulação
    // @ts-ignore
    delete window.__TAURI__;
  });

  const invokeMock = invoke as unknown as ReturnType<typeof vi.fn>;

  describe('useEmployees (list)', () => {
    it('should fetch employees successfully', async () => {
      const mockEmployees = [
        { id: '1', name: 'João Silva', pin: '1234', role: 'ADMIN' },
        { id: '2', name: 'Maria Santos', pin: '5678', role: 'CASHIER' },
      ];

      invokeMock.mockResolvedValue(mockEmployees);

      const { result } = renderHook(() => useEmployees(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEmployees);
      expect(invoke).toHaveBeenCalledWith('get_employees', undefined);
    });

    it('should handle error state', async () => {
      invokeMock.mockRejectedValue(new Error('Database error'));

      const { result } = renderHook(() => useEmployees(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useCreateEmployee', () => {
    it('should create employee successfully', async () => {
      const newEmployee = {
        id: '3',
        name: 'Carlos Oliveira',
        pin: '9999',
        role: 'MANAGER',
      };

      invokeMock.mockResolvedValue(newEmployee);

      // Hook precisa ser implementado
      // const { result } = renderHook(() => useCreateEmployee(), {
      //   wrapper: createWrapper(),
      // });

      // await result.current.mutateAsync({
      //   name: 'Carlos Oliveira',
      //   pin: '9999',
      //   role: 'MANAGER',
      // });

      // expect(invoke).toHaveBeenCalledWith('create_employee', expect.any(Object));
    });
  });
});
