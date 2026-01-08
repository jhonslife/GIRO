-- Migration: 004_fix_stock_movements_schema
-- Description: Adiciona colunas faltantes em stock_movements
-- Created: 2026-01-08
-- Bug Fix: Colunas previous_stock, new_stock, reference_type faltavam

-- ═══════════════════════════════════════════════════════════════════════════
-- CORREÇÕES NA TABELA stock_movements
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE stock_movements ADD COLUMN previous_stock REAL NOT NULL DEFAULT 0;
ALTER TABLE stock_movements ADD COLUMN new_stock REAL NOT NULL DEFAULT 0;
ALTER TABLE stock_movements ADD COLUMN reference_type TEXT;

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_stock_movements_reference ON stock_movements(reference_type, reference_id);
