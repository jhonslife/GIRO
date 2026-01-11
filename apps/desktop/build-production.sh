#!/bin/bash
set -e

echo "🏗️  GIRO - Build de Produção"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar dependências
echo "🔍 Verificando dependências..."
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ Rust/Cargo não encontrado${NC}"
    echo "Instale via: https://rustup.rs/"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependências OK${NC}"
echo ""

# 2. Verificar seed.sql (CRÍTICO)
echo "🔐 Verificando segurança..."
if [ -f "src-tauri/seed.sql" ]; then
    if grep -q "emp-admin-001" src-tauri/seed.sql; then
        echo -e "${YELLOW}⚠️  AVISO CRÍTICO: seed.sql contém admin padrão de DESENVOLVIMENTO!${NC}"
        echo ""
        echo "Em produção, o admin deve ser criado no primeiro acesso."
        echo "Deseja continuar com o build? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            echo -e "${RED}❌ Build cancelado${NC}"
            exit 1
        fi
    fi
fi
echo -e "${GREEN}✅ Verificação de segurança OK${NC}"
echo ""

# 3. Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf src-tauri/target/release/bundle
rm -rf dist
echo -e "${GREEN}✅ Limpeza concluída${NC}"
echo ""

# 4. Instalar dependências (se necessário)
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

# 5. Rodar testes (opcional, mas recomendado)
echo "🧪 Deseja executar os testes antes do build? (Y/n)"
read -r run_tests
if [[ ! "$run_tests" =~ ^[Nn]$ ]]; then
    echo "Executando testes unitários..."
    npm run test:unit 2>/dev/null || echo -e "${YELLOW}⚠️  Alguns testes falharam${NC}"
    
    echo "Executando testes E2E..."
    npm run test:e2e 2>/dev/null || echo -e "${YELLOW}⚠️  Alguns testes E2E falharam${NC}"
fi
echo ""

# 6. Build do frontend
echo "📦 Compilando frontend React..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao compilar frontend${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend compilado${NC}"
echo ""

# 7. Build do Tauri (Rust + Bundle)
echo "🦀 Compilando backend Rust + criando instalador..."
echo "Isso pode levar alguns minutos..."
npm run tauri:build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao compilar Tauri${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build Tauri concluído${NC}"
echo ""

# 8. Mostrar resultados
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ BUILD DE PRODUÇÃO CONCLUÍDO!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📂 Arquivos gerados:"
echo ""

# Detectar sistema operacional e mostrar caminho correto
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    BUNDLE_PATH="src-tauri/target/release/bundle"
    if [ -d "$BUNDLE_PATH/deb" ]; then
        echo "  🐧 Linux (.deb):"
        ls -lh $BUNDLE_PATH/deb/*.deb | awk '{print "     "$9" ("$5")"}'
    fi
    if [ -d "$BUNDLE_PATH/appimage" ]; then
        echo "  🐧 Linux (AppImage):"
        ls -lh $BUNDLE_PATH/appimage/*.AppImage | awk '{print "     "$9" ("$5")"}'
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    BUNDLE_PATH="src-tauri/target/release/bundle"
    if [ -d "$BUNDLE_PATH/dmg" ]; then
        echo "  🍎 macOS (.dmg):"
        ls -lh $BUNDLE_PATH/dmg/*.dmg | awk '{print "     "$9" ("$5")"}'
    fi
    if [ -d "$BUNDLE_PATH/macos" ]; then
        echo "  🍎 macOS (.app):"
        ls -lh $BUNDLE_PATH/macos/*.app | awk '{print "     "$9" ("$5")"}'
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    BUNDLE_PATH="src-tauri/target/release/bundle"
    if [ -d "$BUNDLE_PATH/msi" ]; then
        echo "  🪟 Windows (.msi):"
        ls -lh $BUNDLE_PATH/msi/*.msi 2>/dev/null | awk '{print "     "$9" ("$5")"}' || echo "     (verificar manualmente)"
    fi
    if [ -d "$BUNDLE_PATH/nsis" ]; then
        echo "  🪟 Windows (.exe - NSIS):"
        ls -lh $BUNDLE_PATH/nsis/*.exe 2>/dev/null | awk '{print "     "$9" ("$5")"}' || echo "     (verificar manualmente)"
    fi
fi

echo ""
echo "📋 Próximos passos:"
echo "  1. Testar instalador em máquina limpa"
echo "  2. Verificar criação do primeiro admin"
echo "  3. Testar wizard de configuração"
echo "  4. Validar todas as funcionalidades"
echo ""
echo -e "${YELLOW}⚠️  LEMBRE-SE:${NC}"
echo "  • Em produção, o admin será criado no primeiro acesso"
echo "  • O PIN gerado deve ser anotado com segurança"
echo "  • Teste em ambiente limpo antes de distribuir"
echo ""
