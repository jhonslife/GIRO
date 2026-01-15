-- Migration: Create Fiscal Settings Table
-- Description: Stores configuration for NFC-e emission (CSC, Certificate, Serie, etc.)

CREATE TABLE IF NOT EXISTS fiscal_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Single row configuration
    enabled BOOLEAN NOT NULL DEFAULT 0,
    uf TEXT NOT NULL DEFAULT 'SP',
    environment INTEGER NOT NULL DEFAULT 2, -- 1=Produção, 2=Homologação
    serie INTEGER NOT NULL DEFAULT 1,
    next_number INTEGER NOT NULL DEFAULT 1,
    csc_id TEXT,
    csc TEXT,
    cert_path TEXT,
    cert_password TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Initialize with default values
INSERT OR IGNORE INTO fiscal_settings (id, enabled, uf, environment, serie, next_number)
VALUES (1, 0, 'SP', 2, 1, 1);
