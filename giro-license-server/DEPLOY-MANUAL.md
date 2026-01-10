# 🚀 Deploy Rápido - Railway Dashboard

## Passo a Passo (5 minutos)

### 1. Acessar o Projeto

1. Vá para: https://railway.app/dashboard
2. Abra o projeto **"refreshing-creation"**

### 2. Adicionar PostgreSQL

1. Clique em **"+ New"**
2. Selecione **"Database" > "PostgreSQL"**
3. Clique em **"Deploy"**
4. Aguarde provisionar (30-60s)

### 3. Adicionar Redis

1. Clique em **"+ New"** novamente
2. Selecione **"Database" > "Redis"**
3. Clique em **"Deploy"**
4. Aguarde provisionar (30-60s)

### 4. Criar Serviço Backend

1. Clique em **"+ New"**
2. Selecione **"GitHub Repo"**
3. Conecte este repositório: `jhonslife/Mercearias`
4. Configure:
   - **Root Directory:** `giro-license-server`
   - **Builder:** Dockerfile
   - **Dockerfile Path:** `backend/Dockerfile`

### 5. Configurar Variáveis de Ambiente

No serviço backend, vá em **"Variables"** e adicione:

```bash
APP_ENV=production
APP_PORT=3000
APP_HOST=0.0.0.0
APP_SECRET=<clique em "Generate" para criar um secret>
JWT_SECRET=<clique em "Generate" para criar outro secret>
JWT_EXPIRATION=86400
RUST_LOG=info,giro_license_server=debug
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
DATABASE_MAX_CONNECTIONS=20
```

**Importante:** DATABASE_URL e REDIS_URL são injetados automaticamente!

### 6. Linkar os Serviços

No serviço **backend**:

1. Vá em **"Service Settings"**
2. Clique em **"Connect" no PostgreSQL**
3. Clique em **"Connect" no Redis**

Isso injeta automaticamente `${{Postgres.DATABASE_URL}}` e `${{Redis.REDIS_URL}}`

### 7. Deploy!

1. Clique em **"Deploy"** ou espere o auto-deploy
2. Aguarde o build (~5-10 min na primeira vez)
3. Quando aparecer "Deployed", está no ar! 🎉

### 8. Rodar Migrations

No terminal local:

```bash
cd giro-license-server

# Link com o projeto
railway link -p 1e5725e4-9fec-445f-aba1-2365ed26d8d6

# Rodar migrations
railway run --service backend bash -c "cd backend && sqlx migrate run"
```

### 9. Testar

Pegue a URL pública do serviço (aparece no dashboard) e teste:

```bash
curl https://seu-servico.up.railway.app/api/v1/health
```

Deve retornar:

```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected"
}
```

---

## 🔧 Configuração Automática de Deploy

Para deploys automáticos a cada push:

1. No serviço backend, vá em **"Settings" > "Service"**
2. Em **"Deploy Triggers"**, ative:
   - ✅ **"Deploy on push to main"**
   - ✅ **"Deploy on PR"** (opcional)
3. Em **"Watch Paths"**, adicione:
   ```
   giro-license-server/**
   ```

Agora cada push para `main` faz deploy automático!

---

## ✅ Checklist

- [ ] PostgreSQL criado e rodando
- [ ] Redis criado e rodando
- [ ] Backend service criado
- [ ] Variáveis de ambiente configuradas
- [ ] Serviços linkados (DATABASE_URL + REDIS_URL)
- [ ] Primeiro deploy concluído
- [ ] Migrations rodadas
- [ ] Health check respondendo 200 OK
- [ ] Domain configurado (opcional)

---

## 🎯 Links Úteis

- **Dashboard:** https://railway.app/project/1e5725e4-9fec-445f-aba1-2365ed26d8d6
- **Docs Railway:** https://docs.railway.app
- **Dockerfile:** `giro-license-server/backend/Dockerfile`
- **Migrations:** `giro-license-server/backend/migrations/`

---

## 🆘 Problemas Comuns

### Build falha com "sqlx offline mode"

✅ Já está configurado em `Dockerfile`:

```dockerfile
ENV SQLX_OFFLINE=true
```

### "Connection refused" no PostgreSQL

- Verifique se os serviços estão linkados
- DATABASE_URL deve estar nas variáveis automaticamente

### Health check timeout

- Aumente o timeout em Settings > Healthcheck > 30s
- Verifique logs: `railway logs --service backend`

---

**Pronto! Seu servidor está na nuvem! ☁️**
