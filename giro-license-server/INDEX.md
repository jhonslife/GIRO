# 📚 Índice Completo - Deploy Railway

> **Centro de Documentação do Deploy**  
> Tudo que você precisa para colocar o GIRO License Server no ar!

---

## 🎯 Por Onde Começar?

### 👶 Primeira Vez / Iniciante

**→ [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md)**

- Passo a passo visual pelo Dashboard
- Não precisa de terminal
- 5-10 minutos

### ⚡ Quer Velocidade / Tem Experiência

**→ [deploy-railway.sh](deploy-railway.sh)**

```bash
./deploy-railway.sh
```

- Script automático completo
- Setup + Deploy em 1 comando
- 10-15 minutos

### 🛠️ Quer Controle Total

**→ [railway-commands.sh](railway-commands.sh)**

- Todos os comandos CLI documentados
- Exemplos práticos
- Para customização avançada

---

## 📖 Documentação Completa

### 🚀 Deploy Guides

| Arquivo                                    | Descrição                     | Quando Usar              |
| ------------------------------------------ | ----------------------------- | ------------------------ |
| [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md)       | Guia visual pelo Dashboard    | Primeira vez, prefere UI |
| [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)     | Documentação técnica completa | Referência detalhada     |
| [DEPLOY-FLOWCHART.md](DEPLOY-FLOWCHART.md) | Fluxogramas e diagramas       | Entender o processo      |
| [DEPLOY-STATUS.md](DEPLOY-STATUS.md)       | Status atual do projeto       | Ver o que está pronto    |

### 🔧 Scripts Executáveis

| Script                                     | Comando                             | Descrição                  |
| ------------------------------------------ | ----------------------------------- | -------------------------- |
| [deploy-railway.sh](deploy-railway.sh)     | `./deploy-railway.sh`               | Deploy completo automático |
| [deploy.sh](deploy.sh)                     | `./deploy.sh`                       | Deploy rápido (após setup) |
| [test-api-railway.sh](test-api-railway.sh) | `API_URL=xxx ./test-api-railway.sh` | Testar todos endpoints     |
| [railway-commands.sh](railway-commands.sh) | -                                   | Referência de comandos CLI |

### 🆘 Suporte e Troubleshooting

| Arquivo                                  | Descrição                   |
| ---------------------------------------- | --------------------------- |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Problemas comuns e soluções |
| [DEPLOY-STATUS.md](DEPLOY-STATUS.md)     | Checklist e próximos passos |

### 📊 Configuração

| Arquivo                                      | Descrição                   |
| -------------------------------------------- | --------------------------- |
| [railway.json](railway.json)                 | Config principal do Railway |
| [railway.toml](railway.toml)                 | Config do serviço           |
| [backend/Dockerfile](backend/Dockerfile)     | Multi-stage build otimizado |
| [backend/.env.example](backend/.env.example) | Variáveis necessárias       |

---

## 🎓 Tutoriais Passo a Passo

### Tutorial 1: Deploy Via Dashboard (Recomendado)

