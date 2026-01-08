/**
 * @file tauri.mock.ts - Mock do Tauri API para testes
 */

import { vi } from 'vitest';

type InvokeHandler = (cmd: string, args?: Record<string, unknown>) => unknown;

let invokeHandler: InvokeHandler = () => undefined;

export const setInvokeHandler = (handler: InvokeHandler) => {
  invokeHandler = handler;
};

export const mockInvoke = vi.fn((cmd: string, args?: Record<string, unknown>) => {
  return Promise.resolve(invokeHandler(cmd, args));
});

export const resetTauriMocks = () => {
  mockInvoke.mockClear();
  invokeHandler = () => undefined;
};

// Mock responses for common commands
export const mockTauriCommands = {
  get_products: () => [],
  get_product: () => null,
  create_product: (args: unknown) => ({ id: 'new-product', ...(args as object) }),
  update_product: (args: unknown) => args,
  delete_product: () => ({ success: true }),

  get_employees: () => [],
  login_with_pin: (args: { pin: string }) =>
    args.pin === '0000'
      ? {
          id: 'admin',
          name: 'Admin',
          role: 'ADMIN',
          pin: '0000',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : null,

  open_cash_session: () => ({
    id: 'session-001',
    openedAt: new Date().toISOString(),
    status: 'OPEN',
  }),
  close_cash_session: () => ({
    id: 'session-001',
    closedAt: new Date().toISOString(),
    status: 'CLOSED',
  }),

  create_sale: (args: unknown) => ({ id: 'sale-001', ...(args as object) }),
  get_sales: () => [],

  get_settings: () => ({}),
  update_settings: (args: unknown) => args,
};

export const setupTauriMock = () => {
  setInvokeHandler((cmd, args) => {
    const handler = mockTauriCommands[cmd as keyof typeof mockTauriCommands];
    if (handler) return handler(args as never);
    console.warn(`No mock handler for command: ${cmd}`);
    return null;
  });
};
