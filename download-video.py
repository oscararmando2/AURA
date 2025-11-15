#!/usr/bin/env python3
"""
Script to download the Pilates video for AURA Studio
Usage: python download-video.py
"""

import os
import sys
import urllib.request
from pathlib import Path

def print_banner():
    """Print the script banner."""
    print("╔══════════════════════════════════════════════════════════╗")
    print("║  AURA Studio - Descargador de Video de Fondo            ║")
    print("║  AURA Studio - Background Video Downloader              ║")
    print("╚══════════════════════════════════════════════════════════╝")
    print()

def download_video():
    """Download the video from Pexels."""
    # Configuration
    video_url = "https://www.pexels.com/video/8746842/download/"
    output_dir = Path("assets/videos")
    output_file = output_dir / "pilates-background.mp4"
    
    # Check if directory exists
    if not output_dir.exists():
        print("❌ Error: El directorio 'assets/videos' no existe.")
        print("❌ Error: Directory 'assets/videos' does not exist.")
        print()
        print("Por favor, ejecuta este script desde la raíz del repositorio AURA.")
        print("Please run this script from the AURA repository root.")
        return False
    
    # Check if video already exists
    if output_file.exists():
        print(f"⚠️  El video ya existe en: {output_file}")
        print(f"⚠️  Video already exists at: {output_file}")
        print()
        response = input("¿Deseas reemplazarlo? / Replace it? (y/n): ").lower()
        if response not in ['y', 'yes', 's', 'si', 'sí']:
            print("✅ Operación cancelada.")
            print("✅ Operation cancelled.")
            return False
        print()
    
    print("📥 Descargando video desde Pexels...")
    print("📥 Downloading video from Pexels...")
    print()
    
    try:
        # Download with progress
        def reporthook(block_num, block_size, total_size):
            """Show download progress."""
            if total_size > 0:
                downloaded = block_num * block_size
                percent = min(downloaded * 100 / total_size, 100)
                bar_length = 40
                filled = int(bar_length * percent / 100)
                bar = '█' * filled + '░' * (bar_length - filled)
                size_mb = total_size / (1024 * 1024)
                downloaded_mb = downloaded / (1024 * 1024)
                print(f"\r[{bar}] {percent:.1f}% ({downloaded_mb:.1f}/{size_mb:.1f} MB)", end='', flush=True)
        
        # Download the file
        urllib.request.urlretrieve(video_url, output_file, reporthook)
        print()  # New line after progress bar
        
        # Verify file was created
        if output_file.exists():
            file_size = output_file.stat().st_size
            size_mb = file_size / (1024 * 1024)
            
            print()
            print("╔══════════════════════════════════════════════════════════╗")
            print("║  ✅ ¡Video descargado con éxito!                        ║")
            print("║  ✅ Video downloaded successfully!                      ║")
            print("╚══════════════════════════════════════════════════════════╝")
            print()
            print(f"📁 Ubicación / Location: {output_file}")
            print(f"📊 Tamaño / Size: {size_mb:.2f} MB")
            print()
            print("🎬 Ahora puedes abrir index.html en tu navegador.")
            print("🎬 You can now open index.html in your browser.")
            print("   El video debería reproducirse automáticamente.")
            print("   The video should play automatically.")
            print()
            return True
        else:
            raise Exception("El archivo no se creó / File was not created")
            
    except Exception as e:
        print()
        print("❌ Error al descargar el video.")
        print("❌ Error downloading video.")
        print(f"   Detalles / Details: {str(e)}")
        print()
        print("Por favor, descarga manualmente desde:")
        print("Please download manually from:")
        print(video_url)
        print()
        print(f"Y guárdalo como: {output_file}")
        print(f"And save it as: {output_file}")
        return False

def main():
    """Main function."""
    print_banner()
    
    try:
        success = download_video()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print()
        print()
        print("⚠️  Descarga cancelada por el usuario.")
        print("⚠️  Download cancelled by user.")
        sys.exit(1)

if __name__ == "__main__":
    main()
