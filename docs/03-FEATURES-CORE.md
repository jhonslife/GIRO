# 📦 Mercearias - Features Core

> **Versão:** 1.0.0  
> **Status:** Aprovado  
> **Última Atualização:** 7 de Janeiro de 2026

---

## 📋 Sumário

1. [Módulo PDV (Ponto de Venda)](#módulo-pdv-ponto-de-venda)
2. [Módulo Produtos](#módulo-produtos)
3. [Módulo Estoque](#módulo-estoque)
4. [Módulo Validade](#módulo-validade)
5. [Módulo Funcionários](#módulo-funcionários)
6. [Módulo Controle de Caixa](#módulo-controle-de-caixa)
7. [Módulo Relatórios](#módulo-relatórios)
8. [Módulo Configurações](#módulo-configurações)
9. [Módulo Alertas](#módulo-alertas)
10. [Módulo Backup](#módulo-backup)
11. [Requisitos Não-Funcionais](#requisitos-não-funcionais)

---

## 🛒 Módulo PDV (Ponto de Venda)

### Visão Geral

O módulo de PDV é o coração do sistema, focado em velocidade e simplicidade para o operador de caixa.

### Features

#### PDV-001: Tela Principal de Vendas

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Alta         |
| **Sprint**       | 1-2          |
## Requisitos Funcionais:
- [ ] Layout dividido: Lista de itens (60%) + Painel de totais (40%)
- [ ] Barra de busca proeminente no topo (autocomplete)
- [ ] Exibição de itens: código, nome, qtd, preço unit, subtotal
- [ ] Botões de ação rápida: +1, -1, quantidade manual, remover
- [ ] Painel de totais: subtotal, desconto, total
- [ ] Botões de finalização: Dinheiro, PIX, Cancelar
## Regras de Negócio:
- Venda só pode ser iniciada com caixa aberto
- Quantidade máxima por item: 999
- Valores negativos são bloqueados
- Operador visualiza apenas vendas da sua sessão

---

#### PDV-002: Busca Inteligente de Produtos

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Média        |
| **Sprint**       | 1            |
## Requisitos Funcionais: (cont.)
- [ ] Busca por código de barras (match exato)
- [ ] Busca por código interno (match exato)
- [ ] Busca por nome (fuzzy search, min 2 caracteres)
- [ ] Autocomplete com dropdown (máx 10 resultados)
- [ ] Exibição de: nome, preço, estoque atual
- [ ] Destaque visual para estoque baixo (amarelo) e zerado (vermelho)
- [ ] Suporte a tecla Enter para adicionar primeiro resultado
## Regras de Negócio: (cont.)
- Busca case-insensitive
- Remove acentos automaticamente
- Prioriza match por código sobre nome
- Produtos inativos não aparecem na busca
- Produtos com estoque zero: permite venda com warning

---

#### PDV-003: Scanner de Código de Barras (USB)

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Baixa        |
| **Sprint**       | 2            |
## Requisitos Funcionais: (cont.)
- [ ] Suporte a leitoras USB em modo HID (teclado)
- [ ] Auto-submit ao detectar código
- [ ] Suporte a códigos EAN-13, EAN-8, Code128, Code39
- [ ] Suporte a códigos pesados (balança) com prefixo 2
- [ ] Beep sonoro de confirmação
## Regras de Negócio: (cont.)
- Códigos pesados: prefixo 2 + 5 dígitos produto + 5 dígitos peso + 1 check
- Se produto não encontrado: abre modal de cadastro rápido
- Códigos duplicados na mesma venda: incrementa quantidade

---

#### PDV-004: Scanner Mobile (Celular)

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Alta      |
| **Sprint**       | 3-4       |
## Requisitos Funcionais: (cont.)
- [ ] PWA scanner acessível via QR code na tela do PDV
- [ ] Conexão WebSocket local (mesmo Wi-Fi)
- [ ] Exibição de código QR para pareamento
- [ ] Indicador visual de celular conectado
- [ ] Reconexão automática se conexão perder
- [ ] Múltiplos celulares por PDV (1 ativo por vez)
## Regras de Negócio: (cont.)
- Só aceita conexões da rede local (192.168.x.x / 10.x.x.x)
- Timeout de 30s sem atividade desconecta
- Código do celular tem mesma prioridade que USB

---

#### PDV-005: Integração com Balança

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Alta      |
| **Sprint**       | 4         |
## Requisitos Funcionais: (cont.)
- [ ] Suporte a balanças Toledo (Prix 3, Prix 4)
- [ ] Suporte a balanças Filizola (CS15, Platina)
- [ ] Suporte a balanças Elgin (DP, SM100)
- [ ] Configuração de porta serial (COM1-COM20)
- [ ] Leitura automática de peso ao selecionar produto pesável
- [ ] Botão manual "Ler Peso"
- [ ] Exibição de peso em tempo real
- [ ] Tara automática
## Regras de Negócio: (cont.)
- Produto pesável: campo isWeighted = true
- Unidade obrigatória: KG ou GRAM
- Peso mínimo: 0.001 kg (1g)
- Peso máximo: 30 kg (limite padrão)
- Se balança offline: permite digitação manual com aviso

---

#### PDV-006: Desconto na Venda

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Baixa     |
| **Sprint**       | 2         |
## Requisitos Funcionais: (cont.)
- [ ] Desconto percentual (0-100%)
- [ ] Desconto em valor (R$)
- [ ] Aplicar em item específico ou venda total
- [ ] Campo de justificativa obrigatório
- [ ] Limite máximo configurável por role
## Regras de Negócio: (cont.)
- CASHIER: máx 5% desconto
- MANAGER: máx 20% desconto
- ADMIN: sem limite
- Log de auditoria para todos os descontos
- Desconto não pode resultar em valor negativo

---

#### PDV-007: Cancelamento de Venda

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Média     |
| **Sprint**       | 2         |
## Requisitos Funcionais: (cont.)
- [ ] Cancelar venda em andamento (antes de finalizar)
- [ ] Cancelar venda finalizada (requer autorização)
- [ ] Campo de motivo obrigatório
- [ ] Estorno automático do estoque
- [ ] Log de auditoria com responsável
## Regras de Negócio: (cont.)
- Venda em andamento: qualquer operador pode cancelar
- Venda finalizada: apenas MANAGER ou ADMIN
- Prazo máximo para cancelamento: 24h
- Cancelamento não deleta registro, apenas muda status

---

#### PDV-008: Finalização de Venda

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Média        |
| **Sprint**       | 2            |
## Requisitos Funcionais: (cont.)
- [ ] Seleção de forma de pagamento (Dinheiro, PIX, Outro)
- [ ] Cálculo automático de troco para dinheiro
- [ ] Teclado numérico virtual para valor recebido
- [ ] Atalhos de valor: +10, +20, +50, +100, Exato
- [ ] Confirmação visual e sonora
- [ ] Impressão automática de cupom (se configurado)
- [ ] Abertura automática de gaveta (se configurado)
## Regras de Negócio: (cont.)
- Não permitir finalizar venda vazia
- Valor recebido >= total para dinheiro
- PIX/Outro: assumir valor exato
- Atualização atômica de estoque
- Registro na sessão de caixa

---

#### PDV-009: Impressão de Cupom

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Alta      |
| **Sprint**       | 3         |
## Requisitos Funcionais: (cont.)
- [ ] Suporte a impressoras Epson (TM-T20X, TM-T88V)
- [ ] Suporte a impressoras Elgin (i7, i9)
- [ ] Suporte a impressoras Bematech (MP-4200 TH)
- [ ] Suporte a impressoras Daruma (DR800)
- [ ] Protocolo ESC/POS
- [ ] Conexão USB, Serial ou Rede
- [ ] Template customizável de cupom
- [ ] Logo do estabelecimento (opcional)
- [ ] Guilhotina automática
## Template Padrão do Cupom:
```text
         NOME DO ESTABELECIMENTO
         Endereço completo
         CNPJ: XX.XXX.XXX/XXXX-XX
         ────────────────────────────────
         CUPOM NÃO FISCAL
         Data: 07/01/2026 14:35
         Operador: João
         ────────────────────────────────
         QTD   PRODUTO              VALOR
         ────────────────────────────────
         2     Coca-Cola 2L        R$ 14,00
         0.550 Banana Prata KG     R$  3,85
         1     Pão Francês         R$  0,80
         ────────────────────────────────
         SUBTOTAL               R$ 18,65
         DESCONTO                R$ 0,00
         ════════════════════════════════
         TOTAL                  R$ 18,65
         ════════════════════════════════
         Dinheiro               R$ 20,00
         Troco                   R$ 1,35
         ────────────────────────────────
         Venda #123
         Obrigado pela preferência!
```text
---

#### PDV-010: Gaveta de Dinheiro

| Atributo         | Descrição  |
| ---------------- | ---------- |
| **Prioridade**   | P2 - Média |
| **Complexidade** | Baixa      |
| **Sprint**       | 3          |
## Requisitos Funcionais: (cont.)
- [ ] Abertura via comando na impressora (pulso RJ11)
- [ ] Abertura manual pelo menu
- [ ] Abertura automática ao finalizar venda em dinheiro
- [ ] Log de todas as aberturas
## Regras de Negócio: (cont.)
- Apenas MANAGER e ADMIN podem abrir manualmente
- CASHIER: apenas via venda ou sangria/suprimento

---

## 📋 Módulo Produtos

### Visão Geral (cont.)

Gestão completa do catálogo de produtos com foco em cadastro rápido e organização por categorias.

### Features (cont.)

#### PROD-001: Listagem de Produtos

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Média        |
| **Sprint**       | 1            |
## Requisitos Funcionais: (cont.)
- [ ] Tabela com colunas: código, nome, categoria, preço, estoque
- [ ] Ordenação por qualquer coluna
- [ ] Filtros: categoria, status (ativo/inativo), estoque (baixo/normal)
- [ ] Busca global (nome, código, descrição)
- [ ] Paginação (50 itens por página)
- [ ] Ações: editar, duplicar, desativar
- [ ] Seleção múltipla para ações em lote
- [ ] Export para Excel/CSV

---

#### PROD-002: Cadastro de Produto

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Média        |
| **Sprint**       | 1            |
## Requisitos Funcionais: (cont.)
- [ ] Campos obrigatórios: nome, categoria, preço de venda
- [ ] Campos opcionais: código de barras, descrição, estoque mínimo
- [ ] Código interno gerado automaticamente (sequencial)
- [ ] Seleção de unidade de medida
- [ ] Checkbox "Produto pesável" (vincula a balança)
- [ ] Cálculo automático de margem
- [ ] Preview de como aparecerá no PDV
- [ ] Validação de código de barras duplicado
## Regras de Negócio: (cont.)
- Código interno: formato MRC-00001 (incrementa)
- Código de barras único (se informado)
- Preço de venda > 0
- Margem = ((venda - custo) / custo) \* 100
- Margem negativa: aviso visual

---

#### PROD-003: Cadastro Express (3 Cliques)

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Média     |
| **Sprint**       | 2         |
## Requisitos Funcionais: (cont.)
- [ ] Modal simplificado ao scanear código não encontrado
- [ ] Campos apenas: nome, categoria, preço
- [ ] Sugestão de nome via API COSMOS (código EAN)
- [ ] Sugestão de categoria via histórico
- [ ] Botão "Cadastrar e Vender"
- [ ] Botão "Cadastro Completo" (abre tela full)

---

#### PROD-004: Gestão de Categorias

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Baixa     |
| **Sprint**       | 1         |
## Requisitos Funcionais: (cont.)
- [ ] Hierarquia de 2 níveis (categoria > subcategoria)
- [ ] Nome, cor, ícone por categoria
- [ ] Reordenação drag-and-drop
- [ ] Contagem de produtos por categoria
- [ ] Mesclar categorias (unificar produtos)
- [ ] Impedir exclusão com produtos vinculados
## Categorias Padrão:
- Bebidas
- Laticínios
- Carnes
- Hortifrúti
- Padaria
- Limpeza
- Higiene
- Mercearia (genérico)

---

#### PROD-005: Histórico de Preços

| Atributo         | Descrição  |
| ---------------- | ---------- |
| **Prioridade**   | P2 - Média |
| **Complexidade** | Baixa      |
| **Sprint**       | 3          |
## Requisitos Funcionais: (cont.)
- [ ] Timeline de alterações de preço
- [ ] Gráfico de evolução
- [ ] Filtro por período
- [ ] Responsável pela alteração
- [ ] Motivo da alteração (se informado)

---

#### PROD-006: Importação de Produtos

| Atributo         | Descrição  |
| ---------------- | ---------- |
| **Prioridade**   | P2 - Média |
| **Complexidade** | Alta       |
| **Sprint**       | 5          |
## Requisitos Funcionais: (cont.)
- [ ] Upload de arquivo Excel/CSV
- [ ] Mapeamento de colunas
- [ ] Preview antes de importar
- [ ] Validação de dados
- [ ] Relatório de erros
- [ ] Atualização de produtos existentes (por código)

---

## 📦 Módulo Estoque

### Features (cont.)

#### EST-001: Entrada de Estoque

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Média        |
| **Sprint**       | 2            |
## Requisitos Funcionais: (cont.)
- [ ] Entrada individual ou em lote
- [ ] Seleção de fornecedor
- [ ] Número da nota fiscal
- [ ] Data de validade por lote
- [ ] Custo do lote (atualiza custo médio)
- [ ] Scanner para agilizar entrada
- [ ] Confirmação de quantidade

---

#### EST-002: Ajuste de Inventário

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Média     |
| **Sprint**       | 3         |
## Requisitos Funcionais: (cont.)
- [ ] Contagem de estoque físico
- [ ] Comparação sistema vs contagem
- [ ] Motivo obrigatório para divergências
- [ ] Aprovação de ajustes (MANAGER+)
- [ ] Relatório de divergências

---

#### EST-003: Movimentação de Estoque

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Baixa     |
| **Sprint**       | 2         |
## Requisitos Funcionais: (cont.)
- [ ] Histórico completo de movimentações
- [ ] Filtros: produto, tipo, período, responsável
- [ ] Tipos: entrada, saída, ajuste, perda, transferência
- [ ] Rastreabilidade por lote

---

#### EST-004: Consulta de Saldo

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Baixa        |
| **Sprint**       | 1            |
## Requisitos Funcionais: (cont.)
- [ ] Busca rápida por produto
- [ ] Exibição de saldo atual
- [ ] Detalhamento por lote
- [ ] Custo médio e valor total em estoque
- [ ] Gráfico de movimentação (30 dias)

---

## ⏰ Módulo Validade

### Features (cont.)

#### VAL-001: Dashboard de Vencimentos

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Média        |
| **Sprint**       | 3            |
## Requisitos Funcionais: (cont.)
- [ ] Cards resumo: Vencido, 3 dias, 7 dias, 30 dias
- [ ] Lista detalhada clicável
- [ ] Ação: marcar como verificado
- [ ] Ação: registrar perda
- [ ] Ação: transferir para promoção

---

#### VAL-002: Alerta de Vencimento

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Média        |
| **Sprint**       | 3            |
## Requisitos Funcionais: (cont.)
- [ ] Notificação visual no menu lateral (badge)
- [ ] Popup ao abrir sistema (se houver críticos)
- [ ] Push notification (se configurado)
- [ ] Email diário (se configurado)
- [ ] Configuração de dias de antecedência

---

#### VAL-003: FIFO Automático

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Média     |
| **Sprint**       | 4         |
## Requisitos Funcionais: (cont.)
- [ ] Vendas consomem lotes mais antigos primeiro
- [ ] Indicação visual do lote em uso
- [ ] Alerta se tentando vender lote mais novo

---

## 👥 Módulo Funcionários

### Features (cont.)

#### FUNC-001: Cadastro de Funcionário

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Média     |
| **Sprint**       | 2         |
## Requisitos Funcionais: (cont.)
- [ ] Dados pessoais: nome, CPF, RG, telefone, email
- [ ] Endereço completo
- [ ] Perfil de acesso: Admin, Manager, Cashier, Viewer
- [ ] PIN de 4-6 dígitos para login rápido
- [ ] Senha completa para admin
- [ ] Foto (opcional)
- [ ] Status ativo/inativo

---

#### FUNC-002: Controle de Acesso (RBAC)

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Média        |
| **Sprint**       | 2            |
## Requisitos Funcionais: (cont.)
- [ ] 4 perfis predefinidos
- [ ] Matriz de permissões por módulo
- [ ] Bloqueio de funcionalidades por role
- [ ] Troca de usuário rápida (PIN)
- [ ] Timeout de sessão configurável

---

#### FUNC-003: Log de Atividades

| Atributo         | Descrição  |
| ---------------- | ---------- |
| **Prioridade**   | P2 - Média |
| **Complexidade** | Média      |
| **Sprint**       | 4          |
## Requisitos Funcionais: (cont.)
- [ ] Registro de login/logout
- [ ] Registro de operações críticas
- [ ] Filtro por funcionário, período, ação
- [ ] Export de logs

---

## 💰 Módulo Controle de Caixa

### Features (cont.)

#### CAIXA-001: Abertura de Caixa

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Média        |
| **Sprint**       | 2            |
## Requisitos Funcionais: (cont.)
- [ ] Informar valor de abertura (fundo de troco)
- [ ] Contagem cega (opcional): informar quantidade de cédulas/moedas
- [ ] Apenas 1 caixa aberto por operador
- [ ] Impressão de comprovante de abertura

---

#### CAIXA-002: Fechamento de Caixa

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Alta         |
| **Sprint**       | 2            |
## Requisitos Funcionais: (cont.)
- [ ] Resumo: abertura + vendas - sangrias + suprimentos = esperado
- [ ] Informar valor contado
- [ ] Calcular diferença (sobra/falta)
- [ ] Justificativa obrigatória para diferenças > R$5
- [ ] Impressão de relatório de fechamento
- [ ] Bloqueio de vendas após fechamento

---

#### CAIXA-003: Sangria

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Baixa     |
| **Sprint**       | 2         |
## Requisitos Funcionais: (cont.)
- [ ] Retirada de dinheiro do caixa
- [ ] Motivo obrigatório
- [ ] Aprovação de MANAGER (se > R$200)
- [ ] Impressão de comprovante

---

#### CAIXA-004: Suprimento

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Baixa     |
| **Sprint**       | 2         |
## Requisitos Funcionais: (cont.)
- [ ] Adição de dinheiro ao caixa
- [ ] Motivo obrigatório
- [ ] Impressão de comprovante

---

## 📊 Módulo Relatórios

### Features (cont.)

#### REL-001: Vendas por Período

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Média     |
| **Sprint**       | 4         |
## Requisitos Funcionais: (cont.)
- [ ] Filtros: data início/fim, operador, forma pagamento
- [ ] Gráfico de vendas por dia/semana/mês
- [ ] Tabela detalhada com totais
- [ ] Ticket médio
- [ ] Export PDF/Excel

---

#### REL-002: Produtos Mais Vendidos

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Baixa     |
| **Sprint**       | 4         |
## Requisitos Funcionais: (cont.)
- [ ] Top 20 por quantidade
- [ ] Top 20 por faturamento
- [ ] Filtro por período e categoria
- [ ] Gráfico de barras

---

#### REL-003: Produtos Menos Vendidos

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Baixa     |
| **Sprint**       | 4         |
## Requisitos Funcionais: (cont.)
- [ ] Bottom 20 (menor movimento)
- [ ] Produtos sem venda em X dias
- [ ] Sugestão de promoção/descontinuação

---

#### REL-004: Curva ABC

| Atributo         | Descrição  |
| ---------------- | ---------- |
| **Prioridade**   | P2 - Média |
| **Complexidade** | Média      |
| **Sprint**       | 5          |
## Requisitos Funcionais: (cont.)
- [ ] Classificação A (80%), B (15%), C (5%)
- [ ] Por faturamento ou quantidade
- [ ] Gráfico de Pareto
- [ ] Recomendações por classe

---

#### REL-005: Estoque Valorizado

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Baixa     |
| **Sprint**       | 4         |
## Requisitos Funcionais: (cont.)
- [ ] Valor total em estoque por custo
- [ ] Valor total em estoque por venda
- [ ] Por categoria
- [ ] Evolução no tempo

---

#### REL-006: DRE Simplificado

| Atributo         | Descrição  |
| ---------------- | ---------- |
| **Prioridade**   | P2 - Média |
| **Complexidade** | Alta       |
| **Sprint**       | 6          |
## Requisitos Funcionais: (cont.)
- [ ] Receita bruta
- [ ] (-) Descontos
- [ ] (=) Receita líquida
- [ ] (-) CMV (Custo Mercadoria Vendida)
- [ ] (=) Lucro bruto
- [ ] Margem percentual

---

## ⚙️ Módulo Configurações

### Features (cont.)

#### CONF-001: Dados da Empresa

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Baixa     |
| **Sprint**       | 1         |
## Requisitos Funcionais: (cont.)
- [ ] Nome do estabelecimento
- [ ] Nome fantasia
- [ ] CNPJ/CPF
- [ ] Endereço completo
- [ ] Telefones
- [ ] Logo (upload de imagem)
- [ ] Dados exibidos no cupom

---

#### CONF-002: Configuração de Impressora

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Alta      |
| **Sprint**       | 3         |
## Requisitos Funcionais: (cont.)
- [ ] Seleção de interface: USB, Serial, Rede
- [ ] Detecção automática de impressoras USB
- [ ] Teste de impressão
- [ ] Configuração de colunas (40, 48, 80)
- [ ] Ativar/desativar guilhotina
- [ ] Ativar/desativar gaveta

---

#### CONF-003: Configuração de Balança

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Alta      |
| **Sprint**       | 4         |
## Requisitos Funcionais: (cont.)
- [ ] Seleção de porta COM
- [ ] Seleção de protocolo (Toledo, Filizola, etc)
- [ ] Configuração de baud rate
- [ ] Teste de conexão
- [ ] Teste de leitura de peso

---

#### CONF-004: Tema e Aparência

| Atributo         | Descrição  |
| ---------------- | ---------- |
| **Prioridade**   | P2 - Média |
| **Complexidade** | Baixa      |
| **Sprint**       | 5          |
## Requisitos Funcionais: (cont.)
- [ ] Dark mode / Light mode
- [ ] Cor primária customizável
- [ ] Tamanho da fonte (PDV)
- [ ] Layout do PDV: compacto ou expandido

---

#### CONF-005: Configuração de Backup

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Alta      |
| **Sprint**       | 5         |
## Requisitos Funcionais: (cont.)
- [ ] Autenticação com Google Drive
- [ ] Pasta de destino no Drive
- [ ] Frequência: horário, diário, semanal
- [ ] Retenção: últimos X backups
- [ ] Backup manual imediato
- [ ] Status do último backup

---

## 🚨 Módulo Alertas

### Features (cont.)

#### ALERT-001: Central de Alertas

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Média     |
| **Sprint**       | 3         |
## Requisitos Funcionais: (cont.)
- [ ] Ícone de sino no header com badge
- [ ] Dropdown com alertas recentes
- [ ] Página full com todos os alertas
- [ ] Filtros: tipo, severidade, lido/não lido
- [ ] Marcar como lido individual ou em lote

---

#### ALERT-002: Tipos de Alerta

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Média     |
| **Sprint**       | 3         |
## Alertas Implementados:
- [ ] **Vencimento Crítico**: produto vence em 3 dias
- [ ] **Vencimento Próximo**: produto vence em 7 dias
- [ ] **Vencimento Aviso**: produto vence em 30 dias
- [ ] **Estoque Zerado**: produto sem estoque
- [ ] **Estoque Baixo**: abaixo do mínimo
- [ ] **Margem Negativa**: venda abaixo do custo
- [ ] **Produto Parado**: sem venda em 60 dias

---

## 💾 Módulo Backup

### Features (cont.)

#### BACKUP-001: Backup Local

| Atributo         | Descrição    |
| ---------------- | ------------ |
| **Prioridade**   | P0 - Crítica |
| **Complexidade** | Média        |
| **Sprint**       | 4            |
## Requisitos Funcionais: (cont.)
- [ ] Backup automático a cada fechamento de caixa
- [ ] Backup diário às 03:00 (se PC ligado)
- [ ] Pasta: %APPDATA%/Mercearias/backups
- [ ] Rotação: manter últimos 7 dias
- [ ] Backup manual via menu

---

#### BACKUP-002: Backup Google Drive

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Alta      |
| **Sprint**       | 5         |
## Requisitos Funcionais: (cont.)
- [ ] Autenticação OAuth2
- [ ] Upload após backup local
- [ ] Criptografia AES-256 antes do upload
- [ ] Rotação: manter últimos 30 dias
- [ ] Indicador de status no rodapé

---

#### BACKUP-003: Restauração

| Atributo         | Descrição |
| ---------------- | --------- |
| **Prioridade**   | P1 - Alta |
| **Complexidade** | Alta      |
| **Sprint**       | 5         |
## Requisitos Funcionais: (cont.)
- [ ] Listar backups disponíveis (local + Drive)
- [ ] Visualizar data e tamanho
- [ ] Restaurar com confirmação dupla
- [ ] Backup atual antes de restaurar
- [ ] Reiniciar aplicação após restauração

---

## 🔧 Requisitos Não-Funcionais

### Performance

| Requisito              | Meta    | Medição                 |
| ---------------------- | ------- | ----------------------- |
| Tempo de inicialização | < 3s    | Cold start Windows 10   |
| Busca de produto       | < 100ms | P99 latency             |
| Finalização de venda   | < 500ms | Incluindo impressão     |
| Geração de relatório   | < 5s    | 30 dias, 10k transações |

### Disponibilidade

| Requisito                         | Meta                 |
| --------------------------------- | -------------------- |
| Uptime offline                    | 99.9%                |
| MTBF (Mean Time Between Failures) | > 720h               |
| Recuperação de crash              | < 30s (auto-restart) |

### Segurança

| Requisito          | Implementação           |
| ------------------ | ----------------------- |
| Senhas             | bcrypt, cost 10         |
| Dados em repouso   | SQLCipher (opcional)    |
| Backup em trânsito | HTTPS + AES-256         |
| Sessions           | JWT local, expiração 8h |

### Usabilidade

| Requisito           | Meta             |
| ------------------- | ---------------- |
| Tempo de onboarding | < 30 minutos     |
| Operações no PDV    | Máximo 3 cliques |
| Acessibilidade      | WCAG 2.1 AA      |
| Suporte a teclado   | 100% navegável   |

### Compatibilidade

| Requisito             | Suporte   |
| --------------------- | --------- |
| Windows 10            | ✅ 64-bit |
| Windows 11            | ✅ 64-bit |
| Resolução mínima      | 1024x768  |
| Resolução recomendada | 1366x768+ |

---

_Documento gerado seguindo metodologia "Architect First, Code Later" - Arkheion Corp_