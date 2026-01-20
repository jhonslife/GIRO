# Auditoria — Parte 2: Qualidade de Código

Resumo

- Objetivo: identificar problemas de estilo, complexidade, code smells e potenciais bugs triviais.

Pontos a checar (manual + automação)

- Linter/formatter: verificar `tsconfig.json`, rules em `package.json` e uso de `eslint`/`prettier`.
- Tipagem: assegurar uso consistente de TypeScript (tipos explícitos, `any` mínimo).
- Complexidade: funções/métodos longos, classes com responsabilidade múltipla.
- Padrões: uso consistente de padrões do projeto (ex.: Repositório para acesso a dados).
- Comentários e TODOs: localizar `TODO`, `FIXME` e comentários que indiquem dívida técnica.

Evidências (onde começar)

- `apps/desktop` — contém vários scripts e testes; iniciar por aqui.
- `packages/` — revisar bibliotecas internas (API surface e typing).

Riscos e impacto

- Código não tipado ou com `any` pode levar a bugs em runtime.
- Complexidade elevada dificulta manutenção e aumenta custo de mudanças.

Recomendações imediatas

- Rodar `pnpm -w eslint "**/*.{ts,tsx,js,jsx}" --fix` (se `eslint` estiver configurado).
- Adicionar/atualizar regras TypeScript `noImplicitAny`, `strict` no `tsconfig.json` se apropriado.
- Identificar funções com > 200 linhas ou alta complexidade ciclomática e refatorar para módulos menores.
- Criar checklist de PR com checagens de lint e tipos obrigatórios.

Sugestão de próxima ação

- Autorização para rodar linters e coletar saída para relatório detalhado.
