# 🦀 Backend Roadmap - GIRO Enterprise

> **Agente:** 02-backend  
> **Status:** 🔴 BLOCKED  
> **Progresso:** 0/24 (0%)  
> **Bloqueador:** Depende de 01-database  
> **Última Atualização:** 25 de Janeiro de 2026

---

## 📋 Objetivo

Implementar todos os commands Tauri, services e repositories em Rust para o módulo Enterprise, seguindo os padrões estabelecidos no projeto:

- Commands para IPC (frontend ↔ backend)
- Services para lógica de negócio
- Repositories para acesso a dados via SQLx

---

## ✅ Checklist de Tasks

### Fase 1: Contracts (5 tasks)

- [ ] **BE-001**: Criar `commands/contracts.rs`

  ```rust
  // Estrutura do arquivo
  use tauri::command;
  use crate::database::DbPool;
  use crate::models::enterprise::*;

  #[command]
  pub async fn create_contract(...) -> Result<Contract, String>

  #[command]
  pub async fn update_contract(...) -> Result<Contract, String>

  #[command]
  pub async fn get_contract(...) -> Result<Option<Contract>, String>

  #[command]
  pub async fn list_contracts(...) -> Result<Vec<Contract>, String>

  #[command]
  pub async fn get_contract_dashboard(...) -> Result<ContractDashboard, String>
  ```

- [ ] **BE-002**: Implementar `create_contract`

  - Validar código único
  - Validar datas (start <= end)
  - Criar registro com status PLANNING
  - Registrar audit log

- [ ] **BE-003**: Implementar `update_contract`

  - Verificar permissão (CONTRACT_MANAGER ou ADMIN)
  - Não permitir edição se COMPLETED/CANCELLED
  - Atualizar campos permitidos
  - Registrar audit log

- [ ] **BE-004**: Implementar `list_contracts`

  - Filtros: status, managerId, search (code/name)
  - Paginação cursor-based
  - Incluir contagem de workFronts e requests

- [ ] **BE-005**: Implementar `get_contract_dashboard`
  - Retornar métricas do contrato:
    - Total de requisições (por status)
    - Total de materiais consumidos
    - Custo total apropriado
    - Frentes ativas

### Fase 2: Work Fronts (4 tasks)

- [ ] **BE-006**: Criar `commands/work_fronts.rs`

  ```rust
  #[command]
  pub async fn create_work_front(...) -> Result<WorkFront, String>

  #[command]
  pub async fn update_work_front(...) -> Result<WorkFront, String>

  #[command]
  pub async fn list_work_fronts(...) -> Result<Vec<WorkFront>, String>

  #[command]
  pub async fn get_work_front(...) -> Result<Option<WorkFront>, String>
  ```

- [ ] **BE-007**: Implementar CRUD work_fronts

  - Validar código único por contrato
  - Validar contrato ativo
  - Validar supervisor é funcionário ativo

- [ ] **BE-008**: Implementar filtros de listagem
  - Por contrato
  - Por supervisor
  - Por status

### Fase 3: Activities (3 tasks)

- [ ] **BE-009**: Criar `commands/activities.rs`

  ```rust
  #[command]
  pub async fn create_activity(...) -> Result<Activity, String>

  #[command]
  pub async fn update_activity(...) -> Result<Activity, String>

  #[command]
  pub async fn list_activities(...) -> Result<Vec<Activity>, String>

  #[command]
  pub async fn update_activity_progress(...) -> Result<Activity, String>
  ```

- [ ] **BE-010**: Implementar CRUD activities

  - Validar código único por frente
  - Validar frente ativa

- [ ] **BE-011**: Implementar `update_activity_progress`
  - Atualizar executedQty
  - Calcular progresso percentual
  - Emitir alerta se > 100%

### Fase 4: Stock Locations (4 tasks)

- [ ] **BE-012**: Criar `commands/stock_locations.rs`

  ```rust
  #[command]
  pub async fn create_stock_location(...) -> Result<StockLocation, String>

  #[command]
  pub async fn update_stock_location(...) -> Result<StockLocation, String>

  #[command]
  pub async fn list_stock_locations(...) -> Result<Vec<StockLocation>, String>

  #[command]
  pub async fn get_location_balances(...) -> Result<Vec<StockBalance>, String>

  #[command]
  pub async fn adjust_location_balance(...) -> Result<StockBalance, String>
  ```

