/**
 * @file Hooks Index
 * @description Exporta todos os hooks personalizados
 */

// Cash Session
export {
  useAddCashMovement,
  useCashSession,
  useCloseCashSession,
  useOpenCashSession,
} from './use-cash-session';

// Keyboard
export { PDV_SHORTCUTS, useKeyboard, usePDVKeyboard } from './use-keyboard';

// Employees
export { useCreateEmployee, useEmployees, useUpdateEmployee } from './useEmployees';

// Dashboard
export { useDashboardStats } from './useDashboard';

// Products
export {
  useCreateProduct,
  useDeleteProduct,
  useProduct,
  useProductByBarcode,
  useProductSearch,
  useProducts,
  useUpdateProduct,
} from './use-products';

// Toast
export { toast, useToast } from './use-toast';

// Categories
export * from './useCategories';

// Sales
export * from './useSales';

// Stock
export * from './useStock';

// Alerts
export * from './useAlerts';
