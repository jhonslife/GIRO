# 🚀 Guia de Release - Mercearias v0.1.0

> **Release Candidate**  
> **Data:** 7 de Janeiro de 2026  
> **Versão:** 0.1.0-rc1  
> **Status:** ✅ Pronto para Testes Beta

---

## 📋 Checklist Pré-Release

### ✅ Desenvolvimento

- [x] Backend Rust completo e compilando
- [x] Frontend React com todas as telas
- [x] Integração Tauri funcionando
- [x] Commands Tauri registrados (90+)
- [x] Database schema migrado
- [x] Seed de dados inicial

### ✅ Testes

- [x] Testes unitários passando (45/45)
- [x] Testes de integração implementados (13 testes)
- [x] Testes E2E implementados (8 arquivos, 60+ testes)
- [x] Mocks de hardware criados
- [ ] Testes E2E executados com sucesso
- [ ] Cobertura de código >80%

### 🔄 Qualidade

- [x] ESLint configurado
- [x] TypeScript sem erros críticos
- [x] Rust compilando sem erros
- [ ] Performance benchmarks
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Testes de usabilidade

### 🔧 Infraestrutura

- [x] Vite configurado
- [x] Build otimizado
- [ ] Instalador NSIS
- [ ] Auto-update configurado
- [ ] Signing de executável
- [ ] CI/CD GitHub Actions

### 📚 Documentação

- [x] README principal
- [x] Documentação de arquitetura
- [x] Schema de database documentado
- [x] Guia de testes
- [ ] Manual do usuário
- [ ] Vídeo tutorial
- [ ] Changelog completo

---

## 🛠️ Processo de Build

### 1. Build de Desenvolvimento

```bash
cd apps/desktop

# Instalar dependências
npm install

# Build do frontend
npm run build

# Build do Tauri (desenvolvimento)
npm run tauri build -- --debug
```text
### 2. Build de Produção

```bash
# Limpar builds anteriores
rm -rf src-tauri/target/release
rm -rf dist

# Build otimizado
npm run tauri build

# Saída estará em
# src-tauri/target/release/bundle/
```text
### 3. Instalador Windows

```bash
# Executar no Windows ou Wine
npm run tauri build -- --target x86_64-pc-windows-msvc

# Gera
# - .msi installer
# - .exe standalone
```text
### 4. Build Linux

```bash
# AppImage
npm run tauri build -- --target x86_64-unknown-linux-gnu

# Debian package
npm run tauri build -- --bundles deb
```text
---

## 🧪 Executar Testes

### Testes Unitários e Integração

```bash
cd apps/desktop

# Executar todos os testes
npm run test:run

# Com cobertura
npm run test:coverage

# Em modo watch
npm test
```text
### Testes E2E

```bash
# Instalar Playwright browsers (primeira vez)
npx playwright install

# Executar testes E2E
npm run test:e2e

# Com UI interativa
npm run test:e2e:ui

# Específico
npx playwright test tests/e2e/auth.spec.ts
```text
### Testes Rust

```bash
cd src-tauri

# Testes unitários
cargo test

# Com output detalhado
cargo test -- --nocapture

# Teste específico
cargo test test_create_product
```text
---

## 📦 Estrutura do Release

```text
mercearias-0.1.0/
├── mercearias_0.1.0_amd64.deb        # Debian/Ubuntu
├── mercearias_0.1.0_amd64.AppImage   # Linux universal
├── mercearias_0.1.0_x64.msi          # Windows installer
├── mercearias.exe                     # Windows standalone
├── CHANGELOG.md
├── LICENSE
└── README.md
```text
---

## 🎯 Recursos Incluídos

### Core Features

✅ **PDV (Ponto de Venda)**

- Venda rápida com código de barras
- Suporte a produtos pesados
- Múltiplas formas de pagamento
- Desconto por item e total
- Cancelamento de itens
- Impressão de cupom

✅ **Gestão de Caixa**

- Abertura com saldo inicial
- Sangria e suprimento
- Fechamento com conferência
- Histórico de movimentações
- Relatório de fechamento

✅ **Produtos**

- CRUD completo
- Busca por código/nome
- Categorização
- Controle de estoque
- Preço de venda/custo
- Lotes e validade

✅ **Estoque**

- Entrada de mercadorias
- Saída e ajuste
- Movimentações FIFO
- Alertas de estoque baixo
- Produtos vencendo
- Histórico completo

✅ **Autenticação**

- Login por PIN (4 dígitos)
- Login por senha
- RBAC (4 níveis: Admin, Gerente, Operador, Visualizador)
- Sessões persistentes
- Auditoria de ações

✅ **Relatórios**

- Vendas do dia/período
- Produtos mais vendidos
- Lucro e margem
- Estoque crítico
- Movimentações de caixa
- Exportação PDF/Excel

