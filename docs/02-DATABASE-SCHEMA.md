# 🗄️ Mercearias - Schema do Banco de Dados

> **Versão:** 1.0.0  
> **Status:** Aprovado  
> **Última Atualização:** 7 de Janeiro de 2026  
> **Database:** SQLite 3.45+ via Prisma + SQLx

---

## 📋 Sumário

1. [Diagrama ER](#diagrama-er)
2. [Schema Prisma](#schema-prisma)
3. [Índices e Performance](#índices-e-performance)
4. [Convenções](#convenções)

---

## 📊 Diagrama ER

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                  MERCEARIAS DATABASE                                     │
│                                    Entity Relationship                                   │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    CATEGORIES    │       │     PRODUCTS     │       │   PRODUCT_LOTS   │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id          PK   │◄──────│ categoryId   FK  │       │ id          PK   │
│ name             │   1:N │ id           PK  │◄──────│ productId   FK   │
│ description      │       │ barcode          │   1:N │ lotNumber        │
│ color            │       │ name             │       │ expirationDate   │
│ icon             │       │ description      │       │ quantity         │
│ parentId     FK  │◄──┐   │ unit             │       │ costPrice        │
│ createdAt        │   │   │ salePrice        │       │ purchaseDate     │
│ updatedAt        │   │   │ costPrice        │       │ supplierId   FK  │
└──────────────────┘   │   │ minStock         │       │ createdAt        │
        ▲              │   │ currentStock     │       └──────────────────┘
        │              │   │ isActive         │
        └──────────────┘   │ isWeighted       │       ┌──────────────────┐
       (self-reference)    │ createdAt        │       │    SUPPLIERS     │
                           │ updatedAt        │       ├──────────────────┤
                           └──────────────────┘       │ id          PK   │
                                   │                  │ name             │
                                   │                  │ tradeName        │
                                   │                  │ cnpj             │
                                   │                  │ phone            │
                                   ▼                  │ email            │
┌──────────────────┐       ┌──────────────────┐       │ address          │
│      SALES       │       │   SALE_ITEMS     │       │ createdAt        │
├──────────────────┤       ├──────────────────┤       └──────────────────┘
│ id          PK   │◄──────│ saleId       FK  │
│ employeeId   FK  │   1:N │ id           PK  │       ┌──────────────────┐
│ cashSessionId FK │       │ productId    FK  │       │    EMPLOYEES     │
│ subtotal         │       │ quantity         │       ├──────────────────┤
│ discount         │       │ unitPrice        │       │ id          PK   │
│ total            │       │ discount         │       │ name             │
│ paymentMethod    │       │ total            │       │ cpf              │
│ amountPaid       │       │ lotId        FK  │       │ phone            │
│ change           │       │ createdAt        │       │ email            │
│ status           │       └──────────────────┘       │ pin              │
│ createdAt        │                                  │ password         │
│ canceledAt       │                                  │ role             │
│ canceledBy   FK  │       ┌──────────────────┐       │ isActive         │
│ cancelReason     │       │   STOCK_MOVES    │       │ createdAt        │
└──────────────────┘       ├──────────────────┤       │ updatedAt        │
        ▲                  │ id          PK   │       └──────────────────┘
        │                  │ productId    FK  │               ▲
        │                  │ lotId        FK  │               │
        │                  │ type             │               │
        │                  │ quantity         │       ┌───────┴────────────┐
        │                  │ previousQty      │       │                    │
        │                  │ newQty           │       │                    │
┌───────┴──────────┐       │ reason           │       │                    │
│  CASH_SESSIONS   │       │ employeeId   FK  │───────┘                    │
├──────────────────┤       │ referenceId      │                            │
│ id          PK   │       │ referenceType    │                            │
│ employeeId   FK  │───────│ createdAt        │                            │
│ openedAt         │       └──────────────────┘                            │
│ closedAt         │                                                       │
│ openingBalance   │       ┌──────────────────┐       ┌──────────────────┐ │
│ expectedBalance  │       │  CASH_MOVEMENTS  │       │      ALERTS      │ │
│ actualBalance    │       ├──────────────────┤       ├──────────────────┤ │
│ difference       │◄──────│ sessionId    FK  │       │ id          PK   │ │
│ status           │   1:N │ id           PK  │       │ type             │ │
│ notes            │       │ type             │       │ severity         │ │
└──────────────────┘       │ amount           │       │ productId    FK  │ │
                           │ description      │       │ lotId        FK  │ │
                           │ employeeId   FK  │───────│ message          │ │
                           │ createdAt        │       │ isRead           │ │
                           └──────────────────┘       │ readAt           │ │
                                                      │ readBy       FK  │─┘
┌──────────────────┐       ┌──────────────────┐       │ createdAt        │
│     SETTINGS     │       │   AUDIT_LOGS     │       └──────────────────┘
├──────────────────┤       ├──────────────────┤
│ id          PK   │       │ id          PK   │       ┌──────────────────┐
│ key              │       │ employeeId   FK  │       │  PRICE_HISTORY   │
│ value            │       │ action           │       ├──────────────────┤
│ type             │       │ entity           │       │ id          PK   │
│ group            │       │ entityId         │       │ productId    FK  │
│ updatedAt        │       │ oldValue         │       │ oldPrice         │
│ updatedBy    FK  │       │ newValue         │       │ newPrice         │
└──────────────────┘       │ ipAddress        │       │ reason           │
                           │ createdAt        │       │ employeeId   FK  │
                           └──────────────────┘       │ createdAt        │
                                                      └──────────────────┘
```

---

## 📝 Schema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./mercearias.db"
}

// ════════════════════════════════════════════════════════════════════════════
// CATEGORIAS
// ════════════════════════════════════════════════════════════════════════════

model Category {
  id          String   @id @default(cuid())
  name        String
  description String?
  color       String   @default("#6B7280") // Tailwind gray-500
  icon        String   @default("Package")

  // Hierarquia (subcategorias)
  parentId    String?
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")

  // Relacionamentos
  products    Product[]

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([parentId])
  @@index([name])
}

// ════════════════════════════════════════════════════════════════════════════
// PRODUTOS
// ════════════════════════════════════════════════════════════════════════════

model Product {
  id            String   @id @default(cuid())

  // Identificação
  barcode       String?  @unique
  internalCode  String   @unique // Código interno sequencial
  name          String
  description   String?

  // Categoria
  categoryId    String
  category      Category @relation(fields: [categoryId], references: [id])

  // Unidade de medida
  unit          ProductUnit @default(UNIT)
  isWeighted    Boolean     @default(false) // Venda por peso (balança)

  // Preços
  costPrice     Float    @default(0)
  salePrice     Float
  profitMargin  Float?   // Calculado: ((salePrice - costPrice) / costPrice) * 100

  // Estoque
  minStock      Float    @default(0)    // Quantidade mínima (alerta)
  maxStock      Float?                   // Quantidade máxima (sugestão de compra)
  currentStock  Float    @default(0)    // Estoque atual (desnormalizado para performance)

  // Status
  isActive      Boolean  @default(true)

  // Relacionamentos
  lots          ProductLot[]
  saleItems     SaleItem[]
  stockMoves    StockMovement[]
  alerts        Alert[]
  priceHistory  PriceHistory[]

  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([barcode])
  @@index([internalCode])
  @@index([name])
  @@index([categoryId])
  @@index([isActive])
  @@index([currentStock]) // Para alertas de estoque baixo
}

enum ProductUnit {
  UNIT      // Unidade (un)
  KG        // Quilograma
  GRAM      // Grama
  LITER     // Litro
  ML        // Mililitro
  BOX       // Caixa
  PACK      // Pacote
  DOZEN     // Dúzia
}

// ════════════════════════════════════════════════════════════════════════════
// LOTES DE PRODUTOS (Controle de Validade FIFO)
// ════════════════════════════════════════════════════════════════════════════

model ProductLot {
  id              String   @id @default(cuid())

  // Produto
  productId       String
  product         Product  @relation(fields: [productId], references: [id])

  // Identificação do lote
  lotNumber       String?  // Número do lote do fabricante

  // Validade
  expirationDate  DateTime?
  manufacturingDate DateTime?

  // Quantidades
  initialQuantity Float
  currentQuantity Float    // Atualizado a cada venda/ajuste

  // Custo (pode variar por lote)
  costPrice       Float

  // Compra
  purchaseDate    DateTime @default(now())
  supplierId      String?
  supplier        Supplier? @relation(fields: [supplierId], references: [id])
  invoiceNumber   String?   // Nota fiscal de entrada

  // Status
  status          LotStatus @default(AVAILABLE)

  // Relacionamentos
  saleItems       SaleItem[]
  stockMoves      StockMovement[]
  alerts          Alert[]

  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([productId])
  @@index([expirationDate])
  @@index([status])
  @@index([supplierId])
}

enum LotStatus {
  AVAILABLE   // Disponível para venda
  LOW         // Quantidade baixa
  EXPIRED     // Vencido (não pode vender)
  DEPLETED    // Esgotado
  BLOCKED     // Bloqueado manualmente
}

// ════════════════════════════════════════════════════════════════════════════
// FORNECEDORES
// ════════════════════════════════════════════════════════════════════════════

model Supplier {
  id          String   @id @default(cuid())

  // Identificação
  name        String   // Razão social
  tradeName   String?  // Nome fantasia
  cnpj        String?  @unique
  stateReg    String?  // Inscrição estadual

  // Contato
  phone       String?
  phone2      String?
  email       String?
  website     String?

  // Endereço
  zipCode     String?
  street      String?
  number      String?
  complement  String?
  neighborhood String?
  city        String?
  state       String?

  // Observações
  notes       String?

  // Status
  isActive    Boolean  @default(true)

  // Relacionamentos
  lots        ProductLot[]

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([name])
  @@index([cnpj])
}

// ════════════════════════════════════════════════════════════════════════════
// FUNCIONÁRIOS
// ════════════════════════════════════════════════════════════════════════════

model Employee {
  id          String   @id @default(cuid())

  // Identificação
  name        String
  cpf         String?  @unique
  rg          String?

  // Contato
  phone       String?
  email       String?

  // Endereço
  zipCode     String?
  street      String?
  number      String?
  complement  String?
  neighborhood String?
  city        String?
  state       String?

  // Autenticação
  pin         String?  // PIN de 4-6 dígitos (hash bcrypt)
  password    String?  // Senha completa para admin (hash bcrypt)

  // Permissões
  role        EmployeeRole @default(CASHIER)

  // Status
  isActive    Boolean  @default(true)

  // Relacionamentos
  sales           Sale[]       @relation("SaleEmployee")
  canceledSales   Sale[]       @relation("SaleCanceledBy")
  cashSessions    CashSession[]
  cashMovements   CashMovement[]
  stockMoves      StockMovement[]
  alertsRead      Alert[]      @relation("AlertReadBy")
  priceChanges    PriceHistory[]
  auditLogs       AuditLog[]
  settingsUpdated Setting[]    @relation("SettingUpdatedBy")

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lastLoginAt DateTime?

  @@index([cpf])
  @@index([name])
  @@index([role])
  @@index([isActive])
}

enum EmployeeRole {
  ADMIN     // Acesso total
  MANAGER   // Relatórios, estoque, sem config
  CASHIER   // Apenas PDV
  VIEWER    // Apenas visualização
}

// ════════════════════════════════════════════════════════════════════════════
// VENDAS
// ════════════════════════════════════════════════════════════════════════════

model Sale {
  id              String   @id @default(cuid())

  // Sequencial do dia (reinicia diariamente)
  dailyNumber     Int

  // Funcionário que realizou a venda
  employeeId      String
  employee        Employee @relation("SaleEmployee", fields: [employeeId], references: [id])

  // Sessão de caixa
  cashSessionId   String
  cashSession     CashSession @relation(fields: [cashSessionId], references: [id])

  // Valores
  subtotal        Float    // Soma dos itens sem desconto
  discountPercent Float    @default(0)
  discountValue   Float    @default(0)
  total           Float    // subtotal - discountValue

  // Pagamento
  paymentMethod   PaymentMethod
  amountPaid      Float
  change          Float    @default(0)

  // Cliente (opcional, para futuro programa de fidelidade)
  customerName    String?
  customerCpf     String?

  // Status
  status          SaleStatus @default(COMPLETED)

  // Cancelamento
  canceledAt      DateTime?
  canceledById    String?
  canceledBy      Employee?  @relation("SaleCanceledBy", fields: [canceledById], references: [id])
  cancelReason    String?

  // Itens
  items           SaleItem[]

  // Metadata
  createdAt       DateTime @default(now())

  @@index([employeeId])
  @@index([cashSessionId])
  @@index([createdAt])
  @@index([status])
  @@index([dailyNumber])
}

enum PaymentMethod {
  CASH          // Dinheiro
  DEBIT         // Débito (futuro TEF)
  CREDIT        // Crédito (futuro TEF)
  PIX           // PIX
  VOUCHER       // Vale alimentação/refeição
  OTHER         // Outro
}

enum SaleStatus {
  COMPLETED  // Finalizada
  CANCELED   // Cancelada
}

model SaleItem {
  id          String   @id @default(cuid())

  // Venda
  saleId      String
  sale        Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)

  // Produto
  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  // Lote (para FIFO)
  lotId       String?
  lot         ProductLot? @relation(fields: [lotId], references: [id])

  // Quantidades e valores
  quantity    Float
  unitPrice   Float    // Preço no momento da venda
  discount    Float    @default(0)
  total       Float    // (quantity * unitPrice) - discount

  // Snapshot do produto (para histórico)
  productName String   // Nome no momento da venda
  productCode String   // Código no momento da venda

  // Metadata
  createdAt   DateTime @default(now())

  @@index([saleId])
  @@index([productId])
  @@index([lotId])
}

// ════════════════════════════════════════════════════════════════════════════
// SESSÕES DE CAIXA
// ════════════════════════════════════════════════════════════════════════════

model CashSession {
  id              String   @id @default(cuid())

  // Funcionário que abriu
  employeeId      String
  employee        Employee @relation(fields: [employeeId], references: [id])

  // Período
  openedAt        DateTime @default(now())
  closedAt        DateTime?

  // Valores
  openingBalance  Float    // Fundo de troco inicial
  expectedBalance Float?   // Calculado ao fechar (abertura + vendas - sangrias + suprimentos)
  actualBalance   Float?   // Contagem real informada
  difference      Float?   // actual - expected (sobra ou falta)

  // Status
  status          CashSessionStatus @default(OPEN)

  // Observações
  notes           String?

  // Relacionamentos
  sales           Sale[]
  movements       CashMovement[]

  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([employeeId])
  @@index([status])
  @@index([openedAt])
}

enum CashSessionStatus {
  OPEN      // Em operação
  CLOSED    // Fechado normalmente
  FORCED    // Fechado forçadamente (admin)
}

model CashMovement {
  id          String   @id @default(cuid())

  // Sessão
  sessionId   String
  session     CashSession @relation(fields: [sessionId], references: [id])

  // Funcionário que realizou
  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id])

  // Tipo e valor
  type        CashMovementType
  amount      Float

  // Descrição
  description String?

  // Metadata
  createdAt   DateTime @default(now())

  @@index([sessionId])
  @@index([type])
}

enum CashMovementType {
  OPENING     // Abertura de caixa
  SALE        // Venda em dinheiro
  WITHDRAWAL  // Sangria
  SUPPLY      // Suprimento
  REFUND      // Estorno
  CLOSING     // Fechamento
}

// ════════════════════════════════════════════════════════════════════════════
// MOVIMENTAÇÃO DE ESTOQUE
// ════════════════════════════════════════════════════════════════════════════

model StockMovement {
  id            String   @id @default(cuid())

  // Produto
  productId     String
  product       Product  @relation(fields: [productId], references: [id])

  // Lote (se aplicável)
  lotId         String?
  lot           ProductLot? @relation(fields: [lotId], references: [id])

  // Tipo de movimento
  type          StockMovementType

  // Quantidades
  quantity      Float    // Quantidade movimentada (sempre positivo)
  previousQty   Float    // Estoque antes
  newQty        Float    // Estoque depois

  // Motivo
  reason        String?

  // Funcionário responsável
  employeeId    String
  employee      Employee @relation(fields: [employeeId], references: [id])

  // Referência (venda, compra, etc)
  referenceId   String?
  referenceType String?  // "SALE", "PURCHASE", "ADJUSTMENT", etc

  // Metadata
  createdAt     DateTime @default(now())

  @@index([productId])
  @@index([lotId])
  @@index([type])
  @@index([createdAt])
}

enum StockMovementType {
  ENTRY       // Entrada (compra)
  EXIT        // Saída (venda)
  ADJUSTMENT  // Ajuste de inventário
  TRANSFER    // Transferência entre lotes
  LOSS        // Perda/Avaria
  RETURN      // Devolução
  PRODUCTION  // Produção (para padarias)
  CONSUMPTION // Consumo interno
}

// ════════════════════════════════════════════════════════════════════════════
// ALERTAS
// ════════════════════════════════════════════════════════════════════════════

model Alert {
  id          String   @id @default(cuid())

  // Tipo e severidade
  type        AlertType
  severity    AlertSeverity

  // Produto/Lote relacionado
  productId   String?
  product     Product? @relation(fields: [productId], references: [id])
  lotId       String?
  lot         ProductLot? @relation(fields: [lotId], references: [id])

  // Mensagem
  title       String
  message     String

  // Data de referência (vencimento, etc)
  referenceDate DateTime?

  // Leitura
  isRead      Boolean  @default(false)
  readAt      DateTime?
  readById    String?
  readBy      Employee? @relation("AlertReadBy", fields: [readById], references: [id])

  // Ação tomada
  isResolved  Boolean  @default(false)
  resolvedAt  DateTime?

  // Metadata
  createdAt   DateTime @default(now())

  @@index([type])
  @@index([severity])
  @@index([isRead])
  @@index([productId])
  @@index([createdAt])
}

enum AlertType {
  EXPIRATION_CRITICAL  // Vence em 3 dias
  EXPIRATION_WARNING   // Vence em 7 dias
  EXPIRATION_NOTICE    // Vence em 30 dias
  STOCK_ZERO           // Estoque zerado
  STOCK_LOW            // Estoque baixo
  STOCK_NEGATIVE       // Estoque negativo (erro)
  NEGATIVE_MARGIN      // Margem negativa
  SLOW_MOVING          // Produto parado
}

enum AlertSeverity {
  CRITICAL  // Vermelho - ação imediata
  WARNING   // Amarelo - atenção
  INFO      // Azul - informativo
}

// ════════════════════════════════════════════════════════════════════════════
// HISTÓRICO DE PREÇOS
// ════════════════════════════════════════════════════════════════════════════

model PriceHistory {
  id          String   @id @default(cuid())

  // Produto
  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  // Preços
  oldCostPrice  Float?
  newCostPrice  Float?
  oldSalePrice  Float
  newSalePrice  Float

  // Variação percentual
  variation     Float?  // ((new - old) / old) * 100

  // Motivo
  reason        String?

  // Funcionário que alterou
  employeeId    String
  employee      Employee @relation(fields: [employeeId], references: [id])

  // Metadata
  createdAt     DateTime @default(now())

  @@index([productId])
  @@index([createdAt])
}

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÕES
// ════════════════════════════════════════════════════════════════════════════

model Setting {
  id          String   @id @default(cuid())

  // Chave-valor
  key         String   @unique
  value       String   // JSON stringified para valores complexos
  type        SettingType @default(STRING)

  // Agrupamento
  group       String   @default("general")

  // Descrição para UI
  label       String?
  description String?

  // Quem alterou
  updatedById String?
  updatedBy   Employee? @relation("SettingUpdatedBy", fields: [updatedById], references: [id])

  // Metadata
  updatedAt   DateTime @updatedAt
}

enum SettingType {
  STRING
  NUMBER
  BOOLEAN
  JSON
}

// ════════════════════════════════════════════════════════════════════════════
// AUDIT LOG
// ════════════════════════════════════════════════════════════════════════════

model AuditLog {
  id          String   @id @default(cuid())

  // Quem
  employeeId  String?
  employee    Employee? @relation(fields: [employeeId], references: [id])

  // O quê
  action      String   // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc
  entity      String   // Product, Sale, Employee, etc
  entityId    String?

  // Mudanças
  oldValue    String?  // JSON
  newValue    String?  // JSON

  // Contexto
  ipAddress   String?
  userAgent   String?

  // Metadata
  createdAt   DateTime @default(now())

  @@index([employeeId])
  @@index([entity])
  @@index([action])
  @@index([createdAt])
}
```

---

## 📊 Índices e Performance

### Índices Principais

| Tabela          | Coluna(s)          | Tipo      | Justificativa             |
| --------------- | ------------------ | --------- | ------------------------- |
| `Product`       | `barcode`          | UNIQUE    | Busca instantânea no PDV  |
| `Product`       | `internalCode`     | UNIQUE    | Busca por código interno  |
| `Product`       | `name`             | INDEX     | Busca textual             |
| `Product`       | `categoryId`       | INDEX     | Filtro por categoria      |
| `Product`       | `currentStock`     | INDEX     | Alertas de estoque        |
| `ProductLot`    | `expirationDate`   | INDEX     | Alertas de vencimento     |
| `ProductLot`    | `productId`        | INDEX     | FIFO lookup               |
| `Sale`          | `createdAt`        | INDEX     | Relatórios por período    |
| `Sale`          | `cashSessionId`    | INDEX     | Fechamento de caixa       |
| `StockMovement` | `createdAt`        | INDEX     | Histórico de movimentação |
| `Alert`         | `isRead, severity` | COMPOSITE | Dashboard de alertas      |

### Views Materializadas (Simuladas com Triggers)

Para relatórios frequentes, utilizamos tabelas auxiliares atualizadas por triggers:

```sql
-- Resumo diário de vendas (atualizado por trigger)
CREATE TABLE DailySalesSummary (
    date          TEXT PRIMARY KEY,
    totalSales    INTEGER,
    totalRevenue  REAL,
    totalDiscount REAL,
    avgTicket     REAL,
    topProductId  TEXT,
    updatedAt     TEXT
);

-- Estoque consolidado por categoria
CREATE TABLE CategoryStockSummary (
    categoryId    TEXT PRIMARY KEY,
    totalProducts INTEGER,
    totalValue    REAL,
    lowStockCount INTEGER,
    expiringCount INTEGER,
    updatedAt     TEXT
);
```

---

## 📏 Convenções

### Nomenclatura

| Elemento   | Convenção                  | Exemplo                    |
| ---------- | -------------------------- | -------------------------- |
| Tabelas    | PascalCase, singular       | `Product`, `SaleItem`      |
| Colunas    | camelCase                  | `createdAt`, `costPrice`   |
| Enums      | SCREAMING_SNAKE_CASE       | `CASH`, `ENTRY`            |
| IDs        | CUID (collision-resistant) | `clx1234...`               |
| Timestamps | ISO 8601 UTC               | `2026-01-07T10:30:00.000Z` |

### Soft Delete

Entidades principais usam `isActive` em vez de deleção física:

- `Product.isActive`
- `Employee.isActive`
- `Supplier.isActive`

### Auditoria

Toda entidade principal possui:

- `createdAt`: Criação
- `updatedAt`: Última modificação

Operações críticas são registradas em `AuditLog`.

### Valores Monetários

- Tipo: `Float` (SQLite não tem DECIMAL)
- Precisão: 2 casas decimais (arredondamento matemático)
- Moeda: BRL implícito (sem campo de moeda)

---

## 🔄 Migrations Iniciais

```bash
# Criar primeira migration
npx prisma migrate dev --name init

# Estrutura gerada
prisma/migrations/
├── 20260107000000_init/
│   └── migration.sql
└── migration_lock.toml
```

---

## 🌱 Seeds

```typescript
// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Categorias padrão
  const categorias = [
    { name: 'Bebidas', color: '#3B82F6', icon: 'GlassWater' },
    { name: 'Laticínios', color: '#F59E0B', icon: 'Milk' },
    { name: 'Carnes', color: '#EF4444', icon: 'Beef' },
    { name: 'Hortifrúti', color: '#22C55E', icon: 'Apple' },
    { name: 'Padaria', color: '#A855F7', icon: 'Croissant' },
    { name: 'Limpeza', color: '#06B6D4', icon: 'Sparkles' },
    { name: 'Higiene', color: '#EC4899', icon: 'Bath' },
    { name: 'Mercearia', color: '#6B7280', icon: 'Package' },
  ];

  for (const cat of categorias) {
    await prisma.category.create({ data: cat });
  }

  // Admin padrão
  await prisma.employee.create({
    data: {
      name: 'Administrador',
      role: 'ADMIN',
      pin: await hash('1234', 10),
      password: await hash('admin123', 10),
      isActive: true,
    },
  });

  // Configurações padrão
  const settings = [
    { key: 'store.name', value: 'Minha Mercearia', group: 'store' },
    { key: 'store.cnpj', value: '', group: 'store' },
    { key: 'store.address', value: '', group: 'store' },
    { key: 'store.phone', value: '', group: 'store' },
    { key: 'theme.mode', value: 'light', group: 'theme' },
    { key: 'theme.primaryColor', value: '#3B82F6', group: 'theme' },
    { key: 'printer.enabled', value: 'false', type: 'BOOLEAN', group: 'hardware' },
    { key: 'printer.interface', value: '', group: 'hardware' },
    { key: 'scale.enabled', value: 'false', type: 'BOOLEAN', group: 'hardware' },
    { key: 'scale.port', value: '', group: 'hardware' },
    { key: 'backup.enabled', value: 'false', type: 'BOOLEAN', group: 'backup' },
    { key: 'backup.frequency', value: 'daily', group: 'backup' },
    { key: 'alert.expirationDays', value: '[3, 7, 15, 30]', type: 'JSON', group: 'alerts' },
  ];

  for (const setting of settings) {
    await prisma.setting.create({ data: setting as any });
  }

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

_Documento gerado seguindo metodologia "Architect First, Code Later" - Arkheion Corp_
