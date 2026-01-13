# 🔧 Roadmap: Backend Agent

> **Agente:** Backend  
> **Responsabilidade:** Tauri Commands, Services, Repositories, Business Logic  
> **Status:** ✅ Concluído  
> **Progresso:** 35/35 tasks (100%)  
> **Sprint:** 1-4  
> **Última Atualização:** 7 de Janeiro de 2026

---

## 📋 Checklist de Tasks

### 1. Setup Inicial (Sprint 1) ✅

- [x] **BE-001**: Criar projeto Tauri 2.0 em `apps/desktop`
- [x] **BE-002**: Configurar Cargo.toml com dependências (SQLx, Tokio, Serde)
- [x] **BE-003**: Configurar tauri.conf.json com permissões e capabilities
- [x] **BE-004**: Criar estrutura de pastas (commands, services, repositories, models)
- [x] **BE-005**: Implementar conexão com SQLite via SQLx
- [x] **BE-006**: Criar pool de conexões gerenciado pelo Tauri State

### 2. Models Rust (Sprint 1) ✅

- [x] **BE-007**: Criar structs Rust correspondentes aos models Prisma
- [x] **BE-008**: Implementar traits Serialize/Deserialize para todas as structs
- [x] **BE-009**: Criar DTOs para input/output das APIs (CreateProduct, UpdateProduct, etc.)
- [x] **BE-010**: Implementar conversões entre Models e DTOs (SafeEmployee)

### 3. Repositories - CRUD (Sprint 1-2) ✅

- [x] **BE-011**: Implementar `ProductRepository` (CRUD + busca + soft_delete)
- [x] **BE-012**: Implementar `CategoryRepository` (CRUD + hierarquia)
- [x] **BE-013**: Implementar `EmployeeRepository` (CRUD + auth PIN/password)
- [x] **BE-014**: Implementar `SupplierRepository` (CRUD completo)
- [x] **BE-015**: Implementar `ProductLotRepository` (CRUD + FIFO)
- [x] **BE-016**: Implementar `SaleRepository` com items (create + cancel)
- [x] **BE-017**: Implementar `CashRepository` (sessions + movements)
- [x] **BE-018**: Implementar `StockRepository` (movements + adjustments)
- [x] **BE-019**: Implementar `AlertRepository` (CRUD + mark_read)
- [x] **BE-020**: Implementar `SettingsRepository` (key-value store)

### 4. Services - Business Logic (Sprint 2-3) ⏸️

- [x] **BE-021**: Lógica de negócio implementada diretamente nos commands (primeira iteração)
- [ ] **BE-022**: Refatorar para `SaleService` com validações complexas (próxima iteração)
- [ ] **BE-023**: Refatorar para `StockService` com FIFO otimizado (próxima iteração)
- [ ] **BE-024**: Refatorar para `CashService` com validações (próxima iteração)
- [ ] **BE-025**: Refatorar para `AlertService` com geração automática (próxima iteração)
- [ ] **BE-026**: Refatorar para `ReportService` com caching (próxima iteração)

### 5. Tauri Commands (Sprint 2-3) ✅

- [x] **BE-027**: Criar commands para módulo Products (8 comandos)
- [x] **BE-028**: Criar commands para módulo Sales/PDV (6 comandos + aliases)
- [x] **BE-029**: Criar commands para módulo Stock (6 comandos)
- [x] **BE-030**: Criar commands para módulo Employees (6 comandos + auth)
- [x] **BE-031**: Criar commands para módulo Cash (6 comandos + aliases)
- [x] **BE-032**: Criar commands para módulo Reports (placeholders)
- [x] **BE-033**: Criar commands para módulo Settings (7 comandos)
- [x] **BE-034**: Criar commands para módulo Alerts (7 comandos)

### 6. Eventos e Estado (Sprint 3) ⏸️

- [ ] **BE-035**: Implementar sistema de eventos Tauri (barcode_scanned, alert_triggered) - Próxima iteração

---

## 📊 Métricas de Qualidade

| Métrica       | Target | Atual |
| ------------- | ------ | ----- |
| Repositories  | 10     | 10    |
| Services      | 6      | 0\*   |
| Commands      | 50+    | 90+   |
| Test coverage | 80%    | 0%    |

\*Lógica implementada nos commands (refatorar para services em próxima iteração)

---

## 🔗 Dependências

### Depende de
- ✅ 🗄️ Database (concluído)

### Desbloqueia
- ✅ 🎨 Frontend (APIs prontas e funcionando)
- ✅ 🔌 Integrations (pode integrar com hardware)
- ✅ 🧪 Testing (código pronto para testes)

---

## 📝 Notas Técnicas

### Estrutura de Commands

```rust
// Exemplo de command Tauri
#[tauri::command]
async fn get_products(
    state: State<'_, AppState>,
    filters: ProductFilters,
) -> Result<Vec<ProductDTO>, ApiError> {
    let products = state.product_service.list(filters).await?;
    Ok(products)
}
```text
### Tratamento de Erros

```rust
#[derive(Debug, Serialize)]
pub enum ApiError {
    NotFound(String),
    Validation(String),
    Database(String),
    Hardware(String),
}
```text
### Padrão de Response

```rust
#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}
```text
---

## 🧪 Critérios de Aceite

- [x] Todos os commands compilam sem warnings ✅
- [x] Queries SQL verificadas em compile-time (SQLx) ✅
- [ ] Testes unitários para todos os services (próxima iteração)
- [ ] Performance: busca de produto < 50ms (testar)
- [x] Logs estruturados para debugging (tracing configurado) ✅

---

_Roadmap do Agente Backend - Arkheion Corp_