#!/usr/bin/env bash
set -euo pipefail

# Instala pre-commit e registra hooks do repositório
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[setup] Installing pre-commit (pip) and configuring hooks"
if ! command -v pre-commit >/dev/null 2>&1; then
  if command -v pip3 >/dev/null 2>&1; then
    pip3 install --user pre-commit
  elif command -v pip >/dev/null 2>&1; then
    pip install --user pre-commit
  else
    echo "[warn] pip not found; install pre-commit manually" >&2
  fi
fi

echo "[setup] Installing pre-commit hooks"
pre-commit install || echo "[warn] pre-commit install failed"

echo "[setup] Done. To run hooks on all files: pre-commit run --all-files"

exit 0
