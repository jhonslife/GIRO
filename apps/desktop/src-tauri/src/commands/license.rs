//! License Commands
//!
//! Tauri commands for license management

use tauri::State;
use crate::license::MetricsPayload;
use crate::license::LicenseInfo;
use crate::AppState;

/// Get the hardware ID for this machine
/// Used by frontend to display hardware info and for activation
#[tauri::command]
pub async fn get_hardware_id(state: State<'_, AppState>) -> Result<String, String> {
    Ok(state.hardware_id.clone())
}

#[tauri::command]
pub async fn activate_license(
    license_key: String,
    state: State<'_, AppState>,
) -> Result<LicenseInfo, String> {
    let client = &state.license_client;
    let hardware_id = &state.hardware_id;

    // Normalize: Trim, uppercase, remove spaces
    let normalized_key = license_key.trim().to_uppercase().replace(" ", "");

    let info = client.activate(&normalized_key, hardware_id).await?;

    // Save license key to config
    let config_path = state.db_path.parent()
        .ok_or("Invalid DB path")?
        .join("license.json");

    let license_data = serde_json::json!({
        "key": license_key,
        "activated_at": chrono::Utc::now().to_rfc3339()
    });

    if let Err(e) = std::fs::write(&config_path, serde_json::to_string_pretty(&license_data).unwrap()) {
         // Log error but don't fail activation? Or fail? Better to warn.
         // For now, returning error to ensure operator knows persistence failed.
         return Err(format!("Falha ao salvar licença: {}", e));
    }

    Ok(info)
}

#[tauri::command]
pub async fn validate_license(
    license_key: String,
    state: State<'_, AppState>,
) -> Result<LicenseInfo, String> {
    let client = &state.license_client;
    let hardware_id = &state.hardware_id;

    let normalized_key = license_key.trim().to_uppercase().replace(" ", "");

    let info = client.validate(&normalized_key, hardware_id).await?;

    Ok(info)
}

#[tauri::command]
pub async fn sync_metrics(
    license_key: String,
    metrics: MetricsPayload,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let client = &state.license_client;
    let hardware_id = &state.hardware_id;

    let normalized_key = license_key.trim().to_uppercase().replace(" ", "");

    client.sync_metrics(&normalized_key, hardware_id, metrics).await
}

#[tauri::command]
pub async fn get_server_time(state: State<'_, AppState>) -> Result<String, String> {
    let client = &state.license_client;

    let time = client.get_server_time().await?;

    Ok(time.to_rfc3339())
}
