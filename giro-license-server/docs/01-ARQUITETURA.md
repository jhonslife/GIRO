# 🏗️ GIRO License Server - Arquitetura

> **Versão:** 1.0.0  
> **Status:** Planejamento  
> **Última Atualização:** 8 de Janeiro de 2026

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Camadas da Aplicação](#camadas-da-aplicação)
5. [Fluxos Principais](#fluxos-principais)
6. [Configuração e Deploy](#configuração-e-deploy)

---

## 🎯 Visão Geral

O License Server é uma API REST escrita em **Rust** que gerencia o ciclo de vida das licenças GIRO:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LICENSE SERVER                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐     │
│  │   GIRO Desktop │    │ GIRO Dashboard │    │   Stripe/Pix   │     │
│  │    (Clientes)  │    │  (Admin Web)   │    │   (Payments)   │     │
│  └───────┬────────┘    └───────┬────────┘    └───────┬────────┘     │
│          │                     │                     │              │
│          ▼                     ▼                     ▼              │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                         API LAYER                            │    │
│  │              Axum + Tower (Middleware Stack)                 │    │
│  │                                                              │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │    │
│  │  │  /auth   │ │/licenses │ │ /metrics │ │/payments │        │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      SERVICE LAYER                           │    │
│  │                                                              │    │
│  │  AuthService │ LicenseService │ MetricsService │ PaymentSvc │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    REPOSITORY LAYER                          │    │
│  │                       SQLx + Redis                           │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│          ┌───────────────────┼───────────────────┐                  │
│          ▼                                       ▼                  │
│  ┌───────────────┐                      ┌───────────────┐           │
│  │  PostgreSQL   │                      │    Redis      │           │
│  │  (Persistente)│                      │   (Cache)     │           │
│  └───────────────┘                      └───────────────┘           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológica

### Backend Core

| Crate            | Versão | Responsabilidade                      |
| ---------------- | ------ | ------------------------------------- |
| **axum**         | 0.7+   | Framework web async                   |
| **tokio**        | 1.35+  | Runtime async                         |
| **sqlx**         | 0.7+   | Database driver (PostgreSQL)          |
| **tower**        | 0.4+   | Middleware (rate limit, timeout, etc) |
| **tower-http**   | 0.5+   | CORS, compression, tracing            |
| **serde**        | 1.0+   | Serialização JSON                     |
| **jsonwebtoken** | 9.0+   | JWT encode/decode                     |
| **argon2**       | 0.5+   | Hash de senhas                        |
| **uuid**         | 1.0+   | Geração de IDs únicos                 |
| **chrono**       | 0.4+   | Data/hora com timezone                |
| **tracing**      | 0.1+   | Logging estruturado                   |
| **validator**    | 0.16+  | Validação de inputs                   |

### Infraestrutura

| Tecnologia     | Uso              | Justificativa                     |
| -------------- | ---------------- | --------------------------------- |
| **PostgreSQL** | Banco principal  | Robusto, ACID, bom para queries   |
| **Redis**      | Cache + Sessions | Rate limiting, tokens temporários |
| **Railway**    | Deploy           | PaaS simples, PostgreSQL incluso  |
| **Cloudflare** | CDN + DNS + SSL  | Performance e segurança           |

---

## 📁 Estrutura do Projeto

```
giro-license-server/
├── docs/                          # Documentação
│   ├── 00-OVERVIEW.md
│   ├── 01-ARQUITETURA.md
│   ├── 02-DATABASE-SCHEMA.md
│   └── 03-API-REFERENCE.md
│
├── backend/                       # Aplicação Rust
│   ├── Cargo.toml
│   ├── Cargo.lock
│   │
│   ├── src/
│   │   ├── main.rs               # Entry point
│   │   ├── lib.rs                # Re-exports
│   │   │
│   │   ├── config/               # Configurações
│   │   │   ├── mod.rs
│   │   │   ├── settings.rs       # Env vars
│   │   │   └── database.rs       # Pool config
│   │   │
│   │   ├── routes/               # Handlers HTTP
│   │   │   ├── mod.rs            # Router principal
│   │   │   ├── auth.rs           # /api/v1/auth/*
│   │   │   ├── licenses.rs       # /api/v1/licenses/*
│   │   │   ├── hardware.rs       # /api/v1/hardware/*
│   │   │   ├── metrics.rs        # /api/v1/metrics/*
│   │   │   ├── payments.rs       # /api/v1/payments/*
│   │   │   └── health.rs         # /health
│   │   │
│   │   ├── services/             # Lógica de negócio
│   │   │   ├── mod.rs
│   │   │   ├── auth_service.rs
│   │   │   ├── license_service.rs
│   │   │   ├── hardware_service.rs
│   │   │   ├── metrics_service.rs
│   │   │   └── payment_service.rs
│   │   │
│   │   ├── repositories/         # Acesso a dados
│   │   │   ├── mod.rs
│   │   │   ├── admin_repo.rs
│   │   │   ├── license_repo.rs
│   │   │   ├── hardware_repo.rs
│   │   │   └── metrics_repo.rs
│   │   │
│   │   ├── models/               # Structs e DTOs
│   │   │   ├── mod.rs
│   │   │   ├── admin.rs          # Admin entity
│   │   │   ├── license.rs        # License entity
│   │   │   ├── hardware.rs       # Hardware ID
│   │   │   ├── metrics.rs        # Sync data
│   │   │   └── dto/              # Request/Response
│   │   │       ├── mod.rs
│   │   │       ├── auth_dto.rs
│   │   │       └── license_dto.rs
│   │   │
│   │   ├── middleware/           # Middleware custom
│   │   │   ├── mod.rs
│   │   │   ├── auth.rs           # JWT validation
│   │   │   ├── rate_limit.rs     # Rate limiting
│   │   │   └── api_key.rs        # Desktop API key
│   │   │
│   │   ├── utils/                # Utilitários
│   │   │   ├── mod.rs
│   │   │   ├── jwt.rs            # Token helpers
│   │   │   ├── hash.rs           # Password hash
│   │   │   ├── license_key.rs    # Key generation
│   │   │   └── time.rs           # Server time
│   │   │
│   │   └── errors/               # Error handling
│   │       ├── mod.rs
│   │       └── app_error.rs      # Custom errors
│   │
│   ├── migrations/               # SQL migrations
│   │   ├── 001_create_admins.sql
│   │   ├── 002_create_licenses.sql
│   │   ├── 003_create_hardware.sql
│   │   └── 004_create_metrics.sql
│   │
│   └── tests/                    # Testes
│       ├── common/
│       ├── auth_tests.rs
│       └── license_tests.rs
│
├── dashboard/                    # Frontend Next.js (futuro)
│   └── (...)
│
├── .env.example                  # Exemplo de env vars
├── docker-compose.yml            # Dev environment
├── Dockerfile                    # Production build
└── README.md
```

---

## 🧱 Camadas da Aplicação

### 1. Routes (Handlers)

Responsável por:

- Receber requisições HTTP
- Validar input
- Chamar Services
- Retornar responses

```rust
// routes/licenses.rs
pub async fn activate_license(
    State(state): State<AppState>,
    Json(payload): Json<ActivateLicenseRequest>,
) -> Result<Json<LicenseResponse>, AppError> {
    // Validação
    payload.validate()?;

    // Chama service
    let license = state
        .license_service
        .activate(&payload.license_key, &payload.hardware_id)
        .await?;

    Ok(Json(license.into()))
}
```

### 2. Services (Business Logic)

Responsável por:

- Regras de negócio
- Orquestrar repositories
- Validações complexas

```rust
// services/license_service.rs
impl LicenseService {
    pub async fn activate(
        &self,
        license_key: &str,
        hardware_id: &str,
    ) -> Result<License, AppError> {
        // Busca licença
        let license = self.license_repo
            .find_by_key(license_key)
            .await?
            .ok_or(AppError::LicenseNotFound)?;

        // Verifica se já ativada
        if let Some(existing_hw) = &license.hardware_id {
            if existing_hw != hardware_id {
                return Err(AppError::LicenseAlreadyActivated);
            }
        }

        // Registra hardware
        self.hardware_repo
            .register(hardware_id, license.id)
            .await?;

        // Atualiza licença
        self.license_repo
            .set_hardware_id(license.id, hardware_id)
            .await?;

        // Retorna atualizada
        self.license_repo.find_by_id(license.id).await
    }
}
```

### 3. Repositories (Data Access)

Responsável por:

- Queries SQL via SQLx
- Cache via Redis
- Mapping de dados

```rust
// repositories/license_repo.rs
impl LicenseRepository {
    pub async fn find_by_key(&self, key: &str) -> Result<Option<License>> {
        // Tenta cache primeiro
        if let Some(cached) = self.redis.get::<License>(&key).await? {
            return Ok(Some(cached));
        }

        // Query no banco
        let license = sqlx::query_as!(
            License,
            r#"
            SELECT id, key, admin_id, hardware_id, status,
                   activated_at, expires_at, created_at
            FROM licenses
            WHERE key = $1
            "#,
            key
        )
        .fetch_optional(&self.pool)
        .await?;

        // Cacheia se encontrou
        if let Some(ref l) = license {
            self.redis.set(&key, l, 300).await?; // 5 min TTL
        }

        Ok(license)
    }
}
```

---

## 🔄 Fluxos Principais

### Fluxo 1: Ativação de Licença

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Desktop    │         │    Server    │         │   Database   │
│     GIRO     │         │              │         │              │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │  POST /licenses/activate                        │
       │  { key, hardware_id }  │                        │
       │───────────────────────►│                        │
       │                        │                        │
       │                        │  SELECT license        │
       │                        │───────────────────────►│
       │                        │◄───────────────────────│
       │                        │                        │
       │                        │  Valida regras         │
       │                        │  - Status = pending    │
       │                        │  - HW não conflita     │
       │                        │  - Admin ativo         │
       │                        │                        │
       │                        │  INSERT hardware       │
       │                        │───────────────────────►│
       │                        │                        │
       │                        │  UPDATE license        │
       │                        │───────────────────────►│
       │                        │◄───────────────────────│
       │                        │                        │
       │  200 OK                │                        │
       │  { license, token }    │                        │
       │◄───────────────────────│                        │
       │                        │                        │
```

### Fluxo 2: Validação Periódica

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Desktop    │         │    Server    │         │    Redis     │
│     GIRO     │         │              │         │    Cache     │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │  POST /licenses/validate                        │
       │  { key, hw_id, timestamp }                      │
       │───────────────────────►│                        │
       │                        │                        │
       │                        │  Check cache           │
       │                        │───────────────────────►│
       │                        │◄───────────────────────│
       │                        │                        │
       │                        │  Valida:               │
       │                        │  - HW match            │
       │                        │  - Status = active     │
       │                        │  - Não expirada        │
       │                        │  - Timestamp ± 5min    │
       │                        │                        │
       │  200 OK                │                        │
       │  { valid: true,        │                        │
       │    server_time }       │                        │
       │◄───────────────────────│                        │
       │                        │                        │
```

### Fluxo 3: Sync de Métricas

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Desktop    │         │    Server    │         │   Postgres   │
│     GIRO     │         │              │         │              │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │  POST /metrics/sync    │                        │
       │  {                     │                        │
       │    license_key,        │                        │
       │    date,               │                        │
       │    sales_total,        │                        │
       │    sales_count,        │                        │
       │    products_sold: 50   │                        │
       │  }                     │                        │
       │───────────────────────►│                        │
       │                        │                        │
       │                        │  Valida licença        │
       │                        │                        │
       │                        │  UPSERT metrics        │
       │                        │───────────────────────►│
       │                        │◄───────────────────────│
       │                        │                        │
       │  200 OK                │                        │
       │◄───────────────────────│                        │
       │                        │                        │
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

```bash
# .env
# Application
APP_ENV=production
APP_PORT=3000
APP_HOST=0.0.0.0
APP_SECRET=your-256-bit-secret-key

# Database
DATABASE_URL=postgres://user:pass@host:5432/giro_licenses
DATABASE_MAX_CONNECTIONS=20

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=86400  # 24 hours

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60  # seconds

# Stripe (futuro)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Docker Compose (Dev)

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgres://giro:giro@db:5432/giro_licenses
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: giro
      POSTGRES_PASSWORD: giro
      POSTGRES_DB: giro_licenses
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  cache:
    image: redis:7-alpine
    ports:
      - '6379:6379'

volumes:
  postgres_data:
```

---

## 🚀 Deploy

### Railway (Recomendado)

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Criar projeto
railway init

# 4. Adicionar PostgreSQL
railway add --database postgres

# 5. Adicionar Redis
railway add --database redis

# 6. Deploy
railway up
```

### Dockerfile

```dockerfile
# Build stage
FROM rust:1.75-slim AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/giro-license-server /usr/local/bin/
EXPOSE 3000
CMD ["giro-license-server"]
```

---

## 🔒 Segurança

### Middleware Stack

```rust
// src/main.rs
let app = Router::new()
    .nest("/api/v1", api_routes())
    .layer(
        ServiceBuilder::new()
            // Tracing
            .layer(TraceLayer::new_for_http())
            // CORS
            .layer(CorsLayer::permissive())
            // Rate limiting
            .layer(RateLimitLayer::new(100, Duration::from_secs(60)))
            // Timeout
            .layer(TimeoutLayer::new(Duration::from_secs(30)))
            // Compression
            .layer(CompressionLayer::new())
    );
```

### Headers de Segurança

```rust
.layer(SetResponseHeaderLayer::overriding(
    header::X_CONTENT_TYPE_OPTIONS,
    HeaderValue::from_static("nosniff"),
))
.layer(SetResponseHeaderLayer::overriding(
    header::X_FRAME_OPTIONS,
    HeaderValue::from_static("DENY"),
))
```

---

## 📊 Monitoramento

### Health Check

```rust
// GET /health
{
    "status": "healthy",
    "version": "1.0.0",
    "database": "connected",
    "redis": "connected",
    "uptime_seconds": 86400
}
```

### Métricas

```rust
// GET /metrics (Prometheus format)
giro_active_licenses_total 1234
giro_validations_total{status="success"} 50000
giro_validations_total{status="failed"} 150
giro_api_requests_total{route="/licenses"} 10000
giro_api_latency_seconds{route="/licenses"} 0.015
```

---

_Este documento define a arquitetura técnica do GIRO License Server._
