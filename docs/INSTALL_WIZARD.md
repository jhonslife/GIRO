# GIRO - Instalador Windows

**Versao:** 1.0  
**Plataforma:** Windows 10/11 (64-bit)  
**Tecnologia:** NSIS (Nullsoft Scriptable Install System)

---

## Visao Geral do Instalador

O instalador GIRO guia o usuario atraves de 6 telas para uma instalacao completa e profissional.

---

## Tela 1: Bem-vindo

```text
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                         [LOGO GIRO]                          ║
║                                                              ║
║              Bem-vindo ao Assistente de Instalacao           ║
║                          do GIRO                             ║
║                                                              ║
║   Este assistente ira guia-lo atraves da instalacao do       ║
║   GIRO - Sistema de Gestao Comercial.                        ║
║                                                              ║
║   Recomendamos fechar todos os outros aplicativos antes      ║
║   de continuar.                                              ║
║                                                              ║
║   Desenvolvido por Arkheion                                  ║
║   Versao 1.0.0                                               ║
║                                                              ║
║                                    [Cancelar]  [Proximo >]   ║
╚══════════════════════════════════════════════════════════════╝
```text
## Acoes:
- Proximo: Avanca para Tela 2
- Cancelar: Confirma saida e fecha instalador

---

## Tela 2: Contrato de Licenca (EULA)

```text
╔══════════════════════════════════════════════════════════════╗
║  Contrato de Licenca                                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Por favor, leia atentamente os termos do contrato de        ║
║  licenca antes de prosseguir com a instalacao.               ║
║                                                              ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ GIRO - CONTRATO DE LICENCA DE USUARIO FINAL           │  ║
║  │                                                        │  ║
║  │ Este Contrato de Licenca de Usuario Final ("EULA")     │  ║
║  │ e um acordo legal entre voce e a Arkheion para o       │  ║
║  │ uso do software GIRO.                                  │  ║
║  │                                                        │  ║
║  │ 1. CONCESSAO DE LICENCA                                │  ║
║  │ A Arkheion concede a voce uma licenca nao exclusiva... │  ║
║  │                                          [Scroll ▼]    │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                              ║
║  ( ) Eu ACEITO os termos do contrato de licenca              ║
║  ( ) Eu NAO ACEITO os termos do contrato de licenca          ║
║                                                              ║
║                          [< Voltar]  [Cancelar]  [Proximo >] ║
╚══════════════════════════════════════════════════════════════╝
```text
## Acoes: (cont.)
- Aceitar: Habilita botao Proximo
- Nao Aceitar: Desabilita botao Proximo
- Proximo: Avanca para Tela 3 (apenas se aceitar)

---

## Tela 3: Local de Instalacao

```text
╔══════════════════════════════════════════════════════════════╗
║  Local de Instalacao                                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Escolha a pasta onde o GIRO sera instalado.                 ║
║                                                              ║
║  Pasta de destino:                                           ║
║  ┌────────────────────────────────────────────────┬───────┐  ║
║  │ C:\Program Files\Arkheion\GIRO                 │[...]  │  ║
║  └────────────────────────────────────────────────┴───────┘  ║
║                                                              ║
║  Espaco necessario:    125 MB                                ║
║  Espaco disponivel:    150.5 GB                              ║
║                                                              ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ [✓] Criar atalho na Area de Trabalho                   │  ║
║  │ [✓] Criar atalho no Menu Iniciar                       │  ║
║  │ [ ] Executar GIRO ao iniciar o Windows                 │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                              ║
║                          [< Voltar]  [Cancelar]  [Instalar]  ║
╚══════════════════════════════════════════════════════════════╝
```text
## Opcoes:
- Pasta padrao: `C:\Program Files\Arkheion\GIRO`
- Atalho Desktop: Marcado por padrao
- Atalho Menu: Marcado por padrao
- Auto-iniciar: Desmarcado por padrao

---

## Tela 4: Progresso da Instalacao

