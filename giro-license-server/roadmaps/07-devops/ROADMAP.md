# 🚀 DevOps Roadmap - GIRO License Server

> **Agente:** DevOps & Infrastructure  
> **Sprint:** 1, 4  
> **Dependências:** Nenhuma  
> **Desbloqueia:** Deploy

---

## 📊 Progresso

```
[⬜⬜⬜⬜⬜⬜⬜⬜] 0/8 tasks (0%)
```

---

## 📋 Tasks

### Containerização

- [ ] **OPS-001:** Criar Dockerfile (Backend)

  - Multi-stage build
  - Rust builder stage
  - Runtime minimal (distroless/alpine)
  - Health check

- [ ] **OPS-002:** Criar docker-compose.yml
  - API service
  - PostgreSQL 16
  - Redis 7
  - Network isolada

### CI/CD

- [ ] **OPS-003:** Configurar GitHub Actions - CI

  - Lint (clippy)
  - Format check (rustfmt)
  - Tests
  - Build check
  - Trigger: PR para main

- [ ] **OPS-004:** Configurar GitHub Actions - CD
  - Build Docker image
  - Push para registry
  - Deploy para Railway
  - Trigger: merge em main

### Railway Deploy

- [ ] **OPS-005:** Setup Railway

  - Criar projeto
  - Adicionar PostgreSQL
  - Adicionar Redis
  - Configurar env vars
  - Configurar domínio customizado

- [ ] **OPS-006:** Configurar SSL e domínio
  - Cloudflare DNS
  - SSL automático
  - Redirect HTTP → HTTPS

### Monitoramento

- [ ] **OPS-007:** Implementar logging

  - Structured JSON logs
  - Log levels por env
  - Log aggregation (se necessário)

- [ ] **OPS-008:** Implementar health e métricas
  - /health endpoint
  - /metrics endpoint (Prometheus)
  - Alertas (uptime monitoring)

---

## 🔧 Arquivos de Configuração

### Dockerfile

```dockerfile
# Build
FROM rust:1.75-slim AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

# Runtime
FROM gcr.io/distroless/cc-debian12
COPY --from=builder /app/target/release/giro-license-server /
EXPOSE 3000
CMD ["/giro-license-server"]
```

### GitHub Actions (CI)

```yaml
name: CI
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo fmt --check
      - run: cargo clippy -- -D warnings
      - run: cargo test
```

---

## 📊 Ambientes

| Ambiente    | URL                     | Branch  |
| ----------- | ----------------------- | ------- |
| Development | localhost:3000          | -       |
| Staging     | staging-api.giro.com.br | develop |
| Production  | api.giro.com.br         | main    |

---

## ✅ Critérios de Aceite

- [ ] Docker build funciona
- [ ] CI roda em < 5 min
- [ ] CD faz deploy automático
- [ ] Railway configurado e funcionando
- [ ] SSL ativo no domínio
- [ ] Health check monitorado

---

## 📝 Notas

- Railway auto-deploy em push para main
- Usar secrets do GitHub para env vars
- Backup automático do PostgreSQL no Railway

---

_Última atualização: 08/01/2026_
