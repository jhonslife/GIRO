# 🏗️ Guia Universal de Estruturação de Projetos de Elite

> **Metodologia:** "Architect First, Code Later"
> **Objetivo:** Garantir 100% de clareza antes de escrever a primeira linha de código.

Este guia documenta o processo para replicar a estrutura de organização de alta performance utilizada no projeto _Beautiful Queen_.

---

## 🚀 O Processo de 3 Etapas

Para garantir o sucesso, não pule etapas. A disciplina na fase de planejamento economiza centenas de horas na fase de execução.

### 1️⃣ Fase 1: Planejamento Total (100%)

Nesta fase, você opera puramente como **Arquiteto de Software**. O objetivo é mapear o território inteiro.
## Entregáveis Obrigatórios:
1.  **Visão do Produto (`00-OVERVIEW.md`)**:
    - O que é o produto?
    - Quem é o público-alvo?
    - Qual o diferencial de mercado?
2.  **Arquitetura (`01-ARQUITETURA.md`)**:
    - Decisões técnicas (Stack, Monorepo vs Microservices).
    - Justificativas do "Porquê" cada tecnologia foi escolhida.
3.  **Modelagem de Dados (`02-DATABASE-SCHEMA.md`)**:
    - Schema completo do banco de dados.
    - Cada tabela, relacionamento e tipo de dado definido.
4.  **Mapeamento de Features (`03-FEATURES-CORE.md`)**:
    - Lista exaustiva de todas as funcionalidades.
    - Regras de neǵocio detalhadas.

> ⚠️ **Regra de Ouro:** Não comece a estruturar pastas até que o Schema do Banco e as Features estejam 100% definidos no papel.

### 2️⃣ Fase 2: Estrutura & Dados

Aqui você transforma o plano abstrato em uma estrutura de diretórios física e navegável.
## A Árvore de Documentação (`docs/`):
Crie uma estrutura que reflita a complexidade do domínio.

```text
docs/
├── procedimentos/ (ou domínio específico)
├── cliente/
├── negocio/
└── runbooks/
```text
## A Árvore de Roadmaps (`roadmaps/`):
Divida o trabalho em "Agentes Especialistas". Em vez de um backlog gigante, crie filas de trabalho focadas.

- **01-database**: Apenas migrations e seeds.
- **02-backend**: Apenas APIs e Services.
- **03-frontend**: Apenas UI e Pages.
- **04-auth**: Segurança e Permissões.
- **05-integrations**: Pagamentos, Mensageria, APIs externas.
- **06-testing**: QA e Testes Automatizados.
- **07-devops**: CI/CD e Infra.
- **08-design**: Design System e Tokens.

### 3️⃣ Fase 3: O Processo de Construção (Roadmaps)

A execução deve ser cirúrgica. Utilize o arquivo `STATUS.md` como seu centro de comando.
## Regras de Construção:
1.  **Profundidade Idêntica:** Cada roadmap deve ter tasks granulares.
    - _Errado:_ "Fazer tela de login"
    - _Certo:_ "Criar componente Input", "Criar componente Button", "Integrar API Login", "Tratar erros de validação".
2.  **Dashboard Central (`STATUS.md`):**
    - Deve conter um "Flight Panel" visual.
    - Deve mostrar dependências (ex: Database bloqueia Backend).
    - Deve ter métricas claras de progresso.

---

## 🧬 Anatomia da Estrutura de Pastas

Sempre inicie seus projetos com esta estrutura base:

```bash
PROJETO_RAIZ/
├── docs/                 # O Cérebro do projeto (Planejamento)
│   ├── 00-OVERVIEW.md
│   ├── 01-ARQUITETURA.md
│   ├── 02-DATABASE-SCHEMA.md
│   └── ...
├── roadmaps/             # O Coração do projeto (Execução)
│   ├── STATUS.md         # Dashboard Geral
│   ├── 01-database/
│   ├── 02-backend/
│   └── ...
└── src/                  # O Corpo do projeto (Código)
```text
## 📝 Checklist de Iniciação

- [ ] Definir a "Grande Ideia" e o Problema a ser resolvido.
- [ ] Criar a pasta `docs` e preencher os 4 documentos core.
- [ ] Criar a pasta `roadmaps` e as subpastas dos 8 Agentes.
- [ ] Criar o `STATUS.md` copiando o template mestre.
- [ ] Quebrar o projeto inteiro em tasks dentro de cada `roadmaps/XX-agent/ROADMAP.md`.
- [ ] **Aprovar o Plano:** Só inicie o código após revisar se todas as tasks cobrem 100% das features desenhadas.

---

_Este guia garante que qualquer projeto, independente do tamanho, mantenha a qualidade e organização de nível enterprise._