- [ ] **BE-013**: Implementar CRUD stock_locations

  - Validar código único
  - Validar tipo e vínculo com contrato

- [ ] **BE-014**: Implementar `get_location_balances`

  - Listar todos os produtos com saldo no local
  - Incluir produto com detalhes
  - Filtrar por categoria, search

- [ ] **BE-015**: Implementar `adjust_location_balance`
  - Ajuste manual de inventário
  - Requer justificativa
  - Registrar StockMovement
  - Registrar audit log

### Fase 5: Material Requests (6 tasks)

- [ ] **BE-016**: Criar `commands/material_requests.rs`

  ```rust
  #[command]
  pub async fn create_material_request(...) -> Result<MaterialRequest, String>

  #[command]
  pub async fn add_request_items(...) -> Result<MaterialRequest, String>

  #[command]
  pub async fn submit_request(...) -> Result<MaterialRequest, String>

  #[command]
  pub async fn approve_request(...) -> Result<MaterialRequest, String>

  #[command]
  pub async fn reject_request(...) -> Result<MaterialRequest, String>

  #[command]
  pub async fn separate_request(...) -> Result<MaterialRequest, String>

  #[command]
  pub async fn deliver_request(...) -> Result<MaterialRequest, String>

  #[command]
  pub async fn list_requests(...) -> Result<Vec<MaterialRequest>, String>
  ```

- [ ] **BE-017**: Implementar `create_material_request`

  - Criar requisição em status DRAFT
  - Gerar requestNumber sequencial por contrato
  - Vincular a contrato/frente/atividade

- [ ] **BE-018**: Implementar `submit_request`

  - Alterar status DRAFT → PENDING
  - Validar itens > 0
  - Notificar aprovador (futuro)

- [ ] **BE-019**: Implementar `approve_request`

  - Verificar permissão de aprovação
  - Verificar limite de valor
  - Permitir aprovação parcial (aprovedQty < requestedQty)
  - Alterar status → APPROVED ou PARTIALLY_APPROVED
  - Reservar quantidades no estoque

- [ ] **BE-020**: Implementar `reject_request`

  - Requer motivo
  - Alterar status → REJECTED
  - Liberar reservas se houver

- [ ] **BE-021**: Implementar `separate_request` e `deliver_request`
  - Separar: status → SEPARATING
  - Entregar: status → DELIVERED
  - Baixar estoque do local de origem
  - Criar MaterialConsumption se atividade vinculada
  - Atualizar StockBalance

### Fase 6: Stock Transfers (4 tasks)

- [ ] **BE-022**: Criar `commands/stock_transfers.rs`

  ```rust
  #[command]
  pub async fn create_stock_transfer(...) -> Result<StockTransfer, String>

  #[command]
  pub async fn approve_transfer(...) -> Result<StockTransfer, String>

  #[command]
  pub async fn reject_transfer(...) -> Result<StockTransfer, String>

  #[command]
  pub async fn ship_transfer(...) -> Result<StockTransfer, String>

  #[command]
  pub async fn receive_transfer(...) -> Result<StockTransfer, String>

  #[command]
  pub async fn list_transfers(...) -> Result<Vec<StockTransfer>, String>
  ```

- [ ] **BE-023**: Implementar `create_stock_transfer`

  - Gerar transferNumber sequencial
  - Validar locais diferentes
  - Validar disponibilidade no local de origem

- [ ] **BE-024**: Implementar workflow de transferência
  - `approve_transfer`: PENDING → APPROVED
    - Reservar quantidades na origem
  - `ship_transfer`: APPROVED → IN_TRANSIT
    - Baixar estoque da origem
  - `receive_transfer`: IN_TRANSIT → COMPLETED
    - Entrada no estoque destino
    - Criar StockBalance se não existir

### Fase 7: Reports Enterprise (2 tasks)

- [ ] **BE-025**: Criar `commands/reports_enterprise.rs`

  ```rust
  #[command]
  pub async fn report_consumption_by_contract(...) -> Result<ConsumptionReport, String>

  #[command]
  pub async fn report_consumption_by_activity(...) -> Result<ConsumptionReport, String>

  #[command]
  pub async fn report_consumption_by_cost_center(...) -> Result<CostCenterReport, String>

  #[command]
  pub async fn report_stock_position(...) -> Result<StockPositionReport, String>

  #[command]
  pub async fn report_pending_requests(...) -> Result<PendingRequestsReport, String>
  ```

