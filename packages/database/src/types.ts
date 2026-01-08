// ════════════════════════════════════════════════════════════════════════════
// MERCEARIAS - Custom Types para o Database
// ════════════════════════════════════════════════════════════════════════════

import type {
  Product,
  ProductLot,
  Category,
  Sale,
  SaleItem,
  Employee,
  CashSession,
  Supplier,
  Alert,
  StockMovement,
  PriceHistory,
  Setting,
  CashMovement,
  AuditLog,
} from '@prisma/client';

// ════════════════════════════════════════════════════════════════════════════
// PRODUCT TYPES
// ════════════════════════════════════════════════════════════════════════════

/** Produto com categoria incluída */
export type ProductWithCategory = Product & {
  category: Category;
};

/** Produto com lotes disponíveis */
export type ProductWithLots = Product & {
  lots: ProductLot[];
};

/** Produto completo com todas as relações */
export type ProductFull = Product & {
  category: Category;
  lots: ProductLot[];
};

/** Input para criação de produto */
export interface CreateProductInput {
  name: string;
  categoryId: string;
  salePrice: number;
  barcode?: string;
  description?: string;
  unit?: string;
  isWeighted?: boolean;
  costPrice?: number;
  currentStock?: number;
  minStock?: number;
}

/** Input para atualização de produto */
export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

/** Resultado de busca de produto no PDV */
export interface ProductSearchResult {
  id: string;
  barcode: string | null;
  internalCode: string;
  name: string;
  salePrice: number;
  currentStock: number;
  unit: string;
  isWeighted: boolean;
  categoryName: string;
  categoryColor: string;
}

// ════════════════════════════════════════════════════════════════════════════
// SALE TYPES
// ════════════════════════════════════════════════════════════════════════════

/** Venda com itens incluídos */
export type SaleWithItems = Sale & {
  items: SaleItem[];
};

/** Venda completa com todas as relações */
export type SaleFull = Sale & {
  items: (SaleItem & {
    product: Product;
    lot: ProductLot | null;
  })[];
  employee: Employee;
  cashSession: CashSession;
};

/** Item do carrinho (antes de finalizar venda) */
export interface CartItem {
  id: string; // Temporário para o carrinho
  productId: string;
  productName: string;
  productBarcode: string | null;
  productUnit: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  lotId?: string;
}

/** Input para finalizar venda */
export interface FinalizeSaleInput {
  items: CartItem[];
  paymentMethod: string;
  amountPaid: number;
  discountType?: string;
  discountValue?: number;
  discountReason?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// CASH SESSION TYPES
// ════════════════════════════════════════════════════════════════════════════

/** Sessão de caixa com vendas e movimentações */
export type CashSessionFull = CashSession & {
  sales: Sale[];
  movements: CashMovement[];
  employee: Employee;
};

/** Resumo de fechamento de caixa */
export interface CashSessionSummary {
  id: string;
  openedAt: Date;
  closedAt: Date | null;
  openingBalance: number;
  salesCount: number;
  salesTotal: number;
  cashSales: number;
  pixSales: number;
  otherSales: number;
  withdrawals: number;
  supplies: number;
  expectedBalance: number;
  actualBalance: number | null;
  difference: number | null;
}

// ════════════════════════════════════════════════════════════════════════════
// STOCK TYPES
// ════════════════════════════════════════════════════════════════════════════

/** Input para movimentação de estoque */
export interface StockMovementInput {
  productId: string;
  type: string;
  quantity: number;
  reason?: string;
  referenceId?: string;
  referenceType?: string;
  employeeId?: string;
}

/** Lote com produto */
export type LotWithProduct = ProductLot & {
  product: Product;
};

/** Input para entrada de lote */
export interface CreateLotInput {
  productId: string;
  quantity: number;
  costPrice: number;
  expirationDate?: Date;
  lotNumber?: string;
  supplierId?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// ALERT TYPES
// ════════════════════════════════════════════════════════════════════════════

/** Alerta com produto e lote */
export type AlertFull = Alert & {
  product: Product | null;
  lot: ProductLot | null;
};

/** Contagem de alertas por tipo */
export interface AlertCounts {
  total: number;
  unread: number;
  critical: number;
  warning: number;
  info: number;
}

// ════════════════════════════════════════════════════════════════════════════
// EMPLOYEE TYPES
// ════════════════════════════════════════════════════════════════════════════

/** Funcionário sem dados sensíveis */
export type EmployeeSafe = Omit<Employee, 'pin' | 'password'>;

/** Input para autenticação */
export interface AuthInput {
  pin?: string;
  password?: string;
}

/** Resultado de autenticação */
export interface AuthResult {
  success: boolean;
  employee?: EmployeeSafe;
  error?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// REPORT TYPES
// ════════════════════════════════════════════════════════════════════════════

/** Resumo diário de vendas */
export interface DailySalesSummary {
  date: string;
  salesCount: number;
  total: number;
  cash: number;
  pix: number;
  other: number;
  averageTicket: number;
  itemsSold: number;
}

/** Ranking de produtos */
export interface ProductRanking {
  productId: string;
  productName: string;
  categoryName: string;
  quantity: number;
  revenue: number;
  profit: number;
}

/** Produtos com estoque baixo */
export interface LowStockProduct {
  id: string;
  name: string;
  internalCode: string;
  currentStock: number;
  minStock: number;
  deficit: number;
  lastSaleDate: Date | null;
}

/** Produtos próximos do vencimento */
export interface ExpiringProduct {
  productId: string;
  productName: string;
  lotId: string;
  lotNumber: string | null;
  expirationDate: Date;
  daysUntilExpiration: number;
  quantity: number;
}

// ════════════════════════════════════════════════════════════════════════════
// SETTINGS TYPES
// ════════════════════════════════════════════════════════════════════════════

/** Configurações tipadas por grupo */
export interface AppSettings {
  company: {
    name: string;
    cnpj: string;
    address: string;
    phone: string;
  };
  pdv: {
    autoPrintReceipt: boolean;
    autoOpenDrawer: boolean;
    allowSaleZeroStock: boolean;
    beepOnScan: boolean;
  };
  printer: {
    enabled: boolean;
    type: 'epson' | 'elgin' | 'bematech' | 'daruma';
    connection: 'usb' | 'serial' | 'network';
    port: string;
    width: number;
  };
  scale: {
    enabled: boolean;
    type: 'toledo' | 'filizola' | 'elgin';
    port: string;
  };
  alerts: {
    expirationCriticalDays: number;
    expirationWarningDays: number;
    expirationNoticeDays: number;
  };
  backup: {
    autoEnabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string;
    keepDays: number;
    gdriveEnabled: boolean;
  };
  discount: {
    maxCashier: number;
    maxManager: number;
  };
  theme: {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
  };
}

// ════════════════════════════════════════════════════════════════════════════
// PAGINATION TYPES
// ════════════════════════════════════════════════════════════════════════════

/** Parâmetros de paginação */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Resultado paginado */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
