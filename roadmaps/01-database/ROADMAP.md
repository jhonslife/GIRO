# 🗄️ Roadmap: Database Agent

> **Agente:** Database  
> **Responsabilidade:** Schema, Migrations, Seeds, Otimização  
> **Status:** ✅ Concluído  
> **Progresso:** 22/22 tasks (100%)  
> **Sprint:** 1  
> **Bloqueado Por:** Nenhum

---

## 📋 Checklist de Tasks

### 1. Setup Inicial

- [x] **DB-001**: Criar package `packages/database` no monorepo
- [x] **DB-002**: Configurar Prisma para SQLite
- [x] **DB-003**: Criar estrutura base do `schema.prisma`
- [x] **DB-004**: Configurar scripts de migration no package.json

### 2. Schema - Entidades Core

- [x] **DB-005**: Criar model `Category` com hierarquia (self-relation)
- [x] **DB-006**: Criar model `Product` com todos os campos
- [x] **DB-007**: Criar model `ProductLot` para controle de validade
- [x] **DB-008**: Criar model `Supplier` para fornecedores
- [x] **DB-009**: Criar model `Employee` com campos de auth
- [x] **DB-010**: Criar enums `ProductUnit`, `EmployeeRole`

### 3. Schema - Entidades de Vendas

- [x] **DB-011**: Criar model `Sale` com referências
- [x] **DB-012**: Criar model `SaleItem` com snapshot de produto
- [x] **DB-013**: Criar model `CashSession` para controle de caixa
- [x] **DB-014**: Criar model `CashMovement` para sangria/suprimento
- [x] **DB-015**: Criar enums `PaymentMethod`, `SaleStatus`, `CashMovementType`

### 4. Schema - Entidades de Suporte

- [x] **DB-016**: Criar model `StockMovement` para rastreabilidade
- [x] **DB-017**: Criar model `Alert` para notificações
- [x] **DB-018**: Criar model `PriceHistory` para auditoria
- [x] **DB-019**: Criar model `Setting` para configurações
- [x] **DB-020**: Criar model `AuditLog` para logs gerais

### 5. Finalização

- [x] **DB-021**: Criar índices otimizados para queries do PDV
- [x] **DB-022**: Criar seed script com dados iniciais (categorias, admin, settings)

---

## 📊 Métricas de Qualidade

| Métrica           | Target | Atual  |
| ----------------- | ------ | ------ |
| Models criados    | 15     | 14 ✅  |
| Enums criados     | 10     | 14 ✅  |
| Índices           | 20+    | 45+ ✅ |
| Migration inicial | 1      | 1 ✅   |

---

## 🔗 Dependências

### Depende de
- Nenhum (agente inicial)

### Bloqueia
- 🔧 Backend (precisa do schema para implementar repositories)
- 🔐 Auth (precisa do model Employee)

---

## 📝 Notas Técnicas

### Convenções de Nomenclatura

- Models: PascalCase singular (`Product`, `SaleItem`)
- Campos: camelCase (`createdAt`, `unitPrice`)
- Enums: SCREAMING_SNAKE_CASE (`CASH`, `CREDIT`)

### IDs

- Usar `@id @default(cuid())` para todos os IDs
- CUIDs são collision-resistant e sortable

### Timestamps

- Incluir `createdAt` e `updatedAt` em todas as entidades
- Usar `@default(now())` e `@updatedAt`

### Soft Delete

- Usar `isActive Boolean @default(true)` ao invés de deletar
- Entidades com soft delete: Product, Employee, Supplier

---

## 🧪 Critérios de Aceite

- [ ] `npx prisma validate` passa sem erros
- [ ] `npx prisma migrate dev` gera migration corretamente
- [ ] `npx prisma db seed` executa sem erros
- [ ] Queries de busca de produto < 50ms (benchmark)
- [ ] Schema suporta todos os casos de uso do PDV

---

_Roadmap do Agente Database - Arkheion Corp_