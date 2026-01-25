# 📊 GIRO Enterprise - Dashboard de Progresso

> **Módulo:** Enterprise - Almoxarifado Industrial  
> **Branch:** `feature/enterprise-profile`  
> **Última Atualização:** 25 de Janeiro de 2026  
> **Status Geral:** 🟡 Em Planejamento

---

## 🎛️ Flight Panel

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                     GIRO ENTERPRISE - FLIGHT PANEL                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐    │
│   │ 01-DATABASE │   │ 02-BACKEND  │   │ 03-FRONTEND │   │  04-AUTH    │    │
│   │             │   │             │   │             │   │             │    │
│   │   ░░░░░░░░  │   │   ░░░░░░░░  │   │   ░░░░░░░░  │   │   ░░░░░░░░  │    │
│   │     0%      │   │     0%      │   │     0%      │   │     0%      │    │
│   │   WAITING   │   │   BLOCKED   │   │   BLOCKED   │   │   WAITING   │    │
│   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘    │
│                                                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐    │
│   │ 05-INTEGRAT │   │ 06-TESTING  │   │ 07-DEVOPS   │   │  08-DESIGN  │    │
│   │             │   │             │   │             │   │             │    │
│   │   ░░░░░░░░  │   │   ░░░░░░░░  │   │   ░░░░░░░░  │   │   ░░░░░░░░  │    │
│   │     0%      │   │     0%      │   │     0%      │   │     0%      │    │
│   │   BLOCKED   │   │   BLOCKED   │   │   WAITING   │   │   WAITING   │    │
│   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘    │
│                                                                             │
│   LEGENDA:                                                                  │
│   ░░░░░░░░ = Não iniciado   ▓▓▓▓░░░░ = Em progresso   ▓▓▓▓▓▓▓▓ = Concluído │
│   🟢 READY   🟡 IN PROGRESS   🔴 BLOCKED   ⚪ WAITING                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📈 Progresso por Agente

| Agente              |   Status   | Tasks | Concluídas | Progresso | Bloqueador             |
| ------------------- | :--------: | :---: | :--------: | :-------: | ---------------------- |
| **01-database**     | ⚪ WAITING |  18   |     0      |    0%     | -                      |
| **02-backend**      | 🔴 BLOCKED |  24   |     0      |    0%     | Depende de 01-database |
| **03-frontend**     | 🔴 BLOCKED |  32   |     0      |    0%     | Depende de 02-backend  |
| **04-auth**         | ⚪ WAITING |   8   |     0      |    0%     | -                      |
| **05-integrations** | 🔴 BLOCKED |   6   |     0      |    0%     | Depende de 02-backend  |
| **06-testing**      | 🔴 BLOCKED |  12   |     0      |    0%     | Depende de 03-frontend |
| **07-devops**       | ⚪ WAITING |   4   |     0      |    0%     | -                      |
| **08-design**       | ⚪ WAITING |  10   |     0      |    0%     | -                      |

**TOTAL:** 0/114 tasks (0%)

---

## 🔗 Grafo de Dependências

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                        GRAFO DE DEPENDÊNCIAS                                │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  08-DESIGN   │
                    │  (UI/UX)     │
                    └──────┬───────┘
                           │
                           ▼
    ┌──────────────┐   ┌──────────────┐
    │  04-AUTH     │   │  01-DATABASE │
    │  (Roles)     │   │  (Schema)    │
    └──────┬───────┘   └──────┬───────┘
           │                  │
           │                  ▼
           │           ┌──────────────┐
           │           │  02-BACKEND  │
           │           │  (Commands)  │
           │           └──────┬───────┘
           │                  │
           ▼                  ▼
    ┌──────────────────────────────────┐
    │          03-FRONTEND             │
    │          (Pages/UI)              │
    └──────────────┬───────────────────┘
                   │
                   ├───────────────────────┐
                   ▼                       ▼
    ┌──────────────┐            ┌──────────────┐
    │ 05-INTEGRAT  │            │  06-TESTING  │
    │ (Mobile)     │            │  (QA)        │
    └──────────────┘            └──────┬───────┘
                                       │
                                       ▼
                               ┌──────────────┐
                               │  07-DEVOPS   │
                               │  (CI/CD)     │
                               └──────────────┘

