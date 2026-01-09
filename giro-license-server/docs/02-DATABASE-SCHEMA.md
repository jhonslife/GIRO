# 🗄️ GIRO License Server - Database Schema

> **Versão:** 1.0.0  
> **Status:** Planejamento  
> **Última Atualização:** 8 de Janeiro de 2026

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Diagrama ER](#diagrama-er)
3. [Tabelas](#tabelas)
4. [Índices](#índices)
5. [Migrations](#migrations)

---

## 🎯 Visão Geral

O banco de dados PostgreSQL do License Server armazena:

| Domínio      | Responsabilidade                         |
| ------------ | ---------------------------------------- |
| **Admins**   | Contas dos proprietários/administradores |
| **Licenses** | Licenças compradas e seu status          |
| **Hardware** | Fingerprints das máquinas ativadas       |
| **Metrics**  | Dados agregados enviados pelo Desktop    |
| **Payments** | Histórico de pagamentos e assinaturas    |
| **Audit**    | Log de ações importantes para segurança  |

---

## 📊 Diagrama ER

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────┐       ┌───────────────────┐                      │
│  │      admins       │       │     licenses      │                      │
│  ├───────────────────┤       ├───────────────────┤                      │
│  │ id (PK)           │◄──────│ admin_id (FK)     │                      │
│  │ email             │       │ id (PK)           │                      │
│  │ password_hash     │       │ license_key       │                      │
│  │ name              │       │ hardware_id (FK)  │───────┐              │
│  │ phone             │       │ status            │       │              │
│  │ company_name      │       │ plan_type         │       │              │
│  │ is_verified       │       │ activated_at      │       │              │
│  │ created_at        │       │ expires_at        │       ▼              │
│  │ updated_at        │       │ created_at        │  ┌───────────────┐   │
│  └───────────────────┘       └───────────────────┘  │   hardware    │   │
│          │                           │              ├───────────────┤   │
│          │                           │              │ id (PK)       │   │
│          │                           │              │ fingerprint   │   │
│          │                           │              │ machine_name  │   │
│          │                           │              │ os_version    │   │
│          │                           │              │ first_seen    │   │
│          │                           │              │ last_seen     │   │
│          │                           │              │ is_active     │   │
│          │                           │              └───────────────┘   │
│          │                           │                                  │
│          │                           ▼                                  │
│          │              ┌───────────────────┐                          │
│          │              │     metrics       │                          │
│          │              ├───────────────────┤                          │
│          │              │ id (PK)           │                          │
│          │              │ license_id (FK)   │                          │
│          │              │ date              │                          │
│          │              │ sales_total       │                          │
│          │              │ sales_count       │                          │
│          │              │ products_count    │                          │
│          │              │ created_at        │                          │
│          │              └───────────────────┘                          │
│          │                                                              │
│          ▼                                                              │
│  ┌───────────────────┐       ┌───────────────────┐                     │
│  │     payments      │       │    audit_logs     │                     │
│  ├───────────────────┤       ├───────────────────┤                     │
│  │ id (PK)           │       │ id (PK)           │                     │
│  │ admin_id (FK)     │       │ admin_id (FK)     │                     │
│  │ amount            │       │ license_id (FK)   │                     │
│  │ currency          │       │ action            │                     │
│  │ status            │       │ ip_address        │                     │
│  │ provider          │       │ user_agent        │                     │
│  │ provider_id       │       │ details           │                     │
│  │ licenses_count    │       │ created_at        │                     │
│  │ created_at        │       └───────────────────┘                     │
│  └───────────────────┘                                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Tabelas

### 1. admins

Armazena as contas dos administradores/proprietários.

```sql
CREATE TABLE admins (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    company_name    VARCHAR(100),

    -- Verificação
    is_verified     BOOLEAN DEFAULT FALSE,
    verified_at     TIMESTAMPTZ,

    -- 2FA (opcional)
    totp_secret     VARCHAR(32),
    totp_enabled    BOOLEAN DEFAULT FALSE,

    -- Status
    is_active       BOOLEAN DEFAULT TRUE,

    -- Timestamps
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- Índices
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_phone ON admins(phone) WHERE phone IS NOT NULL;
```

### 2. licenses

Armazena as licenças e seu estado atual.

```sql
CREATE TYPE license_status AS ENUM (
    'pending',      -- Criada, aguardando ativação
    'active',       -- Ativada e funcionando
    'expired',      -- Expirou por falta de pagamento
    'suspended',    -- Suspensa por algum motivo
    'revoked'       -- Revogada permanentemente
);

CREATE TYPE plan_type AS ENUM (
    'monthly',      -- Mensal
    'semiannual',   -- Semestral
    'annual'        -- Anual
);

CREATE TABLE licenses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key     VARCHAR(25) NOT NULL UNIQUE, -- GIRO-XXXX-XXXX-XXXX-XXXX

    -- Relacionamentos
    admin_id        UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    hardware_id     UUID REFERENCES hardware(id) ON DELETE SET NULL,

    -- Plano
    plan_type       plan_type NOT NULL DEFAULT 'monthly',
    status          license_status NOT NULL DEFAULT 'pending',

    -- Datas importantes
    activated_at    TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    last_validated  TIMESTAMPTZ,

    -- Contadores
    validation_count BIGINT DEFAULT 0,

    -- Timestamps
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE UNIQUE INDEX idx_licenses_key ON licenses(license_key);
CREATE INDEX idx_licenses_admin ON licenses(admin_id);
CREATE INDEX idx_licenses_status ON licenses(status);
CREATE INDEX idx_licenses_expires ON licenses(expires_at);
CREATE INDEX idx_licenses_hardware ON licenses(hardware_id) WHERE hardware_id IS NOT NULL;
```

### 3. hardware

Armazena os fingerprints das máquinas.

```sql
CREATE TABLE hardware (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint     VARCHAR(64) NOT NULL, -- SHA256 do Hardware ID

    -- Informações da máquina
    machine_name    VARCHAR(100),
    os_version      VARCHAR(50),
    cpu_info        VARCHAR(100),

    -- Tracking
    first_seen      TIMESTAMPTZ DEFAULT NOW(),
    last_seen       TIMESTAMPTZ DEFAULT NOW(),
    is_active       BOOLEAN DEFAULT TRUE,

    -- Metadados
    ip_address      INET,

    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE UNIQUE INDEX idx_hardware_fingerprint ON hardware(fingerprint);
CREATE INDEX idx_hardware_active ON hardware(is_active);
```

### 4. metrics

Armazena dados agregados do Desktop (sync periódico).

```sql
CREATE TABLE metrics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id      UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,

    -- Data de referência
    date            DATE NOT NULL,

    -- Vendas
    sales_total     DECIMAL(15, 2) DEFAULT 0,
    sales_count     INTEGER DEFAULT 0,
    average_ticket  DECIMAL(10, 2) DEFAULT 0,

    -- Produtos
    products_sold   INTEGER DEFAULT 0,

    -- Estoque (opcional)
    low_stock_count INTEGER DEFAULT 0,
    expiring_count  INTEGER DEFAULT 0,

    -- Caixa
    cash_opens      INTEGER DEFAULT 0,
    cash_closes     INTEGER DEFAULT 0,

    -- Sync info
    synced_at       TIMESTAMPTZ DEFAULT NOW(),

    -- Constraint para evitar duplicatas
    CONSTRAINT unique_license_date UNIQUE (license_id, date)
);

-- Índices
CREATE INDEX idx_metrics_license ON metrics(license_id);
CREATE INDEX idx_metrics_date ON metrics(date);
CREATE INDEX idx_metrics_license_date ON metrics(license_id, date DESC);
```

### 5. payments

Armazena histórico de pagamentos.

```sql
CREATE TYPE payment_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded'
);

CREATE TYPE payment_provider AS ENUM (
    'stripe',
    'pix',
    'manual'
);

CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id        UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,

    -- Valores
    amount          DECIMAL(10, 2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'BRL',

    -- Provider
    provider        payment_provider NOT NULL,
    provider_id     VARCHAR(100), -- ID externo (Stripe, etc)

    -- Status
    status          payment_status NOT NULL DEFAULT 'pending',

    -- Licenças afetadas
    licenses_count  INTEGER NOT NULL DEFAULT 1,

    -- Metadata
    description     TEXT,
    receipt_url     TEXT,

    -- Timestamps
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_payments_admin ON payments(admin_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_provider ON payments(provider_id) WHERE provider_id IS NOT NULL;
```

### 6. audit_logs

Log de ações para segurança e compliance.

```sql
CREATE TYPE audit_action AS ENUM (
    -- Auth
    'login',
    'logout',
    'login_failed',
    'password_reset',

    -- Licenças
    'license_created',
    'license_activated',
    'license_validated',
    'license_validation_failed',
    'license_transferred',
    'license_suspended',
    'license_revoked',

    -- Hardware
    'hardware_registered',
    'hardware_conflict',
    'hardware_cleared',

    -- Pagamentos
    'payment_created',
    'payment_completed',
    'payment_failed'
);

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Referências (opcionais)
    admin_id        UUID REFERENCES admins(id) ON DELETE SET NULL,
    license_id      UUID REFERENCES licenses(id) ON DELETE SET NULL,

    -- Ação
    action          audit_action NOT NULL,

    -- Contexto
    ip_address      INET,
    user_agent      TEXT,

    -- Detalhes em JSON
    details         JSONB DEFAULT '{}',

    -- Timestamp
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries frequentes
CREATE INDEX idx_audit_admin ON audit_logs(admin_id);
CREATE INDEX idx_audit_license ON audit_logs(license_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- Índice GIN para busca no JSONB
CREATE INDEX idx_audit_details ON audit_logs USING GIN (details);
```

### 7. refresh_tokens (Sessions)

Gerenciamento de sessões e refresh tokens.

```sql
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id        UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,

    token_hash      VARCHAR(64) NOT NULL, -- SHA256 do token

    -- Expiração
    expires_at      TIMESTAMPTZ NOT NULL,

    -- Device tracking
    device_name     VARCHAR(100),
    ip_address      INET,
    user_agent      TEXT,

    -- Status
    is_revoked      BOOLEAN DEFAULT FALSE,

    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE UNIQUE INDEX idx_refresh_token ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_admin ON refresh_tokens(admin_id);
CREATE INDEX idx_refresh_expires ON refresh_tokens(expires_at);
```

---

## 📈 Índices Adicionais

### Índices Compostos para Performance

```sql
-- Validação rápida de licenças
CREATE INDEX idx_license_validation ON licenses(license_key, hardware_id, status)
WHERE status = 'active';

-- Busca de métricas por período
CREATE INDEX idx_metrics_range ON metrics(license_id, date)
WHERE date >= CURRENT_DATE - INTERVAL '30 days';

-- Auditoria recente por admin
CREATE INDEX idx_audit_admin_recent ON audit_logs(admin_id, created_at DESC)
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';
```

---

## 🔄 Migrations

### 001_initial_schema.sql

```sql
-- Migration: 001_initial_schema
-- Created: 2026-01-08

BEGIN;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE license_status AS ENUM ('pending', 'active', 'expired', 'suspended', 'revoked');
CREATE TYPE plan_type AS ENUM ('monthly', 'semiannual', 'annual');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE payment_provider AS ENUM ('stripe', 'pix', 'manual');
CREATE TYPE audit_action AS ENUM (
    'login', 'logout', 'login_failed', 'password_reset',
    'license_created', 'license_activated', 'license_validated',
    'license_validation_failed', 'license_transferred',
    'license_suspended', 'license_revoked',
    'hardware_registered', 'hardware_conflict', 'hardware_cleared',
    'payment_created', 'payment_completed', 'payment_failed'
);

-- Create tables in order of dependencies
-- (admins first, then hardware, then licenses, etc.)

COMMIT;
```

### 002_create_admins.sql

```sql
-- Migration: 002_create_admins
-- Created: 2026-01-08

CREATE TABLE IF NOT EXISTS admins (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    company_name    VARCHAR(100),
    is_verified     BOOLEAN DEFAULT FALSE,
    verified_at     TIMESTAMPTZ,
    totp_secret     VARCHAR(32),
    totp_enabled    BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_admins_email ON admins(email);
```

---

## 🧹 Manutenção

### Limpeza Automática

```sql
-- Função para limpar dados antigos
CREATE OR REPLACE FUNCTION cleanup_old_data() RETURNS void AS $$
BEGIN
    -- Remove audit logs > 90 dias
    DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days';

    -- Remove métricas > 365 dias
    DELETE FROM metrics WHERE date < CURRENT_DATE - INTERVAL '365 days';

    -- Remove refresh tokens expirados
    DELETE FROM refresh_tokens WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Agendar via pg_cron (se disponível)
-- SELECT cron.schedule('cleanup-daily', '0 3 * * *', 'SELECT cleanup_old_data()');
```

### Backup Strategy

```sql
-- Tabelas críticas (backup diário):
-- admins, licenses, payments

-- Tabelas auxiliares (backup semanal):
-- hardware, metrics

-- Tabelas de log (backup opcional):
-- audit_logs, refresh_tokens
```

---

## 📊 Queries Úteis

### Licenças ativas por admin

```sql
SELECT
    a.email,
    a.company_name,
    COUNT(l.id) as total_licenses,
    COUNT(l.id) FILTER (WHERE l.status = 'active') as active_licenses
FROM admins a
LEFT JOIN licenses l ON l.admin_id = a.id
GROUP BY a.id
ORDER BY active_licenses DESC;
```

### Métricas dos últimos 7 dias

```sql
SELECT
    l.license_key,
    SUM(m.sales_total) as total_vendas,
    SUM(m.sales_count) as total_transacoes,
    AVG(m.average_ticket) as ticket_medio
FROM metrics m
JOIN licenses l ON m.license_id = l.id
WHERE m.date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY l.id
ORDER BY total_vendas DESC;
```

### Tentativas de fraude

```sql
SELECT
    l.license_key,
    COUNT(*) as tentativas,
    array_agg(DISTINCT al.ip_address) as ips
FROM audit_logs al
JOIN licenses l ON al.license_id = l.id
WHERE al.action IN ('license_validation_failed', 'hardware_conflict')
  AND al.created_at >= NOW() - INTERVAL '24 hours'
GROUP BY l.id
HAVING COUNT(*) > 5
ORDER BY tentativas DESC;
```

---

_Este documento define o schema do banco de dados do GIRO License Server._
