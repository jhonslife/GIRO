# 📋 Mercearias - Visão Geral do Produto

> **Versão:** 1.0.0  
> **Status:** Planejamento  
> **Última Atualização:** 7 de Janeiro de 2026

---

## 🎯 O Que É

**Mercearias** é um sistema profissional completo de gestão para pequenos e médios estabelecimentos comerciais do varejo alimentício brasileiro. Desenvolvido como uma aplicação desktop nativa para Windows, oferece controle total de operações de PDV (Ponto de Venda), gestão de estoque, controle de validade, gestão de funcionários e relatórios gerenciais.

### Proposta de Valor

> _"Gestão profissional ao alcance do pequeno comerciante brasileiro"_

O sistema combina a robustez de soluções enterprise com a simplicidade necessária para operadores de caixa e proprietários de mercearias, padarias, minimercados e pequenos supermercados.

---

## 👥 Público-Alvo

### Perfil Primário: Proprietários de Pequenos Varejos

| Característica      | Descrição                                                      |
| ------------------- | -------------------------------------------------------------- |
| **Tipo de Negócio** | Mercearias, minimercados, padarias, açougues, hortifrútis      |
| **Faturamento**     | R$ 10.000 a R$ 500.000/mês                                     |
| **Funcionários**    | 1 a 15 colaboradores                                           |
| **Localização**     | Bairros, vilas, cidades do interior                            |
| **Tecnologia**      | Familiaridade básica com computadores                          |
| **Dor Principal**   | Perda de produtos por vencimento, falta de controle financeiro |

### Perfil Secundário: Operadores de Caixa

| Característica       | Descrição                            |
| -------------------- | ------------------------------------ |
| **Idade**            | 18 a 50 anos                         |
| **Escolaridade**     | Ensino médio                         |
| **Experiência Tech** | Básica (smartphone, redes sociais)   |
| **Necessidade**      | Interface simples, rápida, sem erros |

---

## 🌍 Análise de Mercado

### Tamanho do Mercado

| Métrica                        | Valor                                |
| ------------------------------ | ------------------------------------ |
| **Pequenos Varejos no Brasil** | ~1.2 milhões de estabelecimentos     |
| **Mercado de Software PDV**    | R$ 2.5 bilhões/ano (2025)            |
| **Crescimento Anual**          | 8-12%                                |
| **Taxa de Digitalização**      | Apenas 35% utilizam sistemas formais |

### Concorrência

| Concorrente   | Modelo     | Preço Mensal | Pontos Fracos                       |
| ------------- | ---------- | ------------ | ----------------------------------- |
| **MarketUP**  | SaaS Cloud | R$ 79-299    | Depende de internet, lento offline  |
| **Hiper**     | SaaS Cloud | R$ 99-399    | Complexo para pequenos comerciantes |
| **Siscomex**  | Desktop    | R$ 150-500   | Interface ultrapassada, UX ruim     |
| **ContaAzul** | SaaS Cloud | R$ 119-399   | Foco em serviços, não varejo        |
| **Bling**     | SaaS Cloud | R$ 75-300    | Genérico, pouca customização        |

### Oportunidades Identificadas

1. **65% dos pequenos varejos** ainda operam sem sistema ou com planilhas
2. **Conexão instável** em muitas regiões torna SaaS cloud problemático
3. **Custo mensal** de assinaturas é barreira para adoção
4. **Integração com hardware** (balanças, impressoras) é complexa nos concorrentes

---

## ⭐ Diferenciais Competitivos

### 1. 🖥️ Aplicação Desktop Nativa

| Benefício                       | Impacto                        |
| ------------------------------- | ------------------------------ |
| **Funciona 100% offline**       | Nunca para, mesmo sem internet |
| **Performance máxima**          | Resposta instantânea no caixa  |
| **Sem mensalidade de servidor** | Economia para o comerciante    |
| **Backup em nuvem opcional**    | Segurança com Google Drive     |

### 2. 📱 Scanner Mobile (Celular como Leitor)

Tecnologia inovadora que permite usar o celular do operador como leitor de código de barras, eliminando:

- Custo de leitoras dedicadas (R$ 200-800 cada)
- Cabos e configurações complexas
- Manutenção de hardware adicional

**Tecnologia:** WebSocket local + App PWA + Camera API

### 3. 🔌 Plug & Play de Hardware

Integração nativa com equipamentos mais usados no Brasil:

| Tipo            | Fabricantes                            | Protocolo            |
| --------------- | -------------------------------------- | -------------------- |
| **Impressoras** | Epson, Elgin, Bematech, Daruma, Gertec | ESC/POS              |
| **Balanças**    | Toledo, Filizola, Urano, Elgin         | Serial/USB           |
| **Leitoras**    | Honeywell, Zebra, Elgin, Bematech      | HID/Serial           |
| **Gavetas**     | Genéricas                              | Pulso via impressora |

### 4. 🚨 Sistema de Alertas Inteligente

| Alerta                 | Descrição                              |
| ---------------------- | -------------------------------------- |
| **Vencimento Crítico** | Produtos vencendo em 3, 7, 15, 30 dias |
| **Estoque Baixo**      | Atingiu quantidade mínima configurada  |
| **Estoque Zerado**     | Produto indisponível para venda        |
| **Produtos Parados**   | Sem movimentação em X dias             |
| **Margem Negativa**    | Preço de venda menor que custo         |

### 5. 📊 Relatórios Acionáveis

