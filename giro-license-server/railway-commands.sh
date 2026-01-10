#!/bin/bash

# 🚂 Railway CLI - Comandos Úteis

# ===================================
# SETUP INICIAL
# ===================================

# Login
railway login

# Link com projeto existente
railway link -p 1e5725e4-9fec-445f-aba1-2365ed26d8d6 -e production

# Criar novo serviço no projeto
railway service create backend

# ===================================
# ADICIONAR DATABASES
# ===================================

# PostgreSQL
railway add --database postgres

# Redis
railway add --database redis

# ===================================
# VARIÁVEIS DE AMBIENTE
# ===================================

# Gerar e setar secrets
railway variables --set "APP_SECRET=$(openssl rand -base64 32)"
railway variables --set "JWT_SECRET=$(openssl rand -base64 32)"

# Variáveis de configuração
railway variables --set "APP_ENV=production"
railway variables --set "APP_PORT=3000"
railway variables --set "APP_HOST=0.0.0.0"
railway variables --set "JWT_EXPIRATION=86400"
railway variables --set "RUST_LOG=info,giro_license_server=debug"
railway variables --set "RATE_LIMIT_REQUESTS=100"
railway variables --set "RATE_LIMIT_WINDOW=60"
railway variables --set "DATABASE_MAX_CONNECTIONS=20"

# Listar todas as variáveis
railway variables

# Deletar uma variável (não existe comando direto, use Dashboard)
# railway variables delete VARIABLE_NAME  # NÃO EXISTE

# ===================================
# DEPLOY
# ===================================

# Deploy e aguardar
railway up

# Deploy em background
railway up --detach

# Deploy com rebuild forçado
railway up --detach --force

# ===================================
# MONITORING
# ===================================

# Ver status
railway status

# Ver logs em tempo real
railway logs --follow

# Ver logs de um deployment específico
railway logs --deployment <deployment-id>

# Ver logs de build
railway logs --build

# ===================================
# MIGRATIONS
# ===================================

# Rodar migrations no Railway
railway run --service backend bash -c "cd backend && sqlx migrate run"

# Conectar ao PostgreSQL
railway run --service postgres psql

# Executar query SQL
railway run --service postgres psql -c "SELECT * FROM admins;"

# ===================================
# DOMAINS
# ===================================

# Adicionar domínio custom
railway domain add api.giro.com.br

# Listar domínios
railway domain

# Remover domínio
railway domain remove api.giro.com.br

# ===================================
# SERVICES
# ===================================

# Listar serviços
railway service

# Selecionar serviço ativo
railway service select backend

# ===================================
# ENVIRONMENTS
# ===================================

# Listar environments
railway environment

# Criar novo environment
railway environment create staging

# Mudar environment
railway environment select production

# ===================================
# CONECTAR A DATABASES
# ===================================

# Conectar a PostgreSQL localmente
railway connect postgres

# Conectar a Redis localmente
railway connect redis

# ===================================
# TROUBLESHOOTING
# ===================================

# Ver todas as informações do projeto
railway status --json | jq

# Ver deployment history
railway deployments

# Rollback para deployment anterior
railway rollback

# Rebuild último deployment
railway up --detach

# Ver uso de recursos
railway usage

# ===================================
# OUTROS
# ===================================

# Abrir projeto no browser
railway open

# Abrir serviço específico no browser
railway open --service backend

# Ver versão do CLI
railway --version

# Atualizar CLI
railway upgrade

# Logout
railway logout

# Ver ajuda
railway --help
railway <command> --help

# ===================================
# EXEMPLO COMPLETO DE SETUP
# ===================================

# 1. Login
railway login

# 2. Link
railway link -p 1e5725e4-9fec-445f-aba1-2365ed26d8d6

# 3. Criar serviços (se não existem)
# Isso é feito melhor pelo dashboard
# railway add --database postgres
# railway add --database redis

# 4. Configurar variáveis
railway variables set APP_ENV=production
railway variables set APP_SECRET=$(openssl rand -base64 32)
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# 5. Deploy
railway up

# 6. Migrations
railway run bash -c "cd backend && sqlx migrate run"

# 7. Testar
curl $(railway status --json | jq -r '.deployment.url')/api/v1/health

# ===================================
# SCRIPTS ÚTEIS
# ===================================

# Ver URL do serviço
railway status --json | jq -r '.deployment.url'

# Executar comando no container
railway run bash

# Fazer backup do database
railway connect postgres -- pg_dump > backup.sql

# Restaurar backup
cat backup.sql | railway connect postgres -- psql

# Ver variáveis formatadas
railway variables --json | jq

# Monitorar logs com filtro
railway logs --follow | grep ERROR

# ===================================
# NOTAS
# ===================================

# - DATABASE_URL é injetado automaticamente quando você linka PostgreSQL
# - REDIS_URL é injetado automaticamente quando você linka Redis
# - O Railway detecta Dockerfile automaticamente
# - Build cache é mantido entre deploys
# - Logs são retidos por 7 dias
# - Free tier: 500 horas/mês, $5 de crédito
