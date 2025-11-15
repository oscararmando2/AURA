# ⚠️ IMPORTANTE: Descarga el Video Primero / IMPORTANT: Download Video First

## 🎬 El video no se reproduce porque falta el archivo / Video doesn't play because file is missing

## 🇪🇸 ESPAÑOL

### Problema
El video de fondo en la página principal no se reproduce porque el archivo de video **no está incluido** en el repositorio.

### Solución Rápida (2 pasos)

**Paso 1:** Descarga el video desde aquí:
- **Link directo:** https://www.pexels.com/video/8746842/download/
- **Nombre del archivo:** `pilates-background.mp4`

**Paso 2:** Coloca el archivo en:
```
assets/videos/pilates-background.mp4
```

### ¿Por qué no está incluido?
Los archivos de video son muy grandes (típicamente >50 MB) y no se deben incluir en repositorios Git. Por eso debes descargarlo manualmente.

### Instrucciones Detalladas

#### Windows:
1. Haz clic en: https://www.pexels.com/video/8746842/download/
2. El navegador descargará el archivo (generalmente en tu carpeta Descargas)
3. Renombra el archivo a: `pilates-background.mp4`
4. Muévelo a: `[Tu Repositorio]/assets/videos/pilates-background.mp4`

#### Mac/Linux (Terminal):
```bash
cd /ruta/a/tu/repositorio/AURA
curl -L -o assets/videos/pilates-background.mp4 "https://www.pexels.com/video/8746842/download/"
```

#### Usando Python:
```python
import urllib.request
urllib.request.urlretrieve(
    "https://www.pexels.com/video/8746842/download/",
    "assets/videos/pilates-background.mp4"
)
print("✅ Video descargado!")
```

### Verificar que Funciona
1. Abre `index.html` en un navegador
2. Deberías ver el video de Pilates en el fondo de la sección principal
3. El video debería hacer loop automáticamente del segundo 1 al 25

---

## 🇬🇧 ENGLISH

### Problem
The background video on the main page doesn't play because the video file is **not included** in the repository.

### Quick Solution (2 steps)

**Step 1:** Download the video from here:
- **Direct link:** https://www.pexels.com/video/8746842/download/
- **File name:** `pilates-background.mp4`

**Step 2:** Place the file in:
```
assets/videos/pilates-background.mp4
```

### Why isn't it included?
Video files are very large (typically >50 MB) and should not be included in Git repositories. That's why you need to download it manually.

### Detailed Instructions

#### Windows:
1. Click on: https://www.pexels.com/video/8746842/download/
2. Your browser will download the file (usually to your Downloads folder)
3. Rename the file to: `pilates-background.mp4`
4. Move it to: `[Your Repository]/assets/videos/pilates-background.mp4`

#### Mac/Linux (Terminal):
```bash
cd /path/to/your/repository/AURA
curl -L -o assets/videos/pilates-background.mp4 "https://www.pexels.com/video/8746842/download/"
```

#### Using Python:
```python
import urllib.request
urllib.request.urlretrieve(
    "https://www.pexels.com/video/8746842/download/",
    "assets/videos/pilates-background.mp4"
)
print("✅ Video downloaded!")
```

### Verify It Works
1. Open `index.html` in a browser
2. You should see the Pilates video in the background of the hero section
3. The video should automatically loop from second 1 to 25

---

## 📝 Additional Documentation

- **Setup Guide:** `VIDEO_SETUP_INSTRUCTIONS.md`
- **Download Instructions:** `assets/videos/README.md`
- **Implementation Details:** `VIDEO_IMPLEMENTATION_COMPLETE.md`

## 🎥 Video Information

- **Source:** Pexels (Free to use)
- **Video ID:** 8746842
- **License:** Pexels License (Free for commercial use)
- **Resolution:** 1920x1080 HD recommended
- **Format:** MP4 (H.264 codec)

---

**¡Una vez descargado, el video se reproducirá automáticamente! 🎬**

**Once downloaded, the video will play automatically! 🎬**
