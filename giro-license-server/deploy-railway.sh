#!/bin/bash
set -e

echo "🚂 GIRO License Server - Railway Deploy Script"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI não encontrado!${NC}"
    echo "Instale com: curl -fsSL https://railway.com/install.sh | sh"
    exit 1
fi

echo -e "${GREEN}✅ Railway CLI encontrado${NC}"

# Navigate to project root
cd "$(dirname "$0")"

# Link project if not linked
if [ ! -f ".railway" ]; then
    echo -e "${YELLOW}⚠️  Projeto não linkado. Linkando agora...${NC}"
    railway link -p 1e5725e4-9fec-445f-aba1-2365ed26d8d6
else
    echo -e "${GREEN}✅ Projeto já linkado${NC}"
fi

# Check for required services
echo ""
echo "📋 Verificando serviços necessários..."

# Check if PostgreSQL exists
if ! railway variables --service postgres &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL não encontrado. Criando...${NC}"
    railway add --database postgres
    echo -e "${GREEN}✅ PostgreSQL criado!${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL já existe${NC}"
fi

# Check if Redis exists
if ! railway variables --service redis &> /dev/null; then
    echo -e "${YELLOW}⚠️  Redis não encontrado. Criando...${NC}"
    railway add --database redis
    echo -e "${GREEN}✅ Redis criado!${NC}"
else
    echo -e "${GREEN}✅ Redis já existe${NC}"
fi

# Set environment variables
echo ""
echo "🔧 Configurando variáveis de ambiente..."

# Generate secrets if not set
APP_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

echo "Configurando APP_ENV..."
railway variables set APP_ENV=production

echo "Configurando APP_PORT..."
railway variables set APP_PORT=3000

echo "Configurando APP_HOST..."
railway variables set APP_HOST=0.0.0.0

echo "Configurando APP_SECRET..."
railway variables set APP_SECRET="$APP_SECRET"

echo "Configurando JWT_SECRET..."
railway variables set JWT_SECRET="$JWT_SECRET"

echo "Configurando JWT_EXPIRATION..."
railway variables set JWT_EXPIRATION=86400

echo "Configurando RUST_LOG..."
railway variables set RUST_LOG="info,giro_license_server=debug"

echo "Configurando RATE_LIMIT_REQUESTS..."
railway variables set RATE_LIMIT_REQUESTS=100

echo "Configurando RATE_LIMIT_WINDOW..."
railway variables set RATE_LIMIT_WINDOW=60

echo "Configurando DATABASE_MAX_CONNECTIONS..."
railway variables set DATABASE_MAX_CONNECTIONS=20

echo ""
echo -e "${GREEN}✅ Variáveis configuradas!${NC}"

# Deploy
echo ""
echo "🚀 Iniciando deploy..."
railway up --detach

echo ""
echo -e "${GREEN}✅ Deploy iniciado!${NC}"
echo ""
echo "📊 Para ver logs:"
echo "   railway logs"
echo ""
echo "🌐 Para abrir o dashboard:"
echo "   railway open"
echo ""
echo "✅ Para verificar o status:"
echo "   railway status"
echo ""
echo "🔍 Para testar o health check:"
echo "   curl \$(railway status --json | jq -r '.deployment.url')/api/v1/health"
echo ""
echo "🎉 Deploy concluído!"
