# Auditoria — Parte 3: Testes e Cobertura

Resumo

- Objetivo: validar existência, qualidade e cobertura dos testes unitários, integração e e2e.

Checks iniciais

- Localizar runners e configs: `playwright.config.ts`, `tests/`, scripts em `package.json` e `apps/desktop` test outputs.
- Cobertura: revisar relatórios em `apps/desktop/coverage*` e arquivos `coverage_report.txt` já presentes.
- Flaky tests: identificar testes marcados como instáveis nos logs (`test_output*.txt`).

Evidências encontradas

- O repositório contém múltiplos arquivos de saída de teste (`test_output*.txt`) e relatórios finais — útil para análise histórica.

Riscos e impacto

- Baixa cobertura em módulos críticos (pagamentos, estoque) aumenta risco em produção.
- Tests flaky = deploys instáveis e confiança reduzida.

Recomendações imediatas

- Rodar: `pnpm -w test` (ou script equivalente) para obter estado atual; coletar relatório de cobertura em LCOV/HTML.
- Priorizar testes para fluxos críticos: checkout, pagamentos, inventário, sincronização.
- Usar `--runInBand`/isolamento para investigar flaky tests.

Métrica alvo sugerida

- Cobertura mínima global: 80% (ajustar por criticidade de pastas).

Próxima ação proposta

- Permissão para executar a suíte de testes e anexar relatórios gerados ao `REPORTS/`.
