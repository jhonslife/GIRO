# 🚀 Deploy Railway - Fluxograma

## 📊 Visão Geral do Processo

```mermaid
flowchart TD
    A[Início] --> B{Railway CLI\nInstalado?}
    B -->|Não| C[Instalar Railway CLI]
    B -->|Sim| D[Login no Railway]
    C --> D

    D --> E{Projeto\nExiste?}
    E -->|Sim| F[Link Projeto]
    E -->|Não| G[Criar Projeto]
    G --> F

    F --> H[Verificar Serviços]

    H --> I{PostgreSQL\nExiste?}
    I -->|Não| J[Criar PostgreSQL]
    I -->|Sim| K{Redis\nExiste?}
    J --> K

    K -->|Não| L[Criar Redis]
    K -->|Sim| M[Criar Serviço Backend]
    L --> M

    M --> N[Configurar Variáveis\nde Ambiente]

    N --> O[Linkar\nDatabase + Redis]

    O --> P[Deploy]

    P --> Q{Build\nSucesso?}

    Q -->|Não| R[Ver Logs de Erro]
    R --> S[Corrigir]
    S --> P

    Q -->|Sim| T[Executar Migrations]

    T --> U{Migrations\nOK?}

    U -->|Não| V[Verificar DATABASE_URL]
    V --> T

    U -->|Sim| W[Testar Health Check]

    W --> X{Health\nOK?}

    X -->|Não| Y[Ver Logs]
    Y --> Z[Debug]
    Z --> P

    X -->|Sim| AA[Testar Endpoints]

    AA --> AB{Testes\nOK?}

    AB -->|Não| AC[Debug Issues]
    AC --> P

    AB -->|Sim| AD[🎉 Deploy Completo!]

    AD --> AE[Configurar\nDomain Custom]
    AD --> AF[Setup CI/CD]
    AD --> AG[Monitoring]

    style A fill:#e1f5ff
    style AD fill:#c8e6c9
    style Q fill:#fff9c4
    style X fill:#fff9c4
    style AB fill:#fff9c4
```

---

## 🎯 Decisões Principais

### 1️⃣ Método de Deploy

```mermaid
flowchart LR
    A[Escolher Método] --> B[Dashboard UI]
    A --> C[CLI Automático]
    A --> D[CLI Manual]

    B --> B1[Mais Visual]
    B --> B2[Melhor para Iniciantes]

    C --> C1[Mais Rápido]
    C --> C2[Scriptável]

    D --> D1[Controle Total]
    D --> D2[Para Avançados]

    style B fill:#e1f5ff
    style C fill:#fff9c4
    style D fill:#ffe0b2
```

**Recomendação:** Use **Dashboard** se é sua primeira vez, **CLI Automático** para velocidade.

---

### 2️⃣ Estrutura de Serviços

```mermaid
graph TB
    subgraph Railway Project
        A[Backend Service]
        B[PostgreSQL]
        C[Redis]
    end

    A -->|DATABASE_URL| B
    A -->|REDIS_URL| C

    B -.->|Auto-injected| A
    C -.->|Auto-injected| A

    A -->|Expose| D[Public URL]

    style A fill:#4CAF50
    style B fill:#2196F3
    style C fill:#FF5722
    style D fill:#FFC107
```

**Importante:** DATABASE_URL e REDIS_URL são **injetados automaticamente** quando você linka os serviços!

---

### 3️⃣ Fluxo de Variáveis de Ambiente

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CLI as Railway CLI
    participant Railway as Railway API
    participant Backend as Backend Service

    Dev->>CLI: railway variables set APP_SECRET=xxx
    CLI->>Railway: POST /variables
    Railway->>Railway: Encrypt & Store
    Railway-->>CLI: ✅ Variable set

    Dev->>CLI: railway up
    CLI->>Railway: Deploy request
    Railway->>Backend: Inject env vars
    Railway->>Backend: Inject DATABASE_URL
    Railway->>Backend: Inject REDIS_URL
    Backend->>Backend: Start with all vars
    Backend-->>Railway: ✅ Healthy
    Railway-->>Dev: 🎉 Deployed
```

---

### 4️⃣ Build Process

```mermaid
flowchart TD
    A[railway up] --> B[Upload Code]

    B --> C[Detect Dockerfile]

    C --> D[Build Stage 1:\nCompile Rust]

    D --> E{Build\nSuccess?}

    E -->|No| F[Show Error Logs]
    F --> G[Fix & Retry]
    G --> B

    E -->|Yes| H[Build Stage 2:\nProduction Image]

    H --> I[Copy Binary]
    I --> J[Copy Migrations]

    J --> K[Create Container]

    K --> L[Inject Env Vars]

    L --> M[Start Service]

    M --> N{Health Check\nPass?}

    N -->|No| O[Rollback]
    N -->|Yes| P[Route Traffic]

    P --> Q[🚀 Live!]

    style D fill:#bbdefb
    style H fill:#c8e6c9
    style Q fill:#a5d6a7
