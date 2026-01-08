//! Modelos de Estoque

use serde::{Deserialize, Serialize};
use sqlx::FromRow;

/// Movimentação de estoque
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct StockMovement {
    pub id: String,
    pub product_id: String,
    #[sqlx(rename = "type")]
    #[serde(rename = "type")]
    pub movement_type: String,
    pub quantity: f64,
    pub previous_stock: f64,
    pub new_stock: f64,
    pub reason: Option<String>,
    pub reference_id: Option<String>,
    pub reference_type: Option<String>,
    pub employee_id: Option<String>,
    pub created_at: String,
}

/// Para criar movimentação
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateStockMovement {
    pub product_id: String,
    pub movement_type: String,
    pub quantity: f64,
    pub reason: Option<String>,
    pub reference_id: Option<String>,
    pub reference_type: Option<String>,
    pub employee_id: Option<String>,
}

/// Lote de produto
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct ProductLot {
    pub id: String,
    pub product_id: String,
    pub supplier_id: Option<String>,
    pub lot_number: Option<String>,
    pub expiration_date: Option<String>,
    pub purchase_date: String,
    pub initial_quantity: f64,
    pub current_quantity: f64,
    pub cost_price: f64,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

/// Status de estoque
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StockStatus {
    pub product_id: String,
    pub product_name: String,
    pub current_stock: f64,
    pub min_stock: f64,
    pub is_low: bool,
    pub is_out: bool,
}
