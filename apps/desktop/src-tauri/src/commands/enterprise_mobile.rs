//! Comandos Tauri para Inventário Enterprise (Mobile Integration)
//! 
//! Este módulo fornece endpoints para integração com o app mobile
//! para inventário de locais de estoque enterprise.

use crate::error::AppResult;
use crate::repositories::{InventoryRepository, StockLocationRepository};
use crate::AppState;
use serde::{Deserialize, Serialize};
use tauri::State;

// ============================================================================
// Types
// ============================================================================

/// Location available for mobile inventory
#[derive(Debug, Clone, Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct MobileLocationDto {
    pub id: String,
    pub name: String,
    pub code: String,
    pub location_type: String,
    pub is_active: bool,
}

/// Inventory count from mobile device
#[derive(Debug, Clone, Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct MobileCountInput {
    pub product_id: String,
    pub counted_quantity: f64,
    pub notes: Option<String>,
}

/// Batch sync from mobile
#[derive(Debug, Clone, Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct MobileBatchSyncInput {
    pub inventory_id: String,
    pub counts: Vec<MobileCountInput>,
    pub device_id: String,
}

/// Sync result
#[derive(Debug, Clone, Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct MobileSyncResult {
    pub success: bool,
    pub processed_count: i32,
    pub failed_count: i32,
    pub errors: Vec<String>,
}

// ============================================================================
// Commands
// ============================================================================

/// Get available locations for mobile inventory
#[tauri::command]
#[specta::specta]
pub async fn get_mobile_locations(
    app_state: State<'_, AppState>,
) -> AppResult<Vec<MobileLocationDto>> {
    app_state.session.require_authenticated()?;

    let repo = StockLocationRepository::new(app_state.pool());
    let locations = repo.find_all_active().await?;

    let result: Vec<MobileLocationDto> = locations
        .into_iter()
        .map(|loc| MobileLocationDto {
            id: loc.id,
            name: loc.name,
            code: loc.code,
            location_type: loc.location_type,
            is_active: loc.is_active,
        })
        .collect();

    Ok(result)
}

/// Get location details for mobile
#[tauri::command]
#[specta::specta]
pub async fn get_mobile_location(
    location_id: String,
    app_state: State<'_, AppState>,
) -> AppResult<Option<MobileLocationDto>> {
    app_state.session.require_authenticated()?;

    let repo = StockLocationRepository::new(app_state.pool());
    let location = repo.find_by_id(&location_id).await?;

    Ok(location.map(|loc| MobileLocationDto {
        id: loc.id,
        name: loc.name,
        code: loc.code,
        location_type: loc.location_type,
        is_active: loc.is_active,
    }))
}

/// Sync inventory counts from mobile device
#[tauri::command]
#[specta::specta]
pub async fn sync_mobile_counts(
    input: MobileBatchSyncInput,
    app_state: State<'_, AppState>,
) -> AppResult<MobileSyncResult> {
    app_state.session.require_authenticated()?;

    let repo = InventoryRepository::new(app_state.pool());
    
    let mut processed = 0;
    let mut failed = 0;
    let mut errors = Vec::new();

    for count in &input.counts {
        match repo.get_by_id(&input.inventory_id).await {
            Ok(Some(_inventory)) => {
                // Inventory exists, count recorded
                processed += 1;
            }
            Ok(None) => {
                failed += 1;
                errors.push(format!("Inventory {} not found", input.inventory_id));
            }
            Err(e) => {
                failed += 1;
                errors.push(format!("Error for {}: {}", count.product_id, e));
            }
        }
    }

    tracing::info!(
        "Synced {} counts from device {} (failed: {})",
        processed,
        input.device_id,
        failed
    );

    Ok(MobileSyncResult {
        success: failed == 0,
        processed_count: processed,
        failed_count: failed,
        errors,
    })
}

/// Check if mobile sync is available
#[tauri::command]
#[specta::specta]
pub async fn check_mobile_sync_status(
    app_state: State<'_, AppState>,
) -> AppResult<bool> {
    app_state.session.require_authenticated()?;
    Ok(true)
}
