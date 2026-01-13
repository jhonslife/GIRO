# 🏗️ Build do Instalador Windows - GIRO Desktop

> **Guia completo para gerar o instalador Windows do GIRO**  
> Desenvolvido por Arkheion Corp

---

## 📋 Pré-requisitos

### Sistema Operacional

- **Linux** (Ubuntu 20.04+, Debian 11+, ou similar)
- **WSL2** (Windows Subsystem for Linux) também funciona

### Ferramentas Necessárias

```bash
# Rust e Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add x86_64-pc-windows-gnu

# Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# pnpm
npm install -g pnpm

# MinGW-w64 (compilador cruzado para Windows)
sudo apt install mingw-w64

# NSIS (gerador de instalador)
sudo apt install nsis
```text
---

## 🚀 Processo de Build Rápido

### Opção 1: Script Automatizado (Recomendado)

```bash
cd apps/desktop
./clean-build-windows.sh
```text
Este script faz:

1. ✅ Valida todas as dependências
2. 🧹 Limpa builds antigos
3. 🔐 Verifica segurança
4. 📦 Instala dependências npm
5. 🎨 Compila frontend (React + Vite)
6. 🦀 Compila backend (Rust -> Windows)
7. 📦 Gera instalador NSIS
8. ✅ Valida resultados

### Opção 2: Manual (Passo a Passo)

```bash
# 1. Limpar builds antigos
rm -rf dist src-tauri/target
cd src-tauri && cargo clean && cd ..

# 2. Instalar dependências
pnpm install

# 3. Compilar frontend
pnpm run build

# 4. Configurar toolchain Windows
export CARGO_TARGET_X86_64_PC_WINDOWS_GNU_LINKER="x86_64-w64-mingw32-gcc"
export CC_x86_64_pc_windows_gnu="x86_64-w64-mingw32-gcc"
export CXX_x86_64_pc_windows_gnu="x86_64-w64-mingw32-g++"
export AR_x86_64_pc_windows_gnu="x86_64-w64-mingw32-ar"

# 5. Build Tauri para Windows
pnpm tauri build --target x86_64-pc-windows-gnu
```text
---

## 📦 Localização dos Arquivos Gerados

### Instalador NSIS (Recomendado para Distribuição)

```text
src-tauri/target/x86_64-pc-windows-gnu/release/bundle/nsis/
├── GIRO_1.0.0_x64-setup.exe          # Instalador principal
└── GIRO_1.0.0_x64-setup.nsis.zip     # Bundle compactado
```text
### Instalador MSI (Alternativo)

```text
src-tauri/target/x86_64-pc-windows-gnu/release/bundle/msi/
└── GIRO_1.0.0_x64.msi
```text
### Executável Standalone (Não recomendado para distribuição)

```text
src-tauri/target/x86_64-pc-windows-gnu/release/
└── giro.exe                           # Requer DLLs manualmente
```text
---

## ⏱️ Tempo Estimado de Build

| Etapa            | Duração       | Observações                 |
| ---------------- | ------------- | --------------------------- |
| Limpeza          | 30s           | Remoção de 10-15GB de cache |
| Dependências npm | 2-5min        | Apenas primeira vez         |
| Frontend (Vite)  | 30-60s        | React + TypeScript          |
| Backend (Rust)   | 5-15min       | Compilação otimizada        |
| Bundle NSIS      | 30-60s        | Geração do instalador       |
| **TOTAL**        | **~10-25min** | Varia conforme hardware     |

---

## 🔍 Validação do Build

### Checklist Pós-Build

- [ ] Instalador `.exe` gerado em `bundle/nsis/`
- [ ] Tamanho do instalador entre 80-150MB
- [ ] Executável `giro.exe` em `release/`
- [ ] Sem erros de compilação nos logs
- [ ] Hash SHA256 gerado para distribuição

### Gerar Hash SHA256

```bash
cd src-tauri/target/x86_64-pc-windows-gnu/release/bundle/nsis
sha256sum GIRO_1.0.0_x64-setup.exe > GIRO_1.0.0_x64-setup.exe.sha256
cat GIRO_1.0.0_x64-setup.exe.sha256
```text
---

## 🧪 Testes Pré-Distribuição

### Testes Obrigatórios

