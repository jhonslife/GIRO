#!/bin/bash
# build-icons.sh - Gera ícones em vários tamanhos a partir de um PNG base
# Uso: ./scripts/build-icons.sh icon-base.png

set -e

INPUT="${1:-apps/desktop/src-tauri/icons/icon.png}"
OUTPUT_DIR="apps/desktop/src-tauri/icons"

if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick não encontrado. Instale com: sudo apt install imagemagick"
    exit 1
fi

if [ ! -f "$INPUT" ]; then
    echo "❌ Arquivo de entrada não encontrado: $INPUT"
    exit 1
fi

echo "🎨 Gerando ícones a partir de: $INPUT"

# PNG em vários tamanhos
for size in 16 24 32 48 64 128 256 512; do
    convert "$INPUT" -resize ${size}x${size} "${OUTPUT_DIR}/${size}x${size}.png"
    echo "  ✓ ${size}x${size}.png"
done

# Ícone 2x para Retina
convert "$INPUT" -resize 256x256 "${OUTPUT_DIR}/128x128@2x.png"
echo "  ✓ 128x128@2x.png"

# ICO para Windows (múltiplos tamanhos embutidos)
convert "$INPUT" \
    \( -clone 0 -resize 16x16 \) \
    \( -clone 0 -resize 32x32 \) \
    \( -clone 0 -resize 48x48 \) \
    \( -clone 0 -resize 64x64 \) \
    \( -clone 0 -resize 128x128 \) \
    \( -clone 0 -resize 256x256 \) \
    -delete 0 "${OUTPUT_DIR}/icon.ico"
echo "  ✓ icon.ico"

# ICNS para macOS
if command -v iconutil &> /dev/null; then
    ICONSET_DIR="${OUTPUT_DIR}/icon.iconset"
    mkdir -p "$ICONSET_DIR"
    
    convert "$INPUT" -resize 16x16 "${ICONSET_DIR}/icon_16x16.png"
    convert "$INPUT" -resize 32x32 "${ICONSET_DIR}/icon_16x16@2x.png"
    convert "$INPUT" -resize 32x32 "${ICONSET_DIR}/icon_32x32.png"
    convert "$INPUT" -resize 64x64 "${ICONSET_DIR}/icon_32x32@2x.png"
    convert "$INPUT" -resize 128x128 "${ICONSET_DIR}/icon_128x128.png"
    convert "$INPUT" -resize 256x256 "${ICONSET_DIR}/icon_128x128@2x.png"
    convert "$INPUT" -resize 256x256 "${ICONSET_DIR}/icon_256x256.png"
    convert "$INPUT" -resize 512x512 "${ICONSET_DIR}/icon_256x256@2x.png"
    convert "$INPUT" -resize 512x512 "${ICONSET_DIR}/icon_512x512.png"
    convert "$INPUT" -resize 1024x1024 "${ICONSET_DIR}/icon_512x512@2x.png"
    
    iconutil -c icns "$ICONSET_DIR" -o "${OUTPUT_DIR}/icon.icns"
    rm -rf "$ICONSET_DIR"
    echo "  ✓ icon.icns"
else
    # Fallback: criar .icns simples via convert
    convert "$INPUT" -resize 512x512 "${OUTPUT_DIR}/icon.icns" 2>/dev/null || true
    echo "  ⚠ icon.icns (fallback - iconutil não disponível)"
fi

echo ""
echo "✅ Ícones gerados em: $OUTPUT_DIR"
ls -la "$OUTPUT_DIR"
