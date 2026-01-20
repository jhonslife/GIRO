#!/usr/bin/env bash
set -euo pipefail

# Part B: secret scanning runner
# Generates reports under ./partB-reports

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/partB-reports"
mkdir -p "$OUT_DIR"

echo "[partB] Starting secret scans — outputs -> $OUT_DIR"

which_or_warn() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[warn] $1 not found in PATH"
    return 1
  fi
  return 0
}

cd "$ROOT"

# gitleaks (if available)
if command -v gitleaks >/dev/null 2>&1; then
  echo "[partB] Running gitleaks (repo + history)"
  gitleaks detect --source . --report-path "$OUT_DIR/partB-gitleaks.json" --report-format json || true
else
  echo "[partB] gitleaks not found in PATH — skipping (install with: go install github.com/zricethezav/gitleaks/v8@latest)"
fi

# trufflehog (git mode) — prefer pnpm exec, fallback to npx or system binary
echo "[partB] Running trufflehog (git-history)"
if command -v pnpm >/dev/null 2>&1; then
  PNPM_TRUFFLE="pnpm -w exec -- trufflehog"
else
  PNPM_TRUFFLE=""
fi

if [ -n "$PNPM_TRUFFLE" ] && $PNPM_TRUFFLE git --json . > "$OUT_DIR/partB-trufflehog.json" 2> "$OUT_DIR/partB-trufflehog.log"; then
  echo "[partB] trufflehog finished (pnpm exec) -> $OUT_DIR/partB-trufflehog.json"
else
  if command -v trufflehog >/dev/null 2>&1; then
    trufflehog git --json . > "$OUT_DIR/partB-trufflehog.json" 2> "$OUT_DIR/partB-trufflehog.log" || true
  else
    # try npx as last resort
    if command -v npx >/dev/null 2>&1; then
      npx trufflehog@latest git --json . > "$OUT_DIR/partB-trufflehog.json" 2> "$OUT_DIR/partB-trufflehog.log" || true
    else
      echo "[partB] trufflehog not available (pnpm/npx/trufflehog) — skipping"
    fi
  fi
fi

# detect plaintext .env or obvious secrets in working tree (exclude node_modules and .git)
echo "[partB] Scanning workspace for common secrets patterns (excluding node_modules and .git)"
grep -RInE --exclude-dir={node_modules,.git,target} "(API_KEY|SECRET|TOKEN|PASSWORD|PRIVATE_KEY|AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|DB_PASSWORD|DATABASE_URL)" . || true

# Summarize
echo "[partB] Done. Reports in: $OUT_DIR"
ls -la "$OUT_DIR" || true

exit 0
