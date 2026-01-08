//! Modelo de Categoria

use serde::{Deserialize, Serialize};
use sqlx::FromRow;

/// Categoria de produtos
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Category {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub icon: Option<String>,
    pub parent_id: Option<String>,
    pub sort_order: i32,
    pub active: bool,
    pub created_at: String,
    pub updated_at: String,
}

/// Para criar categoria
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateCategory {
    pub name: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub icon: Option<String>,
    pub parent_id: Option<String>,
    pub sort_order: Option<i32>,
}

/// Para atualizar categoria
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCategory {
    pub name: Option<String>,
    pub description: Option<String>,
    pub color: Option<String>,
    pub icon: Option<String>,
    pub parent_id: Option<String>,
    pub sort_order: Option<i32>,
    pub active: Option<bool>,
}

/// Categoria com contagem de produtos
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CategoryWithCount {
    #[serde(flatten)]
    pub category: Category,
    pub product_count: i64,
}
