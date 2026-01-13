# 🧪 Guia de Teste - Mercearias Desktop

> **Última Atualização:** 7 de Janeiro de 2026, 22:15  
> **Status:** ✅ Pronto para testar fluxo completo

---

## 🚀 Como Iniciar

```bash
# 1. Ir para o diretório do desktop
cd ~/Mercearias/apps/desktop

# 2. Iniciar o servidor de desenvolvimento
npm run dev

# Aguardar compilação do Rust + Vite
# App abrirá automaticamente em ~30-60 segundos
```text
---

## 👤 Credenciais de Teste

| Funcionário | PIN  | Senha      | Role    | Uso                  |
| ----------- | ---- | ---------- | ------- | -------------------- |
| Admin       | 1234 | admin123   | ADMIN   | Todas as permissões  |
| Gerente     | 9999 | gerente123 | MANAGER | Gerenciar, descontos |
| Operador    | 0000 | -          | CASHIER | PDV, vendas básicas  |

---

## 📋 Fluxo de Teste Completo

### 1️⃣ **Login** (2 min)

1. Aplicação abre na LoginPage
2. Digite PIN: `1234` (Admin)
3. Clique em **Entrar**
4. ✅ Deve redirecionar para Dashboard
## Atalhos:
- Teclado numérico funciona
- `Enter` para confirmar
- `Esc` para limpar
- `Backspace` para apagar

---

### 2️⃣ **Abrir Caixa** (2 min)

1. No Header, clique em **"Caixa Fechado"** ou vá em `/cash`
2. Clique em **"Abrir Caixa"**
3. Defina fundo de troco: `R$ 100,00`
4. Confirme abertura
5. ✅ Status deve mudar para "Caixa Aberto"

---

### 3️⃣ **Fazer uma Venda** (5 min)

1. Vá para **PDV** (menu lateral ou `/pdv`)
2. Busque produto:
   - Digite `7891234567890` ou
   - Busque "Refrigerante Cola 2L"
3. Adicione ao carrinho:
   - Quantidade: `2`
   - Clique em **Adicionar**
4. Adicione mais produtos:
   - "Água Mineral" (código `7891234567891`)
   - Quantidade: `5`
5. Verifique totais no painel direito
6. Clique em **Finalizar Venda (F9)**
7. Modal de Pagamento abre:
   - Forma: **Dinheiro**
   - Valor pago: `R$ 35,00`
   - Troco calculado automaticamente
8. Confirme a venda
9. ✅ Venda deve aparecer no histórico
10. ✅ Estoque deve ser decrementado
## Produtos disponíveis:
```text
MRC-00001 - Refrigerante Cola 2L    - R$ 9,99  (50 un)
MRC-00002 - Água Mineral 500ml      - R$ 2,50  (100 un)
MRC-00003 - Suco de Laranja 1L      - R$ 7,90  (30 un)
MRC-00004 - Leite Integral 1L       - R$ 5,99  (40 un)
MRC-00006 - Iogurte Natural 170g    - R$ 3,49  (25 un)
MRC-00008 - Pão de Forma 500g       - R$ 7,99  (15 un)
MRC-00009 - Arroz Tipo 1 5kg        - R$ 24,90 (20 un)
MRC-00010 - Feijão Carioca 1kg      - R$ 8,99  (35 un)
```text
## Produtos pesáveis (balança):
```text
MRC-00005 - Queijo Mussarela        - R$ 45,90/kg
MRC-00007 - Pão Francês             - R$ 18,90/kg
```text
---

### 4️⃣ **Consultar Vendas** (2 min)

1. Vá para **Relatórios > Vendas** (`/reports/sales`)
2. Filtre vendas de hoje
3. ✅ Venda recém-criada deve aparecer
4. Clique para ver detalhes
5. Verifique:
   - Itens vendidos
   - Forma de pagamento
   - Total e troco

---

### 5️⃣ **Fechar Caixa** (3 min)

1. Vá para **Caixa** (`/cash`)
2. Clique em **"Fechar Caixa"**
3. Modal de fechamento abre:
   - Saldo esperado: calculado automaticamente
   - Informe saldo real: `R$ 120,00`
   - Diferença: calculada automaticamente
