//! Mercearias Desktop - Sistema de Gestão para Varejos
//!
//! Módulos principais:
//! - `commands`: Tauri commands para o frontend
//! - `database`: Conexão e pool SQLite
//! - `error`: Tipos de erro unificados
//! - `hardware`: Integração com periféricos
//! - `models`: Modelos de domínio
//! - `repositories`: Acesso a dados
//! - `services`: Lógica de negócio

// Módulos core
pub mod commands;
pub mod database;
pub mod error;
pub mod hardware;
pub mod middleware;
pub mod models;
pub mod repositories;
pub mod services;

// Re-exports for commands and main
pub use commands::hardware::HardwareState;
pub use database::DatabaseManager;
pub use error::{AppError, AppResult};

use sqlx::SqlitePool;
use std::path::PathBuf;
use std::sync::Arc;

/// Estado global da aplicação compartilhado entre comandos
#[derive(Clone)]
pub struct AppState {
    pub db_pool: Arc<SqlitePool>,
    pub db_path: PathBuf,
    pub backup_dir: PathBuf,
}

impl AppState {
    pub fn new(pool: SqlitePool, db_path: PathBuf, backup_dir: PathBuf) -> Self {
        Self {
            db_pool: Arc::new(pool),
            db_path,
            backup_dir,
        }
    }

    pub fn pool(&self) -> &SqlitePool {
        &self.db_pool
    }
}
