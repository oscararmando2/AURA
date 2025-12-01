# AURA - Sistema de Facturación y Studio Pilates

Este repositorio contiene **dos sistemas independientes**:

1. **Sistema de Facturación** - Para El Mexiquense Market
2. **AURA Studio** - Website de reservas de clases de Pilates

📁 **Documentación adicional:** Toda la documentación detallada está en la carpeta [`/docs`](./docs/)

---

## 🧘 AURA Studio - Pilates Website

Website profesional con sistema de reservas integrado con Firebase.

### ⚠️ ACCIÓN REQUERIDA: Descarga el Video de Fondo

**El video en index.html NO se reproduce porque falta el archivo de video.**

🎬 **Descarga el video AQUÍ:** https://www.pexels.com/video/8746842/download/
- Guárdalo como: `pilates-background.mp4`
- Colócalo en: `assets/videos/pilates-background.mp4`

⚡ **Solución Rápida:**
```bash
# Opción 1: Script automático (Bash)
./download-video.sh

# Opción 2: Script automático (Python)
python download-video.py
```

📖 **Guías completas:**
- [⚡ QUICKSTART_VIDEO.md](docs/QUICKSTART_VIDEO.md) - Solución en 30 segundos
- [📖 DOWNLOAD_VIDEO_FIRST.md](docs/DOWNLOAD_VIDEO_FIRST.md) - Instrucciones detalladas
- [🌐 video-missing.html](video-missing.html) - Guía visual interactiva

**Características:**
- ✅ Sistema de reservas en línea con Firebase Firestore
- ✅ Calendario interactivo con FullCalendar
- ✅ Panel de administración para gestión de reservas
- ✅ Autenticación de usuarios con Firebase Auth
- ✅ Sección "Mis Clases" para que usuarios vean sus reservas
- ✅ Diseño responsive y moderno
- 🎬 Video de fondo en hero section (descarga requerida)

**[Ver documentación completa de Pilates →](docs/PILATES_README.md)**

**Configuración de Firebase:**
- 📖 **[FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)** - Guía completa de configuración
- ⚡ **[APPLY_FIRESTORE_RULES.md](docs/APPLY_FIRESTORE_RULES.md)** - Aplicar reglas de seguridad (2-3 minutos)
- 🔍 **[FIRESTORE_RULES_SOLUTION.md](docs/FIRESTORE_RULES_SOLUTION.md)** - Explicación detallada de las reglas

**Recientes actualizaciones:**
- 🔧 **Reglas de Firestore para "Mis Clases" (2025-11-18)**: Solución para permitir que usuarios vean sus clases. Ver [FIRESTORE_RULES_SOLUTION.md](docs/FIRESTORE_RULES_SOLUTION.md)
- 🔧 **Corrección de reservas (2025-11-12)**: Solucionado el problema de guardado de reservas. Ver [RESERVATION_FIX_SUMMARY.md](docs/RESERVATION_FIX_SUMMARY.md)

---

## 💼 Sistema de Facturación

Sistema completo de facturación y gestión de inventario para **El Mexiquense Market**.

## 🎯 Sistemas Disponibles

Este repositorio contiene **dos sistemas** de facturación:

### 1. 🐍 Sistema Python (Recomendado para nuevos usuarios)
**Ubicación:** `python_invoice_system/`

Sistema completo desarrollado en Python con:
- ✅ Importación desde CSV/Excel
- ✅ Búsqueda por UPC parcial
- ✅ Asignación automática de IDs a productos sin UPC
- ✅ Generación de facturas interactivas
- ✅ Exportación a CSV, Excel y PDF
- ✅ Base de datos SQLite (sin configuración)
- ✅ Interfaz CLI fácil de usar

**[Ver documentación completa →](python_invoice_system/README.md)**

### 2. 🌐 Sistema PHP/MySQL (Sistema web)
**Ubicación:** Raíz del proyecto

Sistema web profesional con:
- ✅ Interfaz web moderna y responsiva
- ✅ Autocompletado de productos por UPC
- ✅ Generación de PDFs profesionales
- ✅ Base de datos MySQL
- ✅ Visor de PDFs integrado

**[Ver documentación PHP →](FACTURACION_README.md)**

## 🚀 Inicio Rápido

### Para Sistema Python:

```bash
cd python_invoice_system
pip install -r requirements.txt
python main.py
```

### Para Sistema PHP:

```bash
# Configurar base de datos MySQL
mysql -u root -p < database.sql

# Iniciar servidor PHP
php -S localhost:8080
```

## 📋 Características Principales

