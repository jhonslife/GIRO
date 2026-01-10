# 🔐 GIRO License Server

> **Backend de Licenciamento do GIRO Desktop**  
> Rust + Axum + PostgreSQL + Redis

---

## � Deploy Rápido

**→ [📚 ÍNDICE COMPLETO DE DEPLOY](INDEX.md)** ⭐

### 3 Formas de Deploy:

1. **🌐 Via Dashboard** (recomendado) - [Guia Visual](DEPLOY-MANUAL.md)
2. **⚡ Script Automático** - `./deploy-railway.sh`
3. **🛠️ CLI Manual** - [Comandos](railway-commands.sh)

---

## 📚 Documentação

### Core Docs

- [📖 Visão Geral](docs/00-OVERVIEW.md)
- [🏗️ Arquitetura](docs/01-ARQUITETURA.md)
- [🗄️ Database Schema](docs/02-DATABASE-SCHEMA.md)

### Deploy Docs

- [📚 Índice Completo](INDEX.md) - **Comece aqui!**
- [🚀 Deploy Manual](DEPLOY-MANUAL.md) - Passo a passo visual
- [📖 Deploy Técnico](RAILWAY_DEPLOY.md) - Referência completa
- [📊 Fluxogramas](DEPLOY-FLOWCHART.md) - Diagramas do processo
- [🔧 Troubleshooting](TROUBLESHOOTING.md) - Solução de problemas
- [✅ Status Atual](DEPLOY-STATUS.md) - O que está pronto

---

## 🚀 Deploy para Produção

### Opção 1: Railway Dashboard (Recomendado)

Siga o guia completo: [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md)

### Opção 2: Railway CLI

```bash
# Deploy automático
./deploy-railway.sh

# Deploy rápido (se já configurado)
./deploy.sh
```

### Opção 3: GitHub Actions (CI/CD)

O deploy automático está configurado para `main` branch.

---

## 📋 Pré-requisitos (Desenvolvimento)

- Docker & Docker Compose
- Rust 1.75+ (para desenvolvimento local)
- SQLx CLI: `cargo install sqlx-cli --no-default-features --features postgres`
- Railway CLI (opcional): `curl -fsSL https://railway.com/install.sh | sh`

## 🚀 Quick Start (Local)

### 1️⃣ Subir Infraestrutura

```bash
cd /home/jhonslife/Mercearias/giro-license-server
./start.sh
```

Este script irá:

- Iniciar PostgreSQL (porta 5433)
- Iniciar Redis (porta 6379)
- Iniciar Adminer - UI do banco (porta 8080)
- Executar migrations automaticamente

### 2️⃣ Iniciar Backend (Desenvolvimento)

```bash
cd backend
cargo run
```

O servidor estará disponível em `http://localhost:3000`

## 🐳 Comandos Docker

```bash
# Subir apenas infra (sem backend)
docker-compose up -d db redis adminer

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Limpar volumes (CUIDADO: apaga dados)
docker-compose down -v
```

## 🗄️ Database

### Migrations

```bash
cd backend

# Criar nova migration
sqlx migrate add nome_da_migration

# Executar migrations
sqlx migrate run

# Reverter última migration
sqlx migrate revert
```

### Acessar DB

**Via Adminer (UI):**

- URL: http://localhost:8080
- System: PostgreSQL
- Server: db
- Username: giro
- Password: giro_dev_password
- Database: giro_licenses

**Via psql:**

```bash
docker-compose exec db psql -U giro -d giro_licenses
```

## 🔧 Configuração do Tauri Desktop

O app Tauri já está configurado para conectar ao servidor de licenças.

### Variáveis de Ambiente

Crie `.env` no diretório do Tauri:

```bash
# apps/desktop/src-tauri/.env
LICENSE_SERVER_URL=http://localhost:3000
LICENSE_API_KEY=dev-key
```

### Comandos Disponíveis

```typescript
// Ativar licença
await invoke('activate_license', { licenseKey: 'XXXX-XXXX-XXXX-XXXX' });

// Validar licença
await invoke('validate_license', { licenseKey: 'XXXX-XXXX-XXXX-XXXX' });

// Sincronizar métricas
await invoke('sync_metrics', {
  licenseKey: 'XXXX-XXXX-XXXX-XXXX',
  metrics: {
    date: '2026-01-09',
    sales_total: 1500.0,
    sales_count: 25,
    products_sold: 80,
    low_stock_count: 5,
    expiring_count: 3,
    cash_opens: 1,
    cash_closes: 1,
  },
});

// Obter hora do servidor
await invoke('get_server_time');
```

## 🧪 Testando a API

### Criar Admin

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@giro.com",
    "password": "Admin@123",
    "name": "Admin GIRO",
    "company_name": "GIRO Inc"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@giro.com",
    "password": "Admin@123"
  }'
```

Salve o `access_token` retornado.

### Criar Licença

```bash
curl -X POST http://localhost:3000/api/licenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -d '{
    "company_name": "Mercadinho Exemplo",
    "plan_type": "professional",
    "max_users": 5,
    "expires_at": "2027-01-09T00:00:00Z"
  }'
```

### Ativar Licença (Desktop)

```bash
curl -X POST http://localhost:3000/api/licenses/CHAVE-DA-LICENCA/activate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-key" \
  -d '{
    "hardware_id": "abc123...",
    "hostname": "PDV-001",
    "os_info": "linux x86_64"
  }'
```

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:3000/health
```

### Logs

```bash
# Backend logs
cd backend && RUST_LOG=debug cargo run

# Docker logs
docker-compose logs -f db
docker-compose logs -f redis
```

## 🔐 Segurança

### Produção

⚠️ **IMPORTANTE:** Antes de deploy em produção:

1. Altere as senhas em `docker-compose.yml`
2. Configure `JWT_SECRET` forte no `.env`
3. Use HTTPS/TLS
4. Configure firewall apropriado
5. Implemente rate limiting
6. Habilite backups automáticos

### Secrets

Nunca commite:

- `.env` com valores reais
- Chaves de API
- Certificados
- Senhas

## 📚 Estrutura do Projeto

```
giro-license-server/
├── backend/                # Backend Rust (Axum)
│   ├── src/
│   │   ├── commands/      # CLI commands
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── errors/        # Error types
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Domain models
│   │   ├── repositories/  # Data access
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── state.rs       # App state
│   │   ├── utils/         # Utilities
│   │   ├── lib.rs
│   │   └── main.rs
│   ├── migrations/        # SQL migrations
│   ├── Cargo.toml
│   └── Dockerfile
├── docker-compose.yml     # Orchestration
├── .env                   # Config (development)
├── .env.example           # Template
└── start.sh               # Setup script
```

## 🆘 Troubleshooting

### Porta já em uso

```bash
# Verificar o que está usando a porta
lsof -i :5433  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :3000  # Backend

# Matar processo
kill -9 PID
```

### Reset completo

```bash
docker-compose down -v
rm -rf backend/target
docker-compose up -d
cd backend && sqlx migrate run
```

### Erro de compilação SQLx

```bash
# Gerar cache offline
cd backend
cargo sqlx prepare

# Ou compilar sem verificação de DB
SQLX_OFFLINE=true cargo build
```

## 📞 Suporte

Para mais informações, consulte:

- [Docs Backend](./backend/README.md)
- [Docs API](./docs/API.md)
- [Roadmap](./roadmaps/STATUS.md)
