<?php
/**
 * Endpoint para buscar productos por UPC
 * Devuelve JSON con información del producto
 */

header('Content-Type: application/json; charset=utf-8');

// Incluir conexión a base de datos
require_once 'conexion.php';

// Obtener el UPC de la petición
$upc = isset($_GET['upc']) ? trim($_GET['upc']) : '';

// Validar que se haya enviado un UPC
if (empty($upc)) {
    echo json_encode([
        'success' => false,
        'error' => 'UPC no proporcionado'
    ]);
    exit;
}

// Preparar consulta SQL
$stmt = $conexion->prepare("SELECT id, producto, precio, unidad FROM productos WHERE upc = ? LIMIT 1");
$stmt->bind_param("s", $upc);

// Ejecutar consulta
if ($stmt->execute()) {
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows > 0) {
        $producto = $resultado->fetch_assoc();
        
        // Devolver datos del producto
        echo json_encode([
            'success' => true,
            'producto' => [
                'id' => $producto['id'],
                'nombre' => $producto['producto'],
                'precio' => number_format($producto['precio'], 2, '.', ''),
                'unidad' => $producto['unidad']
            ]
        ]);
    } else {
        // Producto no encontrado
        echo json_encode([
            'success' => false,
            'error' => 'Producto no encontrado'
        ]);
    }
} else {
    // Error en la consulta
    echo json_encode([
        'success' => false,
        'error' => 'Error al buscar el producto'
    ]);
}

// Cerrar statement y conexión
$stmt->close();
cerrarConexion();
?>