- 🔍 **Búsqueda por UPC parcial**: Encuentra productos escribiendo solo parte del código
- 🏷️ **Productos sin UPC**: Asignación automática de identificadores únicos (ej: CILANTRO001)
- 📊 **Importación masiva**: Soporta CSV y Excel (Sheet 1)
- 🧾 **Facturas profesionales**: Múltiples formatos de exportación
- 💰 **Créditos y descuentos**: Aplicación de créditos en facturas
- 💾 **Base de datos**: Almacenamiento persistente de productos y facturas

## 🎨 Tecnologías Utilizadas

### Sistema Python
- **Lenguaje**: Python 3.8+
- **Datos**: Pandas, OpenPyXL
- **Base de datos**: SQLite3
- **PDFs**: ReportLab

### Sistema PHP
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: PHP 7.4+
- **Base de datos**: MySQL
- **PDFs**: FPDF

## 🚀 Configuración Inicial

1. Clonar el repositorio:
```bash
git clone https://github.com/oscararmando2/AURA.git
cd AURA
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (requerido para MercadoPago):
```bash
# Opción 1: Usar el script de configuración automática
./setup-env.sh

# Opción 2: Configuración manual
cp .env.example .env
# Editar .env con tus valores de MercadoPago Access Token
```

📖 **Para configurar MercadoPago Access Token:**
- [Guía Rápida: MERCADOPAGO_ACCESS_TOKEN_SETUP.md](MERCADOPAGO_ACCESS_TOKEN_SETUP.md)
- [Documentación Completa: MERCADOPAGO_README.md](MERCADOPAGO_README.md)

## 📦 Instalación Detallada

### Sistema Python (Recomendado)

1. Navegar al directorio:
```bash
cd python_invoice_system
```

2. Crear entorno virtual (recomendado):
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Iniciar el sistema:
```bash
python main.py
```

5. (Opcional) Ver ejemplo de uso:
```bash
python ejemplo_uso.py
```

### Sistema PHP (Servidor Web)

1. Crear base de datos:
```bash
mysql -u root -p < database.sql
```

2. Configurar conexión (editar `conexion.php`):
```php
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_contraseña');
```

3. Iniciar servidor:
```bash
php -S localhost:8080
```

4. Abrir en navegador:
```
http://localhost:8080/factura.php
```

## 📁 Estructura del Proyecto

```
AURA/
├── python_invoice_system/    # Sistema Python
│   ├── main.py               # Interfaz CLI
│   ├── inventario.py         # Gestión de inventario
│   ├── facturacion.py        # Gestión de facturas
│   ├── ejemplo_uso.py        # Ejemplo de uso
│   ├── datos_ejemplo.csv     # Datos de muestra
│   ├── requirements.txt      # Dependencias
│   └── README.md            # Documentación detallada
│
├── factura.php              # Sistema web PHP
├── buscar.php               # API búsqueda productos
├── guardar_factura.php      # Guardar y generar PDFs
├── conexion.php             # Conexión MySQL
├── database.sql             # Schema de base de datos
├── fpdf/                    # Librería PDF
├── pdfs/                    # PDFs generados
│
├── index.html               # Página de bienvenida
├── server.js                # Servidor Node.js (legacy)
├── package.json             # Dependencias Node.js
└── README.md               # Este archivo
```

## 🎯 Casos de Uso

### Ejemplo 1: Importar Productos
```bash
python python_invoice_system/main.py
# Seleccionar: 1 → 1 → datos_ejemplo.csv
```

### Ejemplo 2: Buscar por UPC Parcial
```bash
# Buscar "715" encuentra: "715141514643 - Egglands Best..."
# Buscar "CILANTRO" encuentra: "CILANTRO001 - CILANTRO"
```

### Ejemplo 3: Crear Factura
```bash
# 1. Buscar "715" → Seleccionar producto → Cantidad: 2
# 2. Buscar "CILANTRO" → Seleccionar → Cantidad: 10
# 3. Buscar "0700" → Seleccionar producto → Cantidad: 3
# 4. Aplicar crédito: $5.00
# 5. Guardar y exportar (CSV, Excel, PDF)
```

## 📊 Datos de Ejemplo

El archivo `python_invoice_system/datos_ejemplo.csv` incluye 100 productos con:
- ✅ Productos con UPC numéricos
- ✅ Productos sin UPC (CILANTRO, CAJA AGUACATE, etc.)
- ✅ Diferentes categorías y precios
- ✅ Formato compatible con importación

## 🔒 Seguridad

- ✅ Prepared statements para prevenir SQL injection
- ✅ Validación de datos en entrada
- ✅ Sanitización de datos
- ✅ Manejo de errores apropiado

## Licencia

MIT

## Contacto

AURA - Sistema de Facturación  
El Mexiquense Market
