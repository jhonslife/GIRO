//! Comandos utilitários do sistema

use crate::error::AppResult;
use std::path::PathBuf;

/// Retorna o caminho do diretório de dados do aplicativo
#[tauri::command]
pub async fn get_app_data_path() -> AppResult<String> {
    let app_data = dirs::data_local_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("GIRO");

    Ok(app_data.to_string_lossy().to_string())
}

/// Retorna o caminho do banco de dados
#[tauri::command]
pub async fn get_database_path() -> AppResult<String> {
    let app_data = dirs::data_local_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("GIRO")
        .join("giro.db");

    Ok(app_data.to_string_lossy().to_string())
}

/// Retorna informações sobre o uso de disco
#[tauri::command]
pub async fn get_disk_usage() -> AppResult<DiskUsageInfo> {
    let app_data = dirs::data_local_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("GIRO");

    let mut info = DiskUsageInfo {
        database_size: 0,
        backups_size: 0,
        logs_size: 0,
        total_size: 0,
        database_path: String::new(),
        backups_path: String::new(),
    };

    // Banco de dados
    let db_path = app_data.join("giro.db");
    if db_path.exists() {
        if let Ok(metadata) = std::fs::metadata(&db_path) {
            info.database_size = metadata.len();
        }
        info.database_path = db_path.to_string_lossy().to_string();
    }

    // Backups
    let backups_dir = app_data.join("backups");
    if backups_dir.exists() {
        info.backups_size = calculate_dir_size(&backups_dir);
        info.backups_path = backups_dir.to_string_lossy().to_string();
    }

    // Logs
    if let Ok(entries) = std::fs::read_dir(&app_data) {
        for entry in entries.flatten() {
            if let Some(ext) = entry.path().extension() {
                if ext == "log" {
                    if let Ok(metadata) = entry.metadata() {
                        info.logs_size += metadata.len();
                    }
                }
            }
        }
    }

    info.total_size = info.database_size + info.backups_size + info.logs_size;

    Ok(info)
}

/// Calcula o tamanho total de um diretório
fn calculate_dir_size(path: &PathBuf) -> u64 {
    let mut total = 0u64;

    if let Ok(entries) = std::fs::read_dir(path) {
        for entry in entries.flatten() {
            if let Ok(metadata) = entry.metadata() {
                if metadata.is_file() {
                    total += metadata.len();
                } else if metadata.is_dir() {
                    total += calculate_dir_size(&entry.path());
                }
            }
        }
    }

    total
}

#[derive(serde::Serialize)]
pub struct DiskUsageInfo {
    pub database_size: u64,
    pub backups_size: u64,
    pub logs_size: u64,
    pub total_size: u64,
    pub database_path: String,
    pub backups_path: String,
}
