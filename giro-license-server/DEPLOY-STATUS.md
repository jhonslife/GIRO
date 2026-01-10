# ✅ Deploy Railway - Configuração Completa

## 📦 Arquivos Criados

### 1. Configuração do Railway

- **`railway.json`** - Configuração principal do projeto
- **`railway.toml`** - Configuração adicional do serviço
- **`backend/Dockerfile`** - Multi-stage build otimizado (já existia)
- **`backend/railway.toml`** - Config específica do backend (já existia)

### 2. Scripts de Deploy

- **`deploy-railway.sh`** - Script completo de setup e deploy
  - Verifica Railway CLI
  - Linka projeto
  - Cria PostgreSQL e Redis
  - Configura variáveis de ambiente
  - Faz deploy
- **`deploy.sh`** - Script de deploy rápido
  - Para uso após configuração inicial
- **`railway-commands.sh`** - Referência de comandos CLI
  - Todos os comandos úteis do Railway
  - Exemplos práticos
  - Troubleshooting

### 3. Documentação

- **`DEPLOY-MANUAL.md`** - Guia passo a passo pelo Dashboard
  - Setup visual via Railway UI
  - Configuração de serviços
  - Variáveis de ambiente
  - Checklist completo
- **`RAILWAY_DEPLOY.md`** - Documentação técnica completa

  - Referência detalhada
  - Troubleshooting avançado
  - Monitoramento

- **`README.md`** - Atualizado com seção de deploy

---

## 🎯 Como Fazer o Deploy

### Via Dashboard (Mais Fácil)

1. Abra [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md)
2. Siga o passo a passo de 5 minutos
3. Pronto!

### Via CLI (Automático)

```bash
cd giro-license-server
./deploy-railway.sh
```

### Via CLI (Manual)

```bash
# 1. Login
railway login

# 2. Link
railway link -p 1e5725e4-9fec-445f-aba1-2365ed26d8d6

# 3. Criar serviços (via dashboard é mais fácil)
# - PostgreSQL
# - Redis
# - Backend (GitHub repo)

# 4. Configurar variáveis (ver DEPLOY-MANUAL.md)

# 5. Deploy
railway up
```

---

## 📊 Status Atual

| Componente    | Status       | Notas                          |
| ------------- | ------------ | ------------------------------ |
| Railway CLI   | ✅ Instalado | `/usr/bin/railway`             |
| Configurações | ✅ Criadas   | railway.json, railway.toml     |
| Scripts       | ✅ Prontos   | deploy-railway.sh, deploy.sh   |
| Documentação  | ✅ Completa  | 4 arquivos de docs             |
| Dockerfile    | ✅ Otimizado | Multi-stage, cache layers      |
| Backend       | ✅ Pronto    | Compilando e rodando local     |
| **Deploy**    | ⏳ Pendente  | Aguardando criação de serviços |

---

## ⏭️ Próximos Passos

### Para Deploy Imediato

1. **Opção A - Dashboard (5 min)**
   - Acesse https://railway.app/dashboard
   - Siga [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md)
2. **Opção B - CLI (10 min)**
   ```bash
   ./deploy-railway.sh
   # Siga os prompts interativos
   ```

### Após Deploy

1. Rodar migrations:

   ```bash
   railway run bash -c "cd backend && sqlx migrate run"
   ```

2. Testar health check:

   ```bash
   curl $(railway status --json | jq -r '.deployment.url')/api/v1/health
   ```

3. Criar primeiro admin:

   ```bash
   curl -X POST https://seu-servico.railway.app/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@giro.com.br",
       "password": "SenhaForte@123",
       "name": "Admin GIRO"
     }'
   ```

4. Configurar domínio custom (opcional):
   ```bash
   railway domain add api.giro.com.br
   ```

### Configuração Contínua

1. No Railway Dashboard > Settings:

   - Ativar "Deploy on push to main"
   - Configurar watch paths: `giro-license-server/**`

2. Configurar Stripe (quando ready):

   ```bash
   railway variables set STRIPE_SECRET_KEY=sk_live_xxx
   railway variables set STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

3. Configurar Email (Resend):
   ```bash
   railway variables set RESEND_API_KEY=re_xxx
   railway variables set EMAIL_FROM=noreply@giro.com.br
   ```

---

## 🔍 Verificação Pós-Deploy

### Checklist

- [ ] PostgreSQL rodando e acessível
- [ ] Redis rodando e acessível
- [ ] Backend build successful (sem erros)
- [ ] Health check retorna 200 OK
- [ ] DATABASE_URL injetado automaticamente
- [ ] REDIS_URL injetado automaticamente
- [ ] Todas as variáveis de ambiente setadas
- [ ] Migrations executadas com sucesso
- [ ] Endpoint de login funcionando
- [ ] JWT tokens sendo gerados corretamente
- [ ] Rate limiting ativo
- [ ] Logs sem erros críticos

### Comandos de Verificação

```bash
# Status geral
railway status

# Logs em tempo real
railway logs --follow

# Testar health
RAILWAY_URL=$(railway status --json | jq -r '.deployment.url')
curl $RAILWAY_URL/api/v1/health

# Testar registro
curl -X POST $RAILWAY_URL/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123","name":"Test"}'

# Testar login
curl -X POST $RAILWAY_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123"}'
```

---

## 📚 Recursos

### Links Úteis

- **Railway Dashboard:** https://railway.app/project/1e5725e4-9fec-445f-aba1-2365ed26d8d6
- **Railway Docs:** https://docs.railway.app
- **Rust Axum:** https://docs.rs/axum
- **SQLx:** https://docs.rs/sqlx

### Arquivos de Referência

- Configuração Railway: `railway.json`, `railway.toml`
- Dockerfile: `backend/Dockerfile`
- Migrations: `backend/migrations/`
- Schema Prisma: `backend/prisma/schema.prisma` (futuro)
- Env vars: `backend/.env.example`

---

## 🎉 Resumo

Tudo está pronto para o deploy! Você tem 3 opções:

1. **🌐 Dashboard** (mais visual) → [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md)
2. **⚡ Script automático** → `./deploy-railway.sh`
3. **🛠️ Manual CLI** → [railway-commands.sh](railway-commands.sh)

Escolha a que preferir e em menos de 10 minutos seu servidor estará no ar! 🚀

---

**Configurado por:** GitHub Copilot  
**Data:** 10 de Janeiro de 2026  
**Status:** ✅ Pronto para Deploy
