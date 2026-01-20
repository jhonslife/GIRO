# Auditoria — Parte 5: Dependências e Licenças

Resumo

- Objetivo: listar dependências principais, checar vulnerabilidades conhecidas e conformidade de licenças.

Pontos de verificação

- Arquivos: `package.json`, `pnpm-lock.yaml`, `apps/*/package.json`.
- Vulnerabilidades: usar `pnpm audit`, `npm audit` ou `retire.js` para bibliotecas frontend/backend.
- Licenças: garantir compatibilidade das licenças de terceiros com a política do projeto (ex.: MIT, Apache, GPL).

Riscos e impacto

- Dependência com vulnerabilidade crítica em produção = risco alto.
- Licenças incompatíveis podem impedir uso em distribuição comercial.

Recomendações imediatas

- Gerar lista de dependências com `pnpm -w list --depth 0`.
- Rodar `pnpm audit --json` e priorizar atualizações com `pnpm up`.
- Revisar pacotes com licenças copyleft (GPL) e documentar implicações.
- Considerar `renovate`/`dependabot` para automação de atualizações seguras.

Próxima ação

- Autorização para executar `pnpm audit` e anexar o JSON resultante a `REPORTS/` para análise detalhada.
