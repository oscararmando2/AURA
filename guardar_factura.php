<?php
/**
 * Guarda la factura en la base de datos y genera el PDF
 * El Mexiquense Market - Sistema de Facturación
 */

header('Content-Type: application/json; charset=utf-8');

// Incluir conexión a base de datos
require_once 'conexion.php';
require_once 'fpdf/fpdf.php';

// Obtener datos del POST
$data = json_decode(file_get_contents('php://input'), true);

// Validar datos recibidos
if (!$data || !isset($data['fecha']) || !isset($data['cliente']) || !isset($data['productos'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Datos incompletos'
    ]);
    exit;
}

$fecha = $data['fecha'];
$cliente = $data['cliente'];
$productos = $data['productos'];
$subtotal = isset($data['subtotal']) ? floatval($data['subtotal']) : 0;
$creditos = isset($data['creditos']) ? floatval($data['creditos']) : 0;
$total = isset($data['total']) ? floatval($data['total']) : 0;

// Validar que haya productos
if (empty($productos)) {
    echo json_encode([
        'success' => false,
        'error' => 'No hay productos en la factura'
    ]);
    exit;
}

// Iniciar transacción
$conexion->begin_transaction();

try {
    // Insertar factura
    $stmt = $conexion->prepare("INSERT INTO facturas (fecha, cliente, subtotal, creditos, total) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssddd", $fecha, $cliente, $subtotal, $creditos, $total);
    
    if (!$stmt->execute()) {
        throw new Exception("Error al guardar la factura");
    }
    
    $factura_id = $conexion->insert_id;
    $stmt->close();
    
    // Insertar detalle de factura
    $stmt_detalle = $conexion->prepare("INSERT INTO detalle_factura (factura_id, producto_id, upc, descripcion, cantidad, precio, total) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    foreach ($productos as $prod) {
        $producto_id = null;
        $upc = isset($prod['upc']) ? $prod['upc'] : '';
        $descripcion = $prod['descripcion'];
        $cantidad = floatval($prod['cantidad']);
        $precio = floatval($prod['precio']);
        $total_linea = floatval($prod['total']);
        
        // Buscar si el producto existe
        if (!empty($upc)) {
            $stmt_prod = $conexion->prepare("SELECT id FROM productos WHERE upc = ?");
            $stmt_prod->bind_param("s", $upc);
            $stmt_prod->execute();
            $result_prod = $stmt_prod->get_result();
            
            if ($result_prod->num_rows > 0) {
                $row = $result_prod->fetch_assoc();
                $producto_id = $row['id'];
            } else {
                // Insertar nuevo producto si no existe
                $stmt_new_prod = $conexion->prepare("INSERT INTO productos (upc, producto, precio, unidad) VALUES (?, ?, ?, 'PZA')");
                $stmt_new_prod->bind_param("ssd", $upc, $descripcion, $precio);
                if ($stmt_new_prod->execute()) {
                    $producto_id = $conexion->insert_id;
                }
                $stmt_new_prod->close();
            }
            $stmt_prod->close();
        }
        
        // Insertar detalle
        $stmt_detalle->bind_param("iissddd", $factura_id, $producto_id, $upc, $descripcion, $cantidad, $precio, $total_linea);
        if (!$stmt_detalle->execute()) {
            throw new Exception("Error al guardar detalle de factura");
        }
    }
    $stmt_detalle->close();
    
    // Generar PDF
    $pdf_filename = 'factura_' . $factura_id . '_' . date('YmdHis') . '.pdf';
    $pdf_path = 'pdfs/' . $pdf_filename;
    
    // Crear PDF con FPDF
    $pdf = new FPDF('P', 'mm', 'Letter');
    $pdf->AddPage();
    
    // Encabezado
    $pdf->SetFont('Arial', 'B', 20);
    $pdf->SetTextColor(29, 132, 69); // Verde institucional
    $pdf->Cell(0, 10, 'EL MEXIQUENSE MARKET', 0, 1, 'C');
    
    $pdf->SetFont('Arial', '', 12);
    $pdf->SetTextColor(0, 0, 0);
    $pdf->Cell(0, 6, 'Sistema de Facturacion', 0, 1, 'C');
    $pdf->Ln(5);
    
    // Información de la factura
    $pdf->SetFont('Arial', 'B', 12);
    $pdf->Cell(0, 6, 'FACTURA #' . str_pad($factura_id, 6, '0', STR_PAD_LEFT), 0, 1, 'L');
    $pdf->SetFont('Arial', '', 10);
    $pdf->Cell(0, 5, 'Fecha: ' . date('d/m/Y', strtotime($fecha)), 0, 1);
    $pdf->Cell(0, 5, 'Cliente: ' . $cliente, 0, 1);
    $pdf->Ln(5);
    
    // Tabla de productos
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetFillColor(29, 132, 69);
    $pdf->SetTextColor(255, 255, 255);
    
    $pdf->Cell(25, 7, 'UPC', 1, 0, 'C', true);
    $pdf->Cell(80, 7, 'Descripcion', 1, 0, 'C', true);
    $pdf->Cell(20, 7, 'Cant.', 1, 0, 'C', true);
    $pdf->Cell(25, 7, 'Precio', 1, 0, 'C', true);
    $pdf->Cell(30, 7, 'Total', 1, 1, 'C', true);
    
    // Productos
    $pdf->SetFont('Arial', '', 9);
    $pdf->SetTextColor(0, 0, 0);
    
    foreach ($productos as $prod) {
        $pdf->Cell(25, 6, substr($prod['upc'], 0, 12), 1, 0, 'L');
        $pdf->Cell(80, 6, substr($prod['descripcion'], 0, 40), 1, 0, 'L');
        $pdf->Cell(20, 6, number_format($prod['cantidad'], 2), 1, 0, 'C');
        $pdf->Cell(25, 6, '$' . number_format($prod['precio'], 2), 1, 0, 'R');
        $pdf->Cell(30, 6, '$' . number_format($prod['total'], 2), 1, 1, 'R');
    }
    
    $pdf->Ln(5);
    
    // Totales
    $pdf->SetFont('Arial', 'B', 11);
    $pdf->Cell(130, 6, '', 0, 0);
    $pdf->Cell(25, 6, 'Subtotal:', 0, 0, 'R');
    $pdf->Cell(30, 6, '$' . number_format($subtotal, 2), 0, 1, 'R');
    
    if ($creditos > 0) {
        $pdf->SetTextColor(29, 132, 69);
        $pdf->Cell(130, 6, '', 0, 0);
        $pdf->Cell(25, 6, 'Creditos:', 0, 0, 'R');
        $pdf->Cell(30, 6, '-$' . number_format($creditos, 2), 0, 1, 'R');
    }
    
    $pdf->SetTextColor(212, 84, 56); // Rojo institucional
    $pdf->SetFont('Arial', 'B', 14);
    $pdf->Cell(130, 8, '', 0, 0);
    $pdf->Cell(25, 8, 'TOTAL:', 0, 0, 'R');
    $pdf->Cell(30, 8, '$' . number_format($total, 2), 0, 1, 'R');
    
    $pdf->Ln(10);
    
    // Pie de página
    $pdf->SetFont('Arial', 'I', 8);
    $pdf->SetTextColor(100, 100, 100);
    $pdf->Cell(0, 5, 'Gracias por su compra - El Mexiquense Market', 0, 1, 'C');
    $pdf->Cell(0, 5, 'Sistema de Facturacion v1.0', 0, 1, 'C');
    
    // Guardar PDF
    $pdf->Output('F', $pdf_path);
    
    // Actualizar ruta del PDF en la base de datos
    $stmt_update = $conexion->prepare("UPDATE facturas SET pdf_path = ? WHERE id = ?");
    $stmt_update->bind_param("si", $pdf_path, $factura_id);
    $stmt_update->execute();
    $stmt_update->close();
    
    // Confirmar transacción
    $conexion->commit();
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'factura_id' => $factura_id,
        'pdf_url' => $pdf_path,
        'mensaje' => 'Factura guardada exitosamente'
    ]);
    
} catch (Exception $e) {
    // Revertir transacción en caso de error
    $conexion->rollback();
    
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

// Cerrar conexión
cerrarConexion();
?>
