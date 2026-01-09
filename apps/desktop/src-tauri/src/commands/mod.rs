//! Comandos Tauri - Expõe backend ao frontend

pub mod alerts;
pub mod backup;
pub mod cash;
pub mod categories;
pub mod employees;
pub mod hardware;
pub mod price_history;
pub mod products;
pub mod reports;
pub mod sales;
pub mod seed;
pub mod settings;
pub mod stock;
pub mod suppliers;

// Re-export hardware commands (original)
pub use hardware::*;

// Re-export all commands
pub use alerts::*;
pub use backup::*;
pub use cash::*;
pub use categories::*;
pub use employees::*;
pub use price_history::*;
pub use products::*;
pub use reports::*;
pub use sales::*;
pub use settings::*;
pub use stock::*;
pub use suppliers::*;
