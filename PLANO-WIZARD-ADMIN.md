# 🔧 Plano de Implementação - Wizard de Primeiro Admin

> **Prioridade**: 🔴 CRÍTICO para produção  
> **Estimativa**: 2-3 horas  
> **Status**: 📋 Pendente

---

## 🎯 Objetivo

Implementar um wizard que permita ao usuário criar o primeiro administrador durante a instalação/primeiro acesso, eliminando a necessidade de um admin padrão com PIN conhecido.

---

## 📋 Tarefas

### 1. Backend Rust ✅ (Já existe parcialmente)

#### 1.1 Verificar se Existe Admin

**Arquivo**: `apps/desktop/src-tauri/src/commands/employees.rs`

```rust
#[tauri::command]
pub async fn has_admin(state: State<'_, AppState>) -> AppResult<bool> {
    let repo = EmployeeRepository::new(&state.pool);

    let count = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM employees WHERE role = 'ADMIN' AND is_active = 1"
    )
    .fetch_one(&state.pool)
    .await?;

    Ok(count > 0)
}
```text
#### 1.2 Criar Primeiro Admin

**Arquivo**: `apps/desktop/src-tauri/src/commands/employees.rs`

```rust
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateFirstAdminInput {
    pub name: String,
    pub email: Option<String>,
    pub pin: String,
}

#[tauri::command]
pub async fn create_first_admin(
    input: CreateFirstAdminInput,
    state: State<'_, AppState>,
) -> AppResult<SafeEmployee> {
    let repo = EmployeeRepository::new(&state.pool);

    // Verificar se já existe admin
    let count = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM employees WHERE role = 'ADMIN'"
    )
    .fetch_one(&state.pool)
    .await?;

    if count > 0 {
        return Err(AppError::BadRequest(
            "Já existe um administrador cadastrado".to_string()
        ));
    }

    // Validar PIN
    if input.pin.len() < 4 || input.pin.len() > 6 {
        return Err(AppError::ValidationError(
            "PIN deve ter entre 4 e 6 dígitos".to_string()
        ));
    }

    if !input.pin.chars().all(|c| c.is_ascii_digit()) {
        return Err(AppError::ValidationError(
            "PIN deve conter apenas números".to_string()
        ));
    }

    // Criar admin
    let employee = repo.create(CreateEmployee {
        name: input.name,
        email: input.email,
        cpf: None,
        phone: None,
        pin: input.pin,
        password: None,
        role: Some(EmployeeRole::Admin),
        is_active: Some(true),
    }).await?;

    Ok(SafeEmployee::from(employee))
}
```text
#### 1.3 Registrar Commands

**Arquivo**: `apps/desktop/src-tauri/src/main.rs`

```rust
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // ... existing commands
            has_admin,
            create_first_admin,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```text
---

### 2. Frontend React

#### 2.1 Hook useSetup

**Arquivo**: `apps/desktop/src/hooks/useSetup.ts`

```typescript
import { invoke } from '@/lib/tauri';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Employee } from '@/types';

interface CreateFirstAdminInput {
  name: string;
  email?: string;
  pin: string;
}

export function useHasAdmin() {
  return useQuery({
    queryKey: ['has-admin'],
    queryFn: async () => {
      return await invoke<boolean>('has_admin');
    },
  });
}

export function useCreateFirstAdmin() {
  return useMutation({
    mutationFn: async (input: CreateFirstAdminInput) => {
      return await invoke<Employee>('create_first_admin', { input });
    },
  });
}
```text
#### 2.2 Componente FirstAdminWizard

