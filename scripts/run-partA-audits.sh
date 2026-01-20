#!/usr/bin/env bash
set -euo pipefail

# Part A audit runner
# Generates reports under ./partA-reports

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/partA-reports"
mkdir -p "$OUT_DIR"

echo "[partA] Starting audits — outputs -> $OUT_DIR"

# Helpers
which_or_warn() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[warn] $1 not found in PATH"
    return 1
  fi
  return 0
}

# Basic prerequisites
which_or_warn pnpm || { echo "Install pnpm: npm i -g pnpm"; exit 1; }
which_or_warn cargo || { echo "Install Rust toolchain from https://rustup.rs"; exit 1; }

# Optional scanners
if ! command -v cargo-audit >/dev/null 2>&1; then
  echo "[info] cargo-audit not found. Attempting install (may require network)..."
  cargo install cargo-audit || echo "[warn] cargo-audit install failed — install manually"
fi

if ! command -v gitleaks >/dev/null 2>&1; then
  echo "[warn] gitleaks not found. Install with: 'go install github.com/zricethezav/gitleaks/v8@latest' or use your package manager"
fi

# Run from repo root
cd "$ROOT"

echo "[partA] Installing node deps (pnpm install) — this may take a while"
pnpm install --silent

# Inventory: dependencies
echo "[partA] Exporting dependency lists"
pnpm --silent --filter ./apps/desktop... list --depth 0 --json > "$OUT_DIR/partA-desktop-deps.json" || true
pnpm --silent --filter ./packages/database... list --depth 0 --json > "$OUT_DIR/partA-database-deps.json" || true

# JS/TS security audit
echo "[partA] Running pnpm audit"
pnpm audit --json > "$OUT_DIR/partA-pnpm-audit.json" || true

# License scan (license-checker via pnpm dlx)
echo "[partA] Collecting production licenses"
pnpm dlx license-checker --json --production > "$OUT_DIR/partA-licenses.json" || true

# Rust audit (if crate exists)
if [ -d "$ROOT/apps/desktop/src-tauri" ]; then
  echo "[partA] Running cargo audit for Tauri crate"
  pushd apps/desktop/src-tauri >/dev/null
  cargo audit --json > "$OUT_DIR/partA-cargo-audit.json" || true
  popd >/dev/null
else
  echo "[partA] No Tauri crate found at apps/desktop/src-tauri"
fi

# Secret scan (gitleaks) — runs on repo
if command -v gitleaks >/dev/null 2>&1; then
  echo "[partA] Running gitleaks (secret detection)"
  gitleaks detect --source "$ROOT" --report-path "$OUT_DIR/partA-gitleaks.json" --report-format json || true
else
  echo "[partA] Skipping gitleaks (not installed)"
fi

# Summarize
echo "[partA] Done. Reports are in: $OUT_DIR"
ls -la "$OUT_DIR" || true

exit 0
