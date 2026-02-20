#!/bin/bash

# Script to download the Pilates video for AURA Studio
# Usage: ./download-video.sh

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  AURA Studio - Descargador de Video de Fondo            ║"
echo "║  AURA Studio - Background Video Downloader              ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if assets/videos directory exists
if [ ! -d "assets/videos" ]; then
    echo "❌ Error: El directorio 'assets/videos' no existe."
    echo "❌ Error: Directory 'assets/videos' does not exist."
    echo ""
    echo "Por favor, ejecuta este script desde la raíz del repositorio AURA."
    echo "Please run this script from the AURA repository root."
    exit 1
fi

# Check if video already exists
if [ -f "assets/videos/pilates-background.mp4" ]; then
    echo "⚠️  El video ya existe en: assets/videos/pilates-background.mp4"
    echo "⚠️  Video already exists at: assets/videos/pilates-background.mp4"
    echo ""
    read -p "¿Deseas reemplazarlo? / Replace it? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "✅ Operación cancelada."
        echo "✅ Operation cancelled."
        exit 0
    fi
fi

echo "📥 Descargando video desde Pexels..."
echo "📥 Downloading video from Pexels..."
echo ""

# Download the video
VIDEO_URL="https://www.pexels.com/video/8746842/download/"
OUTPUT_FILE="assets/videos/pilates-background.mp4"

# Try curl first
if command -v curl &> /dev/null; then
    echo "Usando curl..."
    echo "Using curl..."
    curl -L -o "$OUTPUT_FILE" "$VIDEO_URL"
    DOWNLOAD_STATUS=$?
# Try wget if curl is not available
elif command -v wget &> /dev/null; then
    echo "Usando wget..."
    echo "Using wget..."
    wget -O "$OUTPUT_FILE" "$VIDEO_URL"
    DOWNLOAD_STATUS=$?
else
    echo "❌ Error: No se encontró curl ni wget."
    echo "❌ Error: Neither curl nor wget found."
    echo ""
    echo "Por favor, descarga manualmente desde:"
    echo "Please download manually from:"
    echo "$VIDEO_URL"
    echo ""
    echo "Y guárdalo como: $OUTPUT_FILE"
    echo "And save it as: $OUTPUT_FILE"
    exit 1
fi

# Check if download was successful
if [ $DOWNLOAD_STATUS -eq 0 ] && [ -f "$OUTPUT_FILE" ]; then
    FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║  ✅ ¡Video descargado con éxito!                        ║"
    echo "║  ✅ Video downloaded successfully!                      ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    echo "📁 Ubicación / Location: $OUTPUT_FILE"
    echo "📊 Tamaño / Size: $FILE_SIZE"
    echo ""
    echo "🎬 Ahora puedes abrir index.html en tu navegador."
    echo "🎬 You can now open index.html in your browser."
    echo "   El video debería reproducirse automáticamente."
    echo "   The video should play automatically."
    echo ""
else
    echo ""
    echo "❌ Error al descargar el video."
    echo "❌ Error downloading video."
    echo ""
    echo "Por favor, descarga manualmente desde:"
    echo "Please download manually from:"
    echo "$VIDEO_URL"
    echo ""
    echo "Y guárdalo como: $OUTPUT_FILE"
    echo "And save it as: $OUTPUT_FILE"
    exit 1
fi
