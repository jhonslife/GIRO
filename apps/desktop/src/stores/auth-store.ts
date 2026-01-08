import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EmployeeRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'VIEWER';

export const PERMISSIONS = {
  // PDV
  'pdv.sell': ['ADMIN', 'MANAGER', 'CASHIER'],
  'pdv.discount.basic': ['ADMIN', 'MANAGER', 'CASHIER'],
  'pdv.discount.advanced': ['ADMIN', 'MANAGER'],
  'pdv.discount.unlimited': ['ADMIN'],
  'pdv.cancel.current': ['ADMIN', 'MANAGER', 'CASHIER'],
  'pdv.cancel.completed': ['ADMIN', 'MANAGER'],

  // Caixa
  'cash.open': ['ADMIN', 'MANAGER', 'CASHIER'],
  'cash.close': ['ADMIN', 'MANAGER', 'CASHIER'],

  // Settings
  'settings.view': ['ADMIN', 'MANAGER'],
  'settings.edit': ['ADMIN'],
  'settings.backup': ['ADMIN'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  email?: string;
  username?: string;
  pin?: string;
}

// Legacy alias for compatibility
export type CurrentUser = Employee;

export interface CashSession {
  id: string;
  employeeId: string;
  employeeName?: string;
  openedAt: string;
  closedAt?: string;
  openingBalance: number;
  closingBalance?: number;
  status: 'OPEN' | 'CLOSED' | 'FORCED';
}

interface AuthState {
  // Estado do usuário
  employee: Employee | null;
  currentEmployee: Employee | null; // alias for compatibility
  currentUser: Employee | null; // deprecated alias
  currentSession: CashSession | null;
  isAuthenticated: boolean;

  // Ações de autenticação
  login: (user: Employee) => void;
  logout: () => void;

  // Ações de sessão de caixa
  openCashSession: (session: CashSession) => void;
  closeCashSession: () => void;

  // Verificações de permissão
  hasPermission: (permission: Permission | EmployeeRole) => boolean;
  canDiscount: (percentage: number) => boolean;
  canCancelSale: () => boolean;
}

const roleHierarchy: Record<EmployeeRole, number> = {
  VIEWER: 0,
  CASHIER: 1,
  MANAGER: 2,
  ADMIN: 3,
};

const discountLimits: Record<EmployeeRole, number> = {
  VIEWER: 0,
  CASHIER: 5,
  MANAGER: 20,
  ADMIN: 100,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      employee: null,
      currentEmployee: null,
      currentUser: null,
      currentSession: null,
      isAuthenticated: false,

      login: (user) => {
        set({
          employee: user,
          currentEmployee: user,
          currentUser: user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          employee: null,
          currentUser: null,
          currentSession: null,
          isAuthenticated: false,
        });
      },

      openCashSession: (session) => {
        set({ currentSession: session });
      },

      closeCashSession: () => {
        set((state) => ({
          currentSession: state.currentSession
            ? { ...state.currentSession, status: 'CLOSED', closedAt: new Date().toISOString() }
            : null,
        }));
      },

      hasPermission: (required) => {
        const { employee } = get();
        if (!employee) return false;

        // Check if it's a Permission key
        if (typeof required === 'string' && required in PERMISSIONS) {
          const allowedRoles = PERMISSIONS[required as Permission];
          // Zustand middleware types are complex - simple role check

          return (allowedRoles as readonly EmployeeRole[]).includes(employee.role);
        }

        // Check if it's a direct role comparison (legacy support)
        const role = required as EmployeeRole;
        return roleHierarchy[employee.role] >= roleHierarchy[role];
      },

      canDiscount: (percentage) => {
        const { employee } = get();
        if (!employee) return false;
        return percentage <= discountLimits[employee.role];
      },

      canCancelSale: () => {
        const { employee } = get();
        if (!employee) return false;
        return roleHierarchy[employee.role] >= roleHierarchy.MANAGER;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        employee: state.employee,
        currentUser: state.employee,
        currentSession: state.currentSession,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