**Arquivo**: `apps/desktop/src/components/setup/FirstAdminWizard.tsx`

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCreateFirstAdmin } from '@/hooks/useSetup';
import { useAuthStore } from '@/stores/auth-store';
import { Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function FirstAdminWizard() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const createAdmin = useCreateFirstAdmin();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateRandomPin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPin(randomPin);
    setConfirmPin(randomPin);
    toast({
      title: 'PIN Gerado',
      description: `PIN: ${randomPin}`,
      duration: 10000,
    });
  };

  const handleNext = () => {
    if (!name || name.length < 3) {
      toast({
        title: 'Nome inválido',
        description: 'Digite um nome com pelo menos 3 caracteres',
        variant: 'destructive',
      });
      return;
    }
    setStep(2);
  };

  const handleCreate = async () => {
    if (pin !== confirmPin) {
      toast({
        title: 'PINs não conferem',
        description: 'Digite o mesmo PIN nos dois campos',
        variant: 'destructive',
      });
      return;
    }

    if (pin.length < 4 || pin.length > 6) {
      toast({
        title: 'PIN inválido',
        description: 'O PIN deve ter entre 4 e 6 dígitos',
        variant: 'destructive',
      });
      return;
    }

    try {
      const admin = await createAdmin.mutateAsync({
        name,
        email: email || undefined,
        pin,
      });

      // Auto-login
      login({
        id: admin.id,
        name: admin.name,
        role: 'ADMIN',
        email: admin.email,
        pin,
      });

      toast({
        title: 'Administrador criado!',
        description: 'Você já está logado. Configure seu negócio.',
      });

      navigate('/wizard'); // Wizard de perfil de negócio
    } catch (error) {
      toast({
        title: 'Erro ao criar administrador',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {step === 1 ? 'Criar Primeiro Administrador' : 'Escolha um PIN de Acesso'}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {step === 1
              ? 'Você terá acesso total ao sistema'
              : 'Este PIN será usado para fazer login'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo *</label>
                <Input
                  placeholder="Ex: João da Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email (opcional)</label>
                <Input
                  type="email"
                  placeholder="Ex: joao@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleNext} disabled={!name || name.length < 3}>
                Próximo →
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">PIN de Acesso (4-6 dígitos) *</label>
                <Input
                  type="password"
                  inputMode="numeric"
                  placeholder="Digite seu PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirme o PIN *</label>
                <Input
                  type="password"
                  inputMode="numeric"
                  placeholder="Digite novamente"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </div>

              <Button variant="outline" className="w-full" onClick={generateRandomPin}>
                🎲 Gerar PIN Aleatório
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  ← Voltar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreate}
                  disabled={!pin || !confirmPin || pin !== confirmPin || createAdmin.isPending}
                >
                  {createAdmin.isPending ? 'Criando...' : '✅ Criar Administrador'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```text
#### 2.3 Atualizar App.tsx

**Arquivo**: `apps/desktop/src/App.tsx`

```tsx
import { FirstAdminWizard } from '@/components/setup/FirstAdminWizard';
import { useHasAdmin } from '@/hooks/useSetup';

// Componente que verifica se precisa criar admin
const AdminCheck: FC = () => {
  const { data: hasAdmin, isLoading } = useHasAdmin();
  const { isAuthenticated } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Se não tem admin e não está autenticado, mostra wizard
  if (!hasAdmin && !isAuthenticated) {
    return <FirstAdminWizard />;
  }

  // Se tem admin mas não está autenticado, vai para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado, redireciona normalmente
  return <Navigate to="/" replace />;
};

const App: FC = () => {
  return (
    <Routes>
      {/* Rota inicial - verifica se precisa criar admin */}
      <Route index element={<AdminCheck />} />

      {/* Login (só se já tem admin) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Resto das rotas... */}
    </Routes>
  );
};
```text
---

### 3. Remover Admin do Seed

**Arquivo**: `apps/desktop/src-tauri/seed.sql`

```sql
-- Seed de dados para desenvolvimento/testes
-- ⚠️ ESTE ARQUIVO É APENAS PARA DESENVOLVIMENTO
-- NÃO SERÁ EXECUTADO EM PRODUÇÃO

-- ❌ COMENTAR/REMOVER ESTA LINHA EM PRODUÇÃO:
-- INSERT INTO employees (id, name, email, role, pin, is_active) VALUES
--   ('emp-admin-001', 'Admin Sistema', 'admin@giro.com', 'ADMIN', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 1);

-- OU criar variável de ambiente para controlar:
-- Se DEV_MODE=true, insere admin padrão
-- Se DEV_MODE=false (produção), não insere
```text
**Alternativa**: Controlar via flag de ambiente

```rust
// src-tauri/src/main.rs

#[cfg(debug_assertions)]
async fn seed_database(pool: &SqlitePool) {
    // Apenas em modo debug
    sqlx::query(include_str!("../seed.sql"))
        .execute(pool)
        .await
        .ok();
}

#[cfg(not(debug_assertions))]
async fn seed_database(_pool: &SqlitePool) {
    // Em produção, não executa seed
}
```text
---

## 🧪 Testes

### Teste 1: Primeira Instalação

```text
1. Instalar app em máquina limpa
2. Abrir aplicação
3. Verificar: Wizard de criação de admin aparece
4. Preencher: Nome = "Admin Teste", Email = "admin@test.com"
5. Escolher: PIN = "123456"
6. Confirmar PIN
7. Clicar: "Criar Administrador"
8. Verificar: Redirecionamento para wizard de perfil
9. Selecionar perfil
10. Verificar: Dashboard aberto
```text
### Teste 2: Segundo Acesso

```text
1. Fechar aplicação
2. Reabrir aplicação
3. Verificar: Tela de login (não wizard de admin)
4. Digitar PIN: "123456"
5. Verificar: Login bem-sucedido
```text
### Teste 3: Gerar PIN Aleatório

```text
1. No wizard de admin, step 2
2. Clicar: "Gerar PIN Aleatório"
3. Verificar: PIN de 6 dígitos aparece
4. Verificar: Toast com PIN exibido
5. Verificar: Campos PIN e Confirmar PIN preenchidos
```text
### Teste 4: Validações

```text
# Nome vazio
1. Deixar nome em branco
2. Clicar "Próximo"
3. Verificar: Erro "Nome inválido"

# PINs diferentes
1. PIN = "1234"
2. Confirmar PIN = "5678"
3. Clicar "Criar"
4. Verificar: Erro "PINs não conferem"

# PIN curto
1. PIN = "12"
2. Clicar "Criar"
3. Verificar: Erro "PIN deve ter entre 4 e 6 dígitos"
```text
---

## 📦 Arquivos a Criar/Modificar

### Criar

- [ ] `apps/desktop/src/components/setup/FirstAdminWizard.tsx`
- [ ] `apps/desktop/src/hooks/useSetup.ts`
- [ ] `apps/desktop/src/pages/setup/LoadingScreen.tsx` (opcional)

### Modificar

- [ ] `apps/desktop/src-tauri/src/commands/employees.rs` (+2 commands)
- [ ] `apps/desktop/src-tauri/src/main.rs` (registrar commands)
- [ ] `apps/desktop/src/App.tsx` (adicionar AdminCheck)
- [ ] `apps/desktop/src-tauri/seed.sql` (comentar admin padrão)

---

## ⏱️ Estimativa de Tempo

| Tarefa              | Tempo        |
| ------------------- | ------------ |
| Backend (commands)  | 30 min       |
| Hook (useSetup)     | 15 min       |
| FirstAdminWizard UI | 60 min       |
| App.tsx integration | 20 min       |
| Remover seed        | 5 min        |
| Testes              | 30 min       |
| **TOTAL**           | **2h 40min** |

---

## ✅ Critérios de Aceitação

- [ ] Em instalação limpa, mostra wizard de admin
- [ ] Valida nome (mín 3 caracteres)
- [ ] Valida PIN (4-6 dígitos, apenas números)
- [ ] Confirma PIN (deve ser igual)
- [ ] Gera PIN aleatório funcionando
- [ ] Auto-login após criar admin
- [ ] Redirecionamento para wizard de perfil
- [ ] Não permite criar segundo admin
- [ ] Seed não insere admin em produção
- [ ] Todos os testes passando

---

## 🚀 Depois de Implementar

1. ✅ Executar `./build-production.sh`
2. ✅ Testar instalador em máquina limpa
3. ✅ Validar fluxo completo
4. ✅ Gerar release notes
5. ✅ Distribuir instalador

---

**Prioridade**: 🔴 CRÍTICO  
**Bloqueador**: Sim (para produção)  
**Responsável**: Dev Team  
**Prazo**: Antes do primeiro build de produção