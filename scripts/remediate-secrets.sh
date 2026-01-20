#!/usr/bin/env bash
# Remediation helper (DO NOT RUN without reading and team coordination)
set -euo pipefail

echo "This script prepares commands for removing leaked secrets from git history."
echo "It does NOT run destructive operations by default. Read and edit before use."

REPORT=scripts/gitleaks_report.json
if [ ! -f "$REPORT" ]; then
  echo "Report not found: $REPORT"
  exit 1
fi

echo "Report contains the following unique files:" 
jq -r '.[].File' "$REPORT" | sort -u

echo
echo "To remove files from history (example):"
echo "  git filter-repo --invert-paths --paths-from-file paths-to-remove.txt"
echo
echo "To replace a secret string in history (example):"
echo "  git filter-repo --replace-text replacements.txt"
echo
echo "Preparations you should make before running history rewrite:"
echo " - Coordinate with team; a force-push will be required."
echo " - Backup repo: git bundle create repo.bundle --all"
echo " - Ensure CI and deploy keys rotated after rewrite."

echo "Generating helper files: paths-to-remove.txt and replacements.txt (edit before use)."

jq -r '.[].File' "$REPORT" | sort -u > scripts/paths-to-remove.txt

# Example replacements: populate with sensitive literals found in the report
cat > scripts/replacements.txt <<'EOF'
# Format: <old>=<new>
# Lines starting with # are comments
# Example replacement entry (edit with exact secret values):
#dW50cnVzdGVkIGNvbW1lbnQ6...====>REDACTED_SIGNING_KEY
EOF

chmod +x scripts/remediate-secrets.sh
echo "Helper files created: scripts/paths-to-remove.txt, scripts/replacements.txt"
echo "Review them, edit replacements.txt with exact secrets, then run filter-repo as needed."
