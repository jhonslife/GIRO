use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct FiscalSettings {
    pub enabled: bool,
    pub uf: String,
    pub environment: i32,
    pub serie: i32,
    pub next_number: i32,
    pub csc_id: Option<String>,
    pub csc: Option<String>,
    pub cert_path: Option<String>,
    pub cert_password: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateFiscalSettings {
    pub enabled: Option<bool>,
    pub uf: Option<String>,
    pub environment: Option<i32>,
    pub serie: Option<i32>,
    pub next_number: Option<i32>,
    pub csc_id: Option<String>,
    pub csc: Option<String>,
    pub cert_path: Option<String>,
    pub cert_password: Option<String>,
}
