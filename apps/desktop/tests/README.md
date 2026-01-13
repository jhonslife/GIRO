# 🧪 Guia de Testes - Mercearias Desktop

> **Cobertura Atual:** 51/58 testes passando (88%)  
> **E2E Criados:** 8 arquivos, 60+ testes  
> **Última Atualização:** 7 de Janeiro de 2026

---

## 📁 Estrutura

```text
tests/
├── unit/                    ✅ 45 testes passando
│   ├── utils/
│   │   ├── formatters.test.ts    (14 testes)
│   │   └── validators.test.ts    (11 testes)
│   └── stores/
│       ├── auth-store.test.ts    (7 testes)
│       └── pdv-store.test.ts     (13 testes)
│
├── integration/             ⚠️ 6/13 testes passando
│   ├── sale.flow.test.ts        (0/6 - corrigir)
│   └── cash.flow.test.ts        (6/7 - 1 falha)
│
├── e2e/                     📝 60+ testes criados
│   ├── auth.spec.ts             (10 testes)
│   ├── cash-session.spec.ts     (9 testes)
│   ├── sale-simple.spec.ts      (11 testes)
│   ├── sale-advanced.spec.ts    (10 testes)
│   ├── products.spec.ts         (7 testes)
│   ├── stock.spec.ts            (8 testes)
│   ├── hardware.spec.ts         (10 testes)
│   └── reports.spec.ts          (8 testes)
│
├── mocks/                   ✅ Estrutura criada
│   └── tauri.ts
│
├── factories/               📝 A expandir
│   └── (criar factories aqui)
│
└── setup.ts                 ✅ Configurado
```text
---

## 🚀 Como Executar

### Script Interativo (Recomendado)

```bash
# Do diretório raiz do projeto
./scripts/run-tests.sh
```text
O script oferece menu com opções:

1. Todos os testes
2. Apenas unitários
3. Apenas integração
4. Apenas E2E
5. Com cobertura
6. E2E com UI
7. Verificar setup

### Comandos Diretos

```bash
cd apps/desktop

# Todos os testes (exceto E2E)
npm run test:run

# Modo watch (desenvolvimento)
npm test

# Com cobertura
npm run test:coverage

# Apenas E2E
npm run test:e2e

# E2E com UI interativa
npm run test:e2e:ui

# E2E em modo debug
npm run test:e2e:debug
```text
### Testes Específicos

```bash
# Um arquivo específico
npm run test:run -- tests/unit/utils/formatters.test.ts

# Um teste específico
npx vitest run -t "should format currency"

# E2E específico
npx playwright test tests/e2e/auth.spec.ts

# E2E com um navegador específico
npx playwright test --project=tauri-webkit
```text
---

## 📊 Status dos Testes

### ✅ Unitários (45/45 - 100%)

| Arquivo              | Testes | Status | Descrição                       |
| -------------------- | ------ | ------ | ------------------------------- |
| `formatters.test.ts` | 14     | ✅     | Formatação de moeda, data, peso |
| `validators.test.ts` | 11     | ✅     | Validação EAN-13, CPF, CNPJ     |
| `auth-store.test.ts` | 7      | ✅     | Store de autenticação           |
| `pdv-store.test.ts`  | 13     | ✅     | Store do PDV                    |

### ⚠️ Integração (6/13 - 46%)

| Arquivo             | Testes | Status | Problema                      |
| ------------------- | ------ | ------ | ----------------------------- |
| `cash.flow.test.ts` | 6/7    | ⚠️     | 1 teste de tracking de vendas |
| `sale.flow.test.ts` | 0/6    | ❌     | State management              |

**Problema:** Stores retornam `undefined` ao invés dos valores esperados.

**Solução:** Resetar stores antes de cada teste e melhorar mocks do Tauri.

### 📝 E2E (60+ testes criados)

| Arquivo                 | Testes | Fluxos Testados                               |
| ----------------------- | ------ | --------------------------------------------- |
| `auth.spec.ts`          | 10     | Login PIN, senha, roles, logout, segurança    |
| `cash-session.spec.ts`  | 9      | Abertura, sangria, suprimento, fechamento     |
| `sale-simple.spec.ts`   | 11     | Venda básica, barcode, quantidade, pagamento  |
| `sale-advanced.spec.ts` | 10     | Desconto, pesados, múltiplos, forms pagamento |
| `products.spec.ts`      | 7      | CRUD, busca, filtros, detalhes                |
| `stock.spec.ts`         | 8      | Entrada, saída, ajuste, baixo estoque         |
| `hardware.spec.ts`      | 10     | Impressora, balança, scanner, gaveta          |
| `reports.spec.ts`       | 8      | Vendas, lucro, gráficos, exportação           |

