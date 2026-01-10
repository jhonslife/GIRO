# 🔍 Railway - Análise Completa do Projeto

**Data:** 10 de Janeiro de 2026  
**Projeto:** refreshing-creation  
**ID:** 1e5725e4-9fec-445f-aba1-2365ed26d8d6  
**Workspace:** DETONA BET 1.0  
**Environment:** production

---

## 📊 Resumo Executivo

### Serviços Encontrados: 3

| Serviço        | Status        | Tipo     | Source                                                  |
| -------------- | ------------- | -------- | ------------------------------------------------------- |
| **Postgres**   | ✅ Rodando    | Database | Template (ghcr.io/railwayapp-templates/postgres-ssl:17) |
| **Redis**      | ✅ Rodando    | Cache    | Template                                                |
| **Mercearias** | ⚠️ Sem Deploy | Backend  | GitHub (jhonslife/Mercearias)                           |

---

## 🗄️ PostgreSQL

### Status

- **Estado:** SUCCESS (Deployment ativo)
- **Versão:** PostgreSQL 17 com SSL
- **Deployment ID:** 9795223d-69f3-41e6-b21d-0d4153dc74da
- **Criado em:** 2026-01-10T17:11:48.757Z
- **Região:** us-east4-eqdc4a

### Conexões

#### DATABASE_URL (Interna - para uso no Railway)

```
postgresql://postgres:DRUoICWbWfwQPEFisHLbTHJROwgsGUzo@postgres.railway.internal:5432/railway
```

#### DATABASE_PUBLIC_URL (Externa - para acesso de fora)

```
postgresql://postgres:DRUoICWbWfwQPEFisHLbTHJROwgsGUzo@trolley.proxy.rlwy.net:49625/railway
```

### Variáveis de Ambiente (PostgreSQL)

| Variável              | Valor                                                               |
| --------------------- | ------------------------------------------------------------------- |
| `PGHOST`              | postgres.railway.internal                                           |
| `PGPORT`              | 5432                                                                |
| `PGUSER`              | postgres                                                            |
| `PGPASSWORD`          | DRUoICWbWfwQPEFisHLbTHJROwgsGUzo                                    |
| `PGDATABASE`          | railway                                                             |
| `DATABASE_URL`        | postgresql://postgres:\*\*\*@postgres.railway.internal:5432/railway |
| `DATABASE_PUBLIC_URL` | postgresql://postgres:\*\*\*@trolley.proxy.rlwy.net:49625/railway   |

### Storage

- **Volume ID:** 15686ffd-e9a0-4499-a2bf-1f594065ed42
- **Mount Path:** /var/lib/postgresql/data
- **Volume Name:** postgres-volume

### Configuração

- **Restart Policy:** ON_FAILURE (max 10 retries)
- **Draining Seconds:** 60
- **SSL Certificate Days:** 820

---

## 🔴 Redis

### Status

- **Estado:** Rodando
- **Porta:** 6379
- **Região:** us-east4

### Conexões

#### REDIS_URL (Interna)

```
redis://default:HbLZawxQpfLdmpmKxIVxeElIlDQcFiAQ@redis.railway.internal:6379
```

#### REDIS_PUBLIC_URL (Externa)

```
redis://default:HbLZawxQpfLdmpmKxIVxeElIlDQcFiAQ@switchyard.proxy.rlwy.net:11133
```

### Variáveis de Ambiente (Redis)

| Variável           | Valor                                                  |
| ------------------ | ------------------------------------------------------ |
| `REDISHOST`        | redis.railway.internal                                 |
| `REDISPORT`        | 6379                                                   |
| `REDISUSER`        | default                                                |
| `REDISPASSWORD`    | HbLZawxQpfLdmpmKxIVxeElIlDQcFiAQ                       |
| `REDIS_URL`        | redis://default:\*\*\*@redis.railway.internal:6379     |
| `REDIS_PUBLIC_URL` | redis://default:\*\*\*@switchyard.proxy.rlwy.net:11133 |

