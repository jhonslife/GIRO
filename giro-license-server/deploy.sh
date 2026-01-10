#!/bin/bash
set -e

echo "🚀 Quick Deploy - GIRO License Server"
echo "====================================="
echo ""

cd "$(dirname "$0")"

# Check if linked
if [ ! -f ".railway" ]; then
    echo "❌ Projeto não linkado! Execute ./deploy-railway.sh primeiro"
    exit 1
fi

echo "📦 Building and deploying..."
railway up

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "Ver logs: railway logs"
echo "Status: railway status"
echo "Abrir: railway open"
