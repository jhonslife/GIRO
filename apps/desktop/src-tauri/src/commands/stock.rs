//! Comandos Tauri para Estoque

use crate::error::AppResult;
use crate::models::{CreateStockMovement, ProductLot, StockMovementRow};
use crate::repositories::StockRepository;
use crate::AppState;
use crate::middleware::Permission;
use crate::require_permission;
use crate::middleware::audit::{AuditService, AuditAction};
use crate::audit_log;
use tauri::State;

#[tauri::command]
pub async fn get_recent_stock_movements(
    limit: i32,
    state: State<'_, AppState>,
) -> AppResult<Vec<StockMovementRow>> {
    let repo = StockRepository::new(state.pool());
    repo.find_recent_movements(limit).await
}

#[tauri::command]
pub async fn get_product_stock_movements(
    product_id: String,
    limit: i32,
    state: State<'_, AppState>,
) -> AppResult<Vec<StockMovementRow>> {
    let repo = StockRepository::new(state.pool());
    repo.find_movements_by_product(&product_id, limit).await
}

#[tauri::command]
pub async fn create_stock_movement(
    input: CreateStockMovement,
    employee_id: String,
    state: State<'_, AppState>,
) -> AppResult<StockMovementRow> {
    let employee = require_permission!(state.pool(), &employee_id, Permission::ManageStock);
    let repo = StockRepository::new(state.pool());
    let result = repo.create_movement(input.clone()).await?;

    // Audit Log
    let audit_service = AuditService::new(state.pool().clone());
    let action = match input.movement_type.as_str() {
        "ENTRY" | "INPUT" => AuditAction::StockEntry,
        "TRANSFER" => AuditAction::StockTransfer,
        _ => AuditAction::StockAdjustment,
    };

    audit_log!(
        audit_service,
        action,
        &employee.id,
        &employee.name,
        "Product",
        &input.product_id,
        format!("Quantidade: {}, Razão: {:?}", input.quantity, input.reason)
    );

    Ok(result)
}

#[tauri::command]
pub async fn get_product_lots(
    product_id: String,
    state: State<'_, AppState>,
) -> AppResult<Vec<ProductLot>> {
    let repo = StockRepository::new(state.pool());
    repo.find_lots_by_product(&product_id).await
}

#[tauri::command]
pub async fn get_expiring_lots(
    days: i32,
    state: State<'_, AppState>,
) -> AppResult<Vec<ProductLot>> {
    let repo = StockRepository::new(state.pool());
    repo.find_expiring_lots(days).await
}

#[tauri::command]
pub async fn get_expired_lots(state: State<'_, AppState>) -> AppResult<Vec<ProductLot>> {
    let repo = StockRepository::new(state.pool());
    repo.find_expired_lots().await
}
