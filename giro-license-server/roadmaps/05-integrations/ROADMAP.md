# 🔌 Integrations Roadmap - GIRO License Server

> **Agente:** Integrations  
> **Sprint:** 3  
> **Dependências:** Backend, Auth  
> **Desbloqueia:** -

---

## 📊 Progresso

```
[⬜⬜⬜⬜⬜⬜⬜⬜] 0/8 tasks (0%)
```

---

## 📋 Tasks

### Stripe (Pagamentos)

- [ ] **INT-001:** Configurar Stripe SDK

  - Adicionar stripe-rust
  - Configurar API keys
  - Criar cliente Stripe

- [ ] **INT-002:** Implementar checkout

  - Criar Stripe Checkout Session
  - Configurar produtos/preços
  - Redirect após sucesso

- [ ] **INT-003:** Implementar webhooks

  - Endpoint POST /payments/webhook
  - Validar signature
  - Processar eventos:
    - checkout.session.completed
    - invoice.paid
    - customer.subscription.deleted

- [ ] **INT-004:** Implementar gestão de assinaturas
  - Criar subscription
  - Cancelar subscription
  - Atualizar quantidade de licenças

### Email (Resend)

- [ ] **INT-005:** Configurar Resend SDK

  - Adicionar client HTTP
  - Configurar API key
  - Templates base

- [ ] **INT-006:** Implementar emails transacionais
  - Boas-vindas
  - Verificação de email
  - Reset de senha
  - Confirmação de pagamento
  - Alerta de licença expirando

### Notificações

- [ ] **INT-007:** Implementar Web Push

  - Gerar VAPID keys
  - Endpoint de subscription
  - Enviar notificações

- [ ] **INT-008:** Implementar alertas internos
  - Estoque baixo (do Desktop)
  - Validade crítica (do Desktop)
  - Licença expirando

---

## 🔧 Configuração Stripe

```bash
# Produtos a criar no Stripe Dashboard
- GIRO Pro Mensal (R$ 99,90)
- GIRO Pro Semestral (R$ 599,40 - 14% off)
- GIRO Pro Anual (R$ 999,00 - 17% off)
```

### Webhook Events

| Evento                          | Ação               |
| ------------------------------- | ------------------ |
| `checkout.session.completed`    | Criar licença(s)   |
| `invoice.paid`                  | Renovar licença(s) |
| `invoice.payment_failed`        | Notificar admin    |
| `customer.subscription.deleted` | Expirar licenças   |

---

## ✅ Critérios de Aceite

- [ ] Checkout Stripe funciona end-to-end
- [ ] Webhooks processam todos os eventos
- [ ] Emails são enviados corretamente
- [ ] Licenças são criadas após pagamento
- [ ] Notificações push funcionam no browser

---

## 📝 Notas

- Usar modo de teste do Stripe durante dev
- Implementar retry em webhooks que falham
- Logs detalhados de todas as transações

---

_Última atualização: 08/01/2026_
