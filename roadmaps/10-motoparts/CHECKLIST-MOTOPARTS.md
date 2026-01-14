# CHECKLIST - Módulo Motopeças

Última atualização: 2026-01-14

Objetivo: consolidar o que falta implementar, definir checklists de desenvolvimento e esboçar testes (unitários e E2E).

**Resumo rápido**

- Backend: ✅ modelos e comandos principais implementados (veículos, clientes, OS, garantias).
- Frontend: ✅ principais UIs existentes, faltam alguns formulários e polimento.
- Testes: pendente — precisamos adicionar unit, integração e E2E.

**1) Checklist de Implementação (prioridade alta → baixa)**

- **Backend**:

  - [x] `vehicle`, `customer`, `service_order` models
  - [x] Repositórios principais
  - [x] Comandos Tauri para CRUD e workflow de OS
  - [ ] Garantir transações em operações multi-step (ex.: criar OS + itens)
  - [ ] Cobertura de validações e tratamento de erros (inputs inválidos, FK)

- **Database / Migrations**:

  - [x] tabelas principais (veículos, customers, OS, items, compatibilities)
  - [ ] Migrations e seeds de exemplo para FIPE (brands/models/years)
  - [ ] Índices em campos de busca (plate, cpf, order_number)

- **Frontend**:

  - [x] `VehicleSelector`, `ProductCompatibilityEditor`, `CustomerSearch`
  - [ ] `ServiceOrderForm.tsx` — criação/edição completa (MISSING)
  - [ ] Melhorar validações de formulário (Zod) e mensagens de erro
  - [ ] Integração completa com hooks (`useServiceOrders`, `useServiceOrderItems`)
  - [ ] Acessibilidade e atalhos PDV (F2, F4 etc.)
  - [ ] Impressão de OS em impressora térmica (integração hardware)

- **UX / Polimento**:

  - [ ] Loading states consistentes
  - [ ] Feedback visual em operações longas (save, cálculos)
  - [ ] Mobile responsiveness para telas de oficina

- **Infra / DevOps**:
  - [ ] Pipeline CI executando lint, type-check e testes
  - [ ] Automatizar seed FIPE nas pipelines de testes

**2) Checklist de Testes**

- **Unitários (Vitest)**

  - [ ] Hooks: `useVehicles`, `useCustomers`, `useServiceOrders`, `useServiceOrderItems`
  - [ ] Componentes: `VehicleSelector`, `CustomerSearch`, `ProductCompatibilityEditor`, `ServiceOrderList` (render + interações básicas)
  - [ ] Utils/formatters: `formatCurrency`, cálculos de totais

- **Integração**

  - [ ] Repositórios + DB em memória (sqlite) — criar/recuperar OS com itens
  - [ ] Testar cálculo de totais no backend (soma peças/mão de obra/discount)

- **E2E (Playwright)**

  - [ ] Fluxo: criar cliente → criar OS → adicionar item peça → completar OS → entregar (pagamento)
  - [ ] Fluxo: garantia — abrir reclamação, percorrer estados (Aprovada/Negada/Resolvida)
  - [ ] Busca por veículo/compatibilidade no cadastro de produto

- **QA / Cobertura**
  - [ ] Meta mínima: 80% unit+integration nas áreas críticas (OS, garantias, compatibilidades)

**3) Itens Detectados como "Faltando" (prioridade sugerida)**

1. `ServiceOrderForm.tsx` — implementação completa (ALTA)
2. Seeds/migrations para FIPE (média) — para testes e demos
3. Transações em backend para operações multi-step (alta) — evita inconsistências
4. Testes unitários para hooks principais (alta)
5. Testes E2E para fluxos críticos (alta)
6. Impressão térmica / integração hardware (média)
7. Testes de performance/optimização (baixa)

**4) Critérios de Aceitação (exemplos)**

- Ao criar OS com 2 itens (1 serviço, 1 peça), o backend calcula corretamente `labor_cost`, `parts_cost` e `total` e persiste tudo; unit+integration tests cobrem o caso.
- `VehicleSelector` carrega marcas → modelos → anos com estados de loading e fallback em erro.
- Fluxo E2E cobre a criação e entrega de uma OS com pagamento.

**5) Próximos passos propostos (curto prazo, 1-3 dias)**

1. Adicionar testes unitários esqueleto para `useServiceOrders` e `VehicleSelector` (já criado em `tests/unit/`)
2. Implementar `ServiceOrderForm.tsx` scaffold com Zod e testes de render
3. Criar migrations/seeds FIPE e script de seed para ambiente de dev
4. Configurar pipeline de CI para rodar testes e lint

---

Arquivos adicionados: `roadmaps/10-motoparts/CHECKLIST-MOTOPARTS.md`
Esboços de testes: `tests/unit/motoparts/VehicleSelector.test.tsx`, `tests/e2e/motoparts/ServiceOrderFlow.spec.ts`

Se quiser, já posso implementar o `ServiceOrderForm.tsx` scaffold e adicionar os testes de unidade correspondentes agora.
