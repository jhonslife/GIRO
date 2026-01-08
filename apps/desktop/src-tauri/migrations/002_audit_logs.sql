-- Migration: 002_audit_logs
-- Description: Tabela de auditoria para logging de ações sensíveis
-- Created: 2026-01-07

-- ═══════════════════════════════════════════════════════════════════════════
-- LOGS DE AUDITORIA
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY NOT NULL,
    action TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    details TEXT,
    ip_address TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_employee ON audit_logs(employee_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
CREATE INDEX idx_audit_target ON audit_logs(target_type, target_id);
