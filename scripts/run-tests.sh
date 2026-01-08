#!/bin/bash

# 🧪 Script de Testes - Mercearias Desktop
# Executa todos os testes do projeto de forma organizada

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║         🧪 MERCEARIAS - SUITE DE TESTES                 ║"
echo "║              Arkheion Corp © 2026                        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Diretório do projeto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DESKTOP_DIR="$PROJECT_DIR/apps/desktop"

cd "$DESKTOP_DIR"

# Função para executar comando com título
run_test() {
    local title=$1
    local command=$2
    
    echo -e "\n${YELLOW}▶ $title${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if eval "$command"; then
        echo -e "${GREEN}✓ $title - PASSOU${NC}"
        return 0
    else
        echo -e "${RED}✗ $title - FALHOU${NC}"
        return 1
    fi
}

# Menu de opções
echo -e "${BLUE}Escolha o tipo de teste:${NC}"
echo "1) Todos os testes"
echo "2) Apenas testes unitários"
echo "3) Apenas testes de integração"
echo "4) Apenas testes E2E"
echo "5) Testes com cobertura"
echo "6) Testes E2E com UI"
echo "7) Verificar setup"
echo ""
read -p "Opção [1-7]: " option

case $option in
    1)
        echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  EXECUTANDO TODOS OS TESTES${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
        
        run_test "Testes Unitários" "npm run test:run -- tests/unit" || true
        run_test "Testes de Integração" "npm run test:run -- tests/integration" || true
        run_test "Testes E2E" "npm run test:e2e" || true
        ;;
    
    2)
        echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  TESTES UNITÁRIOS${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
        
        run_test "Formatadores" "npm run test:run -- tests/unit/utils/formatters.test.ts"
        run_test "Validadores" "npm run test:run -- tests/unit/utils/validators.test.ts"
        run_test "Auth Store" "npm run test:run -- src/stores/__tests__/auth-store.test.ts"
        run_test "PDV Store" "npm run test:run -- src/stores/__tests__/pdv-store.test.ts"
        ;;
    
    3)
        echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  TESTES DE INTEGRAÇÃO${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
        
        run_test "Fluxo de Venda" "npm run test:run -- tests/integration/sale.flow.test.ts"
        run_test "Fluxo de Caixa" "npm run test:run -- tests/integration/cash.flow.test.ts"
        ;;
    
    4)
        echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  TESTES E2E${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
        
        run_test "Autenticação" "npx playwright test tests/e2e/auth.spec.ts" || true
        run_test "Sessão de Caixa" "npx playwright test tests/e2e/cash-session.spec.ts" || true
        run_test "Venda Simples" "npx playwright test tests/e2e/sale-simple.spec.ts" || true
        run_test "Venda Avançada" "npx playwright test tests/e2e/sale-advanced.spec.ts" || true
        run_test "Produtos" "npx playwright test tests/e2e/products.spec.ts" || true
        run_test "Estoque" "npx playwright test tests/e2e/stock.spec.ts" || true
        run_test "Hardware" "npx playwright test tests/e2e/hardware.spec.ts" || true
        run_test "Relatórios" "npx playwright test tests/e2e/reports.spec.ts" || true
        ;;
    
    5)
        echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  TESTES COM COBERTURA${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
        
        run_test "Gerando Cobertura" "npm run test:coverage"
        
        echo -e "\n${GREEN}Relatório de cobertura gerado em:${NC}"
        echo -e "${YELLOW}coverage/index.html${NC}"
        
        # Tentar abrir no navegador
        if command -v xdg-open &> /dev/null; then
            xdg-open coverage/index.html 2>/dev/null || true
        fi
        ;;
    
    6)
        echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  TESTES E2E COM UI INTERATIVA${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
        
        npm run test:e2e:ui
        ;;
    
    7)
        echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  VERIFICANDO SETUP DE TESTES${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
        
        echo -e "\n${YELLOW}Verificando dependências...${NC}"
        
        # Verificar Node.js
        if command -v node &> /dev/null; then
            echo -e "${GREEN}✓ Node.js:${NC} $(node --version)"
        else
            echo -e "${RED}✗ Node.js não encontrado${NC}"
        fi
        
        # Verificar npm
        if command -v npm &> /dev/null; then
            echo -e "${GREEN}✓ npm:${NC} $(npm --version)"
        else
            echo -e "${RED}✗ npm não encontrado${NC}"
        fi
        
        # Verificar dependências instaladas
        if [ -d "node_modules" ]; then
            echo -e "${GREEN}✓ node_modules instalado${NC}"
        else
            echo -e "${RED}✗ node_modules não encontrado - Execute: npm install${NC}"
        fi
        
        # Verificar Vitest
        if [ -f "node_modules/.bin/vitest" ]; then
            echo -e "${GREEN}✓ Vitest instalado${NC}"
        else
            echo -e "${RED}✗ Vitest não encontrado${NC}"
        fi
        
        # Verificar Playwright
        if [ -f "node_modules/.bin/playwright" ]; then
            echo -e "${GREEN}✓ Playwright instalado${NC}"
        else
            echo -e "${RED}✗ Playwright não encontrado${NC}"
        fi
        
        # Verificar arquivos de teste
        echo -e "\n${YELLOW}Arquivos de teste encontrados:${NC}"
        echo -e "${BLUE}Unitários:${NC} $(find tests/unit -name "*.test.ts" 2>/dev/null | wc -l)"
        echo -e "${BLUE}Integração:${NC} $(find tests/integration -name "*.test.ts" 2>/dev/null | wc -l)"
        echo -e "${BLUE}E2E:${NC} $(find tests/e2e -name "*.spec.ts" 2>/dev/null | wc -l)"
        
        # Estrutura de diretórios
        echo -e "\n${YELLOW}Estrutura de testes:${NC}"
        tree tests -L 2 -I 'node_modules' 2>/dev/null || ls -R tests
        ;;
    
    *)
        echo -e "${RED}Opção inválida${NC}"
        exit 1
        ;;
esac

# Resumo final
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TESTES CONCLUÍDOS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}Comandos úteis:${NC}"
echo "  npm run test         - Modo watch"
echo "  npm run test:run     - Executar uma vez"
echo "  npm run test:coverage - Com cobertura"
echo "  npm run test:e2e     - Testes E2E"
echo "  npm run test:e2e:ui  - E2E com UI"

echo -e "\n${GREEN}✓ Processo finalizado${NC}\n"