```text
╔══════════════════════════════════════════════════════════════╗
║  Instalando                                                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Aguarde enquanto o GIRO e instalado no seu computador.      ║
║                                                              ║
║  Extraindo arquivos...                                       ║
║                                                              ║
║  ████████████████████████░░░░░░░░░░░░░░░░░░░░░░  45%         ║
║                                                              ║
║  Arquivo atual:                                              ║
║  giro.exe                                                    ║
║                                                              ║
║  Arquivos extraidos: 127 de 283                              ║
║                                                              ║
║  Tarefas:                                                    ║
║  [✓] Verificando sistema                                     ║
║  [✓] Extraindo arquivos principais                           ║
║  [→] Instalando componentes                                  ║
║  [ ] Configurando banco de dados                             ║
║  [ ] Criando atalhos                                         ║
║  [ ] Finalizando instalacao                                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```text
## Etapas:
1. Verificando sistema (requisitos)
2. Extraindo arquivos principais
3. Instalando componentes
4. Configurando banco de dados SQLite
5. Criando atalhos
6. Finalizando instalacao

---

## Tela 5: Instalacao Concluida

```text
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                         [LOGO GIRO]                          ║
║                                                              ║
║              Instalacao Concluida com Sucesso!               ║
║                                                              ║
║   O GIRO foi instalado com sucesso no seu computador.        ║
║                                                              ║
║   Clique em "Concluir" para fechar o assistente.             ║
║                                                              ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ [✓] Executar GIRO agora                                │  ║
║  │ [ ] Abrir pasta de instalacao                          │  ║
║  │ [ ] Ver documentacao                                   │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                              ║
║   Obrigado por escolher GIRO!                                ║
║   Desenvolvido com ♥ por Arkheion                            ║
║                                                              ║
║                                              [Concluir]      ║
╚══════════════════════════════════════════════════════════════╝
```text
## Opcoes Finais:
- Executar GIRO: Marcado por padrao
- Abrir pasta: Desmarcado
- Ver docs: Desmarcado

---

## Tela 6: Desinstalacao (via Painel de Controle)

```text
╔══════════════════════════════════════════════════════════════╗
║  Desinstalar GIRO                                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Voce tem certeza que deseja remover o GIRO do seu           ║
║  computador?                                                 ║
║                                                              ║
║  ⚠ ATENCAO: Seus dados serao mantidos para backup!           ║
║                                                              ║
║  Os seguintes itens serao removidos:                         ║
║  • Arquivos do programa                                      ║
║  • Atalhos da area de trabalho e menu                        ║
║  • Entradas do registro do Windows                           ║
║                                                              ║
║  Os seguintes itens serao MANTIDOS:                          ║
║  • Banco de dados (seus dados comerciais)                    ║
║  • Arquivos de backup                                        ║
║  • Configuracoes do usuario                                  ║
║                                                              ║
║  Local dos dados: C:\Users\[User]\AppData\Local\GIRO         ║
║                                                              ║
║                             [Cancelar]    [Desinstalar]      ║
╚══════════════════════════════════════════════════════════════╝
```text
---

## Requisitos do Sistema

| Componente | Minimo | Recomendado |
|------------|--------|-------------|
| SO | Windows 10 64-bit | Windows 11 64-bit |
| Processador | Dual Core 2GHz | Quad Core 2.5GHz |
| RAM | 4 GB | 8 GB |
| Disco | 500 MB | 2 GB SSD |
| Tela | 1024x768 | 1366x768+ |

---

## Estrutura de Arquivos Instalados

```text
C:\Program Files\Arkheion\GIRO\
├── GIRO.exe                 # Executavel principal
├── resources/
│   ├── app.asar             # Aplicacao empacotada
│   └── icons/               # Icones do sistema
├── locales/                 # Arquivos de idioma
└── uninstall.exe            # Desinstalador

C:\Users\[User]\AppData\Local\GIRO\
├── database.sqlite          # Banco de dados
├── config.json              # Configuracoes
├── logs/                    # Arquivos de log
└── backups/                 # Backups locais
```text
---

## Codigos de Erro

| Codigo | Descricao | Solucao |
|--------|-----------|---------|
| 1001 | Espaco insuficiente | Libere espaco em disco |
| 1002 | Permissao negada | Execute como administrador |
| 1003 | Arquivo corrompido | Baixe instalador novamente |
| 1004 | Versao incompativel | Atualize o Windows |

---
## Documento tecnico - GIRO Instalador Windows
## Copyright 2026 Arkheion