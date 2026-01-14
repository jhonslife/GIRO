//! Comandos Tauri para Funcionários

use crate::error::AppResult;
use crate::models::{CreateEmployee, Employee, SafeEmployee, UpdateEmployee, EmployeeRole};
use crate::repositories::EmployeeRepository;
use crate::AppState;
use tauri::State;
use serde::Deserialize;

#[tauri::command]
pub async fn get_employees(state: State<'_, AppState>) -> AppResult<Vec<SafeEmployee>> {
    let repo = EmployeeRepository::new(state.pool());
    repo.find_all_safe().await
}

#[tauri::command]
pub async fn get_employee_by_id(
    id: String,
    state: State<'_, AppState>,
) -> AppResult<Option<Employee>> {
    let repo = EmployeeRepository::new(state.pool());
    repo.find_by_id(&id).await
}

#[tauri::command]
pub async fn authenticate_by_pin(
    pin: String,
    state: State<'_, AppState>,
) -> AppResult<Option<SafeEmployee>> {
    let repo = EmployeeRepository::new(state.pool());
    let emp = repo.authenticate_pin(&pin).await?;
    Ok(emp.map(SafeEmployee::from))
}

// Alias para compatibilidade com frontend
#[tauri::command]
pub async fn authenticate_employee(
    pin: String,
    state: State<'_, AppState>,
) -> AppResult<Option<SafeEmployee>> {
    authenticate_by_pin(pin, state).await
}

#[tauri::command]
pub async fn has_admin(state: State<'_, AppState>) -> AppResult<bool> {
    let repo = EmployeeRepository::new(state.pool());
    repo.has_admin().await
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateFirstAdminInput {
    pub name: String,
    pub email: Option<String>,
    pub pin: String,
}

#[tauri::command]
pub async fn create_first_admin(
    input: CreateFirstAdminInput,
    state: State<'_, AppState>,
) -> AppResult<SafeEmployee> {
    let repo = EmployeeRepository::new(state.pool());

    // Verifica se já existe admin
    let has_admin = repo.has_admin().await?;
    if has_admin {
        return Err(crate::error::AppError::Duplicate("Já existe um administrador cadastrado".into()));
    }

    // Valida PIN: 4-6 dígitos numéricos
    if input.pin.len() < 4 || input.pin.len() > 6 {
        return Err(crate::error::AppError::Validation("PIN deve ter entre 4 e 6 dígitos".into()));
    }

    if !input.pin.chars().all(|c| c.is_ascii_digit()) {
        return Err(crate::error::AppError::Validation("PIN deve conter apenas números".into()));
    }

    let create = CreateEmployee {
        name: input.name,
        cpf: None,
        phone: None,
        email: input.email,
        pin: input.pin,
        password: None,
        role: Some(EmployeeRole::Admin),
    };

    let emp = repo.create(create).await?;
    Ok(SafeEmployee::from(emp))
}

#[tauri::command]
pub async fn has_any_employee(state: State<'_, AppState>) -> AppResult<bool> {
    let repo = EmployeeRepository::new(state.pool());
    repo.has_any_employee().await
}

#[tauri::command]
pub async fn create_employee(
    input: CreateEmployee,
    state: State<'_, AppState>,
) -> AppResult<SafeEmployee> {
    let repo = EmployeeRepository::new(state.pool());
    let emp = repo.create(input).await?;
    Ok(SafeEmployee::from(emp))
}

#[tauri::command]
pub async fn update_employee(
    id: String,
    input: UpdateEmployee,
    state: State<'_, AppState>,
) -> AppResult<SafeEmployee> {
    let repo = EmployeeRepository::new(state.pool());
    let emp = repo.update(&id, input).await?;
    Ok(SafeEmployee::from(emp))
}

#[tauri::command]
pub async fn deactivate_employee(id: String, state: State<'_, AppState>) -> AppResult<()> {
    let repo = EmployeeRepository::new(state.pool());
    repo.deactivate(&id).await
}

/// Reativa um funcionário desativado
#[tauri::command]
pub async fn reactivate_employee(
    id: String,
    state: State<'_, AppState>,
) -> AppResult<SafeEmployee> {
    let repo = EmployeeRepository::new(state.pool());
    let emp = repo.reactivate(&id).await?;
    Ok(SafeEmployee::from(emp))
}

/// Lista apenas funcionários inativos
#[tauri::command]
pub async fn get_inactive_employees(state: State<'_, AppState>) -> AppResult<Vec<SafeEmployee>> {
    let repo = EmployeeRepository::new(state.pool());
    let employees = repo.find_inactive().await?;
    Ok(employees.into_iter().map(SafeEmployee::from).collect())
}
