# Resumo pós-install / pnpm audit (20/01/2026)

Contexto

- Aplicados `pnpm.overrides` para `tar@^7.5.3` e `esbuild@>=0.25.0` conforme relatório inicial.
- Fiz backup do lockfile em `REPORTS/pnpm-lock.yaml.bak-20260120-150052`.
- Rodei `pnpm install --no-frozen-lockfile` e `pnpm audit` para obter o estado atual.

Resumo de vulnerabilidades atuais

- Total dependências: 805
- Vulnerabilidades: 2 moderate, 2 moderate (repeated?), 2 low, 1 critical (detalhes abaixo)

Achados notáveis

1. `micromatch` — Moderate (CVE-2024-4067)

- Caminho: `. > lint-staged > micromatch`
- Versões vulneráveis: <4.0.8
- Recomendação: atualizar `micromatch` para >= 4.0.8. Como é transitive via `lint-staged`, atualizar `lint-staged` ou forçar override:
  - `pnpm -w up lint-staged@latest` ou
  - adicionar em `pnpm.overrides`: `"micromatch": "^4.0.8"`.

2. `koa` — Critical / Moderate (vários advisories, CVE-2025-25200 / CVE-2025-32379 / etc.)

- Caminhos: `.>trufflehog>koa`
- Versões vulneráveis: <2.15.4 / <2.16.2 (dependendo da advisory)
- Recomendação: atualizar `koa` para >=2.16.2. Como é trazido por `trufflehog`, opções:
  - remover/alternar `trufflehog` do `devDependencies` e usar como CLI isolado (npx) em CI
  - forçar `pnpm.overrides` para `koa@^2.16.2` e validar em CI

3. `tmp` — Low (CVE-2025-54798)

- Caminhos: `.>trufflehog>inquirer>external-editor>tmp`
- Versões vulneráveis: <=0.2.3
- Recomendação: forçar `tmp@>=0.2.4` via override ou atualizar packages que dependem dele.

Observação sobre `trufflehog`

- Ao corrigir o `trufflehog` devDependency para uma release disponível (`0.0.5`) permitimos a instalação, mas ele traz `koa`, `inquirer`, `micromatch` e `tmp` vulneráveis.
- Para evitar poluir a árvore de dependências de desenvolvimento, recomendo remover `trufflehog` de `devDependencies` e executar-o via `npx trufflehog@latest ...` ou em um container separado na CI (isso reduz o impacto de vulnerabilidades transitivas no dev environment).

Recomendações imediatas (ordem sugerida)

1. Forçar `tar` e `esbuild` (já aplicados via `pnpm.overrides`).
2. Mitigar `koa`, `micromatch` e `tmp`:
   - Opção A (rápida): adicionar overrides em `package.json`:

```json
"pnpm": {
  "overrides": {
    "tar": "^7.5.3",
    "esbuild": ">=0.25.0",
    "koa": ">=2.16.2",
    "micromatch": ">=4.0.8",
    "tmp": ">=0.2.4"
  }
}
```

- Opção B (limpa): remover `trufflehog` de `devDependencies` e usar `npx trufflehog` apenas quando necessário.

3. Rodar a suíte de testes e pipelines CI para validar que as mudanças não introduziram regressões (especialmente para pacotes nativos como `argon2`).

Próximas ações que posso executar agora (preciso de autorização)

- Aplicar overrides adicionais (`koa`, `micromatch`, `tmp`) e rodar `pnpm install` + `pnpm audit` novamente.
- Remover `trufflehog` de `devDependencies` e reexecutar install.
- Rodar a suíte de testes (`pnpm -w test`) e gerar cobertura.
- Executar scan de segredos com `npx trufflehog` ou `gitleaks` (se desejar).

Qual ação você prefere que eu execute a seguir? (Aplicar overrides, remover `trufflehog`, executar testes, ou gerar PRs com recomendações.)
