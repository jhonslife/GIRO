# 🔧 Backend Roadmap - GIRO License Server

> **Agente:** Backend  
> **Sprint:** 1-2  
> **Dependências:** Database  
> **Desbloqueia:** Dashboard, Auth, Testing

---

## 📊 Progresso

```
[⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜] 0/15 tasks (0%)
```

---

## 📋 Tasks

### Setup Inicial

- [ ] **BE-001:** Criar projeto Rust com Cargo

  - Estrutura de pastas conforme 01-ARQUITETURA.md
  - Cargo.toml com todas as deps
  - .env.example

- [ ] **BE-002:** Configurar Axum + Tokio

  - Router principal
  - Graceful shutdown
  - Error handling global

- [ ] **BE-003:** Configurar middleware stack

  - TraceLayer (logging)
  - CorsLayer
  - TimeoutLayer
  - CompressionLayer

- [ ] **BE-004:** Criar AppState e DI
  - Database pool
  - Redis connection
  - Config loader

### Models & Repositories

- [ ] **BE-005:** Criar models/entities

  - Admin
  - License
  - Hardware
  - Metrics
  - Payment

- [ ] **BE-006:** Criar DTOs (request/response)

  - AuthDTO
  - LicenseDTO
  - MetricsDTO
  - ErrorDTO

- [ ] **BE-007:** Implementar repositories
  - AdminRepository
  - LicenseRepository
  - HardwareRepository
  - MetricsRepository

### Services

- [ ] **BE-008:** Implementar LicenseService

  - create_license()
  - activate_license()
  - validate_license()
  - transfer_license()
  - revoke_license()

- [ ] **BE-009:** Implementar HardwareService

  - register_hardware()
  - detect_conflict()
  - clear_hardware()

- [ ] **BE-010:** Implementar MetricsService
  - receive_sync()
  - aggregate_data()
  - get_dashboard_data()

### Routes

- [ ] **BE-011:** Implementar rotas /licenses

  - POST /licenses (create)
  - GET /licenses (list)
  - GET /licenses/:key (details)
  - POST /licenses/:key/activate
  - POST /licenses/:key/validate
  - POST /licenses/:key/transfer
  - DELETE /licenses/:key

- [ ] **BE-012:** Implementar rotas /hardware

  - GET /hardware
  - GET /hardware/:id
  - DELETE /hardware/:id

- [ ] **BE-013:** Implementar rotas /metrics
  - POST /metrics/sync
  - GET /metrics/dashboard
  - GET /metrics/time

### Utilitários

- [ ] **BE-014:** Criar utils

  - license_key.rs (geração GIRO-XXXX-XXXX-XXXX-XXXX)
  - time.rs (validação de time drift)
  - hash.rs (argon2)

- [ ] **BE-015:** Implementar health check
  - GET /health
  - Verificar DB connection
  - Verificar Redis connection

---

## 🔧 Comandos Úteis

```bash
# Rodar em dev
cargo watch -x run

# Build release
cargo build --release

# Rodar testes
cargo test

# Check sem compilar
cargo check
```

---

## ✅ Critérios de Aceite

- [ ] API responde em /health
- [ ] Todas as rotas de licenças funcionam
- [ ] Validação de licença retorna em < 50ms
- [ ] Logs estruturados funcionando
- [ ] Erros retornam JSON padronizado

---

## 📝 Notas

- Usar `tower-http` para middleware padrão
- Implementar tracing com `tracing-subscriber`
- Rate limiting via Redis

---

_Última atualização: 08/01/2026_
