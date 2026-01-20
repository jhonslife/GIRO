#!/usr/bin/env bash
# Safe wrapper to rewrite git history to remove/replace secrets.
# REVIEW carefully before running. This script will NOT run rewrite unless
# you export RUN_FILTER_REPO=1 in the environment.

set -euo pipefail

REPO_DIR=$(pwd)
REPORT="$REPO_DIR/scripts/gitleaks_report.json"
PATHS_FILE="$REPO_DIR/scripts/paths-to-remove.txt"
REPL_FILE="$REPO_DIR/scripts/replacements.txt"

echo "Git Filter-Repo Helper"
echo "Repository: $REPO_DIR"

if [ ! -f "$REPORT" ]; then
  echo "Error: gitleaks report not found at $REPORT"
  exit 1
fi

if ! command -v git-filter-repo >/dev/null 2>&1; then
  echo "git-filter-repo not found. Install from https://github.com/newren/git-filter-repo"
  echo "Or use your package manager. Aborting.";
  exit 1
fi

echo "Files flagged by gitleaks (sample):"
jq -r '.[].File' "$REPORT" | sort -u

echo
echo "Preparing backup bundle..."
BACKUP="$REPO_DIR/repo-backup-$(date +%Y%m%d%H%M%S).bundle"
git bundle create "$BACKUP" --all
echo "Backup created: $BACKUP"

echo
echo "Review the following helper files before proceeding:"
echo " - $PATHS_FILE  (paths to remove from history)"
echo " - $REPL_FILE   (replace-text file for git-filter-repo)"
echo
if [ "${RUN_FILTER_REPO:-0}" != "1" ]; then
  echo "Dry-run mode (no rewrite). To execute rewrite, run with 'export RUN_FILTER_REPO=1' and re-run this script."
  echo
  echo "Example commands to run manually once ready:"
  echo " - Remove paths listed in $PATHS_FILE:" 
  echo "     git filter-repo --invert-paths --paths-from-file $PATHS_FILE"
  echo " - OR replace secrets based on $REPL_FILE (example format described in README):"
  echo "     git filter-repo --replace-text $REPL_FILE"
  exit 0
fi

echo "RUN_FILTER_REPO=1 detected — proceeding with rewrite (destructive)."
read -p "Are you sure you want to proceed? This will rewrite history and require force-push. Type YES to continue: " CONFIRM
if [ "$CONFIRM" != "YES" ]; then
  echo "Aborted by user."; exit 1
fi

if [ -s "$PATHS_FILE" ]; then
  echo "Removing paths from history..."
  git filter-repo --invert-paths --paths-from-file "$PATHS_FILE"
fi

if [ -s "$REPL_FILE" ]; then
  echo "Replacing secrets per $REPL_FILE"
  git filter-repo --replace-text "$REPL_FILE"
fi

echo "Rewrite complete. You must force-push branches to remote (coord with team)."
echo "Example: git push --all --force && git push --tags --force"
