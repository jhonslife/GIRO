# Auditoria — Parte 7: Recomendações Consolidadas

Resumo executivo (ações de alto impacto)

1. Segurança: rodar `pnpm audit` e scan de segredos imediatamente; bloquear chaves expostas e rotacionar credenciais se necessário.
2. Pipeline: configurar CI com lint, type-check, tests e cobertura; tornar esses checks obrigatórios em PRs.
3. Dependências: aplicar atualizações seguras e automatizar com `dependabot`/`renovate`.
4. Qualidade de código: ativar `eslint`/`prettier` e reforçar regras TypeScript `strict`.
5. Testes: priorizar cobertura dos fluxos críticos (pagamentos, estoque), eliminar flaky tests.

Plano de execução em 30/60/90 dias

- 0–30 dias: rodar scans (audit + secrets), fixar vulnerabilidades críticas, adicionar CI básica.
- 30–60 dias: aplicar melhorias de lint/typing; aumentar cobertura em módulos críticos.
- 60–90 dias: refatorar hotspots, automatizar dependabot, revisar performance e observabilidade.

Métricas de sucesso

- Nenhuma vulnerabilidade crítica sem mitigação em produção.
- Cobertura global >= 80% e cobertura crítica 90%.
- Pipeline CI verde em 95% dos PRs.

Próximas ações que posso executar agora (preciso de autorização)

- Rodar `pnpm audit` e anexar resultado em `REPORTS/`.
- Executar `pnpm -w eslint "**/*.{ts,tsx,js,jsx}" --fix` e salvar saída.
- Rodar a suíte de testes e gerar `lcov`/HTML.

Deseja que eu execute alguma destas ações agora? (Indique quais e se tenho permissão para rodar comandos no workspace.)

---

(Data: 20/01/2026)
