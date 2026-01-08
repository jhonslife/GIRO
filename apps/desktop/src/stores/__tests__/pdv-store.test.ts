/**
 * @file pdv-store.test.ts - Testes para PDV store
 */

import { usePDVStore } from '@/stores/pdv-store';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PDV Store', () => {
  beforeEach(() => {
    usePDVStore.getState().clearCart();
  });

  describe('cart operations', () => {
    const mockProduct = {
      productId: 'prod-1',
      productName: 'Arroz 5kg',
      barcode: '7891234567890',
      quantity: 2,
      unitPrice: 24.9,
      unit: 'UN',
      isWeighted: false,
    };

    it('should add item to cart', () => {
      usePDVStore.getState().addItem(mockProduct);

      const state = usePDVStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]?.productId).toBe('prod-1');
      expect(state.items[0]?.quantity).toBe(2);
    });

    it('should increment quantity for existing item', () => {
      usePDVStore.getState().addItem(mockProduct);
      usePDVStore.getState().addItem(mockProduct);

      const state = usePDVStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]?.quantity).toBe(4);
    });

    it('should remove item from cart', () => {
      usePDVStore.getState().addItem(mockProduct);
      const itemId = usePDVStore.getState().items[0]!.id;

      usePDVStore.getState().removeItem(itemId);

      const state = usePDVStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it('should update item quantity', () => {
      usePDVStore.getState().addItem(mockProduct);
      const itemId = usePDVStore.getState().items[0]!.id;

      usePDVStore.getState().updateQuantity(itemId, 5);

      const state = usePDVStore.getState();
      expect(state.items[0]?.quantity).toBe(5);
    });

    it('should remove item when quantity is 0', () => {
      usePDVStore.getState().addItem(mockProduct);
      const itemId = usePDVStore.getState().items[0]!.id;

      usePDVStore.getState().updateQuantity(itemId, 0);

      const state = usePDVStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('calculations', () => {
    it('should calculate subtotal correctly', () => {
      usePDVStore.getState().addItem({
        productId: 'prod-1',
        productName: 'Arroz',
        quantity: 2,
        unitPrice: 10.0,
        unit: 'UN',
        isWeighted: false,
      });

      usePDVStore.getState().addItem({
        productId: 'prod-2',
        productName: 'Feijão',
        quantity: 3,
        unitPrice: 5.0,
        unit: 'UN',
        isWeighted: false,
      });

      const subtotal = usePDVStore.getState().getSubtotal();
      expect(subtotal).toBe(35.0); // (2 * 10) + (3 * 5)
    });

    it('should apply discount correctly', () => {
      usePDVStore.getState().addItem({
        productId: 'prod-1',
        productName: 'Arroz',
        quantity: 1,
        unitPrice: 100.0,
        unit: 'UN',
        isWeighted: false,
      });

      usePDVStore.getState().setDiscount(10, 'Desconto promocional');

      const total = usePDVStore.getState().getTotal();
      expect(total).toBe(90.0);
    });

    it('should calculate change correctly', () => {
      usePDVStore.getState().addItem({
        productId: 'prod-1',
        productName: 'Arroz',
        quantity: 1,
        unitPrice: 50.0,
        unit: 'UN',
        isWeighted: false,
      });

      usePDVStore.getState().setAmountPaid(100);

      const change = usePDVStore.getState().getChange();
      expect(change).toBe(50.0);
    });

    it('should not allow negative total', () => {
      usePDVStore.getState().addItem({
        productId: 'prod-1',
        productName: 'Arroz',
        quantity: 1,
        unitPrice: 10.0,
        unit: 'UN',
        isWeighted: false,
      });

      usePDVStore.getState().setDiscount(20); // Desconto maior que o valor

      const total = usePDVStore.getState().getTotal();
      expect(total).toBe(0); // Não deve ser negativo
    });
  });

  describe('payment modal', () => {
    it('should open payment modal', () => {
      usePDVStore.getState().openPaymentModal();
      expect(usePDVStore.getState().isPaymentModalOpen).toBe(true);
    });

    it('should close payment modal', () => {
      usePDVStore.getState().openPaymentModal();
      usePDVStore.getState().closePaymentModal();

      const state = usePDVStore.getState();
      expect(state.isPaymentModalOpen).toBe(false);
      expect(state.selectedPaymentMethod).toBeNull();
    });

    it('should set payment method', () => {
      usePDVStore.getState().setPaymentMethod('CASH');

      const state = usePDVStore.getState();
      expect(state.paymentMethod).toBe('CASH');
      expect(state.selectedPaymentMethod).toBe('CASH');
    });
  });

  describe('clear cart', () => {
    it('should clear all cart data', () => {
      usePDVStore.getState().addItem({
        productId: 'prod-1',
        productName: 'Arroz',
        quantity: 1,
        unitPrice: 10.0,
        unit: 'UN',
        isWeighted: false,
      });
      usePDVStore.getState().setDiscount(5);
      usePDVStore.getState().setPaymentMethod('CASH');
      usePDVStore.getState().openPaymentModal();

      usePDVStore.getState().clearCart();

      const state = usePDVStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.discount).toBe(0);
      expect(state.paymentMethod).toBeNull();
      expect(state.isPaymentModalOpen).toBe(false);
    });
  });
});
