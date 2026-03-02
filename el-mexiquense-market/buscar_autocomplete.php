<?php
/**
 * Endpoint para autocompletado de productos por UPC parcial
 * Devuelve JSON con lista de productos que coinciden
 */

header('Content-Type: application/json; charset=utf-8');

// Incluir conexión a base de datos
require_once 'conexion.php';

// Obtener el término de búsqueda de la petición
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

// Validar que se haya enviado un término de búsqueda
if (empty($search)) {
    echo json_encode([
        'success' => false,
        'productos' => []
    ]);
    exit;
}

// Preparar consulta SQL - buscar productos que coincidan con el término
$searchTerm = $search . '%';
$stmt = $conexion->prepare("SELECT id, upc, producto, precio, unidad FROM productos WHERE upc LIKE ? LIMIT 10");
$stmt->bind_param("s", $searchTerm);

// Ejecutar consulta
if ($stmt->execute()) {
    $resultado = $stmt->get_result();
    $productos = [];
    
    while ($row = $resultado->fetch_assoc()) {
        $productos[] = [
            'id' => $row['id'],
            'upc' => $row['upc'],
            'nombre' => $row['producto'],
            'precio' => number_format($row['precio'], 2, '.', ''),
            'unidad' => $row['unidad']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'productos' => $productos
    ]);
} else {
    // Error en la consulta
    echo json_encode([
        'success' => false,
        'productos' => []
    ]);
}

// Cerrar statement y conexión
$stmt->close();
cerrarConexion();
?>
