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

    it('should update item quantity via updateItemQuantity wrapper', () => {
      usePDVStore.getState().addItem(mockProduct);
      const itemId = usePDVStore.getState().items[0]!.id;

      usePDVStore.getState().updateItemQuantity(itemId, 3);

      expect(usePDVStore.getState().items[0]?.quantity).toBe(3);
    });

    it('should remove item when quantity is 0', () => {
      usePDVStore.getState().addItem(mockProduct);
      const itemId = usePDVStore.getState().items[0]!.id;

      usePDVStore.getState().updateQuantity(itemId, 0);

      const state = usePDVStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it('should add weighted items as separate rows', () => {
      const weightedProduct = {
        productId: 'prod-w',
        productName: 'Tomate',
        quantity: 0.5,
        unitPrice: 10.0,
        unit: 'KG',
        isWeighted: true,
      };

      usePDVStore.getState().addItem(weightedProduct);
      usePDVStore.getState().addItem(weightedProduct);

      const state = usePDVStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0]?.quantity).toBe(0.5);
      expect(state.items[1]?.quantity).toBe(0.5);
    });

    it('should update item discount', () => {
      usePDVStore.getState().addItem(mockProduct);
      const itemId = usePDVStore.getState().items[0]!.id;

      usePDVStore.getState().updateItemDiscount(itemId, 5);

      const state = usePDVStore.getState();
      expect(state.items[0]?.discount).toBe(5);
    });

    it('should not update other items quantity or discount', () => {
      usePDVStore.getState().addItem(mockProduct);
      usePDVStore.getState().addItem({ ...mockProduct, productId: 'prod-2' });

      const state1 = usePDVStore.getState();
      const id1 = state1.items[0]!.id;
      const id2 = state1.items[1]!.id;

      usePDVStore.getState().updateQuantity(id1, 10);
      usePDVStore.getState().updateItemDiscount(id1, 2);

      const state2 = usePDVStore.getState();
      expect(state2.items.find((i) => i.id === id1)?.quantity).toBe(10);
      expect(state2.items.find((i) => i.id === id1)?.discount).toBe(2);
      expect(state2.items.find((i) => i.id === id2)?.quantity).toBe(mockProduct.quantity);
      expect(state2.items.find((i) => i.id === id2)?.discount).toBe(0);
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

    it('should correctly calculate subtotal with item discounts', () => {
      usePDVStore.getState().addItem({
        productId: 'prod-1',
        productName: 'Item 1',
        quantity: 1,
        unitPrice: 100.0,
        unit: 'UN',
        isWeighted: false,
      });
      const itemId = usePDVStore.getState().items[0]!.id;
      usePDVStore.getState().updateItemDiscount(itemId, 10);

      expect(usePDVStore.getState().getSubtotal()).toBe(90.0);
    });

    it('should return correct item count', () => {
      usePDVStore.getState().addItem({
        productId: 'prod-1',
        productName: 'Item 1',
        quantity: 5,
        unitPrice: 10.0,
        unit: 'UN',
        isWeighted: false,
      });
      expect(usePDVStore.getState().getItemCount()).toBe(5);
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

    it('should set selected payment method directly', () => {
      usePDVStore.getState().setSelectedPaymentMethod('DEBIT');
      expect(usePDVStore.getState().selectedPaymentMethod).toBe('DEBIT');
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

  describe('status and sessions', () => {
    it('should handle processing status', () => {
      usePDVStore.getState().setProcessing(true);
      expect(usePDVStore.getState().isProcessing).toBe(true);
    });

    it('should set last sale id', () => {
      usePDVStore.getState().setLastSaleId('sale-123');
      expect(usePDVStore.getState().lastSaleId).toBe('sale-123');
    });

    it('should set cash session', () => {
      const mockSession = { id: 'sess-1', status: 'OPEN' } as any;
      usePDVStore.getState().setCashSession(mockSession);
      expect(usePDVStore.getState().cashSession).toEqual(mockSession);
    });

    it('should reset payment state', () => {
      usePDVStore.getState().setPaymentMethod('PIX');
      usePDVStore.getState().setAmountPaid(50);
      usePDVStore.getState().openPaymentModal();

      usePDVStore.getState().resetPayment();

      const state = usePDVStore.getState();
      expect(state.paymentMethod).toBeNull();
      expect(state.amountPaid).toBe(0);
      expect(state.isPaymentModalOpen).toBe(false);
    });
  });
});
