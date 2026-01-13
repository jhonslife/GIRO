# 💰 GIRO - Modelo de Negócio

> **Versão:** 1.0.0  
> **Status:** Aprovado  
> **Última Atualização:** 8 de Janeiro de 2026

---

## 📋 Sumário

1. [Visão Geral do Modelo](#visão-geral-do-modelo)
2. [Estrutura de Preços](#estrutura-de-preços)
3. [Sistema de Licenciamento](#sistema-de-licenciamento)
4. [Arquitetura de Monetização](#arquitetura-de-monetização)
5. [Proteção Anti-Fraude](#proteção-anti-fraude)
6. [Painel do Administrador](#painel-do-administrador)
7. [Ecossistema GIRO](#ecossistema-giro)
8. [Projeções Financeiras](#projeções-financeiras)

---

## 🎯 Visão Geral do Modelo

### Modelo: SaaS Híbrido (Desktop + Licenciamento Cloud)

O GIRO opera com um modelo **Desktop-First com Licenciamento Centralizado**:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         ECOSSISTEMA GIRO                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │
│   │   GIRO Desktop  │    │   GIRO Mobile   │    │  GIRO License   │     │
│   │     (PDV)       │◄──►│   (Estoque)     │    │    Server       │     │
│   │                 │WiFi│                 │    │                 │     │
│   │  R$ 99,90/mês   │    │   Incluído      │    │   Validação     │     │
│   │   por caixa     │    │   na licença    │    │   Hardware ID   │     │
│   └────────┬────────┘    └────────┬────────┘    └────────┬────────┘     │
│            │                      │                      │              │
│            │     SQLite Local     │                      │              │
│            └──────────────────────┘                      │              │
│                                                          │              │
│                                              ┌───────────▼───────────┐  │
│                                              │    GIRO Dashboard     │  │
│                                              │  (Painel do Dono)     │  │
│                                              │                       │  │
│                                              │  • Ver métricas       │  │
│                                              │  • Gerenciar licenças │  │
│                                              │  • Transferir máquina │  │
│                                              └───────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```text
### Proposta de Valor por Segmento

| Segmento                 | Licenças Típicas | Ticket Mensal | Valor Percebido     |
| ------------------------ | ---------------- | ------------- | ------------------- |
| **Micro** (1 caixa)      | 1                | R$ 99,90      | Profissionalização  |
| **Pequeno** (2-3 caixas) | 2-3              | R$ 179-269    | Controle + Economia |
| **Médio** (4-6 caixas)   | 4-6              | R$ 359-499    | Escala + Relatórios |
| **Grande** (7+ caixas)   | 7+               | R$ 599+       | Enterprise Lite     |

---

## 💵 Estrutura de Preços

### Plano Único: GIRO Pro

| Componente            | Valor        | Descrição                  |
| --------------------- | ------------ | -------------------------- |
| **Licença por Caixa** | R$ 99,90/mês | 1 máquina = 1 licença      |
| **GIRO Mobile**       | Incluído     | Ilimitado por licença      |
| **Suporte WhatsApp**  | Incluído     | Horário comercial          |
| **Atualizações**      | Incluído     | Novas features automáticas |

### Pacotes Promocionais

| Pacote         | Licenças | Valor/mês | Economia | Ideal Para           |
| -------------- | -------- | --------- | -------- | -------------------- |
| **Starter**    | 1        | R$ 99,90  | -        | Mercearia individual |
| **Dupla**      | 2        | R$ 179,90 | 10%      | Padaria com 2 caixas |
| **Trio**       | 3        | R$ 249,90 | 17%      | Minimercado          |
| **Negócio**    | 5        | R$ 399,90 | 20%      | Supermercado pequeno |
| **Enterprise** | 10       | R$ 749,90 | 25%      | Rede local           |

### Política de Desconto

| Condição                | Desconto                           |
| ----------------------- | ---------------------------------- |
| **Anual (12 meses)**    | 2 meses grátis (17%)               |
| **Semestral (6 meses)** | 1 mês grátis (14%)                 |
| **Indicação**           | R$ 30 de crédito por cliente ativo |

---

## 🔐 Sistema de Licenciamento

### Conceito: Hardware ID Binding

Cada licença é vinculada a uma **assinatura única de hardware** (Hardware Fingerprint):

```text
Hardware ID = SHA256(
    CPU_ID +
    MOTHERBOARD_SERIAL +
    DISK_SERIAL +
    MAC_ADDRESS
)
```text
### Fluxo de Ativação

```text
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Cliente    │         │   Desktop    │         │   License    │
│   (Compra)   │         │     GIRO     │         │    Server    │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │  1. Compra Licença     │                        │
       │───────────────────────────────────────────────► │
       │                        │                        │
       │  2. Recebe Chave       │                        │
       │◄─────────────────────────────────────────────── │
       │                        │                        │
       │  3. Insere Chave       │                        │
       │───────────────────────►│                        │
       │                        │                        │
       │                        │  4. Envia Chave +      │
       │                        │     Hardware ID        │
       │                        │───────────────────────►│
       │                        │                        │
       │                        │  5. Valida & Registra  │
       │                        │◄───────────────────────│
       │                        │                        │
       │  6. App Ativado!       │                        │
       │◄───────────────────────│                        │
       │                        │                        │
```text
### Regras de Licenciamento

| Regra                     | Descrição                              |
| ------------------------- | -------------------------------------- |
| **1 Licença = 1 Máquina** | Hardware ID único por licença          |
| **Ativação Online**       | Requer internet na primeira ativação   |
| **Validação Periódica**   | Check a cada 24h (grace period 7 dias) |
| **Transferência**         | Permitida via painel (reset manual)    |
| **Múltiplas Licenças**    | Mesmo admin, múltiplas máquinas        |

### Estrutura da Licença

```json
{
  "license_key": "GIRO-XXXX-XXXX-XXXX-XXXX",
  "admin_id": "uuid-do-proprietario",
  "hardware_id": "sha256-fingerprint",
  "activated_at": "2026-01-08T10:00:00Z",
  "expires_at": "2026-02-08T10:00:00Z",
  "plan": "pro",
  "features": ["pdv", "stock", "reports", "mobile"],
  "max_mobile_devices": 5,
  "status": "active"
}
```text
---

## 🛡️ Proteção Anti-Fraude

### Vetor 1: Mudança de Data do Windows

**Problema:** Usuário altera data do sistema para "estender" licença.
## Solução:
```rust
fn validate_time() -> Result<(), LicenseError> {
    // 1. Buscar hora do servidor de licenças
    let server_time = license_server.get_time()?;

    // 2. Comparar com hora local
    let local_time = SystemTime::now();
    let drift = (server_time - local_time).abs();

    // 3. Tolerância de 5 minutos
    if drift > Duration::minutes(5) {
        return Err(LicenseError::TimeTampering);
    }

    Ok(())
}
```text
### Vetor 2: Clonagem de Hardware ID

**Problema:** Copiar instalação para outra máquina.
## Solução: (cont.)
- Hardware ID muda → Ativação inválida
- Requer reativação → Servidor detecta conflito
- Admin notificado → Pode liberar ou bloquear

### Vetor 3: Uso Offline Infinito

**Problema:** Desconectar para nunca validar.
## Solução: (cont.)
- Grace Period: 7 dias offline
- Após 7 dias: Modo somente leitura (consultas OK, vendas bloqueadas)
- Após 14 dias: App trava com mensagem de reconexão

### Vetor 4: Compartilhamento de Licença

**Problema:** Usar mesma chave em múltiplos locais.
## Solução: (cont.)
- Cada ativação invalida a anterior
- Notificação push para admin
- Log de tentativas no painel

---

## 📱 Painel do Administrador (Dashboard Web)

### Problema a Resolver

> "O empresário quer acompanhar pelo celular, mas não somos cloud"

### Solução: Sync Unidirecional Periódico

O GIRO Desktop envia **métricas agregadas** para o servidor de licenças em intervalos configuráveis:

```text
┌──────────────┐                    ┌──────────────┐
│   Desktop    │     Sync Data      │   License    │
│     GIRO     │ ──────────────────►│    Server    │
│              │  (a cada 1h)       │              │
│  • Vendas    │                    │  Armazena    │
│  • Estoque   │                    │  Métricas    │
│  • Alertas   │                    │  Agregadas   │
└──────────────┘                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  Dashboard   │
                                    │    Web/PWA   │
                                    │              │
                                    │  Acesso do   │
                                    │  Proprietário│
                                    └──────────────┘
```text
### Dados Sincronizados

| Métrica              | Frequência | Descrição                |
| -------------------- | ---------- | ------------------------ |
| **Vendas do Dia**    | 1h         | Total, qtd, ticket médio |
| **Top 10 Produtos**  | 1h         | Mais vendidos do dia     |
| **Alertas Críticos** | Tempo real | Estoque zero, validade   |
| **Status do Caixa**  | 1h         | Aberto/Fechado           |
| **Últimas Vendas**   | 1h         | Resumo das últimas 20    |

### Funcionalidades do Dashboard

| Feature                     | Descrição                     |
| --------------------------- | ----------------------------- |
| **Visão Geral**             | Cards com métricas do dia     |
| **Gráfico de Vendas**       | Linha de 7/30 dias            |
| **Alertas Push**            | Notificação no celular        |
| **Gerenciar Licenças**      | Ativar, desativar, transferir |
| **Transferir Máquina**      | Liberar Hardware ID           |
| **Histórico de Pagamentos** | Faturas e recibos             |
| **Suporte**                 | Chat integrado                |

### Privacidade

- ❌ Não sincroniza: Dados de clientes, CPFs, detalhes de vendas
- ✅ Sincroniza apenas: Totais agregados, contagens, alertas

---

## 🌐 Ecossistema GIRO

### Produtos do Ecossistema

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         ECOSSISTEMA GIRO                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    GIRO DESKTOP (Principal)                      │   │
│  │                                                                  │   │
│  │  • PDV Completo        • Controle de Caixa    • Relatórios      │   │
│  │  • Gestão de Produtos  • Funcionários         • Backup          │   │
│  │  • Controle de Estoque • Alertas Inteligentes • Hardware        │   │
│  │                                                                  │   │
│  │  Stack: Tauri + React + Rust + SQLite                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│              ┌───────────────┼───────────────┐                         │
│              ▼               ▼               ▼                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐              │
│  │  GIRO Mobile  │  │ GIRO License  │  │GIRO Dashboard │              │
│  │   (Android)   │  │    Server     │  │   (Web/PWA)   │              │
│  │               │  │               │  │               │              │
│  │ • Scanner     │  │ • Validação   │  │ • Métricas    │              │
│  │ • Estoque     │  │ • Hardware ID │  │ • Alertas     │              │
│  │ • Inventário  │  │ • Pagamentos  │  │ • Licenças    │              │
│  │ • Validade    │  │ • Sync Data   │  │ • Suporte     │              │
│  │               │  │               │  │               │              │
│  │ React Native  │  │ Rust + Axum   │  │ Next.js       │              │
│  └───────────────┘  └───────────────┘  └───────────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```text
### Relação Entre Produtos

| Produto                 | Tipo                | Precificação       | Dependência    |
| ----------------------- | ------------------- | ------------------ | -------------- |
| **GIRO Desktop**        | Aplicação Principal | R$ 99,90/caixa/mês | License Server |
| **GIRO Mobile**         | App Complementar    | Incluído           | Desktop (WiFi) |
| **GIRO License Server** | Infraestrutura      | Interno            | -              |
| **GIRO Dashboard**      | Portal Web          | Incluído           | License Server |

---

## 📊 Projeções Financeiras

### Métricas de Negócio

| Métrica             | Ano 1    | Ano 2   | Ano 3    |
| ------------------- | -------- | ------- | -------- |
| **Clientes Ativos** | 500      | 2.000   | 6.000    |
| **Licenças Totais** | 700      | 3.000   | 10.000   |
| **Ticket Médio**    | R$ 129   | R$ 139  | R$ 149   |
| **MRR**             | R$ 90k   | R$ 417k | R$ 1.49M |
| **ARR**             | R$ 1.08M | R$ 5M   | R$ 17.9M |
| **Churn Mensal**    | 5%       | 3%      | 2%       |

### Custos Operacionais

| Item                   | Custo Mensal | Notas              |
| ---------------------- | ------------ | ------------------ |
| **Servidor License**   | R$ 200       | VPS básico         |
| **Suporte (1 pessoa)** | R$ 3.000     | Primeiro ano       |
| **Marketing Digital**  | R$ 2.000     | Google Ads, Meta   |
| **Infraestrutura**     | R$ 500       | Domínios, SSL, etc |
| **Total Fixo**         | ~R$ 6.000    |                    |

### Break-Even

```text
Break-Even = Custo Fixo / Ticket Médio
Break-Even = R$ 6.000 / R$ 129
Break-Even = ~47 clientes

Meta Ano 1: 500 clientes = 10x break-even ✅
```text
---

## 🎯 Roadmap de Monetização

### Fase 1: MVP (Q1 2026)

- [ ] Licenciamento básico (chave + hardware ID)
- [ ] Validação online
- [ ] Painel simples de gestão de licenças
- [ ] Pagamento via Pix manual

### Fase 2: Automação (Q2 2026)

- [ ] Integração Stripe/PagSeguro
- [ ] Renovação automática
- [ ] Dashboard do administrador
- [ ] Notificações push

### Fase 3: Expansão (Q3-Q4 2026)

- [ ] App mobile de acompanhamento
- [ ] Relatórios avançados no dashboard
- [ ] API para integrações
- [ ] Programa de afiliados

---

_Este documento define a estratégia de monetização do ecossistema GIRO._