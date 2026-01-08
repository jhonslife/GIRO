# 🧪 Status de Testes E2E - Mercearias

> **Data:** 7 de Janeiro de 2026  
> **Status:** 🔄 Em Implementação  
> **Progresso:** 20/24 tasks (83%)

---

## 📊 Resumo da Execução de Testes

### ✅ Testes Passando (51/58 - 88%)

#### Unitários (45/45)

- ✅ **Formatadores** (14 testes) - formatação de moeda, data, peso
- ✅ **Validadores** (11 testes) - EAN-13, CPF, CNPJ
- ✅ **Auth Store** (7 testes) - login, logout, permissões
- ✅ **PDV Store** (13 testes) - carrinho, totais, desconto

#### Integração (6/13)

- ✅ Cash Session (5/6 testes)

  - ✅ Abertura de sessão
  - ✅ Fechamento de sessão
  - ✅ Verificação de permissões (2 testes)
  - ❌ **Rastreamento de vendas na sessão** (falha: state management)

- ❌ Sale Flow (0/6 testes) - todos falhando
  - ❌ Adicionar produtos ao carrinho
  - ❌ Calcular totais
  - ❌ Aplicar desconto
  - ❌ Calcular troco
  - ❌ Limpar carrinho
  - ❌ Produtos pesados

### ❌ Testes Falhando (7/58 - 12%)

#### Problema Principal: **State Management nos Stores**

Os testes de integração estão falhando porque o `usePDVStore` não está sendo inicializado corretamente no ambiente de teste.

**Erro comum:**

```
expected undefined to be 20
expected undefined to be 35.5
```

**Causa:** Os métodos do store retornam `undefined` ao invés dos valores esperados.

#### Testes E2E (0/0)

Os testes Playwright não estão sendo executados pelo Vitest devido a conflito de frameworks.

**Erro:**

```
Playwright Test did not expect test.describe() to be called here.
```

**Causa:** Playwright testes devem rodar separadamente com `npx playwright test`, não com Vitest.

---

## 🎯 Próximos Passos

### FASE 1: Corrigir Testes de Integração (Prioridade Alta)

**Problema:** State não persiste entre ações nos testes
**Solução:**

1. Resetar stores antes de cada teste
2. Garantir que os mocks do Tauri retornem dados válidos
3. Usar `act()` do React Testing Library para atualizações de state

### FASE 2: Separar Testes E2E do Vitest (Prioridade Alta)

**Ações:**

1. Criar script separado `test:e2e` no package.json
2. Configurar Playwright para rodar testes Tauri
3. Mover testes E2E para configuração específica

### FASE 3: Implementar Testes E2E Completos (Sprint 6)

**Fluxos Críticos:**

- [ ] E2E-001: Login com PIN
- [ ] E2E-002: Abertura de caixa
- [ ] E2E-003: Venda simples (1 produto)
- [ ] E2E-004: Venda múltipla (5+ produtos)
- [ ] E2E-005: Venda com desconto
- [ ] E2E-006: Venda com produto pesado
- [ ] E2E-007: Cancelamento de item
- [ ] E2E-008: Fechamento de caixa
- [ ] E2E-009: Cadastro de produto
- [ ] E2E-010: Entrada de estoque
- [ ] E2E-011: Relatório de vendas
- [ ] E2E-012: Backup de dados

### FASE 4: Testes de Hardware (Mock) (Sprint 6)

**Dispositivos:**

- [ ] HW-001: Impressora térmica ESC/POS
- [ ] HW-002: Balança serial Toledo
- [ ] HW-003: Scanner de código de barras
- [ ] HW-004: Gaveta de dinheiro
- [ ] HW-005: Scanner mobile (WebSocket)

---

## 🔧 Correções Necessárias

### 1. Configuração de Testes

**Arquivo:** `vitest.config.ts`

```typescript
// Excluir testes E2E do Vitest
export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/e2e/**', // ← Adicionar esta linha
    ],
  },
});
```