- [ ] **BE-026**: Implementar relatórios
  - Consumo por Contrato: agregar MaterialConsumption
  - Consumo por Atividade: detalhar por atividade
  - Consumo por Centro de Custo: agregar por costCenter
  - Posição de Estoque: saldos por local
  - Requisições Pendentes: listar por aprovador

---

## 📁 Estrutura de Arquivos

```text
apps/desktop/src-tauri/src/
├── commands/
│   ├── mod.rs                    # Adicionar exports
│   ├── contracts.rs              # NOVO
│   ├── work_fronts.rs            # NOVO
│   ├── activities.rs             # NOVO
│   ├── stock_locations.rs        # NOVO
│   ├── material_requests.rs      # NOVO
│   ├── stock_transfers.rs        # NOVO
│   └── reports_enterprise.rs     # NOVO
├── models/
│   ├── mod.rs
│   └── enterprise.rs             # NOVO - structs e DTOs
├── repositories/
│   ├── mod.rs
│   ├── contract_repo.rs          # NOVO
│   ├── work_front_repo.rs        # NOVO
│   ├── activity_repo.rs          # NOVO
│   ├── location_repo.rs          # NOVO
│   ├── request_repo.rs           # NOVO
│   └── transfer_repo.rs          # NOVO
└── services/
    ├── mod.rs
    ├── request_service.rs        # NOVO - lógica de workflow
    ├── transfer_service.rs       # NOVO - lógica de workflow
    └── cost_appropriation_service.rs  # NOVO
```

---

## 🔧 Padrões de Código

### Command Pattern

```rust
use tauri::command;
use crate::database::DbPool;
use crate::error::AppError;

#[command]
pub async fn create_contract(
    pool: tauri::State<'_, DbPool>,
    employee_id: String,
    input: CreateContractInput,
) -> Result<Contract, String> {
    // Validação
    input.validate().map_err(|e| e.to_string())?;

    // Verificar permissão
    let employee = get_employee(&pool, &employee_id).await
        .map_err(|e| e.to_string())?;

    if !employee.can_create_contract() {
        return Err("Sem permissão para criar contratos".into());
    }

    // Executar
    let contract = ContractRepository::new(pool.inner().clone())
        .create(input)
        .await
        .map_err(|e| e.to_string())?;

    // Audit log
    AuditLog::log_create(&pool, "Contract", &contract.id, &employee_id).await?;

    Ok(contract)
}
```

### Repository Pattern

```rust
pub struct ContractRepository {
    pool: Pool<Sqlite>,
}

impl ContractRepository {
    pub fn new(pool: Pool<Sqlite>) -> Self {
        Self { pool }
    }

    pub async fn create(&self, input: CreateContractInput) -> Result<Contract, sqlx::Error> {
        let id = cuid::cuid2();

        sqlx::query_as!(
            Contract,
            r#"
            INSERT INTO contracts (id, code, name, client_name, ...)
            VALUES (?, ?, ?, ?, ...)
            RETURNING *
            "#,
            id,
            input.code,
            input.name,
            input.client_name,
        )
        .fetch_one(&self.pool)
        .await
    }
}
```

---

## 🔗 Registro no main.rs

Adicionar ao `tauri::Builder`:

```rust
.invoke_handler(tauri::generate_handler![
    // ... commands existentes ...

    // Enterprise - Contracts
    commands::contracts::create_contract,
    commands::contracts::update_contract,
    commands::contracts::get_contract,
    commands::contracts::list_contracts,
    commands::contracts::get_contract_dashboard,

    // Enterprise - Work Fronts
    commands::work_fronts::create_work_front,
    commands::work_fronts::update_work_front,
    commands::work_fronts::list_work_fronts,
    commands::work_fronts::get_work_front,

    // ... demais commands ...
])
```

---

## 🧪 Validação

Após implementação, verificar:

- [ ] Todos os commands registrados no main.rs
- [ ] Tipos de retorno são `Result<T, String>`
- [ ] Erros tratados com mensagens claras em PT-BR
- [ ] Audit logs em operações de escrita
- [ ] Transações em operações multi-tabela
- [ ] Testes unitários para cada command

---

_Roadmap criado em: 25 de Janeiro de 2026_
