//! Testes para AlertRepository

use crate::models::CreateAlert;
use crate::repositories::alert_repository::AlertRepository;
use sqlx::SqlitePool;

async fn setup_test_db() -> SqlitePool {
    let pool = SqlitePool::connect(":memory:").await.unwrap();
    sqlx::migrate!("./migrations").run(&pool).await.unwrap();
    pool
}

#[tokio::test]
async fn test_create_alert() {
    let pool = setup_test_db().await;
    let repo = AlertRepository::new(&pool);

    let input = CreateAlert {
        alert_type: "LOW_STOCK".to_string(),
        severity: "WARNING".to_string(),
        title: "Estoque Baixo".to_string(),
        message: "Produto X está com estoque baixo".to_string(),
        product_id: Some("prod-001".to_string()),
        lot_id: None,
    };

    let result = repo.create(input).await;
    assert!(result.is_ok());

    let alert = result.unwrap();
    assert_eq!(alert.alert_type, "LOW_STOCK");
    assert_eq!(alert.severity, "WARNING");
    assert!(!alert.is_read);
}

#[tokio::test]
async fn test_find_by_id() {
    let pool = setup_test_db().await;
    let repo = AlertRepository::new(&pool);

    let input = CreateAlert {
        alert_type: "EXPIRATION".to_string(),
        severity: "CRITICAL".to_string(),
        title: "Produto Vencido".to_string(),
        message: "Lote X venceu".to_string(),
        product_id: None,
        lot_id: Some("lot-001".to_string()),
    };

    let created = repo.create(input).await.unwrap();
    let found = repo.find_by_id(&created.id).await.unwrap();

    assert!(found.is_some());
    assert_eq!(found.unwrap().id, created.id);
}

#[tokio::test]
async fn test_find_by_id_not_found() {
    let pool = setup_test_db().await;
    let repo = AlertRepository::new(&pool);

    let found = repo.find_by_id("non-existent").await.unwrap();
    assert!(found.is_none());
}

#[tokio::test]
async fn test_find_all() {
    let pool = setup_test_db().await;
    let repo = AlertRepository::new(&pool);

    // Create multiple alerts
    for i in 1..=5 {
        let input = CreateAlert {
            alert_type: "LOW_STOCK".to_string(),
            severity: "WARNING".to_string(),
            title: format!("Alert {}", i),
            message: format!("Message {}", i),
            product_id: None,
            lot_id: None,
        };
        repo.create(input).await.unwrap();
    }

    let alerts = repo.find_all(10).await.unwrap();
    assert_eq!(alerts.len(), 5);
}

#[tokio::test]
async fn test_find_unread() {
    let pool = setup_test_db().await;
    let repo = AlertRepository::new(&pool);

    // Create alerts
    for i in 1..=3 {
        let input = CreateAlert {
            alert_type: "INFO".to_string(),
            severity: "INFO".to_string(),
            title: format!("Alert {}", i),
            message: format!("Message {}", i),
            product_id: None,
            lot_id: None,
        };
        repo.create(input).await.unwrap();
    }

    let unread = repo.find_unread().await.unwrap();
    assert_eq!(unread.len(), 3);
}

#[tokio::test]
async fn test_count_unread() {
    let pool = setup_test_db().await;
    let repo = AlertRepository::new(&pool);

    // Create 4 alerts
    for i in 1..=4 {
        let input = CreateAlert {
            alert_type: "LOW_STOCK".to_string(),
            severity: "WARNING".to_string(),
            title: format!("Alert {}", i),
            message: format!("Message {}", i),
            product_id: None,
            lot_id: None,
        };
        repo.create(input).await.unwrap();
    }

    let count = repo.count_unread().await.unwrap();
    assert_eq!(count, 4);
}

#[tokio::test]
async fn test_mark_as_read() {
    let pool = setup_test_db().await;
    let repo = AlertRepository::new(&pool);

    let input = CreateAlert {
        alert_type: "LOW_STOCK".to_string(),
        severity: "WARNING".to_string(),
        title: "Test Alert".to_string(),
        message: "Test Message".to_string(),
        product_id: None,
        lot_id: None,
    };

    let created = repo.create(input).await.unwrap();
    assert!(!created.is_read);

    // Mark as read
    repo.mark_as_read(&created.id).await.unwrap();

    // Verify
    let updated = repo.find_by_id(&created.id).await.unwrap().unwrap();
    assert!(updated.is_read);
    assert!(updated.read_at.is_some());
}

#[tokio::test]
async fn test_mark_all_as_read() {
    let pool = setup_test_db().await;
    let repo = AlertRepository::new(&pool);

    // Create multiple unread alerts
    for i in 1..=3 {
        let input = CreateAlert {
            alert_type: "LOW_STOCK".to_string(),
            severity: "WARNING".to_string(),
            title: format!("Alert {}", i),
            message: format!("Message {}", i),
            product_id: None,
            lot_id: None,
        };
        repo.create(input).await.unwrap();
    }

    // Verify unread count
    assert_eq!(repo.count_unread().await.unwrap(), 3);

    // Mark all as read
    repo.mark_all_as_read().await.unwrap();

    // Verify count is now 0
    assert_eq!(repo.count_unread().await.unwrap(), 0);
}

#[tokio::test]
async fn test_find_by_severity() {
    let pool = setup_test_db().await;
    let repo = AlertRepository::new(&pool);

    // Create alerts with different severities
    let severities = vec!["CRITICAL", "CRITICAL", "WARNING", "INFO"];
    for (i, severity) in severities.iter().enumerate() {
        let input = CreateAlert {
            alert_type: "LOW_STOCK".to_string(),
            severity: severity.to_string(),
            title: format!("Alert {}", i),
            message: format!("Message {}", i),
            product_id: None,
            lot_id: None,
        };
        repo.create(input).await.unwrap();
    }

    let critical = repo.find_by_severity("CRITICAL").await.unwrap();
    assert_eq!(critical.len(), 2);

    let warning = repo.find_by_severity("WARNING").await.unwrap();
    assert_eq!(warning.len(), 1);
}

#[tokio::test]
async fn test_delete_alert() {
    let pool = setup_test_db().await;
    let repo = AlertRepository::new(&pool);

    let input = CreateAlert {
        alert_type: "LOW_STOCK".to_string(),
        severity: "WARNING".to_string(),
        title: "To Delete".to_string(),
        message: "This will be deleted".to_string(),
        product_id: None,
        lot_id: None,
    };

    let created = repo.create(input).await.unwrap();
    
    // Delete
    repo.delete(&created.id).await.unwrap();

    // Verify deleted
    let found = repo.find_by_id(&created.id).await.unwrap();
    assert!(found.is_none());
}
