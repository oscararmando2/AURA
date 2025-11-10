# 🧾 Sistema de Facturación - El Mexiquense Market

Sistema web completo de facturación profesional con diseño moderno y funcionalidad avanzada.

## 📋 Características

### Funcionalidades Principales
- ✅ **Autocompletado inteligente**: Ingresa el UPC y el sistema autocompleta nombre y precio del producto
- ✅ **Múltiples líneas**: Agrega tantos productos como necesites en la misma factura
- ✅ **Cálculo automático**: Subtotales, créditos y total general se calculan en tiempo real
- ✅ **Guardado en BD**: Todas las facturas se almacenan en MySQL con estructura relacional
- ✅ **Generación de PDF**: PDF profesional con logo, detalles y totales
- ✅ **Visor embebido**: Visualiza el PDF generado directamente en la página
- ✅ **Impresión directa**: Imprime o descarga el PDF desde el navegador
- ✅ **Productos dinámicos**: Si un producto no existe, se agrega automáticamente a la BD

### Diseño Visual
- 🎨 Colores institucionales de "El Mexiquense Market":
  - Verde: #1D8445
  - Rojo: #D45438
  - Fondo: #FAFAFA
- 📱 Totalmente responsivo (móvil, tablet y desktop)
- ✨ Interfaz moderna con bordes redondeados y sombras suaves
- 🔤 Tipografía: Poppins (Google Fonts)

## 🗂️ Estructura de Archivos

```
AURA/
├── factura.php              # Página principal del sistema de facturación
├── conexion.php             # Conexión a MySQL
├── buscar.php               # API para buscar productos por UPC
├── guardar_factura.php      # Guarda factura y genera PDF
├── database.sql             # Script SQL para crear la base de datos
├── fpdf/
│   └── fpdf.php            # Librería FPDF para generación de PDFs
└── pdfs/                    # Carpeta donde se guardan los PDFs generados
```

## 🚀 Instalación

### Requisitos Previos
- PHP 7.4 o superior
- MySQL 5.7 o superior
- Servidor web (Apache, Nginx) o XAMPP/MAMP/WAMP
- Extensiones PHP: mysqli, json

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/oscararmando2/AURA.git
   cd AURA
   ```

2. **Crear la base de datos**
   ```bash
   mysql -u root -p < database.sql
   ```
   
   O importar manualmente desde phpMyAdmin:
   - Crear base de datos: `el_mexiquense_market`
   - Importar el archivo `database.sql`

3. **Configurar conexión a la base de datos**
   
   Editar `conexion.php` y actualizar las credenciales:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'tu_usuario');
   define('DB_PASS', 'tu_contraseña');
   define('DB_NAME', 'el_mexiquense_market');
   ```

4. **Configurar permisos**
   ```bash
   chmod 777 pdfs/
   ```

5. **Iniciar el servidor**
   
   **Con XAMPP/MAMP:**
   - Copiar archivos a la carpeta `htdocs/`
   - Iniciar Apache y MySQL
   - Abrir: `http://localhost/factura.php`
   
   **Con PHP integrado:**
   ```bash
   php -S localhost:8080
   ```
   Abrir: `http://localhost:8080/factura.php`

## 📊 Base de Datos

### Estructura de Tablas

#### Tabla: `productos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | ID único del producto |
| upc | VARCHAR(50) | Código UPC único |
| producto | VARCHAR(255) | Nombre del producto |
| precio | DECIMAL(10,2) | Precio unitario |
| unidad | VARCHAR(50) | Unidad de medida (PZA, KG, LT) |

#### Tabla: `facturas`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | ID único de la factura |
| fecha | DATE | Fecha de la factura |
| cliente | VARCHAR(255) | Nombre del cliente |
| subtotal | DECIMAL(10,2) | Subtotal antes de créditos |
| creditos | DECIMAL(10,2) | Créditos aplicados |
| total | DECIMAL(10,2) | Total final |
| pdf_path | VARCHAR(500) | Ruta del PDF generado |

#### Tabla: `detalle_factura`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | ID único del detalle |
| factura_id | INT (FK) | Referencia a la factura |
| producto_id | INT (FK) | Referencia al producto |
| upc | VARCHAR(50) | Código UPC del producto |
| descripcion | VARCHAR(255) | Descripción del producto |
| cantidad | DECIMAL(10,2) | Cantidad |
| precio | DECIMAL(10,2) | Precio unitario |
| total | DECIMAL(10,2) | Total de la línea |

### Datos de Ejemplo
El script `database.sql` incluye 20 productos de ejemplo que puedes usar para probar el sistema.

## 💻 Uso del Sistema

### 1. Crear Nueva Factura

