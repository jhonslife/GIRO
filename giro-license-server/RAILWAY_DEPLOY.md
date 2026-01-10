# Railway Deploy Guide - GIRO License Server

## 🚂 Deploy Rápido

### Pré-requisitos

```bash
# Instalar Railway CLI (se ainda não tiver)
curl -fsSL https://railway.com/install.sh | sh
# ou
npm i -g @railway/cli
```

### 1. Configurar Projeto Railway

```bash
cd giro-license-server

# Linkar com o projeto existente
railway link -p 1e5725e4-9fec-445f-aba1-2365ed26d8d6

# Ou criar novo projeto
railway init
```

### 2. Criar Serviços

No Railway Dashboard ou via CLI:

#### a) PostgreSQL Database

```bash
railway add --database postgres
```

Após criado, pegue a URL:

```bash
railway variables --service postgres
# Copie o valor de DATABASE_URL
```

#### b) Redis Cache

```bash
railway add --database redis
```

Pegue a URL:

```bash
railway variables --service redis
# Copie o valor de REDIS_URL
```

#### c) Backend Service (este repo)

```bash
# O serviço será criado automaticamente no primeiro deploy
railway up
```

### 3. Configurar Variáveis de Ambiente

```bash
# Definir variáveis no Railway
railway variables set APP_ENV=production
railway variables set APP_PORT=3000
railway variables set APP_HOST=0.0.0.0
railway variables set APP_SECRET=$(openssl rand -base64 32)
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# DATABASE_URL e REDIS_URL já vêm dos serviços linkados automaticamente
# Mas você pode sobrescrever se necessário:
railway variables set DATABASE_URL="postgresql://user:pass@host:port/db"
railway variables set REDIS_URL="redis://host:port"

# Stripe (quando configurar)
railway variables set STRIPE_SECRET_KEY="sk_live_xxx"
railway variables set STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Email (Resend)
railway variables set RESEND_API_KEY="re_xxx"
railway variables set EMAIL_FROM="noreply@giro.com.br"
railway variables set EMAIL_FROM_NAME="GIRO License Server"

# Logging
railway variables set RUST_LOG="info,giro_license_server=debug"

# Rate Limiting
railway variables set RATE_LIMIT_REQUESTS=100
railway variables set RATE_LIMIT_WINDOW=60

# Database connections
railway variables set DATABASE_MAX_CONNECTIONS=20
```

### 4. Deploy

```bash
# Deploy do backend
railway up

# Ou watch mode (redeploy automático)
railway up --watch

# Ver logs
railway logs

# Abrir no browser
railway open
```

### 5. Rodar Migrations

```bash
# Executar migrations no Railway
railway run sqlx migrate run --source ./backend/migrations
```

### 6. Verificar Health

```bash
# Pegar a URL do serviço
RAILWAY_URL=$(railway status --json | jq -r '.deployment.url')

# Testar health
curl https://$RAILWAY_URL/api/v1/health
```

## 🔧 Troubleshooting

### Build falhou

```bash
# Ver logs de build
railway logs --deployment <deployment-id>

# Rebuild
railway up --detach
```

### Database não conecta

```bash
# Verificar se DATABASE_URL está setada
railway variables

# Testar conexão local
railway run psql $DATABASE_URL
```

### Redis não conecta

```bash
# Verificar REDIS_URL
railway variables | grep REDIS

# Testar
railway run redis-cli -u $REDIS_URL ping
```

## 🎯 Estrutura de Serviços

```
giro-license-server (project)
├── backend (service - este repo)
│   └── PORT: 3000
│   └── DOCKERFILE: backend/Dockerfile
├── postgres (database)
│   └── Provisionado pelo Railway
└── redis (database)
    └── Provisionado pelo Railway
```

## 📊 Monitoramento

```bash
# Ver status
railway status

# Logs em tempo real
railway logs --follow

# Métricas
railway open --service backend
# Vá para "Metrics" no dashboard
```

## 🔄 CI/CD com GitHub

1. No Railway Dashboard, vá em Settings
2. Conecte o repositório GitHub
3. Configure:
   - Branch: `main`
   - Root directory: `/giro-license-server`
   - Build command: (vazio, usa Dockerfile)
   - Watch paths: `backend/**`

Agora cada push para `main` faz deploy automático!

## 🌐 Custom Domain (Opcional)

```bash
# Adicionar domínio custom
railway domain add api.giro.com.br

# Seguir instruções para configurar DNS
```

## 📦 Variáveis Essenciais

| Variável       | Descrição             | Exemplo                          |
| -------------- | --------------------- | -------------------------------- |
| `DATABASE_URL` | PostgreSQL connection | Auto-injetado pelo Railway       |
| `REDIS_URL`    | Redis connection      | Auto-injetado pelo Railway       |
| `APP_SECRET`   | App secret key        | `openssl rand -base64 32`        |
| `JWT_SECRET`   | JWT signing key       | `openssl rand -base64 32`        |
| `APP_ENV`      | Environment           | `production`                     |
| `RUST_LOG`     | Log level             | `info,giro_license_server=debug` |

## 🚀 Deploy Checklist

- [ ] PostgreSQL criado
- [ ] Redis criado
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations rodadas
- [ ] Health check respondendo
- [ ] Testes de login funcionando
- [ ] Stripe configurado (quando aplicável)
- [ ] Email configurado (quando aplicável)
- [ ] Domain custom configurado (opcional)
- [ ] Monitoring ativo

---

**Pronto para produção!** 🎉
