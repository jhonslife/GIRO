# 🗄️ Database Roadmap - GIRO License Server

> **Agente:** Database  
> **Sprint:** 1  
> **Dependências:** Nenhuma  
> **Desbloqueia:** Backend, Testing

---

## 📊 Progresso

```
[⬜⬜⬜⬜⬜⬜⬜⬜] 0/8 tasks (0%)
```

---

## 📋 Tasks

### Setup Inicial

- [ ] **DB-001:** Configurar projeto SQLx com PostgreSQL
  - Criar `database/` com Cargo.toml
  - Configurar connection pool
  - Adicionar .env.example
- [ ] **DB-002:** Configurar Docker Compose para desenvolvimento
  - PostgreSQL 16
  - Redis 7
  - Volumes persistentes

### Migrations

- [ ] **DB-003:** Criar migration: `001_create_enums`

  - license_status ENUM
  - plan_type ENUM
  - payment_status ENUM
  - payment_provider ENUM
  - audit_action ENUM

- [ ] **DB-004:** Criar migration: `002_create_admins`

  - Tabela admins
  - Índices
  - Constraints

- [ ] **DB-005:** Criar migration: `003_create_hardware`

  - Tabela hardware
  - Índice único fingerprint

- [ ] **DB-006:** Criar migration: `004_create_licenses`

  - Tabela licenses
  - FKs para admins e hardware
  - Índices compostos

- [ ] **DB-007:** Criar migration: `005_create_supporting_tables`
  - metrics
  - payments
  - audit_logs
  - refresh_tokens

### Seeds

- [ ] **DB-008:** Criar seeds de desenvolvimento
  - Admin de teste
  - Licenças de exemplo
  - Dados de métricas mock

---

## 🔧 Comandos Úteis

```bash
# Rodar migrations
sqlx migrate run

# Criar nova migration
sqlx migrate add <name>

# Verificar status
sqlx migrate info

# Reset database
sqlx database reset
```

---

## ✅ Critérios de Aceite

- [ ] Todas as migrations rodam sem erro
- [ ] Schema reflete 100% do 02-DATABASE-SCHEMA.md
- [ ] Seeds populam dados de teste
- [ ] Docker compose sobe PostgreSQL + Redis
- [ ] Connection pool configurado e testado

---

## 📝 Notas

- Usar UUIDs v7 para melhor ordenação temporal
- Configurar `max_connections = 20` no pool
- Habilitar logging de queries em dev

---

_Última atualização: 08/01/2026_
