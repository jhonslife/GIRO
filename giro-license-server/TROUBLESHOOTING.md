# 🔧 Troubleshooting Guide - Railway Deploy

## 🚨 Problemas Comuns e Soluções

---

### 1. Build Fails - "sqlx offline mode"

#### Erro

```
error: environment variable DATABASE_URL must be set
```

#### Causa

SQLx precisa do database schema em compile-time.

#### Solução ✅

```dockerfile
# Já está configurado no Dockerfile
ENV SQLX_OFFLINE=true
```

Verifique se `.sqlx/` existe no repositório:

```bash
ls -la backend/.sqlx/
```

Se não existir, gere localmente:

```bash
cd backend
cargo sqlx prepare
git add .sqlx/
git commit -m "Add SQLx offline data"
git push
```

---

### 2. Connection Refused - PostgreSQL

#### Erro

```
Error: Connection refused (os error 111)
or
Error: Connection timeout
```

#### Causa

DATABASE_URL não está configurado ou serviços não estão linkados.

#### Solução ✅

1. Verifique se PostgreSQL está rodando:

```bash
railway status --service postgres
```

2. Verifique as variáveis:

```bash
railway variables | grep DATABASE_URL
```

3. Se DATABASE_URL não aparecer, linke os serviços:

   - Railway Dashboard > Backend Service > Settings
   - Connect > PostgreSQL
   - Isso injeta automaticamente `${{Postgres.DATABASE_URL}}`

4. Force rebuild:

```bash
railway up --force
```

---

### 3. Redis Connection Failed

#### Erro

```
Error: Redis connection failed
or
RateLimitExceeded
```

#### Causa

REDIS_URL não está configurado.

#### Solução ✅

1. Verifique se Redis está rodando:

```bash
railway status --service redis
```

2. Linke o Redis:

   - Railway Dashboard > Backend Service > Settings
   - Connect > Redis

3. Teste a conexão:

```bash
railway run --service redis redis-cli ping
# Deve retornar: PONG
```

---

### 4. Health Check Timeout

#### Erro

```
Deployment failed: health check timeout
```

#### Causa

- Servidor não está respondendo no `/health`
- Porta errada
- Servidor travou ao iniciar

#### Solução ✅

1. Verifique os logs:

```bash
railway logs --follow
```

2. Procure por:

   - "Server listening on..." → Porta correta?
   - Panics ou crashes
   - Connection errors

3. Verifique a configuração do health check:

```json
// railway.json
{
  "deploy": {
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 30
  }
}
```

4. Teste o endpoint localmente:

```bash
# Se estiver rodando localmente
curl http://localhost:3000/api/v1/health
```

5. Aumente o timeout se necessário:

```bash
railway variables set HEALTHCHECK_TIMEOUT=60
```

---

### 5. Migrations Não Rodam

#### Erro

```
Error: Migration table not found
or
Error: Migration xxx not applied
```

#### Causa

Migrations não foram executadas no Railway.

#### Solução ✅

1. Rode manualmente:

```bash
railway run bash -c "cd backend && sqlx migrate run"
```

2. Verifique se rodou:

```bash
railway run --service postgres psql -c "SELECT * FROM _sqlx_migrations;"
```

3. Se falhar, verifique DATABASE_URL:

```bash
railway variables | grep DATABASE_URL
```

4. Alternativa - rode direto no PostgreSQL:

```bash
railway run --service postgres psql < backend/migrations/001_initial.sql
```

---

### 6. "Port Already in Use"

#### Erro

```
Error: Address already in use (os error 98)
```

#### Causa

- APP_PORT configurado errado
- Conflito de porta

#### Solução ✅

Railway automaticamente atribui uma porta via `$PORT`.

1. Verifique se está usando a variável PORT do Railway:

```rust
// src/config.rs
let port = env::var("PORT")
    .unwrap_or_else(|_| env::var("APP_PORT").unwrap_or("3000".to_string()));
```

2. Não force a porta 3000 se `$PORT` existir.

3. Configure:

```bash
railway variables set APP_PORT=3000
```

---

### 7. "No Space Left on Device"

#### Erro

```
Error: No space left on device
```

#### Causa

Build muito grande ou cache cheio.

#### Solução ✅

1. Otimize o Dockerfile (já está otimizado):

```dockerfile
# Multi-stage build reduz tamanho final
FROM rust:1.83-slim AS builder
# ... build ...
FROM debian:bookworm-slim AS production
# Apenas o binário
```

2. Limpe o cache de build:

```bash
railway up --force
```

3. Verifique o tamanho da imagem:

```bash
docker images | grep giro-license-server
# Deve ser < 200MB
```

---

### 8. JWT Validation Fails

#### Erro

```
401 Unauthorized
or
Invalid token
```

#### Causa

JWT_SECRET diferente entre deploys.

#### Solução ✅

1. Verifique se JWT_SECRET está setado:

