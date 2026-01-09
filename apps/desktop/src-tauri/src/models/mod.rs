//! Modelos de Domínio - GIRO
//!
//! Structs Rust correspondentes ao schema Prisma.

pub mod alert;
pub mod cash;
pub mod category;
pub mod employee;
pub mod price_history;
pub mod product;
pub mod sale;
pub mod settings;
pub mod stock;
pub mod supplier;

pub use alert::*;
pub use cash::*;
pub use category::*;
pub use employee::*;
pub use price_history::*;
pub use product::*;
pub use sale::*;
pub use settings::*;
pub use stock::*;
pub use supplier::*;
