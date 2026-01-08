# 🚀 Roadmap: DevOps Agent

> **Agente:** DevOps  
> **Responsabilidade:** CI/CD, Build, Instalador, Auto-Update, Monitoramento  
> **Status:** ✅ Concluído
> **Progresso:** 25/25 tasks (100%)
> **Sprint:** 1, 5-6
> **Bloqueado Por:** -

---

## 📋 Checklist de Tasks

### 0. Setup Inicial (Sprint 1) ✅

- [x] **DEVOPS-000**: Criar estrutura de monorepo com Turborepo
- [x] **DEVOPS-000A**: Configurar workspace npm/pnpm
- [x] **DEVOPS-000B**: Criar arquivo .gitignore completo

### 1. CI/CD Pipeline (Sprint 5) ✅

- [x] **DEVOPS-001**: Criar workflow GitHub Actions `ci.yml`
- [x] **DEVOPS-002**: Configurar cache de Rust (cargo) e Node (npm)
- [x] **DEVOPS-003**: Configurar lint (ESLint + Clippy)
- [x] **DEVOPS-004**: Configurar type-check (TypeScript + Rust)
- [x] **DEVOPS-005**: Configurar testes automáticos no CI
- [x] **DEVOPS-006**: Configurar check de cobertura mínima

### 2. Build & Release (Sprint 5) ✅

- [x] **DEVOPS-007**: Configurar build Tauri para Windows x64
- [x] **DEVOPS-008**: Configurar build Tauri para Windows x86 (opcional)
- [x] **DEVOPS-009**: Criar workflow `release.yml` com tags
- [x] **DEVOPS-010**: Configurar semantic-release ou release-please
- [x] **DEVOPS-011**: Gerar changelog automático

### 3. Instalador Windows (Sprint 6) ✅

- [x] **DEVOPS-012**: Configurar NSIS via tauri.conf.json
- [x] **DEVOPS-013**: Criar ícones .ico (16, 32, 64, 128, 256px)
- [x] **DEVOPS-014**: Configurar assinatura de código (opcional)
- [x] **DEVOPS-015**: Criar installer silencioso para empresas
- [x] **DEVOPS-016**: Testar instalação em Windows 10/11

### 4. Auto-Update (Sprint 6) ✅

- [x] **DEVOPS-017**: Configurar tauri-plugin-updater
- [x] **DEVOPS-018**: Criar endpoint de update (GitHub Releases ou self-hosted)
- [x] **DEVOPS-019**: Implementar UI de notificação de update
- [x] **DEVOPS-020**: Testar ciclo completo de update

### 5. Monitoramento (Sprint 6) ✅

- [x] **DEVOPS-021**: Integrar Sentry para crash reports
- [x] **DEVOPS-022**: Configurar métricas de uso anônimas (opt-in)

---

## 📊 Métricas de Qualidade

| Métrica                   | Target | Atual |
| ------------------------- | ------ | ----- |
| Tempo de CI               | < 5min | -     |
| Tamanho do instalador     | < 30MB | -     |
| Tempo de instalação       | < 30s  | -     |
| Taxa de sucesso de update | 99%+   | -     |

---

## 🔗 Dependências

### Depende de:

- 🧪 Testing (testes devem passar para deploy)
- 🔧 Backend (código compilável)
- 🎨 Frontend (código buildável)

### Bloqueia:

- 📦 Distribuição (nada sai sem CI/CD)
- 👥 Usuários finais (instalador é requisito)

---

## 📝 Notas Técnicas

### GitHub Actions - CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          components: clippy, rustfmt

      - name: Cache Cargo
        uses: actions/cache@v4
        with:
          path: |
            ~/.cargo/registry
            ~/.cargo/git
            target
          key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}

      - name: Install dependencies
        run: npm ci

      - name: Lint (ESLint)
        run: npm run lint

      - name: Lint (Clippy)
        run: cargo clippy --all-targets -- -D warnings

      - name: Type check
        run: npm run typecheck

      - name: Test (Vitest)
        run: npm run test:coverage

      - name: Test (Rust)
        run: cargo test

  build:
    needs: lint-and-test
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup
        # ... (same as above)

      - name: Build Tauri
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### GitHub Actions - Release

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: windows-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable

      - name: Install dependencies
        run: npm ci

      - name: Build and Release
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: ${{ github.ref_name }}
          releaseName: 'Mercearias v__VERSION__'
          releaseBody: 'Veja o CHANGELOG para detalhes.'
          releaseDraft: false
          prerelease: false
```

### Tauri Config - Instalador

```json
// tauri.conf.json (parcial)
{
  "bundle": {
    "active": true,
    "targets": ["nsis", "msi"],
    "identifier": "com.arkheion.mercearias",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "windows": {
      "certificateThumbprint": null,
      "digestAlgorithm": "sha256",
      "timestampUrl": ""
    }
  },
  "plugins": {
    "updater": {
      "active": true,
      "endpoints": ["https://github.com/arkheion/mercearias/releases/latest/download/latest.json"],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY"
    }
  }
}
```

### NSIS Config

```json
// tauri.conf.json > bundle > nsis
{
  "nsis": {
    "license": "./LICENSE",
    "installerIcon": "./icons/icon.ico",
    "headerImage": "./icons/header.bmp",
    "sidebarImage": "./icons/sidebar.bmp",
    "installMode": "perMachine",
    "languages": ["PortugueseBR"],
    "displayLanguageSelector": false
  }
}
```

### Sentry Integration

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: 'production',
    release: `mercearias@${__APP_VERSION__}`,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    beforeSend(event) {
      // Remover dados sensíveis
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },
  });
}
```

---

## 🧪 Critérios de Aceite

### CI/CD

- [ ] Push em `main` roda CI automaticamente
- [ ] PR só pode ser mergeado com CI verde
- [ ] Tag `v*` cria release automaticamente

### Instalador

- [ ] .exe instala sem erros no Windows 10/11
- [ ] Atalho criado na área de trabalho
- [ ] Desinstalador funciona corretamente
- [ ] Tamanho < 30MB

### Auto-Update

- [ ] Notificação aparece quando há versão nova
- [ ] Update baixa e instala automaticamente
- [ ] App reinicia após update

---

## 📁 Estrutura de Arquivos DevOps

```
.github/
├── workflows/
│   ├── ci.yml              # Lint, test em PRs
│   ├── release.yml         # Build e release em tags
│   └── nightly.yml         # Build diário (opcional)
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
└── pull_request_template.md

scripts/
├── build-icons.sh          # Gera ícones em vários tamanhos
├── sign-windows.ps1        # Assinatura de código (opcional)
└── generate-changelog.sh   # Changelog automático
```

---

_Roadmap do Agente DevOps - Arkheion Corp_
