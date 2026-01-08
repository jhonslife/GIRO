//! Modelos de Domínio - Mercearias
//!
//! Structs Rust correspondentes ao schema Prisma.

pub mod alert;
pub mod cash;
pub mod category;
pub mod employee;
pub mod product;
pub mod sale;
pub mod settings;
pub mod stock;
pub mod supplier;

pub use alert::*;
pub use cash::*;
pub use category::*;
pub use employee::*;
pub use product::*;
pub use sale::*;
pub use settings::*;
pub use stock::*;
pub use supplier::*;
