# Parte A — Inventário de Dependências e Recomendações Rápidas

## Resumo executivo

- Inventário gerado para `apps/desktop`, `packages/database` e crate Rust `apps/desktop/src-tauri`.
- Pontos críticos iniciais: dependências nativas/crypto (`openssl` vendored, `serialport`, `sqlx`), `@tauri-apps/cli` em runtime deps, Node engine `>=20` em `packages/database`, campos de hash em `Employee` (ver `schema.prisma`).

## Ações imediatas (prioridade alta)

- Rodar SCA: `pnpm audit` (monorepo) e `cargo audit` (crate Tauri). Capturar JSON e priorizar CVEs com severidade High/Critical.
- Executar scanner de segredos no histórico (`gitleaks`) antes de compartilhar relatórios.
- Avaliar mover `@tauri-apps/cli` de `dependencies` → `devDependencies` em `apps/desktop/package.json`.
- Verificar algoritmo de hashing para `Employee.pin` e `Employee.password` (use bcrypt/argon2 + salt + optional pepper). Planejar migração se hashes fracos.
- Confirmar toolchain CI para builds nativos (OpenSSL vendored, `serialport`) e documentar binários suportados.

## Comandos reproduzíveis (rodar localmente)

```bash
# Tornar script executável e rodar
chmod +x scripts/run-partA-audits.sh
scripts/run-partA-audits.sh
```

## Artefatos esperados (após execução do script)

- `partA-reports/partA-desktop-deps.json` — dependências do frontend
- `partA-reports/partA-database-deps.json` — dependências do package DB
- `partA-reports/partA-pnpm-audit.json` — resultado do `pnpm audit`
- `partA-reports/partA-licenses.json` — lista de licenças (production)
- `partA-reports/partA-cargo-audit.json` — resultado de `cargo audit` (Tauri)
- `partA-reports/partA-gitleaks.json` — report de segredos (se gitleaks instalado)

## Triagem inicial recomendada

- Alta: CVEs em dependências de runtime (priorize fixes para: `tauri` e plugins, `sqlx`, `reqwest`, `openssl`).
- Alta: segredos encontrados no histórico — rotacionar e remover do histórico com estratégia segura.
- Média: licenças incompatíveis para redistribuição, especialmente se o produto for fechado (`Proprietary`).

## Observações técnicas

- `packages/database` declara `node >= 20` — verifique runners CI.
- `prisma` datasource é `sqlite` (arquivo). Garanta backups e migrations antes de alterar.
- Campos `Employee.pin` e `Employee.password` são hashes — confirme algoritmo e parâmetros de custo.

## Próximos passos sugeridos

1. Execute `scripts/run-partA-audits.sh` e envie os JSONs gerados aqui para triagem (eu priorizo e proponho PRs para correção).
2. Paralelamente, Parte B: varredura de segredos e playbook de remoção/rotacionamento (posso gerar).

---

Relatório gerado pelo Planejador — se quiser que eu comece a triagem dos JSONs automaticamente, rode o script e compartilhe os arquivos gerados ou permita execução aqui.