### Storage

- **Volume ID:** 4418159b-ffa6-460f-a194-dd518d45ec65
- **Mount Path:** /data
- **Volume Name:** redis-volume

### Acesso TCP

- **Proxy Domain:** switchyard.proxy.rlwy.net
- **Proxy Port:** 11133
- **Application Port:** 6379

---

## 🚀 Mercearias (Backend)

### Status

- **Estado:** ⚠️ **SEM DEPLOYMENT ATIVO**
- **Source:** GitHub Repository
- **Repo:** jhonslife/Mercearias
- **Service ID:** c7ca7840-f800-47ed-9772-935400360a69

### Observações

- ✅ Serviço criado e configurado
- ⚠️ **Nenhum deployment foi feito ainda**
- ⚠️ **Sem domínios configurados**
- ⚠️ **Variáveis de ambiente do backend NÃO configuradas**

### Variáveis Atuais (Apenas Sistema)

| Variável                 | Valor                                |
| ------------------------ | ------------------------------------ |
| `RAILWAY_ENVIRONMENT`    | production                           |
| `RAILWAY_ENVIRONMENT_ID` | 671351b9-3ab1-4b7c-be4f-a9542837c8c5 |
| `RAILWAY_PROJECT_ID`     | 1e5725e4-9fec-445f-aba1-2365ed26d8d6 |
| `RAILWAY_PROJECT_NAME`   | refreshing-creation                  |
| `RAILWAY_SERVICE_ID`     | c7ca7840-f800-47ed-9772-935400360a69 |
| `RAILWAY_SERVICE_NAME`   | Mercearias                           |
| `RAILWAY_PRIVATE_DOMAIN` | mercearias.railway.internal          |

### ⚠️ Variáveis Faltantes (Necessárias para o Backend)

**CRÍTICAS:**

- ❌ `DATABASE_URL` (não injetado - precisa linkar PostgreSQL)
- ❌ `REDIS_URL` (não injetado - precisa linkar Redis)
- ❌ `APP_SECRET`
- ❌ `JWT_SECRET`

**CONFIGURAÇÃO:**

- ❌ `APP_ENV=production`
- ❌ `APP_PORT=3000`
- ❌ `APP_HOST=0.0.0.0`
- ❌ `JWT_EXPIRATION=86400`
- ❌ `RUST_LOG`
- ❌ `RATE_LIMIT_REQUESTS`
- ❌ `RATE_LIMIT_WINDOW`
- ❌ `DATABASE_MAX_CONNECTIONS`

**OPCIONAIS:**

- ❌ `STRIPE_SECRET_KEY`
- ❌ `STRIPE_WEBHOOK_SECRET`
- ❌ `RESEND_API_KEY`
- ❌ `EMAIL_FROM`
- ❌ `EMAIL_FROM_NAME`

---

## 🔗 Networking

### Domínios Internos (Railway Internal)

- `postgres.railway.internal:5432`
- `redis.railway.internal:6379`
- `mercearias.railway.internal` (quando deployado)

### Domínios Públicos (TCP Proxy)

- **PostgreSQL:** `trolley.proxy.rlwy.net:49625`
- **Redis:** `switchyard.proxy.rlwy.net:11133`
- **Mercearias:** Nenhum (sem deployment)

### Domínios Personalizados

- ❌ Nenhum configurado

---

## 📋 Checklist de Configuração

### ✅ O Que Está Pronto

- [x] Projeto Railway criado
- [x] Environment "production" configurado
- [x] PostgreSQL provisionado e rodando
- [x] Redis provisionado e rodando
- [x] Serviço "Mercearias" criado
- [x] Conexão com GitHub configurada

### ❌ O Que Falta Fazer

#### 1. Configurar Variáveis de Ambiente no Serviço Mercearias