```

---

## ⚡ Quick Reference

### Via Dashboard (5 min)

```
1. Acesse https://railway.app
2. Abra projeto: refreshing-creation
3. Add Database > PostgreSQL
4. Add Database > Redis
5. New > GitHub Repo > jhonslife/Mercearias
   - Root: giro-license-server
   - Dockerfile: backend/Dockerfile
6. Link serviços (PostgreSQL + Redis ao Backend)
7. Configure variáveis (ver DEPLOY-MANUAL.md)
8. Deploy automático inicia
9. Aguarde build (~5-10 min)
10. ✅ Done!
```

### Via CLI (1 comando)

```bash
./deploy-railway.sh
# Responda os prompts
# ✅ Done!
```

---

## 🔍 Troubleshooting Flow

```mermaid
flowchart TD
    A[Erro no Deploy] --> B{Tipo de Erro?}

    B -->|Build Failed| C[Ver Logs de Build]
    C --> C1[Rust Compile Error?]
    C --> C2[Dependency Error?]
    C1 --> C1A[Corrigir código]
    C2 --> C2A[Atualizar Cargo.toml]

    B -->|Deploy Failed| D[Ver Logs de Deploy]
    D --> D1[Connection Error?]
    D --> D2[Health Check Failed?]
    D1 --> D1A[Verificar DATABASE_URL]
    D2 --> D2A[Verificar /health endpoint]

    B -->|Runtime Error| E[Ver Logs de Runtime]
    E --> E1[Database Connection?]
    E --> E2[Redis Connection?]
    E --> E3[Port Binding?]
    E1 --> E1A[Check DATABASE_URL]
    E2 --> E2A[Check REDIS_URL]
    E3 --> E3A[Ensure PORT=3000]

    style C1A fill:#c8e6c9
    style C2A fill:#c8e6c9
    style D1A fill:#c8e6c9
    style D2A fill:#c8e6c9
    style E1A fill:#c8e6c9
    style E2A fill:#c8e6c9
    style E3A fill:#c8e6c9
```

### Comandos de Debug

```bash
# Ver logs em tempo real
railway logs --follow

# Ver status completo
railway status --json | jq

# Testar conexão do PostgreSQL
railway run --service postgres psql -c "SELECT 1"

# Testar conexão do Redis
railway run --service redis redis-cli ping

# Ver todas as variáveis
railway variables

# Rebuild forçado
railway up --force
```

---

## 📋 Checklist Visual

### Pré-Deploy

- [ ] Railway CLI instalado
- [ ] Autenticado (`railway whoami`)
- [ ] Dockerfile testado localmente
- [ ] Migrations funcionando local
- [ ] .env.example atualizado

### Setup Railway

- [ ] Projeto criado/linkado
- [ ] PostgreSQL provisionado
- [ ] Redis provisionado
- [ ] Backend service criado
- [ ] Serviços linkados

### Configuração

- [ ] APP_SECRET gerado
- [ ] JWT_SECRET gerado
- [ ] Todas as env vars setadas
- [ ] DATABASE_URL auto-injetado
- [ ] REDIS_URL auto-injetado

### Deploy

- [ ] Build completo (sem erros)
- [ ] Container iniciado
- [ ] Health check OK
- [ ] Migrations executadas
- [ ] Endpoints testados

### Pós-Deploy

- [ ] URL pública funcionando
- [ ] Primeiro admin criado
- [ ] Login testado
- [ ] Domain custom (opcional)
- [ ] CI/CD configurado
- [ ] Monitoring ativo

---

## 🎯 Arquitetura Final

```
┌─────────────────────────────────────────────────┐
│           Railway Cloud (us-west1)               │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────────┐     ┌──────────────────┐  │
│  │   PostgreSQL    │◄────│  Backend Service │  │
│  │   (Database)    │     │  (Rust + Axum)   │  │
│  │                 │     │                  │  │
│  │  Port: Internal │     │  Port: 3000      │  │
│  └─────────────────┘     │                  │  │
│                          │  PUBLIC_URL ──────┼──┼──► Internet
│  ┌─────────────────┐     │                  │  │
│  │      Redis      │◄────│  Dockerfile:     │  │
│  │    (Cache)      │     │  backend/...     │  │
│  │                 │     └──────────────────┘  │
│  │  Port: Internal │                           │
│  └─────────────────┘                           │
│                                                 │
│  Environment Variables (Encrypted):             │
│  • DATABASE_URL (auto)                          │
│  • REDIS_URL (auto)                             │
│  • APP_SECRET                                   │
│  • JWT_SECRET                                   │
│  • ... (todas as outras)                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

**Pronto para deploy! Escolha seu caminho e vamos lá! 🚀**
