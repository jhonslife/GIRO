# 🧪 Testing Roadmap - GIRO License Server

> **Agente:** Testing & QA  
> **Sprint:** 2-4  
> **Dependências:** Backend  
> **Desbloqueia:** -

---

## 📊 Progresso

```
[⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜] 0/10 tasks (0%)
```

---

## 📋 Tasks

### Setup

- [ ] **TEST-001:** Configurar ambiente de testes
  - Test database (PostgreSQL em Docker)
  - Fixtures e factories
  - Test utilities

### Unit Tests (Backend)

- [ ] **TEST-002:** Testes de LicenseService

  - create_license()
  - activate_license()
  - validate_license()
  - transfer_license()
  - Casos de erro

- [ ] **TEST-003:** Testes de AuthService

  - register()
  - login()
  - refresh_token()
  - validate_api_key()

- [ ] **TEST-004:** Testes de HardwareService

  - register_hardware()
  - detect_conflict()
  - Fingerprint validation

- [ ] **TEST-005:** Testes de utilitários
  - license_key generation
  - time drift detection
  - password hashing

### Integration Tests

- [ ] **TEST-006:** Testes de API - Licenses

  - Fluxo completo de ativação
  - Validação com hardware correto
  - Validação com hardware errado
  - Transferência de licença

- [ ] **TEST-007:** Testes de API - Auth

  - Registro + Login
  - Refresh token flow
  - Rate limiting

- [ ] **TEST-008:** Testes de API - Metrics
  - Sync de métricas
  - Agregação de dados
  - Dashboard data

### E2E Tests (Dashboard)

- [ ] **TEST-009:** Testes Playwright - Dashboard
  - Login/Logout
  - Listar licenças
  - Transferir licença
  - Ver métricas

### Performance & Security

- [ ] **TEST-010:** Testes de carga e segurança
  - Load test com k6 (1000 req/s)
  - Security audit (OWASP)
  - Penetration testing básico

---

## 🔧 Comandos Úteis

```bash
# Rodar todos os testes
cargo test

# Testes com output
cargo test -- --nocapture

# Testes específicos
cargo test license

# Coverage
cargo tarpaulin

# E2E (Dashboard)
cd dashboard && npx playwright test
```

---

## 📊 Métricas de Qualidade

| Métrica           | Target  | Atual |
| ----------------- | ------- | ----- |
| Coverage Backend  | > 80%   | 0%    |
| Coverage Frontend | > 70%   | 0%    |
| E2E Pass Rate     | 100%    | 0%    |
| Load Test (p99)   | < 100ms | -     |

---

## ✅ Critérios de Aceite

- [ ] Coverage > 80% no backend
- [ ] Todos os fluxos críticos testados
- [ ] E2E cobre happy paths
- [ ] Load test passa com 1000 req/s
- [ ] Nenhuma vulnerabilidade crítica

---

## 📝 Notas

- Usar `sqlx::test` para testes de banco
- Mock de Stripe em testes
- CI roda testes em cada PR

---

_Última atualização: 08/01/2026_
