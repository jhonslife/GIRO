import type { Page } from '@playwright/test';

export const dismissTutorialIfPresent = async (page: Page): Promise<void> => {
  const skipButton = page.getByRole('button', { name: /Pular/i }).first();
  if (await skipButton.isVisible().catch(() => false)) {
    await skipButton.click();
    await page.waitForLoadState('domcontentloaded');
  }
};

export const loginWithPin = async (page: Page, pin: string): Promise<void> => {
  for (const digit of pin.split('')) {
    await page.locator(`button:has-text("${digit}")`).first().click();
  }

  await page.locator('button:has-text("Entrar")').first().click();

  await page
    .waitForURL(/\/(dashboard|pdv|cash|stock)/, {
      timeout: 15000,
    })
    .catch(() => undefined);

  await page.waitForLoadState('domcontentloaded');
  await dismissTutorialIfPresent(page);
};

export const ensureLoggedIn = async (page: Page, pin: string): Promise<void> => {
  const pinPrompt = page.getByText(/Digite seu PIN/i).first();
  if (await pinPrompt.isVisible().catch(() => false)) {
    await loginWithPin(page, pin);
  }
};

export const ensureCashOpen = async (page: Page): Promise<void> => {
  const startUrl = page.url();

  await dismissTutorialIfPresent(page);

  const cashClosedHeading = page.getByRole('heading', { name: 'Caixa Fechado' }).first();
  const isCashClosed = await cashClosedHeading.isVisible().catch(() => false);
  if (!isCashClosed) return;

  const openButton = page.getByRole('button', { name: 'Abrir Caixa' }).first();
  await openButton.click();

  await page.waitForURL(/\/cash/, { timeout: 10000 }).catch(() => undefined);
  await page.waitForLoadState('domcontentloaded');
  await dismissTutorialIfPresent(page);

  const dialog = page.getByRole('dialog', { name: /Abrir Caixa/i });

  // No PDV, o botão apenas navega para /cash; no /cash, é necessário clicar novamente para abrir o dialog.
  if (!(await dialog.isVisible().catch(() => false))) {
    const openButtonOnCash = page.getByRole('button', { name: 'Abrir Caixa' }).first();
    if (await openButtonOnCash.isVisible().catch(() => false)) {
      await openButtonOnCash.click();
    }
  }

  await dialog.waitFor({ state: 'visible', timeout: 10000 });

  const initialInput = dialog.locator('input').first();
  await initialInput.fill('100');

  const confirmButton = dialog.getByRole('button', { name: /Abrir/i }).last();
  await confirmButton.click();

  await dialog.waitFor({ state: 'hidden', timeout: 10000 });
  await page.waitForLoadState('domcontentloaded');

  // Se abrimos o caixa vindo do PDV, voltamos para o PDV para manter o teste no fluxo esperado.
  if (startUrl.includes('/pdv')) {
    await page.goto('/pdv');
    await page.waitForLoadState('domcontentloaded');
    await dismissTutorialIfPresent(page);
  }
};
