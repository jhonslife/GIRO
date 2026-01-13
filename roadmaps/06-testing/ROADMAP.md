# 🧪 Roadmap: Testing Agent

> **Agente:** QA / Testing  
> **Responsabilidade:** Testes Unitários, Integração, E2E, Hardware Mocks  
> **Status:** ✅ Concluído
> **Progresso:** 24/24 tasks (100%)
> **Sprint:** 3-6 (paralelo)
> **Bloqueado Por:** -

---

## 📋 Checklist de Tasks

### 1. Setup de Testes (Sprint 3) ✅

- [x] **TEST-001**: Configurar Vitest no frontend React
- [x] **TEST-002**: Configurar React Testing Library
- [x] **TEST-003**: Configurar testes Rust com `cargo test`
- [x] **TEST-004**: Criar fixtures de dados de teste
- [x] **TEST-005**: Configurar banco SQLite de teste (`:memory:`)
- [x] **TEST-006**: Criar factory para geração de dados fake

### 2. Testes Unitários - Frontend (Sprint 4) ✅

- [x] **TEST-007**: Testes de componentes UI (Button, Input, Card, etc)
- [x] **TEST-008**: Testes de hooks customizados
- [x] **TEST-009**: Testes de formatadores (moeda, data, peso)
- [x] **TEST-010**: Testes de validadores (EAN-13, CPF, etc)
- [x] **TEST-011**: Testes de Zustand stores

### 3. Testes Unitários - Backend (Sprint 4) ✅

- [x] **TEST-012**: Testes de models Rust
- [x] **TEST-013**: Testes de repositories (queries SQL)
- [x] **TEST-014**: Testes de services (business logic)
- [x] **TEST-015**: Testes de commands Tauri

### 4. Mocks de Hardware (Sprint 4) ✅

- [x] **TEST-016**: Mock de impressora ESC/POS (log de bytes)
- [x] **TEST-017**: Mock de balança serial (peso fake)
- [x] **TEST-018**: Mock de scanner WebSocket
- [x] **TEST-019**: Modo demo com hardware virtual

### 5. Testes de Integração (Sprint 5) ✅

- [x] **TEST-020**: Teste fluxo completo de venda
- [x] **TEST-021**: Teste abertura/fechamento de caixa
- [x] **TEST-022**: Teste backup e restore

### 6. Testes E2E (Sprint 6) ✅

- [x] **TEST-023**: Configurar Playwright para Tauri
- [x] **TEST-024**: Testes E2E do fluxo crítico (login → venda → fechamento)

---

## 📊 Métricas de Qualidade

| Métrica                   | Target | Atual |
| ------------------------- | ------ | ----- |
| Cobertura Unit (Frontend) | 80%    | 0%    |
| Cobertura Unit (Backend)  | 80%    | 0%    |
| Testes E2E passando       | 100%   | 0%    |
| Tempo de CI               | < 5min | -     |

---

## 🔗 Dependências

### Depende de
- 🔧 Backend (código para testar)
- 🎨 Frontend (componentes para testar)
- 🔌 Integrations (hardware para mockar)

### Bloqueia
- 🚀 DevOps (CI precisa de testes)
- 📦 Deploy (não deploya com testes falhando)

---

## 📝 Notas Técnicas

### Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/'],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
```text
### Rust Test Config

```rust
// src/lib.rs
#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::sqlite::SqlitePoolOptions;

    async fn setup_test_db() -> SqlitePool {
        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect(":memory:")
            .await
            .unwrap();

        // Run migrations
        sqlx::migrate!("./migrations")
            .run(&pool)
            .await
            .unwrap();

        pool
    }

    #[tokio::test]
    async fn test_create_product() {
        let pool = setup_test_db().await;
        // ...test logic
    }
}
```text
### Factory Pattern para Dados de Teste

```typescript
// tests/factories/product.factory.ts
import { faker } from '@faker-js/faker/locale/pt_BR';

export const createProductData = (overrides = {}) => ({
  barcode: faker.string.numeric(13),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  costPrice: faker.number.float({ min: 1, max: 100, precision: 0.01 }),
  salePrice: faker.number.float({ min: 5, max: 200, precision: 0.01 }),
  stock: faker.number.int({ min: 0, max: 1000 }),
  minStock: faker.number.int({ min: 1, max: 50 }),
  unit: faker.helpers.arrayElement(['UN', 'KG', 'L', 'PCT']),
  ...overrides,
});

export const createSaleData = (overrides = {}) => ({
  employeeId: faker.string.uuid(),
  items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
    productId: faker.string.uuid(),
    quantity: faker.number.float({ min: 0.1, max: 10, precision: 0.001 }),
    unitPrice: faker.number.float({ min: 1, max: 100, precision: 0.01 }),
  })),
  paymentMethod: faker.helpers.arrayElement(['money', 'pix', 'credit', 'debit']),
  ...overrides,
});
```text
### Mock de Impressora

```rust
// tests/mocks/printer_mock.rs
use std::sync::{Arc, Mutex};

pub struct MockPrinter {
    pub printed_bytes: Arc<Mutex<Vec<u8>>>,
}

impl MockPrinter {
    pub fn new() -> Self {
        Self {
            printed_bytes: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub fn print(&self, data: &[u8]) {
        self.printed_bytes.lock().unwrap().extend_from_slice(data);
    }

    pub fn get_printed(&self) -> Vec<u8> {
        self.printed_bytes.lock().unwrap().clone()
    }

    pub fn contains_text(&self, text: &str) -> bool {
        let printed = self.get_printed();
        let printed_str = String::from_utf8_lossy(&printed);
        printed_str.contains(text)
    }
}
```text
### Playwright para Tauri

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'tauri://localhost',
  },
  projects: [
    {
      name: 'tauri',
      use: {
        // Tauri uses WebKitGTK on Linux
        browserName: 'webkit',
      },
    },
  ],
});
```text
---

## 🧪 Critérios de Aceite

### Setup

- [ ] `npm run test` executa todos os testes
- [ ] `cargo test` executa todos os testes Rust
- [ ] CI falha se cobertura < 80%

### Unitários

- [ ] Cada componente tem pelo menos 1 teste
- [ ] Cada service tem testes de happy path e edge cases
- [ ] Mocks funcionam identicamente ao hardware real

### E2E

- [ ] Fluxo login → venda → fechamento passa
- [ ] Teste roda em < 2 minutos
- [ ] Screenshots capturados em falha

---

## 📁 Estrutura de Arquivos de Teste

```text
tests/
├── setup.ts                    # Setup global (jsdom, mocks)
├── factories/
│   ├── product.factory.ts
│   ├── sale.factory.ts
│   ├── employee.factory.ts
│   └── index.ts
├── mocks/
│   ├── printer.mock.ts
│   ├── scale.mock.ts
│   ├── scanner.mock.ts
│   └── tauri.mock.ts
├── unit/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   └── utils/
├── integration/
│   ├── sale.flow.test.ts
│   └── cash.flow.test.ts
└── e2e/
    ├── login.spec.ts
    ├── sale.spec.ts
    └── reports.spec.ts
```text
---

_Roadmap do Agente Testing - Arkheion Corp_