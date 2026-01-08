//! Ponto de entrada do aplicativo Mercearias Desktop

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use mercearias_lib::{AppState, commands, DatabaseManager, HardwareState};
use std::path::PathBuf;

fn get_database_path() -> PathBuf {
    let app_data = dirs::data_local_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("Mercearias");
    
    std::fs::create_dir_all(&app_data).ok();
    app_data.join("mercearias.db")
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "mercearias_lib=info,tauri=warn".into()),
        )
        .init();

    tracing::info!("Iniciando Mercearias Desktop v{}", env!("CARGO_PKG_VERSION"));

    let db_path = get_database_path();
    tracing::info!("Banco de dados: {:?}", db_path);

    let db = DatabaseManager::new(db_path.to_str().unwrap())
        .await
        .expect("Falha ao conectar com banco de dados");
    
    let app_dir = db_path.parent().expect("Falha ao obter diretório da aplicação").to_path_buf();
    let backup_dir = app_dir.join("backups");
    std::fs::create_dir_all(&backup_dir).ok();

    let app_state = AppState::new(db.pool().clone(), db_path.clone(), backup_dir);

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .manage(app_state)
        .manage(HardwareState::default())
        .setup(|_app| {
            tracing::info!("Aplicação inicializada com sucesso");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Produtos
            commands::get_products,
            commands::get_product_by_id,
            commands::get_product_by_barcode,
            commands::search_products,
            commands::get_low_stock_products,
            commands::create_product,
            commands::update_product,
            commands::delete_product,
            
            // Categorias
            commands::get_categories,
            commands::get_categories_with_count,
            commands::get_category_by_id,
            commands::create_category,
            commands::update_category,
            commands::delete_category,
            
            // Funcionários
            commands::get_employees,
            commands::get_employee_by_id,
            commands::authenticate_by_pin,
            commands::authenticate_employee, // alias
            commands::create_employee,
            commands::update_employee,
            commands::deactivate_employee,
            
            // Vendas
            commands::get_sales_today,
            commands::get_today_sales, // alias
            commands::get_sale_by_id,
            commands::get_sales_by_session,
            commands::create_sale,
            commands::cancel_sale,
            commands::get_daily_summary,
            commands::get_daily_sales_total,
            commands::get_monthly_summary,
            
            // Caixa
            commands::get_current_session,
            commands::get_current_cash_session, // alias
            commands::get_session_history,
            commands::get_session_movements,
            commands::open_cash_session,
            commands::close_cash_session,
            commands::add_cash_movement,
            
            // Estoque
            commands::get_recent_stock_movements,
            commands::get_product_stock_movements,
            commands::create_stock_movement,
            commands::get_product_lots,
            commands::get_expiring_lots,
            commands::get_expired_lots,
            
            // Alertas
            commands::get_alerts,
            commands::get_unread_alerts,
            commands::get_unread_alert_count,
            commands::get_unread_alerts_count,
            commands::mark_alert_read,
            commands::mark_all_alerts_read,
            commands::create_alert,
            commands::delete_alert,

            // Relatórios
            commands::get_stock_report,
            commands::get_top_products,
            commands::get_sales_report,
            
            // Configurações
            commands::get_all_settings,
            commands::get_settings_by_group,
            commands::get_setting,
            commands::get_setting_bool,
            commands::get_setting_number,
            commands::set_setting,
            commands::delete_setting,
            
            // Fornecedores
            commands::get_suppliers,
            commands::get_supplier_by_id,
            commands::search_suppliers,
            commands::create_supplier,
            commands::update_supplier,
            commands::delete_supplier,
            
            // Hardware
            commands::list_serial_ports,
            commands::check_port_exists,
            commands::configure_printer,
            commands::print_receipt,
            commands::test_printer,
            commands::get_printer_config,
            commands::configure_scale,
            commands::read_weight,
            commands::auto_detect_scale,
            commands::get_scale_config,
            commands::configure_drawer,
            commands::open_drawer,
            commands::get_drawer_config,
            commands::start_scanner_server,
            commands::stop_scanner_server,
            commands::list_scanner_devices,
            commands::get_scanner_server_info,
            commands::generate_pairing_qr,

            // Seeding
            commands::seed::seed_database,
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao executar aplicação Tauri");
}