1. **Instalação Limpa**

   - Testar em VM Windows 10/11 limpa
   - Verificar todos os arquivos instalados
   - Validar registro no menu Iniciar

2. **Funcionalidades Core**

   - Login inicial (criação de admin)
   - Cadastro de produtos
   - Realização de vendas
   - Relatórios básicos

3. **Hardware**

   - Impressora térmica (se disponível)
   - Leitor de código de barras
   - Gaveta de dinheiro

4. **Performance**
   - Tempo de inicialização < 5s
   - Respostas de UI < 200ms
   - Consultas de banco < 100ms

### Ambientes de Teste Recomendados

- ✅ Windows 10 22H2 (64-bit)
- ✅ Windows 11 23H2 (64-bit)
- ✅ Windows Server 2019/2022
- ⚠️ Windows 7/8.1 (não suportado oficialmente)

---

## 🐛 Troubleshooting

### Erro: "MinGW not found"

```bash
sudo apt update
sudo apt install mingw-w64
```text
### Erro: "Target not installed"

```bash
rustup target add x86_64-pc-windows-gnu
```text
### Erro: "Linking failed"

```bash
export CARGO_TARGET_X86_64_PC_WINDOWS_GNU_LINKER="x86_64-w64-mingw32-gcc"
```text
### Erro: "NSIS not found"

```bash
sudo apt install nsis
```text
### Build muito lento

```bash
# Usar build paralelo
export CARGO_BUILD_JOBS=$(nproc)

# Limpar cache do Rust
cargo clean
rm -rf ~/.cargo/registry/cache
```text
### Instalador não abre no Windows

- Verificar se o antivírus não está bloqueando
- Executar como Administrador
- Desabilitar SmartScreen temporariamente

---

## 📊 Tamanhos Esperados

| Arquivo              | Tamanho Típico |
| -------------------- | -------------- |
| `giro.exe` (backend) | 15-25 MB       |
| `dist/` (frontend)   | 5-10 MB        |
| Instalador NSIS      | 80-120 MB      |
| Instalador MSI       | 85-130 MB      |

---

## 🔐 Segurança e Distribuição

### Assinatura Digital (Recomendado)

Para distribuição profissional, assine o instalador com um certificado Code Signing:

```bash
# Com signtool.exe (Windows)
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com GIRO_1.0.0_x64-setup.exe

# Verificar assinatura
signtool verify /pa GIRO_1.0.0_x64-setup.exe
```text
### Checklist de Distribuição

- [ ] Build em modo `--release`
- [ ] Sem credenciais hardcoded
- [ ] Sem dados de desenvolvimento
- [ ] Hash SHA256 gerado
- [ ] Assinatura digital aplicada
- [ ] Testes em ambiente limpo
- [ ] Changelog atualizado
- [ ] Documentação de versão

---

## 📝 Versionamento

### Atualizar Versão

Edite `src-tauri/tauri.conf.json`:

```json
{
  "version": "1.0.0",  // <-- Incrementar aqui
  ...
}
```text
Convenção:

- **1.x.x** - Versões principais (breaking changes)
- **x.1.x** - Novas funcionalidades
- **x.x.1** - Correções de bugs

---

## 🚢 Deploy e Distribuição

### Opções de Distribuição

1. **Download Direto**

   - Hospedar em site próprio
   - GitHub Releases
   - CDN (Cloudflare, etc)

2. **Auto-Update**

   - Tauri tem suporte built-in
   - Requer servidor de updates
   - Configurar em `tauri.conf.json`

3. **Microsoft Store** (Futuro)
   - Requer conta de desenvolvedor
   - Processo de review
   - Distribuição centralizada

---

## 📞 Suporte

### Problemas com Build

- 📧 Email: dev@arkheion.com
- 💬 Slack: #giro-dev
- 🐛 Issues: GitHub Issues

### Documentação Adicional

- [Tauri Build Guide](https://tauri.app/v1/guides/building/)
- [Rust Cross-Compilation](https://rust-lang.github.io/rustup/cross-compilation.html)
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)

---

## 📜 Changelog de Builds

### v1.0.0 (12/01/2026)

- ✨ Release inicial
- 🚀 Instalador Windows completo
- 📦 NSIS + MSI bundles
- 🔐 Instalação segura

---
## Desenvolvido com ❤️ por Arkheion Corp
_GIRO - Sistema de Gestão Comercial_