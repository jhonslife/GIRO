# 🔐 Auth Roadmap - GIRO License Server

> **Agente:** Auth & Security  
> **Sprint:** 2  
> **Dependências:** Backend  
> **Desbloqueia:** Dashboard, Integrations

---

## 📊 Progresso

```
[⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜] 0/10 tasks (0%)
```

---

## 📋 Tasks

### Autenticação Admin (Dashboard)

- [ ] **AUTH-001:** Implementar registro de admin

  - Hash senha com Argon2
  - Validar email único
  - Enviar email de verificação

- [ ] **AUTH-002:** Implementar login

  - Verificar credenciais
  - Gerar JWT access token
  - Gerar refresh token
  - Registrar em audit_logs

- [ ] **AUTH-003:** Implementar refresh token

  - Validar refresh token
  - Gerar novo access token
  - Rotação de refresh token

- [ ] **AUTH-004:** Implementar logout

  - Invalidar refresh token
  - Limpar sessão no Redis

- [ ] **AUTH-005:** Implementar reset de senha
  - Gerar token temporário
  - Enviar email
  - Validar e atualizar senha

### Autenticação Desktop (API Key)

- [ ] **AUTH-006:** Implementar middleware API Key

  - Validar X-API-Key header
  - Associar licença ao request
  - Rate limiting por API key

- [ ] **AUTH-007:** Implementar validação de licença
  - Verificar license_key
  - Verificar hardware_id match
  - Verificar status = active
  - Verificar não expirada

### Segurança

- [ ] **AUTH-008:** Implementar rate limiting

  - Limite por IP (auth endpoints)
  - Limite por API key (validation)
  - Armazenar contadores no Redis

- [ ] **AUTH-009:** Implementar detecção de fraude

  - Detectar time drift (> 5 min)
  - Detectar hardware_id conflict
  - Alertar admin via log

- [ ] **AUTH-010:** Implementar audit logging
  - Log de todas as ações sensíveis
  - IP address e user agent
  - Detalhes em JSONB

---

## 🔧 Estrutura JWT

```json
{
  "sub": "admin-uuid",
  "email": "admin@example.com",
  "type": "access",
  "exp": 1736467200,
  "iat": 1736380800
}
```

### Configuração de Tokens

| Token         | Duração | Storage         |
| ------------- | ------- | --------------- |
| Access Token  | 24h     | Client (memory) |
| Refresh Token | 30d     | DB + Cookie     |
| Reset Token   | 1h      | Redis           |

---

## ✅ Critérios de Aceite

- [ ] Login retorna tokens válidos
- [ ] Refresh token funciona
- [ ] API key valida licenças corretamente
- [ ] Rate limiting bloqueia após exceder limite
- [ ] Audit logs registram todas as ações
- [ ] Time drift detectado e rejeitado

---

## 📝 Notas

- Usar RS256 para JWT em produção
- Refresh tokens devem ser one-time-use
- Implementar blacklist de tokens revogados

---

_Última atualização: 08/01/2026_