1. Ingresa la **fecha** (por defecto es hoy)
2. Ingresa el **nombre del cliente**
3. Agrega productos:
   - Escribe el **UPC** (mínimo 7 dígitos)
   - El sistema autocompletará **nombre** y **precio**
   - Ajusta la **cantidad** si es necesario
   - El **total** se calcula automáticamente

### 2. Agregar Más Productos
- Haz clic en "➕ Agregar Línea" para añadir más productos
- Cada línea calcula su total automáticamente
- Puedes eliminar líneas con el botón "✕"

### 3. Aplicar Créditos (Opcional)
- Ingresa el monto de créditos en el campo correspondiente
- El total se ajustará automáticamente

### 4. Guardar y Generar PDF
- Haz clic en "💾 Guardar Factura"
- El sistema:
  - Guarda la factura en la base de datos
  - Genera el PDF automáticamente
  - Muestra el PDF en el visor de la derecha
  - Te permite imprimirlo o descargarlo

### 5. Nueva Factura
- Haz clic en "🔄 Nueva Factura" para limpiar el formulario
- Inicia una nueva factura desde cero

## 🔧 API Endpoints

### GET `/buscar.php`
Busca un producto por UPC.

**Parámetros:**
- `upc` (string): Código UPC del producto

**Respuesta exitosa:**
```json
{
  "success": true,
  "producto": {
    "id": 1,
    "nombre": "Coca Cola 600ml",
    "precio": "15.50",
    "unidad": "PZA"
  }
}
```

**Respuesta error:**
```json
{
  "success": false,
  "error": "Producto no encontrado"
}
```

### POST `/guardar_factura.php`
Guarda una factura y genera el PDF.

**Body (JSON):**
```json
{
  "fecha": "2025-11-10",
  "cliente": "Juan Pérez",
  "productos": [
    {
      "upc": "7501000123456",
      "descripcion": "Coca Cola 600ml",
      "cantidad": 2,
      "precio": 15.50,
      "total": 31.00
    }
  ],
  "subtotal": 31.00,
  "creditos": 0,
  "total": 31.00
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "factura_id": 1,
  "pdf_url": "pdfs/factura_1_20251110120000.pdf",
  "mensaje": "Factura guardada exitosamente"
}
```

## 🎨 Personalización

### Cambiar Colores
Edita las variables CSS en `factura.php`:
```css
:root {
    --verde-principal: #1D8445;
    --rojo-principal: #D45438;
    --fondo-claro: #FAFAFA;
}
```

### Modificar Diseño del PDF
Edita la función de generación en `guardar_factura.php`:
```php
// Personaliza encabezados, colores, tamaños de fuente, etc.
$pdf->SetFont('Arial', 'B', 20);
$pdf->SetTextColor(29, 132, 69);
```

### Agregar Logo
1. Coloca tu logo en la carpeta del proyecto (ej: `logo.png`)
2. En `guardar_factura.php`, agrega:
   ```php
   $pdf->Image('logo.png', 10, 10, 30);
   ```

## 🔒 Seguridad

- ✅ Uso de **Prepared Statements** para prevenir SQL Injection
- ✅ Validación de datos en cliente y servidor
- ✅ Sanitización de entradas
- ✅ Transacciones MySQL para integridad de datos
- ✅ Manejo de errores apropiado

### Recomendaciones Adicionales
- Cambiar credenciales de base de datos por defecto
- Usar HTTPS en producción
- Implementar autenticación de usuarios
- Realizar backups regulares de la base de datos
- Limitar acceso a la carpeta `pdfs/`

## 🐛 Solución de Problemas

### Error: "Conexión a base de datos fallida"
- Verifica que MySQL esté corriendo
- Confirma credenciales en `conexion.php`
- Asegúrate que la base de datos existe

### Error: "No se puede escribir en pdfs/"
- Verifica permisos de la carpeta:
  ```bash
  chmod 777 pdfs/
  ```

### El PDF no se muestra
- Verifica que la carpeta `pdfs/` exista
- Revisa permisos de escritura
- Comprueba que no haya errores en el navegador (F12)

### El producto no autocompleta
- Verifica que el UPC tenga al menos 7 caracteres
- Confirma que el producto existe en la tabla `productos`
- Revisa la consola del navegador para errores

## 📱 Compatibilidad

### Navegadores
- ✅ Chrome/Edge (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Opera (76+)

### Dispositivos
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024)
- ✅ Móvil (375x667+)

## 📞 Soporte

Para reportar bugs o solicitar características:
- Abrir un issue en GitHub
- Email: soporte@elmexiquensemarket.com

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 👨‍💻 Desarrollador

Desarrollado para **El Mexiquense Market**  
Sistema de Facturación v1.0  
© 2025

---

**¡Gracias por usar nuestro sistema de facturación!** 🎉
