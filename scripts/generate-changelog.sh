#!/bin/bash
# generate-changelog.sh - Gera changelog baseado em commits convencionais
# Uso: ./scripts/generate-changelog.sh [tag-anterior] [tag-atual]

set -e

PREV_TAG="${1:-$(git describe --abbrev=0 --tags HEAD~1 2>/dev/null || echo "")}"
CURR_TAG="${2:-$(git describe --abbrev=0 --tags 2>/dev/null || echo "HEAD")}"

echo "# Changelog"
echo ""
echo "## ${CURR_TAG}"
echo ""
echo "_$(date +%Y-%m-%d)_"
echo ""

# Features
FEATURES=$(git log ${PREV_TAG}..${CURR_TAG} --pretty=format:"%s" 2>/dev/null | grep "^feat" || true)
if [ -n "$FEATURES" ]; then
    echo "### ✨ Novos Recursos"
    echo ""
    echo "$FEATURES" | sed 's/^feat[:(]/- /; s/):/:/; s/^feat: /- /'
    echo ""
fi

# Fixes
FIXES=$(git log ${PREV_TAG}..${CURR_TAG} --pretty=format:"%s" 2>/dev/null | grep "^fix" || true)
if [ -n "$FIXES" ]; then
    echo "### 🐛 Correções"
    echo ""
    echo "$FIXES" | sed 's/^fix[:(]/- /; s/):/:/; s/^fix: /- /'
    echo ""
fi

# Performance
PERF=$(git log ${PREV_TAG}..${CURR_TAG} --pretty=format:"%s" 2>/dev/null | grep "^perf" || true)
if [ -n "$PERF" ]; then
    echo "### ⚡ Performance"
    echo ""
    echo "$PERF" | sed 's/^perf[:(]/- /; s/):/:/; s/^perf: /- /'
    echo ""
fi

# Refactors
REFACTOR=$(git log ${PREV_TAG}..${CURR_TAG} --pretty=format:"%s" 2>/dev/null | grep "^refactor" || true)
if [ -n "$REFACTOR" ]; then
    echo "### ♻️ Refatorações"
    echo ""
    echo "$REFACTOR" | sed 's/^refactor[:(]/- /; s/):/:/; s/^refactor: /- /'
    echo ""
fi

# Documentation
DOCS=$(git log ${PREV_TAG}..${CURR_TAG} --pretty=format:"%s" 2>/dev/null | grep "^docs" || true)
if [ -n "$DOCS" ]; then
    echo "### 📚 Documentação"
    echo ""
    echo "$DOCS" | sed 's/^docs[:(]/- /; s/):/:/; s/^docs: /- /'
    echo ""
fi

# Breaking Changes
BREAKING=$(git log ${PREV_TAG}..${CURR_TAG} --pretty=format:"%B" 2>/dev/null | grep -i "BREAKING CHANGE" || true)
if [ -n "$BREAKING" ]; then
    echo "### ⚠️ Breaking Changes"
    echo ""
    echo "$BREAKING" | sed 's/^/- /'
    echo ""
fi

echo "---"
echo ""
echo "_Gerado automaticamente por generate-changelog.sh_"
