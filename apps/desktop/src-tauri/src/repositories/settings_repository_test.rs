//! Testes para SettingsRepository

use crate::models::SetSetting;
use crate::repositories::settings_repository::SettingsRepository;
use sqlx::SqlitePool;

async fn setup_test_db() -> SqlitePool {
    let pool = SqlitePool::connect(":memory:").await.unwrap();
    sqlx::migrate!("./migrations").run(&pool).await.unwrap();
    pool
}

#[tokio::test]
async fn test_set_new_setting() {
    let pool = setup_test_db().await;
    let repo = SettingsRepository::new(&pool);

    let input = SetSetting {
        key: "company.name".to_string(),
        value: "Minha Mercearia".to_string(),
        value_type: Some("STRING".to_string()),
        group_name: Some("company".to_string()),
        description: Some("Nome da empresa".to_string()),
    };

    let result = repo.set(input).await;
    assert!(result.is_ok());

    let setting = result.unwrap();
    assert_eq!(setting.key, "company.name");
    assert_eq!(setting.value, "Minha Mercearia");
    assert_eq!(setting.group_name, "company");
}

#[tokio::test]
async fn test_update_existing_setting() {
    let pool = setup_test_db().await;
    let repo = SettingsRepository::new(&pool);

    // Create initial setting
    let input1 = SetSetting {
        key: "pdv.sound_enabled".to_string(),
        value: "true".to_string(),
        value_type: Some("BOOLEAN".to_string()),
        group_name: Some("pdv".to_string()),
        description: None,
    };
    repo.set(input1).await.unwrap();

    // Update setting
    let input2 = SetSetting {
        key: "pdv.sound_enabled".to_string(),
        value: "false".to_string(),
        value_type: None,
        group_name: None,
        description: None,
    };
    let updated = repo.set(input2).await.unwrap();

    assert_eq!(updated.value, "false");
}

#[tokio::test]
async fn test_find_by_key() {
    let pool = setup_test_db().await;
    let repo = SettingsRepository::new(&pool);

    let input = SetSetting {
        key: "printer.port".to_string(),
        value: "USB001".to_string(),
        value_type: Some("STRING".to_string()),
        group_name: Some("printer".to_string()),
        description: None,
    };
    repo.set(input).await.unwrap();

    let found = repo.find_by_key("printer.port").await.unwrap();
    assert!(found.is_some());
    assert_eq!(found.unwrap().value, "USB001");
}

#[tokio::test]
async fn test_find_by_key_not_found() {
    let pool = setup_test_db().await;
    let repo = SettingsRepository::new(&pool);

    let found = repo.find_by_key("non.existent.key").await.unwrap();
    assert!(found.is_none());
}

#[tokio::test]
async fn test_find_by_group() {
    let pool = setup_test_db().await;
    let repo = SettingsRepository::new(&pool);

    // Create settings in different groups
    let settings = vec![
        ("company.name", "Test Co", "company"),
        ("company.cnpj", "12345678901234", "company"),
        ("pdv.sound", "true", "pdv"),
    ];

    for (key, value, group) in settings {
        let input = SetSetting {
            key: key.to_string(),
            value: value.to_string(),
            value_type: None,
            group_name: Some(group.to_string()),
            description: None,
        };
        repo.set(input).await.unwrap();
    }

    let company_settings = repo.find_by_group("company").await.unwrap();
    assert_eq!(company_settings.len(), 2);

    let pdv_settings = repo.find_by_group("pdv").await.unwrap();
    assert_eq!(pdv_settings.len(), 1);
}

#[tokio::test]
async fn test_find_all() {
    let pool = setup_test_db().await;
    let repo = SettingsRepository::new(&pool);

    // Create multiple settings
    for i in 1..=5 {
        let input = SetSetting {
            key: format!("setting.{}", i),
            value: format!("value{}", i),
            value_type: None,
            group_name: None,
            description: None,
        };
        repo.set(input).await.unwrap();
    }

    let all = repo.find_all().await.unwrap();
    assert!(all.len() >= 5);
}

#[tokio::test]
async fn test_get_value() {
    let pool = setup_test_db().await;
    let repo = SettingsRepository::new(&pool);

    let input = SetSetting {
        key: "theme".to_string(),
        value: "dark".to_string(),
        value_type: None,
        group_name: None,
        description: None,
    };
    repo.set(input).await.unwrap();

    let value = repo.get_value("theme").await.unwrap();
    assert_eq!(value, Some("dark".to_string()));

    let not_found = repo.get_value("not.exists").await.unwrap();
    assert!(not_found.is_none());
}

#[tokio::test]
async fn test_get_bool() {
    let pool = setup_test_db().await;
    let repo = SettingsRepository::new(&pool);

    // Test "true" string
    let input1 = SetSetting {
        key: "feature.enabled".to_string(),
        value: "true".to_string(),
        value_type: Some("BOOLEAN".to_string()),
        group_name: None,
        description: None,
    };
    repo.set(input1).await.unwrap();

    assert!(repo.get_bool("feature.enabled").await.unwrap());

    // Test "1" string
    let input2 = SetSetting {
        key: "feature.active".to_string(),
        value: "1".to_string(),
        value_type: Some("BOOLEAN".to_string()),
        group_name: None,
        description: None,
    };
    repo.set(input2).await.unwrap();

    assert!(repo.get_bool("feature.active").await.unwrap());

    // Test false default for non-existent
    assert!(!repo.get_bool("non.existent").await.unwrap());
}

#[tokio::test]
async fn test_get_number() {
    let pool = setup_test_db().await;
    let repo = SettingsRepository::new(&pool);

    let input = SetSetting {
        key: "pdv.tax_rate".to_string(),
        value: "18.5".to_string(),
        value_type: Some("NUMBER".to_string()),
        group_name: None,
        description: None,
    };
    repo.set(input).await.unwrap();

    let number = repo.get_number("pdv.tax_rate").await.unwrap();
    assert!(number.is_some());
    assert!((number.unwrap() - 18.5).abs() < 0.001);
}

#[tokio::test]
async fn test_delete_setting() {
    let pool = setup_test_db().await;
    let repo = SettingsRepository::new(&pool);

    let input = SetSetting {
        key: "to.delete".to_string(),
        value: "temp".to_string(),
        value_type: None,
        group_name: None,
        description: None,
    };
    repo.set(input).await.unwrap();

    // Verify exists
    assert!(repo.find_by_key("to.delete").await.unwrap().is_some());

    // Delete
    repo.delete("to.delete").await.unwrap();

    // Verify deleted
    assert!(repo.find_by_key("to.delete").await.unwrap().is_none());
}
