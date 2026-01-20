# Parte B — Playbook de Varredura e Remediação de Segredos

## Objetivo

Detectar segredos no repositório (incluindo histórico), classificar os achados e executar um plano de remoção e rotação seguro.

## Ferramentas recomendadas

- `gitleaks` (detecta segredos no histórico e working tree)
- `trufflehog` (varredura git/history com heurísticas)
- `git filter-repo` (para remoção segura no histórico)
- `bfg-repo-cleaner` (alternativa simples para remoção)
- `vault` / `AWS Secrets Manager` / `GCP Secret Manager` (para armazenar novos segredos)
- `pre-commit` + `gitleaks` hook (para prevenir novos commits)

## 1. Preparação

1. Não compartilhe relatórios contendo segredos em canais públicos.
2. Trabalhe em cópia local/clonada do repositório (clone --mirror para remover histórico com segurança).
3. Informe stakeholders: equipe SRE/infra, responsáveis por tokens externos (GitHub, Cloud, APIs).

## 2. Executar varredura (exemplo)

```bash
chmod +x scripts/run-partB-secrets.sh
scripts/run-partB-secrets.sh
# Saídas: partB-reports/partB-gitleaks.json, partB-trufflehog.json
```

## 3. Triagem dos achados

- Classificar por: tipo (API key, private_key, password), fonte (commit hash, file path), exposição (public internet), serviço afetado.
- Priorizar: keys com acesso a produção (alta), tokens com long expiry (alta), private keys (alta).

## 4. Remoção segura do histórico

Opção segura (recomendado): `git filter-repo` (é rápido e seguro). Exemplo para remover uma chave literal:

```bash
# criar backup (mirror)
git clone --mirror <repo-url> repo-mirror.git
cd repo-mirror.git

# substituir a string/regex por REDACTED
git filter-repo --replace-refs delete-no-add --path-glob 'path/to/file' --invert-paths --commit-callback 'import re; m = re.search(b"SECRET_PATTERN", commit.message);'
# ou usar --replace-text
# criar arquivo replace.txt com linha: 's/REDACTED/SECRET_VALUE/'
# git filter-repo --replace-text replace.txt

# push forçado para remoto (após coordenação!)
# git push --force --mirror origin
```

Notas:

- Alterar histórico requer comunicação e coordenação com todos os colaboradores; todos precisarão re-clonar ou resetar suas branches.
- Registre a ação e ID de commits removidos para auditoria.

## 5. Rotacionar credenciais afetadas

Para cada credencial encontrada:

1. Identifique o serviço (GitHub token, AWS key, Google Cloud, third-party API).
2. Revoque a credencial exposta imediatamente.
3. Gere nova credencial em sistema seguro (vault/secret manager).
4. Atualize os consumidores: CI/CD secrets, envs, configurações de deploy.
5. Teste renovação em staging antes de tornar produção.

## 6. Prevenção de recorrência

- Adicione `gitleaks` como hook pre-commit/pre-push (`pre-commit` or Husky) para bloquear commits com segredos.
- Adote `git-secrets` em servidores de CI para bloquear pushes que contenham padrões.
- Use secret managers e nunca hardcode keys in repo.
- Atualize `README`/`CONTRIBUTING` com política de secrets.

## 7. Checklist de remediação (por item)

- [ ] Revoque credenciais encontradas (listar serviços)
- [ ] Remova secret do histórico com `git filter-repo` ou BFG
- [ ] Push forçado do mirror (coordenado)
- [ ] Notificar time e atualizar documentação
- [ ] Configurar pre-commit + CI checks

## 8. Exemplos práticos rápidos

- Adicionar gitleaks ao `pre-commit`:

```yaml
repos:
  - repo: https://github.com/zricethezav/gitleaks-pre-commit
    rev: v8.18.0
    hooks:
      - id: gitleaks
        args: [--config-path=.gitleaks.toml]
```

- Exemplo mínimo `.gitleaks.toml` para suprimir falsos positivos e custom patterns:

```toml
[[rules]]
  description = "Generic API Key"
  regex = '''(?i)(api[_-]?key|token|secret)["'=:\s]+[A-Za-z0-9-_]{20,}'''
  tags = ["key"]

[allowlist]
  paths = ["docs/**", "templates/**"]
```

## 9. Observações legais e de compliance

- Segredos expostos podem implicar violações contratuais (ex.: provedores, clientes). Incluir a gerência/legal quando identificar chaves de produção.
- Mantenha evidências (relatórios) em local seguro e com controle de acesso.

---

Se quiser, posso:

- Gerar um PR com configuração `pre-commit` + `.gitleaks.toml` e instruções no `CONTRIBUTING.md`.
- Ajudar a triagem dos JSONs (`partB-reports/*`) quando você executar o script e enviar os resultados.