```bash
# Gerar e configurar secrets
railway variables set APP_SECRET=$(openssl rand -base64 32)
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# Configuração básica
railway variables set APP_ENV=production
railway variables set APP_PORT=3000
railway variables set APP_HOST=0.0.0.0
railway variables set JWT_EXPIRATION=86400

# Logging e Rate Limiting
railway variables set RUST_LOG="info,giro_license_server=debug"
railway variables set RATE_LIMIT_REQUESTS=100
railway variables set RATE_LIMIT_WINDOW=60
railway variables set DATABASE_MAX_CONNECTIONS=20
```

#### 2. Linkar PostgreSQL e Redis ao Backend

**Opção A - Via Dashboard:**

1. Acesse https://railway.app/project/1e5725e4-9fec-445f-aba1-2365ed26d8d6
2. Clique no serviço "Mercearias"
3. Vá em "Variables"
4. Em "Service Variables", adicione referências:
   - `DATABASE_URL` → `${{Postgres.DATABASE_URL}}`
   - `REDIS_URL` → `${{Redis.REDIS_URL}}`

**Opção B - Via CLI:**

```bash
# Atualmente não há comando direto, melhor usar o Dashboard
```

#### 3. Configurar Build do Backend

O serviço já está conectado ao GitHub, mas precisa configurar:

**No Railway Dashboard:**

1. Service "Mercearias" → Settings
2. **Root Directory:** `giro-license-server`
3. **Build Command:** (deixar vazio, usa Dockerfile)
4. **Dockerfile Path:** `backend/Dockerfile`
5. **Watch Paths:** `giro-license-server/**`

#### 4. Fazer o Primeiro Deploy

```bash
# Via CLI
railway up

# Ou via Dashboard
# Settings → Deployments → Deploy Now
```

#### 5. Executar Migrations

```bash
# Após primeiro deploy bem-sucedido
railway run bash -c "cd backend && sqlx migrate run"
```

---

## 🚨 Problemas Identificados

### 1. Backend sem Deploy

**Impacto:** Alto  
**Descrição:** O serviço Mercearias foi criado mas nunca teve um deployment.  
**Solução:** Configurar variáveis de ambiente e fazer deploy.

### 2. DATABASE_URL e REDIS_URL Não Injetados

**Impacto:** Crítico  
**Descrição:** O backend não consegue acessar PostgreSQL e Redis.  
**Solução:** Linkar os serviços via Dashboard ou configurar variáveis manualmente.

### 3. Variáveis de Ambiente Faltando

**Impacto:** Crítico  
**Descrição:** APP_SECRET, JWT_SECRET e outras vars essenciais não estão configuradas.  
**Solução:** Executar os comandos `railway variables set` listados acima.

### 4. Root Directory Não Configurado

**Impacto:** Alto  
**Descrição:** O Railway pode tentar buildar da raiz do repo em vez de `giro-license-server/`.  
**Solução:** Configurar Root Directory no Dashboard.

### 5. Dockerfile Path Não Especificado

**Impacto:** Alto  
**Descrição:** Railway pode não encontrar o Dockerfile correto.  
**Solução:** Especificar `backend/Dockerfile` nas configurações.

---

## 🎯 Próximos Passos Recomendados

### Passo 1: Linkar Databases (Via Dashboard - Mais Fácil)

1. Acesse: https://railway.app/project/1e5725e4-9fec-445f-aba1-2365ed26d8d6
2. Clique em "Mercearias"
3. Clique em "Variables"
4. Em "Service Variables", clique em "+ New Variable"
5. Adicione:
   - Name: `DATABASE_URL`
   - Value: `${{Postgres.DATABASE_URL}}`
6. Repita para:
   - Name: `REDIS_URL`
   - Value: `${{Redis.REDIS_URL}}`

### Passo 2: Configurar Outras Variáveis (Via CLI)