```bash
railway variables | grep JWT_SECRET
```

2. Se não estiver, gere um:

```bash
railway variables set JWT_SECRET=$(openssl rand -base64 32)
```

3. **Importante:** Após mudar JWT_SECRET, todos os tokens antigos são invalidados!

4. Faça login novamente para obter novo token.

---

### 9. Rate Limiting Muito Agressivo

#### Erro

```
429 Too Many Requests
```

#### Causa

Rate limit muito baixo para produção.

#### Solução ✅

1. Aumente os limites:

```bash
railway variables set RATE_LIMIT_REQUESTS=1000
railway variables set RATE_LIMIT_WINDOW=60
```

2. Ou desabilite temporariamente para debug:

```bash
railway variables set RATE_LIMIT_REQUESTS=999999
```

3. Verifique os logs:

```bash
railway logs | grep "rate limit"
```

---

### 10. Env Vars Não Carregam

#### Erro

```
Environment variable XXX not set
```

#### Causa

Variável não foi definida no Railway.

#### Solução ✅

1. Liste todas as variáveis:

```bash
railway variables
```

2. Compare com `.env.example`:

```bash
cat backend/.env.example
```

3. Adicione as faltantes:

```bash
railway variables set MISSING_VAR=value
```

4. Verifique no runtime:

```bash
railway run env | grep MISSING_VAR
```

---

### 11. Stripe Webhooks Não Funcionam

#### Erro

```
Webhook signature verification failed
```

#### Causa

STRIPE_WEBHOOK_SECRET errado.

#### Solução ✅

1. Pegue o webhook secret do Stripe Dashboard:

   - https://dashboard.stripe.com/webhooks
   - Clique no webhook
   - "Signing secret"

2. Configure no Railway:

```bash
railway variables set STRIPE_WEBHOOK_SECRET=whsec_xxx
```

3. Configure o endpoint no Stripe:
   - URL: `https://seu-dominio.railway.app/api/v1/webhooks/stripe`

---

### 12. CORS Errors no Frontend

#### Erro

```
Access to fetch blocked by CORS policy
```

#### Causa

Frontend URL não está na whitelist de CORS.

#### Solução ✅

1. Configure FRONTEND_URL:

```bash
railway variables set FRONTEND_URL=https://seu-dashboard.vercel.app
```

2. Verifique o middleware de CORS:

```rust
// src/main.rs
let cors = CorsLayer::new()
    .allow_origin(frontend_url.parse::<HeaderValue>()?)
    .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
    .allow_headers([AUTHORIZATION, CONTENT_TYPE]);
```

3. Para desenvolvimento, permita localhost:

```bash
railway variables set FRONTEND_URL=http://localhost:5173
```

---

## 🔍 Debug Tools

### Ver Logs Específicos

```bash
# Últimas 100 linhas
railway logs --tail 100

# Apenas erros
railway logs | grep -i error

# Apenas de um deployment
railway logs --deployment <id>

# Com timestamp
railway logs --timestamps
```

### Executar Comandos no Container

```bash
# Bash interativo
railway run bash

# Comando específico
railway run ls -la /app

# Ver variáveis de ambiente
railway run env

# Testar conexão PostgreSQL
railway run psql $DATABASE_URL -c "SELECT 1"

# Testar conexão Redis
railway run redis-cli -u $REDIS_URL ping
```

### Monitoramento

```bash
# Status em tempo real
watch -n 5 railway status

# Métricas
railway metrics

# Ver deployments
railway deployments

# Ver uso de recursos
railway usage
```

---

## 📞 Quando Pedir Ajuda

Se nada funcionar, colete estas informações:

```bash
# 1. Status geral
railway status --json > railway-status.json

# 2. Logs completos
railway logs --tail 500 > railway-logs.txt

# 3. Variáveis (sem valores sensíveis)
railway variables | sed 's/=.*/=***/' > railway-vars.txt

# 4. Deployment history
railway deployments > railway-deployments.txt

# 5. Versão do CLI
railway --version > railway-version.txt

# 6. Dockerfile
cp backend/Dockerfile railway-dockerfile.txt
```

Depois abra uma issue com esses arquivos anexados.

---

## ✅ Checklist de Debug

Quando algo der errado, siga esta ordem:

1. [ ] Ver logs: `railway logs --follow`
2. [ ] Verificar status: `railway status`
3. [ ] Verificar variáveis: `railway variables`
4. [ ] Testar PostgreSQL: `railway run psql $DATABASE_URL -c "SELECT 1"`
5. [ ] Testar Redis: `railway run redis-cli -u $REDIS_URL ping`
6. [ ] Verificar health: `curl $(railway status --json | jq -r '.deployment.url')/api/v1/health`
7. [ ] Rebuild: `railway up --force`
8. [ ] Rollback: `railway rollback`

---

**Se tudo mais falhar, delete e recrie o serviço! Às vezes é mais rápido. 🔄**
