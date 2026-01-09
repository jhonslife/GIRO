#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Configurando Ambiente para Cross-Compilacao Windows ===${NC}"
echo "Este script instalara: NSIS, MinGW-w64 e o target Rust x86_64-pc-windows-gnu"
echo "OBS: Voce precisara digitar sua senha de sudo."
echo ""

# 1. Instalar dependencias do sistema
echo -e "${GREEN}>> Instalando dependencias do sistema (apt)...${NC}"
sudo apt-get update
sudo apt-get install -y nsis mingw-w64 lld llvm build-essential libappindicator3-dev

# 2. Adicionar target do Rust
echo -e "${GREEN}>> Adicionando target Rust x86_64-pc-windows-gnu...${NC}"
rustup target add x86_64-pc-windows-gnu

echo ""
echo -e "${GREEN}=== Concluido! ===${NC}"
echo "Agora voce pode gerar o .exe rodando:"
echo "npm run tauri:build -- --target x86_64-pc-windows-gnu"
