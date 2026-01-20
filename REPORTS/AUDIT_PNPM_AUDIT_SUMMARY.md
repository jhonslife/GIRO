# Resumo: `pnpm audit` (20/01/2026)

Resumo rápido

- Dependências totais escaneadas: 679
- Vulnerabilidades: 1 moderate, 1 high
- Arquivo de auditoria: `REPORTS/pnpm-audit.json`

Achados principais

1. `esbuild` — Moderate

- Caminho afetado: `apps__desktop > vite > esbuild`
- Versão encontrada: 0.21.5
- Problema: CORS em modo de desenvolvimento permite que sites externos leiam respostas do dev server (GHSA-67mh-4wv8-2f99).
- Recomendação: atualizar `esbuild` para >= 0.25.0.
- Ação prática:
  - Preferível: atualizar `vite` para uma versão que dependa de `esbuild` >= 0.25.0 (ex.: `pnpm up vite@latest -w` ou atualizar apenas em `apps/desktop` se o `vite` for lá).
  - Alternativa: forçar resolução/override para `esbuild@>=0.25.0` no `package.json` (campo `resolutions`) ou em `pnpm.overrides`.

2. `tar` (node-tar) — High

- Caminho afetado: `packages__database > argon2 > @mapbox/node-pre-gyp > tar`
- Versão encontrada: 6.2.1
- Problema: Arbitrary File Overwrite / Symlink Poisoning via extração inadequada (CVE-2026-23745 / GHSA-8qq5-rm4j-mr97).
- Recomendação: atualizar `tar` (node-tar) para >= 7.5.3.
- Ação prática:
  - Investigar se `argon2` versão usada tem uma dependência atualizada de `@mapbox/node-pre-gyp` ou se há uma versão do `argon2` que remova/atualize `node-pre-gyp`.
  - Se não for possível atualizar diretamente, usar `pnpm overrides`/`pnpm.overrides` ou `resolutions` para forçar `tar@>=7.5.3`.
  - Testar builds nativos após a atualização (argon2 e node-pre-gyp estão relacionados a binários nativos).

Recomendações imediatas (ordem de prioridade)

1. Prioridade Alta: Mitigar `tar` (CVE-2026-23745).
   - Tentativa rápida:

```bash
# atualizar dependências no workspace (revisar mudanças antes de commitar)
pnpm -w up @mapbox/node-pre-gyp@latest
# ou forçar override do tar
# editar package.json e adicionar:
# "pnpm": { "overrides": { "tar": "^7.5.3" } }
# então:
pnpm install
```

2. Prioridade Moderada: Mitigar `esbuild` via atualização de `vite` ou override.

```bash
# atualizar vite (que trará esbuild mais novo)
pnpm -w up vite@latest
# ou forçar override
# "pnpm": { "overrides": { "esbuild": ">=0.25.0" } }
pnpm install
```

3. Após atualizações:

- Regenerar lockfile e rodar `pnpm -w install`/`pnpm install`.
- Rodar a suíte de testes e builds: `pnpm -w test` e `pnpm -w -F "./apps/desktop" build` (ajustar conforme scripts locais).
- Executar pipeline CI (se existir) para validar as mudanças.

Observações

- Forçar overrides pode resolver rapidamente a advertência, mas pode introduzir incompatibilidades binárias (especialmente para pacotes nativos como `argon2`). Testes e builds locais/CI são obrigatórios antes de aplicar em produção.
- Se o projeto usar CI automatizado, criar PRs separados com as correções e rodar pipelines para validar.

Próximos passos que posso executar agora (preciso de autorização)

- Aplicar um `pnpm -w up` controlado e salvar o diff do `pnpm-lock.yaml`.
- Inserir `pnpm.overrides` no `package.json` e rodar `pnpm install` para verificar efeitos.
- Executar testes (`pnpm -w test`) e gerar relatório de cobertura.
- Rodar scan de segredos (gitleaks) localmente.

Deseja que eu tente atualizar/forçar overrides agora (indicando qual preferência), ou prefere que eu apenas gere PRs de recomendação para revisão manual?"
