<?php
/**
 * Archivo de conexión a la base de datos MySQL
 * El Mexiquense Market - Sistema de Facturación
 * 
 * SEGURIDAD: Las credenciales se obtienen de variables de entorno
 */

// Cargar variables de entorno desde .env si existe
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // Ignorar comentarios
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            // Remover comillas si existen
            $value = trim($value, '"\'');
            if (!getenv($name)) {
                putenv("$name=$value");
            }
        }
    }
}

// Configuración de la base de datos usando variables de entorno
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'invoice_user');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'el_mexiquense_market');

// Configuración de zona horaria
date_default_timezone_set('America/Mexico_City');

// Crear conexión
$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar conexión
if ($conexion->connect_error) {
    // No exponer detalles del error en producción
    error_log('Error de conexión MySQL: ' . $conexion->connect_error);
    die(json_encode([
        'success' => false,
        'error' => 'Error de conexión a la base de datos'
    ]));
}

// Configurar charset a UTF-8
$conexion->set_charset('utf8mb4');

/**
 * Función auxiliar para cerrar la conexión
 */
function cerrarConexion() {
    global $conexion;
    if ($conexion) {
        $conexion->close();
    }
}

// No cerrar la conexión aquí, se cerrará en cada script que la use
?>