4. Adicione observações (opcional)
5. Confirme fechamento
6. ✅ Status muda para "Caixa Fechado"
7. ✅ Sessão salva no histórico

---

### 6️⃣ **Outras Funcionalidades** (Opcional)

#### Cadastrar Produto

1. Vá para **Produtos** (`/products`)
2. Clique em **"+ Novo Produto"**
3. Preencha:
   - Nome: `Café Torrado 500g`
   - Código de Barras: `7891234567899`
   - Categoria: `Mercearia`
   - Preço Venda: `R$ 15,90`
   - Custo: `R$ 10,50`
   - Estoque: `20`
4. Salve
5. ✅ Produto disponível no PDV

#### Entrada de Estoque

1. Vá para **Estoque > Entrada** (`/stock/entry`)
2. Selecione produto
3. Quantidade: `50`
4. Custo: `R$ 6,00`
5. Salve
6. ✅ Estoque atualizado

#### Alertas

1. Header mostra contador de alertas
2. Clique no sino
3. Veja alertas de:
   - Estoque baixo
   - Produtos vencendo
   - Avisos do sistema

---

## ⌨️ Atalhos do PDV

| Tecla | Ação            |
| ----- | --------------- |
| F1    | Buscar produto  |
| F2    | Quantidade      |
| F3    | Desconto        |
| F4    | Remover item    |
| F9    | Finalizar venda |
| Esc   | Cancelar/Voltar |
| Enter | Confirmar       |

---

## ✅ Checklist de Validação

### Backend Rust

- [ ] Aplicação compila sem erros
- [ ] Database conecta (path: `~/.local/share/Mercearias/mercearias.db`)
- [ ] Logs aparecem no console
- [ ] Commands Tauri respondem

### Autenticação

- [ ] Login com PIN 1234 funciona
- [ ] Login com PIN 0000 funciona
- [ ] PIN errado mostra erro
- [ ] Redirect para dashboard após login

### PDV

- [ ] Busca produto por código de barras
- [ ] Busca produto por nome
- [ ] Adiciona produto ao carrinho
- [ ] Remove produto do carrinho
- [ ] Altera quantidade
- [ ] Calcula totais corretamente
- [ ] Modal de pagamento abre
- [ ] Calcula troco automaticamente
- [ ] Venda é salva no banco

### Caixa

- [ ] Abrir caixa com fundo de troco
- [ ] Status atualiza para "Aberto"
- [ ] Vendas são vinculadas à sessão
- [ ] Fechar caixa com conferência
- [ ] Diferença de caixa é calculada
- [ ] Histórico de sessões funciona

### Estoque

- [ ] Estoque decrementa após venda
- [ ] Entrada de estoque funciona
- [ ] Histórico de movimentações aparece

---

## 🐛 Possíveis Problemas

### App não inicia

```bash
# Verificar se o processo está rodando
ps aux | grep tauri

# Matar processos antigos
killall mercearias-desktop

# Recompilar
cd ~/Mercearias/apps/desktop
npm run dev
```text
### Banco não encontrado

```bash
# Verificar se o banco existe
ls -lh ~/.local/share/Mercearias/

# Se não existir, copiar novamente
cp ~/Mercearias/packages/database/prisma/mercearias.db ~/.local/share/Mercearias/
```text
### Erro de autenticação

```bash
# Verificar se o seed foi executado
cd ~/Mercearias/packages/database
npm run db:seed
```text
### Frontend não conecta ao backend

- Verifique console do browser (F12)
- Verifique logs do terminal onde rodou `npm run dev`
- Veja mensagens de erro do Tauri

---

## 📊 Métricas de Sucesso

✅ **Autenticação funcionando**
✅ **Venda completa criada**
✅ **Estoque decrementado**
✅ **Caixa aberto e fechado**
✅ **Dados persistidos no banco**

---

## 🎯 Próximos Passos

Após validação:

- [ ] Implementar RBAC (verificação de permissões)
- [ ] Conectar impressora térmica real
- [ ] Integrar balança física
- [ ] Testes E2E com Playwright
- [ ] Performance testing

---

**Status:** 🟢 Sistema pronto para testes end-to-end!