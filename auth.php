<?php
/**
 * Sistema de Autenticación PHP
 * El Mexiquense Market - Sistema de Facturación
 * 
 * Este archivo maneja la autenticación básica con sesiones PHP
 */

// Iniciar sesión de forma segura
if (session_status() === PHP_SESSION_NONE) {
    // Configuración de seguridad de sesión
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_samesite', 'Strict');
    
    // En producción con HTTPS, habilitar cookie segura
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        ini_set('session.cookie_secure', 1);
    }
    
    session_start();
}

// Regenerar ID de sesión periódicamente para prevenir fijación de sesión
if (!isset($_SESSION['created'])) {
    $_SESSION['created'] = time();
} else if (time() - $_SESSION['created'] > 1800) {
    // Regenerar sesión cada 30 minutos
    session_regenerate_id(true);
    $_SESSION['created'] = time();
}

/**
 * Verificar si el usuario está autenticado
 * @return bool
 */
function estaAutenticado() {
    return isset($_SESSION['usuario_id']) && !empty($_SESSION['usuario_id']);
}

/**
 * Obtener el usuario actual
 * @return array|null
 */
function obtenerUsuarioActual() {
    if (!estaAutenticado()) {
        return null;
    }
    return [
        'id' => $_SESSION['usuario_id'],
        'nombre' => $_SESSION['usuario_nombre'] ?? '',
        'rol' => $_SESSION['usuario_rol'] ?? 'usuario'
    ];
}

/**
 * Iniciar sesión de usuario
 * @param int $usuario_id
 * @param string $nombre
 * @param string $rol
 * @return bool
 */
function iniciarSesion($usuario_id, $nombre, $rol = 'usuario') {
    // Regenerar ID de sesión al iniciar sesión (previene fijación de sesión)
    session_regenerate_id(true);
    
    $_SESSION['usuario_id'] = $usuario_id;
    $_SESSION['usuario_nombre'] = $nombre;
    $_SESSION['usuario_rol'] = $rol;
    $_SESSION['login_time'] = time();
    $_SESSION['created'] = time();
    
    return true;
}

/**
 * Cerrar sesión
 * @return bool
 */
function cerrarSesion() {
    // Destruir todas las variables de sesión
    $_SESSION = array();
    
    // Destruir la cookie de sesión
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    // Destruir la sesión
    session_destroy();
    
    return true;
}

/**
 * Verificar si el usuario tiene un rol específico
 * @param string $rol
 * @return bool
 */
function tieneRol($rol) {
    if (!estaAutenticado()) {
        return false;
    }
    return isset($_SESSION['usuario_rol']) && $_SESSION['usuario_rol'] === $rol;
}

/**
 * Requerir autenticación - redirige o retorna error si no está autenticado
 * @param bool $api - Si es true, retorna JSON error en lugar de redirigir
 * @return void
 */
function requerirAutenticacion($api = false) {
    if (!estaAutenticado()) {
        if ($api) {
            header('Content-Type: application/json; charset=utf-8');
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'No autorizado. Por favor inicie sesión.'
            ]);
            exit;
        } else {
            header('Location: login.php');
            exit;
        }
    }
}

/**
 * Generar token CSRF
 * @return string
 */
function generarTokenCSRF() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verificar token CSRF
 * @param string $token
 * @return bool
 */
function verificarTokenCSRF($token) {
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Obtener campo oculto HTML con token CSRF
 * @return string
 */
function campoCSRF() {
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(generarTokenCSRF()) . '">';
}
?>
