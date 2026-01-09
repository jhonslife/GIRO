# 📡 GIRO License Server - API Reference

> **Versão:** 1.0.0  
> **Base URL:** `https://api.giro.com.br/v1`  
> **Status:** Planejamento  
> **Última Atualização:** 8 de Janeiro de 2026

---

## 📋 Sumário

1. [Autenticação](#autenticação)
2. [Endpoints de Auth](#endpoints-de-auth)
3. [Endpoints de Licenças](#endpoints-de-licenças)
4. [Endpoints de Hardware](#endpoints-de-hardware)
5. [Endpoints de Métricas](#endpoints-de-métricas)
6. [Endpoints de Pagamentos](#endpoints-de-pagamentos)
7. [Códigos de Erro](#códigos-de-erro)

---

## 🔐 Autenticação

### Tipos de Autenticação

| Tipo            | Uso                  | Header                          |
| --------------- | -------------------- | ------------------------------- |
| **JWT Bearer**  | Dashboard (Admins)   | `Authorization: Bearer <token>` |
| **API Key**     | Desktop GIRO         | `X-API-Key: <api_key>`          |
| **License Key** | Validação de licença | Body do request                 |

### JWT Token Structure

```json
{
  "sub": "admin-uuid",
  "email": "admin@example.com",
  "exp": 1736467200,
  "iat": 1736380800
}
```

### Rate Limiting

| Tipo           | Limite        | Window |
| -------------- | ------------- | ------ |
| **Auth**       | 5 requests    | 1 min  |
| **Validation** | 100 requests  | 1 min  |
| **General**    | 1000 requests | 1 min  |

Headers de resposta:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1736380860
```

---

## 🔑 Endpoints de Auth

### POST /auth/register

Cria uma nova conta de administrador.

**Request:**

```json
{
  "email": "joao@mercearia.com",
  "password": "Senh@Forte123",
  "name": "João da Silva",
  "phone": "+5511999999999",
  "company_name": "Mercearia do João"
}
```

**Response (201 Created):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "joao@mercearia.com",
  "name": "João da Silva",
  "company_name": "Mercearia do João",
  "is_verified": false,
  "created_at": "2026-01-08T10:00:00Z"
}
```

**Errors:**
| Code | Descrição |
| ---- | -------------------------- |
| 400 | Dados inválidos |
| 409 | Email já cadastrado |

---

### POST /auth/login

Autentica um administrador.

**Request:**

```json
{
  "email": "joao@mercearia.com",
  "password": "Senh@Forte123"
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "admin": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "joao@mercearia.com",
    "name": "João da Silva",
    "company_name": "Mercearia do João"
  }
}
```

**Errors:**
| Code | Descrição |
| ---- | ----------------------- |
| 401 | Credenciais inválidas |
| 403 | Conta desativada |
| 429 | Muitas tentativas |

---

### POST /auth/refresh

Renova o access token usando o refresh token.

**Request:**

```json
{
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

---

### POST /auth/logout

Invalida o refresh token atual.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

### POST /auth/password/forgot

Solicita reset de senha.

**Request:**

```json
{
  "email": "joao@mercearia.com"
}
```

**Response (200 OK):**

```json
{
  "message": "Email de recuperação enviado"
}
```

---

### POST /auth/password/reset

Redefine a senha com o token recebido por email.

**Request:**

```json
{
  "token": "reset-token-from-email",
  "new_password": "NovaSenha@456"
}
```

**Response (200 OK):**

```json
{
  "message": "Senha alterada com sucesso"
}
```

---

## 📜 Endpoints de Licenças

### GET /licenses

Lista licenças do administrador autenticado.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Param | Tipo | Default | Descrição |
| ------- | ------ | ------- | ------------------- |
| status | string | all | Filtrar por status |
| page | int | 1 | Página |
| limit | int | 20 | Itens por página |

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "license_key": "GIRO-A1B2-C3D4-E5F6-G7H8",
      "status": "active",
      "plan_type": "monthly",
      "hardware": {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "machine_name": "CAIXA-01",
        "last_seen": "2026-01-08T14:30:00Z"
      },
      "activated_at": "2026-01-01T10:00:00Z",
      "expires_at": "2026-02-01T10:00:00Z",
      "created_at": "2026-01-01T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "total_pages": 1
  }
}
```

---

### POST /licenses

Cria uma nova licença (após pagamento).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "plan_type": "monthly",
  "quantity": 1
}
```

**Response (201 Created):**

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "license_key": "GIRO-A1B2-C3D4-E5F6-G7H8",
  "status": "pending",
  "plan_type": "monthly",
  "expires_at": null,
  "created_at": "2026-01-08T10:00:00Z"
}
```

---

### GET /licenses/:key

Retorna detalhes de uma licença específica.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "license_key": "GIRO-A1B2-C3D4-E5F6-G7H8",
  "status": "active",
  "plan_type": "monthly",
  "hardware": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "fingerprint": "sha256:abc123...",
    "machine_name": "CAIXA-01",
    "os_version": "Windows 11 Pro",
    "first_seen": "2026-01-01T10:00:00Z",
    "last_seen": "2026-01-08T14:30:00Z"
  },
  "validation_count": 1250,
  "activated_at": "2026-01-01T10:00:00Z",
  "expires_at": "2026-02-01T10:00:00Z",
  "last_validated": "2026-01-08T14:30:00Z"
}
```

---

### POST /licenses/:key/activate

Ativa uma licença vinculando a um Hardware ID.  
**Usado pelo GIRO Desktop na primeira execução.**

**Headers:**

```
X-API-Key: <desktop_api_key>
```

**Request:**

```json
{
  "license_key": "GIRO-A1B2-C3D4-E5F6-G7H8",
  "hardware_id": "sha256:cpu_id+motherboard+disk+mac",
  "machine_name": "CAIXA-01",
  "os_version": "Windows 11 Pro"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "license": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "license_key": "GIRO-A1B2-C3D4-E5F6-G7H8",
    "status": "active",
    "expires_at": "2026-02-01T10:00:00Z"
  },
  "server_time": "2026-01-08T10:00:00Z"
}
```

**Errors:**
| Code | Descrição |
| ---- | -------------------------------------- |
| 400 | Dados inválidos |
| 404 | Licença não encontrada |
| 409 | Licença já ativada em outra máquina |
| 410 | Licença expirada |

---

### POST /licenses/:key/validate

Valida uma licença ativa.  
**Chamado periodicamente pelo GIRO Desktop (a cada 24h).**

**Headers:**

```
X-API-Key: <desktop_api_key>
```

**Request:**

```json
{
  "license_key": "GIRO-A1B2-C3D4-E5F6-G7H8",
  "hardware_id": "sha256:cpu_id+motherboard+disk+mac",
  "client_time": "2026-01-08T10:00:00Z"
}
```

**Response (200 OK):**

```json
{
  "valid": true,
  "status": "active",
  "expires_at": "2026-02-01T10:00:00Z",
  "days_remaining": 24,
  "server_time": "2026-01-08T10:00:05Z",
  "features": {
    "max_products": null,
    "max_users": null,
    "sync_enabled": true
  }
}
```

**Response (Inválida):**

```json
{
  "valid": false,
  "reason": "hardware_mismatch",
  "message": "Esta licença está ativada em outro computador",
  "server_time": "2026-01-08T10:00:05Z"
}
```

**Reasons possíveis:**
| Reason | Descrição |
| ------------------- | ------------------------------------------ |
| `not_found` | Licença não existe |
| `not_activated` | Licença ainda não foi ativada |
| `hardware_mismatch` | Hardware ID não confere |
| `expired` | Licença expirada |
| `suspended` | Licença suspensa |
| `revoked` | Licença revogada |
| `time_drift` | Hora do cliente muito diferente do servidor|

---

### POST /licenses/:key/transfer

Transfere a licença para outra máquina (limpa Hardware ID).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "reason": "Troca de computador"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Licença liberada. Pode ativar em nova máquina.",
  "license": {
    "license_key": "GIRO-A1B2-C3D4-E5F6-G7H8",
    "status": "pending",
    "hardware": null
  }
}
```

---

### DELETE /licenses/:key

Revoga uma licença permanentemente.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Licença revogada"
}
```

---

## 💻 Endpoints de Hardware

### GET /hardware

Lista máquinas do administrador.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "fingerprint": "sha256:abc123...",
      "machine_name": "CAIXA-01",
      "os_version": "Windows 11 Pro",
      "license_key": "GIRO-A1B2-C3D4-E5F6-G7H8",
      "first_seen": "2026-01-01T10:00:00Z",
      "last_seen": "2026-01-08T14:30:00Z",
      "is_active": true
    }
  ]
}
```

---

### GET /hardware/:id

Detalhes de uma máquina específica.

**Response (200 OK):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "fingerprint": "sha256:abc123...",
  "machine_name": "CAIXA-01",
  "os_version": "Windows 11 Pro",
  "cpu_info": "Intel Core i5-10400",
  "license": {
    "license_key": "GIRO-A1B2-C3D4-E5F6-G7H8",
    "status": "active"
  },
  "validations_today": 48,
  "first_seen": "2026-01-01T10:00:00Z",
  "last_seen": "2026-01-08T14:30:00Z"
}
```

---

## 📊 Endpoints de Métricas

### POST /metrics/sync

Recebe dados agregados do GIRO Desktop.

**Headers:**

```
X-API-Key: <desktop_api_key>
```

**Request:**

```json
{
  "license_key": "GIRO-A1B2-C3D4-E5F6-G7H8",
  "hardware_id": "sha256:abc123...",
  "date": "2026-01-08",
  "metrics": {
    "sales_total": 5420.5,
    "sales_count": 87,
    "average_ticket": 62.3,
    "products_sold": 234,
    "low_stock_count": 12,
    "expiring_count": 5,
    "cash_opens": 2,
    "cash_closes": 1
  }
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "synced_at": "2026-01-08T18:00:00Z"
}
```

---

### GET /metrics/dashboard

Retorna métricas agregadas para o Dashboard.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Param | Tipo | Default | Descrição |
| ----------- | ------ | ------- | --------------------- |
| period | string | 7d | 7d, 30d, 90d |
| license_id | uuid | all | Filtrar por licença |

**Response (200 OK):**

```json
{
  "period": {
    "start": "2026-01-01",
    "end": "2026-01-08"
  },
  "summary": {
    "total_sales": 45680.9,
    "total_transactions": 743,
    "average_ticket": 61.48,
    "total_products_sold": 2156
  },
  "by_license": [
    {
      "license_key": "GIRO-A1B2-C3D4-E5F6-G7H8",
      "machine_name": "CAIXA-01",
      "sales_total": 28500.0,
      "sales_count": 456
    },
    {
      "license_key": "GIRO-I9J0-K1L2-M3N4-O5P6",
      "machine_name": "CAIXA-02",
      "sales_total": 17180.9,
      "sales_count": 287
    }
  ],
  "daily": [
    { "date": "2026-01-08", "total": 5420.5, "count": 87 },
    { "date": "2026-01-07", "total": 6120.0, "count": 102 },
    { "date": "2026-01-06", "total": 5890.4, "count": 95 }
  ],
  "alerts": {
    "low_stock": 12,
    "expiring_soon": 5
  }
}
```

---

### GET /metrics/time

Retorna hora do servidor (para sincronização).

**Response (200 OK):**

```json
{
  "server_time": "2026-01-08T10:00:00Z",
  "timezone": "UTC"
}
```

---

## 💳 Endpoints de Pagamentos

### POST /payments/checkout

Cria uma sessão de checkout.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "plan_type": "monthly",
  "licenses_count": 2,
  "payment_method": "stripe"
}
```

**Response (200 OK):**

```json
{
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_xxx",
  "session_id": "cs_xxx",
  "expires_at": "2026-01-08T11:00:00Z"
}
```

---

### POST /payments/webhook

Recebe webhooks do Stripe.

**Headers:**

```
Stripe-Signature: <signature>
```

**Response (200 OK):**

```json
{
  "received": true
}
```

---

### GET /payments

Lista histórico de pagamentos.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "amount": 199.8,
      "currency": "BRL",
      "status": "completed",
      "provider": "stripe",
      "licenses_count": 2,
      "description": "2x GIRO Pro Mensal",
      "receipt_url": "https://pay.stripe.com/receipts/xxx",
      "paid_at": "2026-01-01T10:00:00Z",
      "created_at": "2026-01-01T09:55:00Z"
    }
  ]
}
```

---

## ❌ Códigos de Erro

### Formato de Erro

```json
{
  "error": {
    "code": "LICENSE_NOT_FOUND",
    "message": "Licença não encontrada",
    "details": {
      "license_key": "GIRO-XXXX-XXXX-XXXX-XXXX"
    }
  }
}
```

### Códigos HTTP

| Status | Descrição                |
| ------ | ------------------------ |
| 200    | Sucesso                  |
| 201    | Criado                   |
| 204    | Sem conteúdo             |
| 400    | Requisição inválida      |
| 401    | Não autenticado          |
| 403    | Não autorizado           |
| 404    | Não encontrado           |
| 409    | Conflito                 |
| 410    | Gone (expirado)          |
| 422    | Entidade não processável |
| 429    | Rate limit excedido      |
| 500    | Erro interno             |

### Códigos de Erro da API

| Código                      | Descrição                               |
| --------------------------- | --------------------------------------- |
| `VALIDATION_ERROR`          | Campos inválidos                        |
| `UNAUTHORIZED`              | Token inválido ou expirado              |
| `FORBIDDEN`                 | Sem permissão                           |
| `ADMIN_NOT_FOUND`           | Administrador não encontrado            |
| `ADMIN_EMAIL_EXISTS`        | Email já cadastrado                     |
| `ADMIN_INACTIVE`            | Conta desativada                        |
| `LICENSE_NOT_FOUND`         | Licença não encontrada                  |
| `LICENSE_ALREADY_ACTIVATED` | Licença já ativada em outra máquina     |
| `LICENSE_EXPIRED`           | Licença expirada                        |
| `LICENSE_SUSPENDED`         | Licença suspensa                        |
| `LICENSE_REVOKED`           | Licença revogada                        |
| `HARDWARE_MISMATCH`         | Hardware ID não confere                 |
| `HARDWARE_CONFLICT`         | Conflito de hardware (fraude detectada) |
| `TIME_DRIFT`                | Diferença de horário muito grande       |
| `RATE_LIMIT_EXCEEDED`       | Muitas requisições                      |
| `PAYMENT_FAILED`            | Falha no pagamento                      |
| `INTERNAL_ERROR`            | Erro interno do servidor                |

---

_Este documento define a referência completa da API do GIRO License Server._
