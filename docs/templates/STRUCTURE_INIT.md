# 🤖 Prompt Mestre de Inicialização de Estrutura

> **Instrução de Uso:** Copie e cole este prompt para iniciar um novo projeto com a estrutura "Beautiful Queen Standard".

---

**[PASTE THIS TO YOUR AI ASSISTANT]**

Atue como um **Senior Principal Architect**. Vamos iniciar um novo projeto chamado `[NOME_DO_PROJETO]` e preciso que você configure a estrutura completa seguindo a metodologia **"Deep Planning & 8 Agents"**.

O projeto é: `[DESCREVA SEU PROJETO AQUI]`

### 1. Execute o Planejamento Inicial (Docs)

Crie a estrutura de diretórios `docs/` e gere os seguintes arquivos markdown detalhados (não use placeholders, use sua criatividade técnica para preencher baseado na descrição do projeto):

- `docs/00-OVERVIEW.md`: Visão do produto, análise de mercado e diferenciais.
- `docs/01-ARQUITETURA.md`: Stack recomendada (Next.js, Python, etc), decisões de monorepo/microservices.
- `docs/02-DATABASE-SCHEMA.md`: Schema SQL/Prisma completo e relacional.
- `docs/03-FEATURES-CORE.md`: Lista detalhada de funcionalidades funcionais e não-funcionais.

### 2. Crie a Estrutura de Roadmaps

Crie o diretório `roadmaps/` com as seguintes subpastas para simular agentes especializados:

- `01-database`
- `02-backend`
- `03-frontend`
- `04-auth`
- `05-integrations`
- `06-testing`
- `07-devops`
- `08-design`

### 3. Gere o Dashboard Mestre (`STATUS.md`)

Na raiz de `roadmaps/`, crie o arquivo `STATUS.md` contendo:

- Um dashboard ASCII visual mostrando o status dos 8 agentes.
- Uma tabela de progresso.
- Um gráfico ASCII de dependências (Ex: Database -> Backend -> Frontend).

### 4. Popule os Roadmaps Individuais

Para CADA subpasta em `roadmaps/` (ex: `01-database`), crie um arquivo `ROADMAP.md` que contenha um checklist detalhado de tarefas para aquele domínio específico.

- **Regra:** As tarefas devem cobrir 100% do escopo definido em `docs/`.
- **Formato:** Use `[ ]` para tarefas a fazer.
- **Granularidade:** Seja específico (ex: "Criar tabela Users", "Configurar Jest", "Criar Componente Navbar").

### 5. Finalização

Ao final, me apresente o `tree` da estrutura criada e pergunte qual área devo aprovar primeiro para iniciarmos a "Fase de Construção".

---

**FIM DO PROMPT**
