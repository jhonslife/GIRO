//! Repositório de Configurações Fiscais (NFC-e)

use crate::error::AppResult;
use crate::models::{FiscalSettings, UpdateFiscalSettings};
use sqlx::SqlitePool;

pub struct FiscalRepository<'a> {
    pool: &'a SqlitePool,
}

impl<'a> FiscalRepository<'a> {
    pub fn new(pool: &'a SqlitePool) -> Self {
        Self { pool }
    }

    const COLS: &'static str =
        "enabled, uf, environment, serie, next_number, csc_id, csc, cert_path, cert_password, updated_at";

    pub async fn get(&self) -> AppResult<FiscalSettings> {
        let query = format!("SELECT {} FROM fiscal_settings WHERE id = 1", Self::COLS);
        let result = sqlx::query_as::<_, FiscalSettings>(&query)
            .fetch_one(self.pool)
            .await?;
        Ok(result)
    }

    pub async fn update(&self, data: UpdateFiscalSettings) -> AppResult<FiscalSettings> {
        let current = self.get().await?;
        let now = chrono::Utc::now().to_rfc3339();

        sqlx::query(
            "UPDATE fiscal_settings SET 
                enabled = ?, 
                uf = ?, 
                environment = ?, 
                serie = ?, 
                next_number = ?, 
                csc_id = ?, 
                csc = ?, 
                cert_path = ?, 
                cert_password = ?, 
                updated_at = ? 
            WHERE id = 1"
        )
        .bind(data.enabled.unwrap_or(current.enabled))
        .bind(data.uf.unwrap_or(current.uf))
        .bind(data.environment.unwrap_or(current.environment))
        .bind(data.serie.unwrap_or(current.serie))
        .bind(data.next_number.unwrap_or(current.next_number))
        .bind(data.csc_id.or(current.csc_id))
        .bind(data.csc.or(current.csc))
        .bind(data.cert_path.or(current.cert_path))
        .bind(data.cert_password.or(current.cert_password))
        .bind(&now)
        .execute(self.pool)
        .await?;

        self.get().await
    }

    pub async fn increment_number(&self) -> AppResult<i32> {
        let current = self.get().await?;
        let next = current.next_number + 1;
        
        sqlx::query("UPDATE fiscal_settings SET next_number = ? WHERE id = 1")
            .bind(next)
            .execute(self.pool)
            .await?;
            
        Ok(next)
    }
}