1. **Setup Inicial** - [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md#1-acessar-o-projeto)

   - Login Railway
   - Abrir projeto

2. **Criar Databases** - [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md#2-adicionar-postgresql)

   - PostgreSQL
   - Redis

3. **Criar Backend** - [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md#4-criar-serviço-backend)

   - Conectar GitHub
   - Configurar Dockerfile

4. **Configurar** - [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md#5-configurar-variáveis-de-ambiente)

   - Env vars
   - Linkar serviços

5. **Deploy** - [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md#7-deploy)
   - Build
   - Migrations
   - Testes

**Tempo estimado:** 10-15 minutos

---

### Tutorial 2: Deploy Via CLI

1. **Instalar CLI**

   ```bash
   curl -fsSL https://railway.com/install.sh | sh
   ```

2. **Rodar Script**

   ```bash
   ./deploy-railway.sh
   ```

3. **Aguardar**

   - Script faz tudo automaticamente
   - Responda os prompts se solicitado

4. **Verificar**
   ```bash
   railway status
   railway logs
   ```

**Tempo estimado:** 5-10 minutos

---

### Tutorial 3: Deploy Manual Avançado

1. **Estudar Comandos** - [railway-commands.sh](railway-commands.sh)

2. **Link Projeto**

   ```bash
   railway link -p 1e5725e4-9fec-445f-aba1-2365ed26d8d6
   ```

3. **Criar Serviços** (via Dashboard é mais fácil)

4. **Configurar Variáveis**

   ```bash
   railway variables set APP_SECRET=$(openssl rand -base64 32)
   railway variables set JWT_SECRET=$(openssl rand -base64 32)
   # ... outras vars
   ```

5. **Deploy**
   ```bash
   railway up
   ```

**Tempo estimado:** 15-20 minutos

---

## 🔍 Busca Rápida

### Preciso configurar X

| O que preciso         | Onde encontrar                                                            |
| --------------------- | ------------------------------------------------------------------------- |
| PostgreSQL            | [DEPLOY-MANUAL.md#2](DEPLOY-MANUAL.md#2-adicionar-postgresql)             |
| Redis                 | [DEPLOY-MANUAL.md#3](DEPLOY-MANUAL.md#3-adicionar-redis)                  |
| Variáveis de ambiente | [DEPLOY-MANUAL.md#5](DEPLOY-MANUAL.md#5-configurar-variáveis-de-ambiente) |
| Migrations            | [DEPLOY-MANUAL.md#8](DEPLOY-MANUAL.md#8-rodar-migrations)                 |
| Domínio custom        | [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md#custom-domain-opcional)             |
| CI/CD                 | [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md#cicd-com-github)                    |

### Deu erro em X

| Problema               | Solução                                                                      |
| ---------------------- | ---------------------------------------------------------------------------- |
| Build falha            | [TROUBLESHOOTING.md#1](TROUBLESHOOTING.md#1-build-fails---sqlx-offline-mode) |
| PostgreSQL não conecta | [TROUBLESHOOTING.md#2](TROUBLESHOOTING.md#2-connection-refused---postgresql) |
| Redis não conecta      | [TROUBLESHOOTING.md#3](TROUBLESHOOTING.md#3-redis-connection-failed)         |
| Health check timeout   | [TROUBLESHOOTING.md#4](TROUBLESHOOTING.md#4-health-check-timeout)            |
| Migrations não rodam   | [TROUBLESHOOTING.md#5](TROUBLESHOOTING.md#5-migrations-não-rodam)            |
| 429 Too Many Requests  | [TROUBLESHOOTING.md#9](TROUBLESHOOTING.md#9-rate-limiting-muito-agressivo)   |

### Quero fazer X

| Ação                   | Como fazer                                             |
| ---------------------- | ------------------------------------------------------ |
| Ver logs               | `railway logs --follow`                                |
| Testar API             | `./test-api-railway.sh`                                |
| Conectar no PostgreSQL | `railway connect postgres`                             |
| Executar migration     | `railway run bash -c "cd backend && sqlx migrate run"` |
| Rollback deploy        | `railway rollback`                                     |
| Ver métricas           | `railway open` → Metrics tab                           |

---

## 📝 Checklist Completo

### Antes do Deploy

- [ ] Railway CLI instalado
- [ ] Autenticado (`railway whoami`)
- [ ] Dockerfile funciona localmente
- [ ] Migrations testadas
- [ ] Endpoints testados localmente

### Durante o Deploy

- [ ] PostgreSQL criado
- [ ] Redis criado
- [ ] Backend service criado
- [ ] Serviços linkados
- [ ] Variáveis configuradas
- [ ] Build completo
- [ ] Health check OK

### Depois do Deploy

- [ ] Migrations executadas
- [ ] Health endpoint responde
- [ ] Login funciona
- [ ] Licenças criam/validam
- [ ] Logs sem erros
- [ ] Domínio configurado (opcional)
- [ ] CI/CD ativo

### Produção

- [ ] Stripe configurado
- [ ] Email configurado
- [ ] Monitoring ativo
- [ ] Backups configurados
- [ ] Alertas configurados

---

## 🎯 Links Úteis

### Railway

- **Dashboard:** https://railway.app/project/1e5725e4-9fec-445f-aba1-2365ed26d8d6
- **Docs:** https://docs.railway.app
- **Status:** https://status.railway.app

### GIRO

- **Backend Repo:** jhonslife/Mercearias/giro-license-server
- **Desktop Repo:** jhonslife/Mercearias/apps/desktop
- **Docs:** /docs/

### Ferramentas

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Resend Dashboard:** https://resend.com/emails

---

## 💡 Dicas

### 🚀 Performance

- Multi-stage Dockerfile já otimizado
- Build cache funciona automaticamente
- Use `--detach` para não bloquear terminal

### 💰 Custos

- Free tier: 500 horas/mês + $5 crédito
- PostgreSQL pequeno: ~$5/mês
- Redis pequeno: ~$3/mês
- Backend: ~$5-10/mês (conforme uso)

### 🔒 Segurança

- Sempre use secrets gerados (`openssl rand -base64 32`)
- NUNCA commite .env com secrets reais
- Ative 2FA no Railway
- Use variáveis de ambiente, não hardcode

### 📊 Monitoring

- Configure alertas no Railway Dashboard
- Use `railway logs --follow` para debug
- Monitore métricas de uso
- Configure health checks

---

## 🆘 Precisa de Ajuda?

1. **Procure no Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. **Veja os logs:** `railway logs --follow`
3. **Consulte a documentação:** Links acima
4. **Abra uma issue:** No GitHub com logs anexados

---

## 📅 Próximas Atualizações

- [ ] GitHub Actions para CI/CD automático
- [ ] Script de backup automático
- [ ] Monitoring com Grafana/Prometheus
- [ ] Testes de carga
- [ ] Documentação da API (Swagger)

---

**Tudo pronto para deploy! Escolha seu caminho e boa sorte! 🚀**

---

_Última atualização: 10 de Janeiro de 2026_  
_Versão: 1.0.0_