**Status:** Criados mas ainda não executados (configuração Playwright pendente).

---

## 🔧 Configuração

### Vitest (Unitários + Integração)

**Arquivo:** `vitest.config.ts`

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    exclude: ['tests/e2e/**'], // E2E separado
    coverage: {
      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
        statements: 70,
      },
    },
  },
});
```text
### Playwright (E2E)

**Arquivo:** `playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'tauri://localhost',
  },
  projects: [
    {
      name: 'tauri-webkit',
      use: { browserName: 'webkit' },
    },
  ],
});
```text
---

## 🐛 Problemas Conhecidos

### 1. Testes de Integração Falhando
## Erro:
```text
expected undefined to be 20
```text
**Causa:** Store Zustand não está sendo inicializado corretamente.
## Fix:
```typescript
// tests/setup.ts
beforeEach(() => {
  usePDVStore.getState().reset();
  useAuthStore.getState().logout();
});
```text
### 2. E2E não roda pelo Vitest
## Erro: (cont.)
```text
Playwright Test did not expect test.describe() to be called here
```text
**Fix:** Testes E2E devem rodar com `npx playwright test`, não com Vitest.

### 3. Mocks do Tauri Incompletos

**Solução:** Expandir `tests/setup.ts` com mais comandos mockados:

```typescript
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn((cmd, args) => {
    const mocks = {
      get_products: () => Promise.resolve([createMockProduct()]),
      create_sale: (sale) => Promise.resolve({ id: 1, ...sale }),
      // ... adicionar mais
    };
    return mocks[cmd]?.(args) || Promise.resolve(null);
  }),
}));
```text
---

## 📝 Criando Novos Testes

### Teste Unitário

```typescript
// tests/unit/utils/my-util.test.ts
import { describe, expect, it } from 'vitest';
import { myFunction } from '@/lib/my-util';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```text
### Teste de Integração

```typescript
// tests/integration/my-flow.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import { useMyStore } from '@/stores/my-store';

describe('My Flow', () => {
  beforeEach(() => {
    useMyStore.getState().reset();
  });

  it('should complete flow', () => {
    const { action } = useMyStore.getState();
    action();
    expect(useMyStore.getState().value).toBe(expected);
  });
});
```text
### Teste E2E

```typescript
// tests/e2e/my-feature.spec.ts
import { expect, test } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should work', async ({ page }) => {
    await page.locator('button').click();
    await expect(page.locator('.result')).toBeVisible();
  });
});
```text
---

## 🎯 Metas de Cobertura

| Tipo            | Meta | Atual   |
| --------------- | ---- | ------- |
| Stores          | >90% | 100% ✅ |
| Utils           | >90% | 100% ✅ |
| Components      | >70% | ~40% ⚠️ |
| Services (Rust) | >80% | ~70% ⚠️ |
| Fluxos Críticos | 100% | 0% ❌   |

---

## 📚 Recursos

### Documentação

- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Tauri Testing](https://tauri.app/v1/guides/testing/)

### Exemplos

- `tests/unit/` - Exemplos de testes unitários
- `tests/integration/` - Exemplos de testes de integração
- `tests/e2e/` - Exemplos de testes E2E

---

## 🆘 Troubleshooting

### Testes não encontram módulos

```bash
# Reinstalar dependências
rm -rf node_modules
npm install
```text
### Playwright browsers não instalados

```bash
npx playwright install
```text
### Testes lentos

```bash
# Executar em paralelo
npm run test:run -- --reporter=verbose --poolOptions.threads.maxThreads=4
```text
### Database bloqueado

```bash
# Remover lock
rm ~/.local/share/Mercearias/mercearias.db-wal
```text
---

## 📞 Suporte

- **Issues:** https://github.com/arkheion/mercearias/issues
- **Discussões:** https://github.com/arkheion/mercearias/discussions
- **Email:** dev@arkheion.com

---

_Guia atualizado automaticamente - QA Team_