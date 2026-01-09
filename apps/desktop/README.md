# Mercearias Desktop

Sistema de Ponto de Venda (PDV) para mercearias e pequenos comercios.

![Tests](https://github.com/user/Mercearias/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/user/Mercearias/graph/badge.svg)](https://codecov.io/gh/user/Mercearias)

## Tecnologias

- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Rust, Tauri, SQLite
- **Testes:** Vitest, Playwright, Cargo Test

## Scripts

```bash
# Desenvolvimento
npm run dev

# Testes
npm run test:run          # Vitest (250+ testes)
npm run test:coverage     # Com cobertura
cargo test                # Rust (78 testes)
./scripts/run-e2e.sh      # E2E Playwright

# Build
npm run build
cargo build --release
```

## Estrutura

```
apps/desktop/
├── src/                 # Frontend React
│   ├── components/      # Componentes UI
│   │   └── tutorial/    # Sistema de Tutoriais
│   ├── hooks/           # React Query hooks
│   ├── pages/           # Paginas da aplicacao
│   └── stores/          # Zustand stores
├── src-tauri/           # Backend Rust
│   ├── src/
│   │   ├── repositories/  # Acesso a dados
│   │   └── services/      # Logica de negocio
│   └── migrations/        # SQLite migrations
└── tests/               # Testes
    ├── unit/
    ├── integration/
    └── e2e/
```

## Testes

| Categoria | Testes |
|-----------|--------|
| Stores | 54 |
| Hooks | 63 |
| Components | 70+ |
| Formatters | 51 |
| Validators | 11 |
| Integration | 12 |
| Rust | 78 |
