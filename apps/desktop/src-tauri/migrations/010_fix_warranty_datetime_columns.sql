-- Migration: Fix warranty_claims DATETIME columns to TEXT
-- Criado em: 2026-01-11
-- Motivo: SQLx tem problemas com mapeamento de DATETIME do SQLite para String

-- ═══════════════════════════════════════════════════════════════════════════
-- CORREÇÃO: Alterar colunas DATETIME para TEXT
-- ═══════════════════════════════════════════════════════════════════════════

-- SQLite não suporta ALTER COLUMN, então precisamos recriar a tabela
-- Primeiro, criar tabela temporária com schema correto

CREATE TABLE IF NOT EXISTS warranty_claims_new (
    id TEXT PRIMARY KEY NOT NULL,
    customer_id TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK(source_type IN ('SALE', 'SERVICE_ORDER')),
    sale_item_id TEXT,
    order_item_id TEXT,
    product_id TEXT,
    description TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'IN_ANALYSIS', 'APPROVED', 'DENIED', 'RESOLVED', 'CLOSED')),
    resolution TEXT,
    resolution_type TEXT CHECK(resolution_type IN ('REFUND', 'REPLACEMENT', 'REPAIR', 'CREDIT')),
    resolved_by_id TEXT,
    resolved_at TEXT,
    refund_amount REAL,
    replacement_cost REAL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Copiar dados existentes (se houver)
INSERT OR IGNORE INTO warranty_claims_new (
    id, customer_id, source_type, sale_item_id, order_item_id,
    product_id, description, reason, status, resolution, resolution_type,
    resolved_by_id, resolved_at, refund_amount, replacement_cost, notes,
    created_at, updated_at
)
SELECT 
    id, customer_id, source_type, sale_item_id, order_item_id,
    product_id, description, reason, status, resolution, resolution_type,
    resolved_by_id, 
    CAST(resolved_at AS TEXT),
    refund_amount, replacement_cost, notes,
    CAST(created_at AS TEXT), 
    CAST(updated_at AS TEXT)
FROM warranty_claims;

-- Remover tabela antiga
DROP TABLE IF EXISTS warranty_claims;

-- Renomear tabela nova
ALTER TABLE warranty_claims_new RENAME TO warranty_claims;

-- Recriar índices
CREATE INDEX IF NOT EXISTS idx_warranty_claims_customer ON warranty_claims(customer_id);
CREATE INDEX IF NOT EXISTS idx_warranty_claims_status ON warranty_claims(status);
CREATE INDEX IF NOT EXISTS idx_warranty_claims_source_type ON warranty_claims(source_type);
CREATE INDEX IF NOT EXISTS idx_warranty_claims_created_at ON warranty_claims(created_at);
CREATE INDEX IF NOT EXISTS idx_warranty_claims_product ON warranty_claims(product_id);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER IF NOT EXISTS trigger_warranty_claims_updated_at
    AFTER UPDATE ON warranty_claims
    FOR EACH ROW
BEGIN
    UPDATE warranty_claims SET updated_at = datetime('now') WHERE id = NEW.id;
END;
