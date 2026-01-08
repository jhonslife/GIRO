/**
 * @file sale.flow.test.ts - Teste de integração do fluxo de venda
 */

import { useAuthStore } from '@/stores/auth-store';
import { usePDVStore } from '@/stores/pdv-store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createProduct } from '../factories/product.factory';

// Mock Tauri invoke
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn((cmd: string) => {
    if (cmd === 'create_sale') {
      return Promise.resolve({ id: 'sale-test-001', status: 'COMPLETED' });
    }
    return Promise.resolve(null);
  }),
}));

describe('Sale Flow Integration', () => {
  beforeEach(() => {
    // Reset stores
    useAuthStore.getState().logout();
    usePDVStore.getState().clearCart();
  });

  describe('Complete sale flow', () => {
    it('should add products to cart', () => {
      const product = createProduct({ salePrice: 10 });

      usePDVStore.getState().addItem({
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        quantity: 2,
        unitPrice: product.salePrice,
        unit: product.unit,
        isWeighted: false,
      });

      const state = usePDVStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0]?.quantity).toBe(2);
      expect(state.getSubtotal()).toBe(20);
    });

    it('should calculate totals correctly', () => {
      const product1 = createProduct({ salePrice: 10 });
      const product2 = createProduct({ salePrice: 15.5 });

      usePDVStore.getState().addItem({
        productId: product1.id,
        productName: product1.name,
        barcode: product1.barcode,
        quantity: 2,
        unitPrice: product1.salePrice,
        unit: product1.unit,
        isWeighted: false,
      });

      usePDVStore.getState().addItem({
        productId: product2.id,
        productName: product2.name,
        barcode: product2.barcode,
        quantity: 1,
        unitPrice: product2.salePrice,
        unit: product2.unit,
        isWeighted: false,
      });

      const state = usePDVStore.getState();
      expect(state.getSubtotal()).toBe(35.5);
      expect(state.getTotal()).toBe(35.5);
    });

    it('should apply discount', () => {
      const product = createProduct({ salePrice: 100 });

      usePDVStore.getState().addItem({
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        quantity: 1,
        unitPrice: product.salePrice,
        unit: product.unit,
        isWeighted: false,
      });

      usePDVStore.getState().setDiscount(10);

      const state = usePDVStore.getState();
      expect(state.discount).toBe(10);
      expect(state.getTotal()).toBe(90);
    });

    it('should calculate change', () => {
      const product = createProduct({ salePrice: 27.5 });

      usePDVStore.getState().addItem({
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        quantity: 1,
        unitPrice: product.salePrice,
        unit: product.unit,
        isWeighted: false,
      });

      usePDVStore.getState().setAmountPaid(30);

      const state = usePDVStore.getState();
      expect(state.amountPaid).toBe(30);
      expect(state.getChange()).toBe(2.5);
    });

    it('should clear cart after sale', () => {
      const product = createProduct({ salePrice: 10 });

      usePDVStore.getState().addItem({
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        quantity: 1,
        unitPrice: product.salePrice,
        unit: product.unit,
        isWeighted: false,
      });

      expect(usePDVStore.getState().items.length).toBe(1);

      usePDVStore.getState().clearCart();

      const state = usePDVStore.getState();
      expect(state.items.length).toBe(0);
      expect(state.getSubtotal()).toBe(0);
      expect(state.getTotal()).toBe(0);
    });
  });

  describe('Weighted products', () => {
    it('should handle weighted items correctly', () => {
      const product = createProduct({
        salePrice: 29.9,
        unit: 'KILOGRAM',
      });

      usePDVStore.getState().addItem({
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        quantity: 0.55, // 550g
        unitPrice: product.salePrice,
        unit: product.unit,
        isWeighted: true,
      });

      const state = usePDVStore.getState();
      const expectedTotal = Math.round(0.55 * 29.9 * 100) / 100;
      // item total calculation
      const item = state.items[0];
      if (item) {
        const itemTotal = item.quantity * item.unitPrice - item.discount;
        expect(itemTotal).toBeCloseTo(expectedTotal, 2);
      }
    });
  });
});