| Relatório                 | Decisão que Permite         |
| ------------------------- | --------------------------- |
| **Top 20 Mais Vendidos**  | Nunca deixar faltar         |
| **Top 20 Menos Vendidos** | Promoções ou descontinuar   |
| **Curva ABC**             | Foco nos 20% que geram 80%  |
| **Giro de Estoque**       | Otimizar capital de giro    |
| **Histórico de Preços**   | Negociar com fornecedores   |
| **DRE Simplificado**      | Saúde financeira do negócio |

### 6. ⚡ Cadastro Express (3 Cliques)

Cadastro rápido de produtos com:

- **Auto-complete** de dados via código de barras (base COSMOS/GTIN)
- **Sugestão de categoria** por machine learning local
- **Duplicação de produto similar** com ajustes
- **Import de planilha** do fornecedor

---

## 🏗️ Escopo da Versão 1.0

### ✅ Incluído (MVP)

| Módulo            | Funcionalidades Principais                       |
| ----------------- | ------------------------------------------------ |
| **PDV/Caixa**     | Venda rápida, busca inteligente, scanner, gaveta |
| **Produtos**      | Cadastro, categorias, códigos de barras, preços  |
| **Estoque**       | Entradas, saídas, inventário, alertas            |
| **Validade**      | Controle FIFO, alertas de vencimento             |
| **Funcionários**  | Cadastro básico, controle de acesso, logs        |
| **Caixa**         | Abertura, fechamento, sangria, suprimento        |
| **Relatórios**    | Vendas, estoque, produtos, financeiro básico     |
| **Configurações** | Empresa, impressora, balança, tema (dark/light)  |
| **Backup**        | Google Drive automático                          |

### ❌ Não Incluído (Versões Futuras)

| Funcionalidade           | Versão Planejada |
| ------------------------ | ---------------- |
| NFC-e / NF-e             | 2.0              |
| Integração TEF (cartões) | 2.0              |
| Multi-loja               | 2.5              |
| E-commerce sync          | 3.0              |
| App mobile gerencial     | 2.0              |
| Contas a pagar/receber   | 1.5              |
| Fidelidade/Cashback      | 2.5              |

---

## 📈 Métricas de Sucesso

### KPIs do Produto

| Métrica             | Meta v1.0         | Meta v2.0         |
| ------------------- | ----------------- | ----------------- |
| **Tempo de venda**  | < 5 segundos/item | < 3 segundos/item |
| **Uptime offline**  | 99.9%             | 99.99%            |
| **Crash rate**      | < 0.1%            | < 0.01%           |
| **Onboarding time** | < 30 minutos      | < 15 minutos      |
| **NPS usuários**    | > 50              | > 70              |

### KPIs de Negócio (Clientes)

| Métrica                       | Benchmark | Com Mercearias |
| ----------------------------- | --------- | -------------- |
| **Perda por vencimento**      | 3-5%      | < 1%           |
| **Ruptura de estoque**        | 15-20%    | < 5%           |
| **Tempo de fechamento caixa** | 30+ min   | < 10 min       |
| **Acuracidade de estoque**    | 70%       | > 95%          |

---

## 🛣️ Roadmap de Alto Nível

```text
Q1 2026: MVP Desktop + Caixa + Estoque + Validade
         ├── Instalador Windows
         ├── Impressora térmica
         └── Scanner USB/mobile

Q2 2026: Relatórios + Backup Cloud + Multi-usuário
         ├── Dashboard gerencial
         ├── Google Drive sync
         └── Perfis de acesso

Q3 2026: NFC-e + TEF + App Mobile
         ├── Emissão fiscal
         ├── Cartão crédito/débito
         └── App consulta gerencial

Q4 2026: Multi-loja + Franquias
         ├── Sincronização lojas
         ├── Dashboard consolidado
         └── Gestão de franquias
```text
---

## 💰 Modelo de Monetização (Planejado)

| Plano                | Preço      | Inclui                                    |
| -------------------- | ---------- | ----------------------------------------- |
| **Starter**          | R$ 49/mês  | 1 caixa, 500 produtos, backup básico      |
| **Pro**              | R$ 99/mês  | 3 caixas, ilimitado, relatórios avançados |
| **Enterprise**       | R$ 199/mês | Multi-loja, API, suporte prioritário      |
| **Licença Perpétua** | R$ 1.997   | Sem mensalidade, atualizações 1 ano       |

---

## 📞 Requisitos de Infraestrutura

### Hardware Mínimo (Cliente)

| Componente      | Mínimo         | Recomendado       |
| --------------- | -------------- | ----------------- |
| **Processador** | Dual Core 2GHz | Quad Core 2.5GHz  |
| **RAM**         | 4GB            | 8GB               |
| **Disco**       | 500MB livre    | 2GB SSD           |
| **Tela**        | 1024x768       | 1366x768 ou maior |
| **OS**          | Windows 10     | Windows 11        |

### Periféricos Suportados

| Tipo            | Modelos Homologados                                       |
| --------------- | --------------------------------------------------------- |
| **Impressoras** | Epson TM-T20X, TM-T88V, Elgin i9, i7, Bematech MP-4200 TH |
| **Balanças**    | Toledo Prix 3, Prix 4, Filizola CS15, Elgin DP            |
| **Leitoras**    | Honeywell Voyager 1250g, Elgin EL250, Bematech S-500      |

---

_Documento gerado seguindo metodologia "Architect First, Code Later" - Arkheion Corp_