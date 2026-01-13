#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# GIRO Desktop - Guia Rápido de Build Windows
# ═══════════════════════════════════════════════════════════════════════════

# 📦 Build Completo e Limpo (Recomendado)
# ═══════════════════════════════════════════════════════════════════════════
cd apps/desktop
./clean-build-windows.sh

# 🚀 Build Rápido (sem limpeza)
# ═══════════════════════════════════════════════════════════════════════════
cd apps/desktop
pnpm install
pnpm run build
pnpm tauri build --target x86_64-pc-windows-gnu

# 🧹 Apenas Limpeza
# ═══════════════════════════════════════════════════════════════════════════
cd apps/desktop
rm -rf dist
rm -rf src-tauri/target
cd src-tauri && cargo clean && cd ..

# 📍 Localização dos Arquivos Gerados
# ═══════════════════════════════════════════════════════════════════════════

# Instalador NSIS (Principal)
# src-tauri/target/x86_64-pc-windows-gnu/release/bundle/nsis/GIRO_1.0.0_x64-setup.exe

# Instalador MSI (Alternativo)
# src-tauri/target/x86_64-pc-windows-gnu/release/bundle/msi/GIRO_1.0.0_x64.msi

# Executável
# src-tauri/target/x86_64-pc-windows-gnu/release/giro-desktop.exe

# ⏱️ Tempo Estimado
# ═══════════════════════════════════════════════════════════════════════════
# Build completo (primeira vez): ~15-25 minutos
# Build incremental: ~5-10 minutos
# Apenas bundle: ~1-2 minutos

# 🔍 Verificar Build
# ═══════════════════════════════════════════════════════════════════════════
ls -lh src-tauri/target/x86_64-pc-windows-gnu/release/bundle/nsis/
sha256sum src-tauri/target/x86_64-pc-windows-gnu/release/bundle/nsis/*.exe

# 🐛 Troubleshooting Comum
# ═══════════════════════════════════════════════════════════════════════════

# Erro: MinGW não encontrado
sudo apt install mingw-w64

# Erro: Target não instalado
rustup target add x86_64-pc-windows-gnu

# Erro: pnpm não encontrado
npm install -g pnpm

# Erro: Linking falhou
export CARGO_TARGET_X86_64_PC_WINDOWS_GNU_LINKER="x86_64-w64-mingw32-gcc"

# Build muito lento - usar compilação paralela
export CARGO_BUILD_JOBS=$(nproc)

# ✅ Checklist Pré-Distribuição
# ═══════════════════════════════════════════════════════════════════════════
# [ ] Instalador gerado (.exe ou .msi)
# [ ] Tamanho do arquivo razoável (80-150MB)
# [ ] Hash SHA256 calculado
# [ ] Testado em VM Windows limpa
# [ ] Todas as funcionalidades testadas
# [ ] Hardware testado (impressora, scanner, etc)
# [ ] Versão correta no arquivo
# [ ] Changelog atualizado

# 📝 Atualizar Versão
# ═══════════════════════════════════════════════════════════════════════════
# Editar: src-tauri/tauri.conf.json
# "version": "1.0.0" -> "1.0.1"

# 🔐 Gerar Hash para Distribuição
# ═══════════════════════════════════════════════════════════════════════════
cd src-tauri/target/x86_64-pc-windows-gnu/release/bundle/nsis
sha256sum *.exe > checksums.sha256
cat checksums.sha256

# 📚 Documentação Completa
# ═══════════════════════════════════════════════════════════════════════════
# Ver: BUILD-WINDOWS.md
