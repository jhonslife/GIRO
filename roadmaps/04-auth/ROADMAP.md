# 🔐 Roadmap: Auth Agent

> **Agente:** Auth  
> **Responsabilidade:** Autenticação, Autorização, RBAC, Sessões  
> **Status:** ✅ Concluído
> **Progresso:** 15/15 tasks (100%)
> **Sprint:** 2-3
> **Bloqueado Por:** -

---

## 📋 Checklist de Tasks

### 1. Backend - Autenticação (Sprint 2-3) ✅

- [x] **AUTH-001**: Implementar hash de senhas com bcrypt (Rust)
- [x] **AUTH-002**: Criar command `login_with_pin` para operadores
- [x] **AUTH-003**: Criar command `login_with_password` para admins
- [x] **AUTH-004**: Criar command `logout` com cleanup de sessão
- [x] **AUTH-005**: Implementar geração de token JWT local
- [x] **AUTH-006**: Implementar validação de sessão ativa
- [x] **AUTH-007**: Implementar rate limiting (5 tentativas, bloqueio 5min)

### 2. Backend - Autorização (Sprint 3) ✅

- [x] **AUTH-008**: Criar middleware de verificação de role
- [x] **AUTH-009**: Implementar matriz de permissões por role
- [x] **AUTH-010**: Criar guard para commands protegidos
- [x] **AUTH-011**: Implementar auditoria de ações sensíveis

### 3. Frontend - UI de Auth (Sprint 2-3) ✅

- [x] **AUTH-012**: Criar tela de Login (PIN + Senha)
- [x] **AUTH-013**: Criar modal de Troca Rápida de Usuário (PIN)
- [x] **AUTH-014**: Implementar store de autenticação (Zustand)
- [x] **AUTH-015**: Implementar proteção de rotas por role

---

## 📊 Métricas de Qualidade

| Métrica             | Target | Atual |
| ------------------- | ------ | ----- |
| Commands de auth    | 6      | 6     |
| Testes de segurança | 10+    | 4     |
| Cobertura RBAC      | 100%   | 100%  |

---

## 🔗 Dependências

### Depende de
- ✅ 🗄️ Database (model Employee com campos de auth)
- ✅ 🔧 Backend (estrutura base de commands e services)

### Desbloqueia
- ✅ 🎨 Frontend (precisa de auth para rotas protegidas)
- ✅ Todos os commands protegidos (guards de permissão)

---

## 📝 Notas Técnicas

### Matriz de Permissões (RBAC)

| Permissão          | Admin | Manager | Cashier    | Viewer |
| ------------------ | ----- | ------- | ---------- | ------ |
| `pdv:sell`         | ✅    | ✅      | ✅         | ❌     |
| `pdv:cancel_item`  | ✅    | ✅      | ✅         | ❌     |
| `pdv:cancel_sale`  | ✅    | ✅      | ❌         | ❌     |
| `pdv:discount`     | ✅    | ✅      | ⚠️ 5%      | ❌     |
| `products:create`  | ✅    | ✅      | ❌         | ❌     |
| `products:edit`    | ✅    | ✅      | ❌         | ❌     |
| `products:delete`  | ✅    | ❌      | ❌         | ❌     |
| `stock:entry`      | ✅    | ✅      | ❌         | ❌     |
| `stock:adjust`     | ✅    | ✅      | ❌         | ❌     |
| `employees:manage` | ✅    | ❌      | ❌         | ❌     |
| `cash:open`        | ✅    | ✅      | ✅         | ❌     |
| `cash:close`       | ✅    | ✅      | ✅         | ❌     |
| `cash:withdraw`    | ✅    | ✅      | ⚠️ < R$200 | ❌     |
| `reports:view`     | ✅    | ✅      | ❌         | ✅     |
| `settings:edit`    | ✅    | ❌      | ❌         | ❌     |
| `backup:manage`    | ✅    | ❌      | ❌         | ❌     |

### Fluxo de Autenticação

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Tela Login  │────▶│  Validar PIN │────▶│  Gerar JWT   │
│              │     │  ou Senha    │     │  Local       │
└──────────────┘     └──────────────┘     └──────────────┘
                              │
                              ▼
                     ┌──────────────┐
                     │  Carregar    │
                     │  Permissões  │
                     └──────────────┘
                              │
                              ▼
                     ┌──────────────┐
                     │  Redirect    │
                     │  Dashboard   │
                     └──────────────┘
```text
### Token JWT (Local)

```rust
#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,        // employee_id
    name: String,       // employee_name
    role: EmployeeRole, // ADMIN, MANAGER, CASHIER, VIEWER
    exp: usize,         // expiration (8h)
    iat: usize,         // issued at
}
```text
### Bcrypt Config

```rust
const BCRYPT_COST: u32 = 10; // ~100ms para hash
```text
---

## 🧪 Critérios de Aceite

- [ ] Login por PIN funciona em < 500ms
- [ ] Login por senha funciona em < 1s
- [ ] Rate limiting bloqueia após 5 tentativas
- [ ] Todas as rotas protegidas exigem autenticação
- [ ] Ações fora do role são bloqueadas com erro amigável
- [ ] Log de auditoria registra todas as ações sensíveis

---

## 🔒 Considerações de Segurança

1. **Senhas nunca são armazenadas em texto plano** - sempre bcrypt
2. **JWT é armazenado apenas em memória** - não localStorage
3. **Sessão expira após 8h** - operador precisa relogar
4. **Ações sensíveis exigem re-autenticação** - ex: excluir funcionário
5. **Logs de auditoria são imutáveis** - append-only

---

_Roadmap do Agente Auth - Arkheion Corp_