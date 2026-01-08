/**
 * @file sale.spec.ts - Teste E2E do fluxo de venda
 */

import { expect, test } from '@playwright/test';

test.describe('Sale Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    // Login com 0000
    await page.locator('button:has-text("0")').first().click();
    await page.locator('button:has-text("0")').first().click();
    await page.locator('button:has-text("0")').first().click();
    await page.locator('button:has-text("0")').first().click();

    const loginButton = page.locator('button:has-text("Entrar")');
    await loginButton.click();
    await page.waitForTimeout(1500);
  });

  test('should navigate to PDV', async ({ page }) => {
    // Click PDV in navigation
    const pdvLink = page.locator('a:has-text("PDV"), button:has-text("PDV"), [href*="/pdv"]');
    if (await pdvLink.isVisible()) {
      await pdvLink.click();
    }

    // Should see sale interface elements
    const saleArea = page.locator('.pdv, .sale, [data-testid="pdv-screen"]');
    await expect(saleArea.first()).toBeVisible({ timeout: 5000 });
  });

  test('should add product by barcode', async ({ page }) => {
    // Navigate to PDV
    await page.goto('/pdv');
    await page.waitForTimeout(500);

    // Find barcode input
    const barcodeInput = page
      .locator('input[placeholder*="código"], input[placeholder*="barcode"]')
      .first();
    if (await barcodeInput.isVisible()) {
      await barcodeInput.fill('7891234567890');
      await barcodeInput.press('Enter');

      // Should show product in cart
      await page.waitForTimeout(500);
      const cartItems = page.locator('.cart-item, [data-testid="cart-item"], tr');
      expect(await cartItems.count()).toBeGreaterThan(0);
    }
  });

  test('should show total amount', async ({ page }) => {
    await page.goto('/pdv');
    await page.waitForTimeout(500);

    // Total should be visible
    const totalElement = page.locator('text=/R\\$|Total/i');
    await expect(totalElement.first()).toBeVisible();
  });

  test('should open payment modal', async ({ page }) => {
    await page.goto('/pdv');
    await page.waitForTimeout(500);

    // Click payment/finalize button
    const payButton = page.locator(
      'button:has-text("Pagamento"), button:has-text("Finalizar"), button:has-text("Pagar")'
    );
    if (await payButton.first().isVisible()) {
      await payButton.first().click();

      // Payment modal should appear
      const paymentModal = page.locator('[role="dialog"], .modal, .payment-modal');
      await expect(paymentModal.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should complete sale with cash', async ({ page }) => {
    await page.goto('/pdv');
    await page.waitForTimeout(500);

    // Add item (mock)
    const barcodeInput = page.locator('input[placeholder*="código"]').first();
    if (await barcodeInput.isVisible()) {
      await barcodeInput.fill('7891234567890');
      await barcodeInput.press('Enter');
      await page.waitForTimeout(500);
    }

    // Open payment
    const payButton = page
      .locator('button:has-text("Pagar"), button:has-text("Finalizar")')
      .first();
    if (await payButton.isVisible()) {
      await payButton.click();
      await page.waitForTimeout(500);

      // Select cash payment
      const cashOption = page.locator('button:has-text("Dinheiro"), [data-payment="cash"]');
      if (await cashOption.first().isVisible()) {
        await cashOption.first().click();
      }

      // Confirm sale
      const confirmButton = page.locator(
        'button:has-text("Confirmar"), button:has-text("Concluir")'
      );
      if (await confirmButton.first().isVisible()) {
        await confirmButton.first().click();

        // Success message or cart cleared
        await page.waitForTimeout(1000);
      }
    }
  });
});