```bash
# Certifique-se de estar no serviço Mercearias
railway link -s Mercearias

# Configure as variáveis
railway variables set APP_SECRET=$(openssl rand -base64 32)
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set APP_ENV=production
railway variables set APP_PORT=3000
railway variables set APP_HOST=0.0.0.0
railway variables set JWT_EXPIRATION=86400
railway variables set RUST_LOG="info,giro_license_server=debug"
railway variables set RATE_LIMIT_REQUESTS=100
railway variables set RATE_LIMIT_WINDOW=60
railway variables set DATABASE_MAX_CONNECTIONS=20
```

### Passo 3: Configurar Build Settings (Via Dashboard)

1. Mercearias → Settings → Source
2. **Root Directory:** `giro-license-server`
3. **Build Provider:** Dockerfile
4. **Dockerfile Path:** `backend/Dockerfile`
5. Salvar

### Passo 4: Deploy

```bash
railway up
```

Ou via Dashboard: Mercearias → Deployments → "Deploy Now"

### Passo 5: Migrations

```bash
# Aguardar deploy completar, então:
railway run bash -c "cd backend && sqlx migrate run"
```

### Passo 6: Testar

```bash
# Pegar a URL do serviço
BACKEND_URL=$(railway status --json | jq -r '.services.edges[] | select(.node.name == "Mercearias") | .node.serviceInstances.edges[0].node.domains.serviceDomains[0].domain')

# Testar health
curl https://$BACKEND_URL/api/v1/health
```

---

## 📊 Custos Estimados

Com base na configuração atual:

| Serviço            | Uso Estimado              | Custo Mensal    |
| ------------------ | ------------------------- | --------------- |
| PostgreSQL         | ~1GB storage, low usage   | ~$5-7           |
| Redis              | ~500MB storage, low usage | ~$3-5           |
| Mercearias Backend | ~512MB RAM, 0.5 vCPU      | ~$5-10          |
| **Total**          |                           | **~$13-22/mês** |

**Free Tier:** 500 horas/mês + $5 crédito  
**Status:** Pode usar free tier inicialmente

---

## 🔐 Credenciais e URLs

### PostgreSQL

- **Host Interno:** `postgres.railway.internal:5432`
- **Host Público:** `trolley.proxy.rlwy.net:49625`
- **User:** `postgres`
- **Password:** `DRUoICWbWfwQPEFisHLbTHJROwgsGUzo`
- **Database:** `railway`

### Redis

- **Host Interno:** `redis.railway.internal:6379`
- **Host Público:** `switchyard.proxy.rlwy.net:11133`
- **User:** `default`
- **Password:** `HbLZawxQpfLdmpmKxIVxeElIlDQcFiAQ`

### IDs Importantes

- **Project ID:** `1e5725e4-9fec-445f-aba1-2365ed26d8d6`
- **Environment ID:** `671351b9-3ab1-4b7c-be4f-a9542837c8c5`
- **Postgres Service ID:** `31d18d5b-c5b7-4197-9a37-d87dc569008a`
- **Redis Service ID:** `7c53ac9e-4cf1-45a9-8f8a-2826fbdf12f4`
- **Mercearias Service ID:** `c7ca7840-f800-47ed-9772-935400360a69`

---

## 📝 Comandos Úteis

```bash
# Ver status geral
railway status

# Ver status JSON completo
railway status --json | jq

# Mudar para serviço específico
railway link -s Mercearias
railway link -s Postgres
railway link -s Redis

# Ver variáveis de um serviço
railway variables --service Postgres
railway variables --service Redis
railway variables --service Mercearias

# Ver logs
railway logs --follow

# Deploy
railway up

# Executar comando no container
railway run bash
railway run env  # Ver todas as env vars no runtime
```

---

**Conclusão:** O projeto está 70% configurado. PostgreSQL e Redis estão prontos e rodando. O serviço backend foi criado mas **precisa de configuração de variáveis e deploy inicial**.

**Tempo estimado para conclusão:** 15-20 minutos seguindo os passos acima.
