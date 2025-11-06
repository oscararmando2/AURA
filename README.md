# AURA STUDIO

Sitio web moderno y responsivo para AURA STUDIO - Estudio de Pilates en Zitacuaro, Michoacan.

## Características

- ✨ Diseño ultra moderno y responsivo
- 🎨 Esquema de colores blanco y negro
- 💪 Sección de beneficios del Pilates
- 📍 Ubicación en Zitacuaro, Michoacan
- 💳 Integración con MercadoPago para suscripciones
- 👤 Sistema de registro e inicio de sesión
- 🗄️ Base de datos SQLite para usuarios y suscripciones
- 📱 Diseño completamente responsivo

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Base de datos**: SQLite3
- **Autenticación**: bcryptjs, express-session
- **Pagos**: MercadoPago
- **Animaciones**: AOS (Animate On Scroll)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/oscararmando2/AURA.git
cd AURA
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (opcional):
```bash
cp .env.example .env
# Editar .env con tus valores
```

4. Iniciar el servidor:
```bash
npm start
```

5. Para desarrollo con auto-reload:
```bash
npm run dev
```

6. Abrir en el navegador:
```
http://localhost:3000
```

## Estructura del Proyecto

```
AURA/
├── index.html          # Página principal
├── styles.css          # Estilos modernos y responsivos
├── app.js             # JavaScript del cliente
├── server.js          # Servidor backend
├── package.json       # Dependencias del proyecto
├── .gitignore         # Archivos a ignorar en git
└── README.md          # Este archivo
```

## Funcionalidades

### Frontend

- **Hero Section**: Imagen de fondo con llamado a la acción
- **Visión**: Descripción del estudio y sus objetivos
- **Beneficios**: Grid con 6 beneficios principales del Pilates
- **Horarios**: Información de horarios de atención
- **Ubicación**: Mapa integrado de Google Maps
- **Suscripción**: Botón de pago con MercadoPago
- **Autenticación**: Formularios de registro e inicio de sesión

### Backend

- **Registro de usuarios**: Con validación y hash de contraseñas
- **Inicio de sesión**: Sistema de sesiones con Express
- **Base de datos**: SQLite para almacenar usuarios y suscripciones
- **API REST**: Endpoints para gestión de usuarios y suscripciones
- **Panel de administración**: Endpoints para ver usuarios y suscripciones

## API Endpoints

### Autenticación
- `POST /register` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `POST /logout` - Cerrar sesión
- `GET /auth/status` - Verificar estado de autenticación

### Suscripciones (requiere autenticación)
- `POST /subscription` - Guardar información de suscripción
- `GET /subscriptions` - Obtener suscripciones del usuario

### Administración (requiere privilegios de admin)
- `GET /admin/users` - Listar todos los usuarios
- `GET /admin/subscriptions` - Listar todas las suscripciones

## Crear un Usuario Administrador

Para crear un usuario administrador, usa SQLite directamente:

```bash
sqlite3 aura_studio.db "UPDATE users SET is_admin = 1 WHERE username = 'tu_usuario';"
```

O durante el desarrollo:
```bash
sqlite3 aura_studio.db
UPDATE users SET is_admin = 1 WHERE username = 'admin';
.exit
```

## Configuración de MercadoPago

El botón de suscripción está configurado con el ID del plan de MercadoPago:
```
preapproval_plan_id=e7b1306f0c12462985724495ffb3e341
```

## Diseño Responsivo

El sitio es completamente responsivo con breakpoints en:
- Móvil: < 480px
- Tablet: < 768px
- Desktop: > 768px
- Pantallas grandes: > 1600px

## Seguridad

- Contraseñas hasheadas con bcryptjs
- Sesiones seguras con express-session
- Validación de datos en cliente y servidor
- Protección contra SQL injection con prepared statements

## Licencia

MIT

## Contacto

AURA STUDIO - Zitacuaro, Michoacan
