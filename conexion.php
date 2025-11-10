<?php
/**
 * Archivo de conexión a la base de datos MySQL
 * El Mexiquense Market - Sistema de Facturación
 */

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root');  // Cambiar según tu configuración
define('DB_PASS', '');      // Cambiar según tu configuración
define('DB_NAME', 'el_mexiquense_market');

// Configuración de zona horaria
date_default_timezone_set('America/Mexico_City');

// Crear conexión
$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar conexión
if ($conexion->connect_error) {
    die(json_encode([
        'success' => false,
        'error' => 'Error de conexión: ' . $conexion->connect_error
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