ORDEM DE EXECUÇÃO RECOMENDADA:
1️⃣ 08-design + 04-auth + 01-database (paralelo)
2️⃣ 02-backend
3️⃣ 03-frontend
4️⃣ 05-integrations + 06-testing (paralelo)
5️⃣ 07-devops
```

---

## 📋 Resumo de Tasks por Agente

### 01-database (18 tasks)

| #   | Task                                     | Status |
| --- | ---------------------------------------- | :----: |
| 1   | Adicionar enum `BusinessType.ENTERPRISE` |   ⬜   |
| 2   | Adicionar enum `ContractStatus`          |   ⬜   |
| 3   | Adicionar enum `WorkFrontStatus`         |   ⬜   |
| 4   | Adicionar enum `ActivityStatus`          |   ⬜   |
| 5   | Adicionar enum `StockLocationType`       |   ⬜   |
| 6   | Adicionar enum `RequestStatus`           |   ⬜   |
| 7   | Adicionar enum `RequestPriority`         |   ⬜   |
| 8   | Adicionar enum `TransferStatus`          |   ⬜   |
| 9   | Criar model `Contract`                   |   ⬜   |
| 10  | Criar model `WorkFront`                  |   ⬜   |
| 11  | Criar model `Activity`                   |   ⬜   |
| 12  | Criar model `StockLocation`              |   ⬜   |
| 13  | Criar model `StockBalance`               |   ⬜   |
| 14  | Criar model `MaterialRequest`            |   ⬜   |
| 15  | Criar model `MaterialRequestItem`        |   ⬜   |
| 16  | Criar model `StockTransfer`              |   ⬜   |
| 17  | Criar model `StockTransferItem`          |   ⬜   |
| 18  | Criar model `MaterialConsumption`        |   ⬜   |

### 02-backend (24 tasks)

| #   | Task                                   | Status |
| --- | -------------------------------------- | :----: |
| 1   | Criar `commands/contracts.rs`          |   ⬜   |
| 2   | Implementar `create_contract`          |   ⬜   |
| 3   | Implementar `update_contract`          |   ⬜   |
| 4   | Implementar `list_contracts`           |   ⬜   |
| 5   | Implementar `get_contract`             |   ⬜   |
| 6   | Criar `commands/work_fronts.rs`        |   ⬜   |
| 7   | Implementar CRUD work_fronts           |   ⬜   |
| 8   | Criar `commands/activities.rs`         |   ⬜   |
| 9   | Implementar CRUD activities            |   ⬜   |
| 10  | Criar `commands/stock_locations.rs`    |   ⬜   |
| 11  | Implementar CRUD stock_locations       |   ⬜   |
| 12  | Implementar get_location_balances      |   ⬜   |
| 13  | Criar `commands/material_requests.rs`  |   ⬜   |
| 14  | Implementar create_request             |   ⬜   |
| 15  | Implementar approve_request            |   ⬜   |
| 16  | Implementar reject_request             |   ⬜   |
| 17  | Implementar separate_request           |   ⬜   |
| 18  | Implementar deliver_request            |   ⬜   |
| 19  | Criar `commands/stock_transfers.rs`    |   ⬜   |
| 20  | Implementar create_transfer            |   ⬜   |
| 21  | Implementar approve_transfer           |   ⬜   |
| 22  | Implementar ship_transfer              |   ⬜   |
| 23  | Implementar receive_transfer           |   ⬜   |
| 24  | Criar `commands/reports_enterprise.rs` |   ⬜   |

### 03-frontend (32 tasks)

| #   | Task                                       | Status |
| --- | ------------------------------------------ | :----: |
| 1   | Criar `pages/contracts/index.tsx`          |   ⬜   |
| 2   | Criar `pages/contracts/[id].tsx`           |   ⬜   |
| 3   | Criar `pages/contracts/new.tsx`            |   ⬜   |
| 4   | Criar componente `ContractCard`            |   ⬜   |
| 5   | Criar componente `ContractForm`            |   ⬜   |
| 6   | Criar `pages/work-fronts/index.tsx`        |   ⬜   |
| 7   | Criar `pages/work-fronts/[id].tsx`         |   ⬜   |
| 8   | Criar componente `WorkFrontCard`           |   ⬜   |
| 9   | Criar `pages/activities/index.tsx`         |   ⬜   |
| 10  | Criar componente `ActivityCard`            |   ⬜   |
| 11  | Criar `pages/locations/index.tsx`          |   ⬜   |
| 12  | Criar `pages/locations/[id]/balances.tsx`  |   ⬜   |
| 13  | Criar componente `LocationBalanceTable`    |   ⬜   |
| 14  | Criar `pages/requests/index.tsx`           |   ⬜   |
| 15  | Criar `pages/requests/new.tsx`             |   ⬜   |
| 16  | Criar `pages/requests/[id].tsx`            |   ⬜   |
| 17  | Criar componente `RequestForm`             |   ⬜   |
| 18  | Criar componente `RequestItemsTable`       |   ⬜   |
| 19  | Criar componente `RequestWorkflow`         |   ⬜   |
| 20  | Criar componente `RequestApprovalModal`    |   ⬜   |
| 21  | Criar `pages/transfers/index.tsx`          |   ⬜   |
| 22  | Criar `pages/transfers/new.tsx`            |   ⬜   |
| 23  | Criar `pages/transfers/[id].tsx`           |   ⬜   |
| 24  | Criar componente `TransferForm`            |   ⬜   |
| 25  | Criar componente `TransferWorkflow`        |   ⬜   |
| 26  | Criar `pages/inventory/index.tsx`          |   ⬜   |
| 27  | Criar componente `InventoryCountForm`      |   ⬜   |
| 28  | Adaptar `pages/dashboard/` para Enterprise |   ⬜   |
| 29  | Criar `DashboardEnterprise` componente     |   ⬜   |
| 30  | Criar hooks `useContracts`                 |   ⬜   |
| 31  | Criar hooks `useRequests`                  |   ⬜   |
| 32  | Criar hooks `useTransfers`                 |   ⬜   |

### 04-auth (8 tasks)

| #   | Task                              | Status |
| --- | --------------------------------- | :----: |
| 1   | Adicionar role `CONTRACT_MANAGER` |   ⬜   |
| 2   | Adicionar role `SUPERVISOR`       |   ⬜   |
| 3   | Adicionar role `WAREHOUSE`        |   ⬜   |
| 4   | Adicionar role `REQUESTER`        |   ⬜   |
| 5   | Criar matriz de permissões        |   ⬜   |
| 6   | Implementar `canApproveRequest()` |   ⬜   |
| 7   | Implementar `canManageContract()` |   ⬜   |
| 8   | Implementar limites de aprovação  |   ⬜   |

### 05-integrations (6 tasks)

| #   | Task                                   | Status |
| --- | -------------------------------------- | :----: |
| 1   | Adaptar Mobile Scanner para inventário |   ⬜   |
| 2   | Criar actions `inventory.start`        |   ⬜   |
| 3   | Criar actions `inventory.scan`         |   ⬜   |
| 4   | Criar actions `inventory.count`        |   ⬜   |
| 5   | Criar actions `inventory.finish`       |   ⬜   |
| 6   | Documentar API WebSocket inventário    |   ⬜   |

### 06-testing (12 tasks)

| #   | Task                                       | Status |
| --- | ------------------------------------------ | :----: |
| 1   | Testes unitários - Contract CRUD           |   ⬜   |
| 2   | Testes unitários - WorkFront CRUD          |   ⬜   |
| 3   | Testes unitários - Request workflow        |   ⬜   |
| 4   | Testes unitários - Transfer workflow       |   ⬜   |
| 5   | Testes unitários - Stock balances          |   ⬜   |
| 6   | Testes integração - Request flow completo  |   ⬜   |
| 7   | Testes integração - Transfer flow completo |   ⬜   |
| 8   | Testes E2E - Criar contrato                |   ⬜   |
| 9   | Testes E2E - Requisição até entrega        |   ⬜   |
| 10  | Testes E2E - Transferência entre obras     |   ⬜   |
| 11  | Testes acessibilidade - axe-core           |   ⬜   |
| 12  | Coverage > 80%                             |   ⬜   |

### 07-devops (4 tasks)

| #   | Task                                 | Status |
| --- | ------------------------------------ | :----: |
| 1   | Atualizar CI para incluir Enterprise |   ⬜   |
| 2   | Build profile Enterprise no Tauri    |   ⬜   |
| 3   | Migrations automáticas               |   ⬜   |
| 4   | Release notes Enterprise             |   ⬜   |

### 08-design (10 tasks)

| #   | Task                                | Status |
| --- | ----------------------------------- | :----: |
| 1   | Definir paleta de cores Enterprise  |   ⬜   |
| 2   | Criar ícones para módulos           |   ⬜   |
| 3   | Design do Dashboard Enterprise      |   ⬜   |
| 4   | Design do Workflow de Requisição    |   ⬜   |
| 5   | Design do Workflow de Transferência |   ⬜   |
| 6   | Design do Inventário Rotativo       |   ⬜   |
| 7   | Design responsivo para tablets      |   ⬜   |
| 8   | Wireframes das telas principais     |   ⬜   |
| 9   | Protótipo interativo (Figma)        |   ⬜   |
| 10  | Validação de acessibilidade WCAG    |   ⬜   |

---

## 📆 Cronograma Estimado

| Semana | Foco                    | Entregáveis                              |
| ------ | ----------------------- | ---------------------------------------- |
| **1**  | Database + Design       | Schema completo, wireframes              |
| **2**  | Backend base            | Commands de contratos/frentes/atividades |
| **3**  | Backend requisições     | Workflow de requisição completo          |
| **4**  | Backend transferências  | Workflow de transferência completo       |
| **5**  | Frontend base           | Páginas de contratos/frentes             |
| **6**  | Frontend requisições    | Telas e workflow de requisição           |
| **7**  | Frontend transferências | Telas e workflow de transferência        |
| **8**  | Relatórios              | Dashboard e relatórios Enterprise        |
| **9**  | Inventário              | Módulo de inventário rotativo            |
| **10** | QA + Polish             | Testes, ajustes, documentação            |

---

## 🚦 Próximos Passos

1. ⬜ **Aprovar documentação** - Revisar 05-ENTERPRISE-MODULE.md
2. ⬜ **Iniciar 01-database** - Criar schema Prisma
3. ⬜ **Iniciar 08-design** - Wireframes das telas
4. ⬜ **Iniciar 04-auth** - Definir roles e permissões

---

## 📝 Notas

- Branch: `feature/enterprise-profile`
- Sem quebra de compatibilidade com perfis existentes
- Reutilização máxima do core (Products, Employees, etc.)
- Mobile Scanner adaptado para inventário

---

_Dashboard atualizado em: 25 de Janeiro de 2026_