**Arquivo:** `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run --exclude tests/e2e",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### 2. Setup de Mocks Tauri

**Arquivo:** `tests/setup.ts`

```typescript
import { vi } from 'vitest';

// Mock completo do Tauri
global.__TAURI_INTERNALS__ = {
  invoke: vi.fn(),
};

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn((cmd, args) => {
    // Retornar dados mockados por comando
    const mocks = {
      get_products: () => Promise.resolve([]),
      create_sale: () => Promise.resolve({ id: 1 }),
      // ... outros mocks
    };
    return mocks[cmd]?.(args) || Promise.resolve(null);
  }),
}));
```

### 3. Factory de Dados

**Criar:** `tests/factories/product.factory.ts`

```typescript
export const createMockProduct = (overrides = {}) => ({
  id: 1,
  name: 'Produto Teste',
  barcode: '7891234567890',
  price: 10.5,
  stock: 100,
  unit: 'UN',
  ...overrides,
});
```

---

## 📋 Estrutura Ideal de Testes

```
tests/
├── unit/                    ✅ 45 testes passando
│   ├── utils/
│   │   ├── formatters.test.ts
│   │   └── validators.test.ts
│   └── stores/
│       ├── auth-store.test.ts
│       └── pdv-store.test.ts
│
├── integration/             ⚠️ 6/13 testes passando
│   ├── sale.flow.test.ts   (CORRIGIR)
│   └── cash.flow.test.ts   (CORRIGIR 1 teste)
│
├── e2e/                     🔄 A implementar
│   ├── auth.spec.ts
│   ├── cash-session.spec.ts
│   ├── sale-simple.spec.ts
│   ├── sale-advanced.spec.ts
│   ├── products.spec.ts
│   ├── stock.spec.ts
│   ├── reports.spec.ts
│   └── hardware.spec.ts
│
├── mocks/                   ✅ Básico pronto
│   ├── tauri.ts
│   ├── hardware/
│   │   ├── printer.ts
│   │   ├── scale.ts
│   │   └── scanner.ts
│   └── data/
│       └── seed.ts
│
├── factories/               🔄 A expandir
│   ├── product.factory.ts
│   ├── employee.factory.ts
│   ├── sale.factory.ts
│   └── cash.factory.ts
│
└── setup.ts                 ✅ Configurado
```

---

## 🎯 Métricas de Cobertura Desejadas

| Categoria          | Meta | Atual | Status |
| ------------------ | ---- | ----- | ------ |
| Stores             | >90% | 100%  | ✅     |
| Utils              | >90% | 100%  | ✅     |
| Services (Rust)    | >80% | ~70%  | ⚠️     |
| Components         | >70% | ~40%  | ⚠️     |
| E2E Critical Paths | 100% | 0%    | ❌     |

---

## 📝 Comandos Úteis

```bash
# Executar todos os testes unitários + integração
npm run test:run

# Executar com cobertura
npm run test:coverage

# Executar testes E2E (após correção)
npm run test:e2e

# Executar testes E2E com UI
npm run test:e2e:ui

# Executar apenas testes de um arquivo
npx vitest run tests/unit/utils/formatters.test.ts

# Executar testes em modo watch
npm run test
```

---

## 🚀 Timeline de Implementação

### Semana 1 (Atual)

- [x] Análise do estado atual
- [x] Identificação de problemas
- [ ] Correção de testes de integração
- [ ] Separação de testes E2E

### Semana 2

- [ ] Implementar 12 testes E2E críticos
- [ ] Configurar CI/CD para rodar testes
- [ ] Mocks de hardware completos
- [ ] Cobertura >80% nos services Rust

### Semana 3

- [ ] Testes de performance
- [ ] Testes de acessibilidade
- [ ] Documentação de testes
- [ ] Release Candidate

---

_Atualizado automaticamente - QA Agent_
