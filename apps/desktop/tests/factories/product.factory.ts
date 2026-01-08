import { Product } from '@/types';

export const createProduct = (overrides: Partial<Product> = {}): Product => {
  return {
    id: crypto.randomUUID(),
    name: 'Test Product',
    description: 'A test product description',
    barcode: '7891234567895',
    internalCode: 'P0001',
    salePrice: 10.0,
    costPrice: 5.0,
    currentStock: 100,
    minStock: 10,
    unit: 'UNIT',
    isWeighted: false,
    categoryId: 'cat-001',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
};

export const createProductData = createProduct;
