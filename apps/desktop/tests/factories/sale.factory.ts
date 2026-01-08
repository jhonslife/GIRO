/**
 * @file sale.factory.ts - Factory para geração de dados de venda
 */

let saleCounter = 1;

export const createSaleData = (overrides: Partial<SaleData> = {}): SaleData => ({
  id: `sale-${String(saleCounter++).padStart(6, '0')}`,
  subtotal: 0,
  discount: 0,
  total: 0,
  paymentMethod: randomElement(['CASH', 'PIX', 'CREDIT', 'DEBIT']),
  amountPaid: 0,
  changeAmount: 0,
  status: 'COMPLETED',
  sessionId: 'session-001',
  employeeId: 'emp-001',
  createdAt: new Date().toISOString(),
  items: [],
  ...overrides,
});

export const createSaleItemData = (overrides: Partial<SaleItem> = {}): SaleItem => ({
  id: `item-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  quantity: randomFloat(0.5, 5),
  unitPrice: randomFloat(2, 50),
  discount: 0,
  total: 0,
  saleId: '',
  productId: `prod-${String(Math.floor(Math.random() * 100)).padStart(5, '0')}`,
  ...overrides,
});

export const createCompleteSale = (itemCount: number = 3): SaleData => {
  const items = Array.from({ length: itemCount }, () => {
    const item = createSaleItemData();
    item.total = Math.round(item.quantity * item.unitPrice * 100) / 100;
    return item;
  });

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discount = Math.random() > 0.7 ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const total = Math.round((subtotal - discount) * 100) / 100;
  const amountPaid = Math.ceil(total);
  const changeAmount = Math.round((amountPaid - total) * 100) / 100;

  return createSaleData({
    items,
    subtotal,
    discount,
    total,
    amountPaid,
    changeAmount,
  });
};

interface SaleData {
  id: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  changeAmount: number;
  status: string;
  sessionId: string;
  employeeId: string;
  createdAt: string;
  items: SaleItem[];
}

interface SaleItem {
  id: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  saleId: string;
  productId: string;
}

function randomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