### Hardware Suportado

🖨️ **Impressoras Térmicas**

- EPSON TM-T20/T20II
- ELGIN i9/i7
- Bematech MP-4200
- Protocolo ESC/POS

⚖️ **Balanças**

- Toledo 2124/2180
- Filizola BP-15
- Protocolo serial padrão

📱 **Scanner**

- USB HID (plug and play)
- Scanner mobile via WebSocket
- Leitor de código de barras 1D/2D

💰 **Gaveta de Dinheiro**

- Abertura via impressora
- Controle manual

---

## 🔐 Segurança

### Dados

- Database SQLite com WAL mode
- Backup automático diário
- Criptografia de senhas (SHA-256)
- Soft delete (recuperação de dados)

### Permissões

| Role         | Permissões                              |
| ------------ | --------------------------------------- |
| Admin        | Todas as funcionalidades                |
| Gerente      | Vendas, descontos, relatórios, produtos |
| Operador     | Apenas vendas básicas                   |
| Visualizador | Apenas consulta, sem edição             |

### Auditoria

- Log de todas as vendas
- Log de movimentações de caixa
- Log de alterações de estoque
- Identificação de usuário em cada ação

---

## 📊 Requisitos de Sistema

### Mínimos

- **OS:** Windows 10, Linux (Ubuntu 20.04+)
- **CPU:** Dual-core 2.0 GHz
- **RAM:** 4 GB
- **Disco:** 500 MB livres
- **Tela:** 1024x768

### Recomendados

- **OS:** Windows 11, Linux (Ubuntu 22.04+)
- **CPU:** Quad-core 2.5 GHz
- **RAM:** 8 GB
- **Disco:** 1 GB livres (para backups)
- **Tela:** 1920x1080

### Hardware Externo

- Porta USB para impressora/scanner
- Porta serial (COM) para balança
- Rede WiFi para scanner mobile

---

## 🚀 Instalação

### Windows

1. Baixar `mercearias_0.1.0_x64.msi`
2. Executar instalador
3. Seguir wizard de instalação
4. Iniciar aplicação

### Linux (Debian/Ubuntu)

```bash
# Download
wget https://releases.mercearias.app/v0.1.0/mercearias_0.1.0_amd64.deb

# Instalar
sudo dpkg -i mercearias_0.1.0_amd64.deb

# Resolver dependências se necessário
sudo apt-get install -f

# Executar
mercearias
```text
### Linux (AppImage)

```bash
# Download (cont.)
wget https://releases.mercearias.app/v0.1.0/mercearias_0.1.0_amd64.AppImage

# Dar permissão
chmod +x mercearias_0.1.0_amd64.AppImage

# Executar (cont.)
./mercearias_0.1.0_amd64.AppImage
```text
---

## 📍 Localização dos Dados

### Linux

```text
~/.local/share/Mercearias/
├── mercearias.db          # Database principal
├── mercearias.db-wal      # Write-Ahead Log
├── backups/               # Backups automáticos
│   ├── backup-2026-01-07.db
│   └── ...
└── logs/                  # Logs da aplicação
    ├── app.log
    └── errors.log
```text
### Windows (cont.)

```text
C:\Users\{usuario}\AppData\Local\Mercearias\
├── mercearias.db
├── mercearias.db-wal
├── backups\
└── logs\
```text
---

## 🔄 Atualização

### Automática (Futuro)

- App verifica updates ao iniciar
- Download em background
- Instalação ao fechar

### Manual

1. Fazer backup do database
2. Desinstalar versão antiga
3. Instalar nova versão
4. Database é migrado automaticamente

---

## 🐛 Problemas Conhecidos

### Em Investigação

- [ ] Performance com >100k produtos
- [ ] Suporte a múltiplas balanças simultâneas
- [ ] Dark mode em alguns componentes

### Limitações Atuais

- Impressora apenas em porta USB (não rede)
- Backup automático apenas local
- Sem sincronização multi-loja

---

## 📞 Suporte

### Documentação

- Docs online: https://docs.mercearias.app
- FAQ: https://mercearias.app/faq
- Video tutoriais: https://youtube.com/@mercearias

### Contato

- Email: suporte@mercearias.app
- GitHub Issues: https://github.com/arkheion/mercearias/issues
- Discord: https://discord.gg/mercearias

---

## 📝 Próximas Versões

### v0.2.0 (Planejado)

- Sincronização em nuvem
- Modo multi-loja
- App mobile para scanner
- Relatórios avançados
- Dashboard em tempo real

### v0.3.0 (Futuro)

- Integração com e-commerce
- Programa de fidelidade
- Emissão de NF-e
- TEF (pagamento integrado)

---

## 📄 Licença

MIT License - Arkheion Corp © 2026

---

_Release preparado com ❤️ pela equipe Mercearias_