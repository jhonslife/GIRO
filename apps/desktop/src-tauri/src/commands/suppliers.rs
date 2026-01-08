//! Comandos Tauri para Fornecedores

use crate::error::AppResult;
use crate::models::{CreateSupplier, Supplier, UpdateSupplier};
use crate::repositories::SupplierRepository;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn get_suppliers(state: State<'_, AppState>) -> AppResult<Vec<Supplier>> {
    let repo = SupplierRepository::new(state.pool());
    repo.find_all_active().await
}

#[tauri::command]
pub async fn get_supplier_by_id(id: String, state: State<'_, AppState>) -> AppResult<Option<Supplier>> {
    let repo = SupplierRepository::new(state.pool());
    repo.find_by_id(&id).await
}

#[tauri::command]
pub async fn search_suppliers(query: String, state: State<'_, AppState>) -> AppResult<Vec<Supplier>> {
    let repo = SupplierRepository::new(state.pool());
    repo.search(&query).await
}

#[tauri::command]
pub async fn create_supplier(input: CreateSupplier, state: State<'_, AppState>) -> AppResult<Supplier> {
    let repo = SupplierRepository::new(state.pool());
    repo.create(input).await
}

#[tauri::command]
pub async fn update_supplier(id: String, input: UpdateSupplier, state: State<'_, AppState>) -> AppResult<Supplier> {
    let repo = SupplierRepository::new(state.pool());
    repo.update(&id, input).await
}

#[tauri::command]
pub async fn delete_supplier(id: String, state: State<'_, AppState>) -> AppResult<()> {
    let repo = SupplierRepository::new(state.pool());
    repo.delete(&id).await
}
