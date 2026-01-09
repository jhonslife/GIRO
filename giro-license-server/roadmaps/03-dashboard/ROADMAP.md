# 🖥️ Dashboard Roadmap - GIRO License Server

> **Agente:** Frontend (Dashboard)  
> **Sprint:** 3  
> **Dependências:** Backend, Auth  
> **Desbloqueia:** -

---

## 📊 Progresso

```
[⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜] 0/12 tasks (0%)
```

---

## 📋 Tasks

### Setup Inicial

- [ ] **FE-001:** Criar projeto Next.js 14

  - App Router
  - TypeScript
  - TailwindCSS
  - Shadcn/UI

- [ ] **FE-002:** Configurar estrutura base

  - Layout principal
  - Providers (Theme, Auth, Query)
  - Middleware de auth

- [ ] **FE-003:** Configurar API client
  - Axios/Fetch wrapper
  - Interceptors para JWT
  - Error handling global

### Autenticação UI

- [ ] **FE-004:** Criar telas de auth

  - /login
  - /register
  - /forgot-password
  - /reset-password

- [ ] **FE-005:** Implementar AuthContext
  - Login/Logout
  - Token refresh
  - Protected routes

### Dashboard Principal

- [ ] **FE-006:** Criar página /dashboard

  - Cards de métricas (vendas, licenças)
  - Gráfico de vendas 7/30 dias
  - Lista de alertas

- [ ] **FE-007:** Criar página /licenses

  - Listagem com filtros
  - Status badges
  - Ações (transferir, revogar)

- [ ] **FE-008:** Criar página /licenses/:key
  - Detalhes da licença
  - Info do hardware
  - Histórico de validações

### Gerenciamento

- [ ] **FE-009:** Criar página /hardware

  - Lista de máquinas
  - Status de conexão
  - Ação de limpar vínculo

- [ ] **FE-010:** Criar página /payments

  - Histórico de pagamentos
  - Faturas
  - Link para checkout

- [ ] **FE-011:** Criar página /settings
  - Dados da conta
  - Alterar senha
  - Configurações de notificação

### Componentes

- [ ] **FE-012:** Criar componentes reutilizáveis
  - DataTable com paginação
  - MetricCard
  - StatusBadge
  - ConfirmDialog
  - Toast notifications

---

## 🔧 Comandos Úteis

```bash
# Dev server
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npm run type-check
```

---

## ✅ Critérios de Aceite

- [ ] Todas as telas responsivas (mobile-first)
- [ ] Dark mode funcionando
- [ ] Loading states em todas as ações
- [ ] Error handling com feedback visual
- [ ] Lighthouse score > 90

---

## 📝 Notas

- Usar Server Components por padrão
- Client Components apenas para interatividade
- Implementar React Query para cache

---

_Última atualização: 08/01/2026_
