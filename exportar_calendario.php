<?php
/**
 * Exportar calendario de reservas en formato PDF
 * AURA Studio - Sistema de Reservaciones
 * 
 * Genera un PDF con diseño de calendario profesional
 * incluyendo el logotipo de AURA y las reservas organizadas por fecha
 */

header('Content-Type: application/json; charset=utf-8');

// Verificar que haya datos enviados
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['reservations']) || empty($data['reservations'])) {
    echo json_encode([
        'success' => false,
        'error' => 'No hay datos de reservas para exportar'
    ]);
    exit;
}

require_once 'fpdf/fpdf.php';

$reservations = $data['reservations'];

// Agrupar reservas por fecha
$reservationsByDate = [];
foreach ($reservations as $reservation) {
    $date = $reservation['date'];
    if (!isset($reservationsByDate[$date])) {
        $reservationsByDate[$date] = [];
    }
    $reservationsByDate[$date][] = $reservation;
}

// Ordenar fechas
ksort($reservationsByDate);

// Crear PDF personalizado
class CalendarPDF extends FPDF {
    private $logoPath;
    
    function __construct($logoPath) {
        parent::__construct('P', 'mm', 'Letter');
        $this->logoPath = $logoPath;
    }
    
    // Encabezado
    function Header() {
        // Logo
        if (file_exists($this->logoPath)) {
            $this->Image($this->logoPath, 15, 10, 30);
        }
        
        // Título
        $this->SetFont('Arial', 'B', 24);
        $this->SetTextColor(139, 110, 85); // Color café elegante
        $this->Cell(0, 15, '', 0, 1); // Espacio para el logo
        $this->Cell(0, 10, 'AURA STUDIO', 0, 1, 'C');
        
        // Subtítulo
        $this->SetFont('Arial', '', 14);
        $this->SetTextColor(100, 100, 100);
        $this->Cell(0, 8, 'Calendario de Reservaciones', 0, 1, 'C');
        
        // Fecha de generación
        $this->SetFont('Arial', 'I', 9);
        $this->SetTextColor(120, 120, 120);
        $fechaActual = date('d/m/Y H:i');
        $this->Cell(0, 6, 'Generado el ' . $fechaActual, 0, 1, 'C');
        
        $this->Ln(5);
        
        // Línea decorativa
        $this->SetDrawColor(139, 110, 85);
        $this->SetLineWidth(0.5);
        $this->Line(15, $this->GetY(), 200, $this->GetY());
        $this->Ln(8);
    }
    
    // Pie de página
    function Footer() {
        $this->SetY(-20);
        
        // Línea decorativa
        $this->SetDrawColor(139, 110, 85);
        $this->SetLineWidth(0.5);
        $this->Line(15, $this->GetY(), 200, $this->GetY());
        $this->Ln(3);
        
        // Texto del pie
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(120, 120, 120);
        $this->Cell(0, 5, 'AURA Studio - Sistema de Gestión de Reservaciones', 0, 1, 'C');
        
        // Número de página
        $this->SetFont('Arial', '', 8);
        $this->Cell(0, 4, 'Pagina ' . $this->PageNo(), 0, 0, 'C');
    }
    
    // Función para dibujar una tarjeta de fecha
    function DrawDateCard($date, $reservations) {
        // Verificar si necesitamos una nueva página
        if ($this->GetY() > 240) {
            $this->AddPage();
        }
        
        // Formatear fecha en español
        $dateObj = DateTime::createFromFormat('Y-m-d', $date);
        if (!$dateObj) {
            $dateObj = new DateTime($date);
        }
        
        $dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        $meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        $diaNombre = $dias[$dateObj->format('w')];
        $dia = $dateObj->format('d');
        $mes = $meses[$dateObj->format('n') - 1];
        $anio = $dateObj->format('Y');
        
        $fechaFormateada = "$diaNombre, $dia de $mes de $anio";
        
        $startY = $this->GetY();
        
        // Fondo de la tarjeta de fecha
        $this->SetFillColor(239, 233, 225); // Color crema elegante
        $this->Rect(15, $startY, 185, 12, 'F');
        
        // Borde de la tarjeta
        $this->SetDrawColor(139, 110, 85);
        $this->SetLineWidth(0.3);
        $this->Rect(15, $startY, 185, 12);
        
        // Texto de la fecha
        $this->SetXY(15, $startY + 3);
        $this->SetFont('Arial', 'B', 12);
        $this->SetTextColor(80, 60, 45);
        $this->Cell(185, 6, $fechaFormateada, 0, 1, 'C');
        
        $this->Ln(2);
        
        // Encabezado de tabla de reservas
        $this->SetFillColor(139, 110, 85);
        $this->SetTextColor(255, 255, 255);
        $this->SetFont('Arial', 'B', 10);
        
        $this->Cell(30, 7, 'Hora', 1, 0, 'C', true);
        $this->Cell(70, 7, 'Cliente', 1, 0, 'C', true);
        $this->Cell(40, 7, 'Telefono', 1, 0, 'C', true);
        $this->Cell(45, 7, 'Notas', 1, 1, 'C', true);
        
        // Contenido de las reservas
        $this->SetFont('Arial', '', 9);
        $this->SetTextColor(50, 50, 50);
        
        foreach ($reservations as $res) {
            // Verificar si necesitamos una nueva página
            if ($this->GetY() > 250) {
                $this->AddPage();
                
                // Re-imprimir encabezado de tabla
                $this->SetFillColor(139, 110, 85);
                $this->SetTextColor(255, 255, 255);
                $this->SetFont('Arial', 'B', 10);
                
                $this->Cell(30, 7, 'Hora', 1, 0, 'C', true);
                $this->Cell(70, 7, 'Cliente', 1, 0, 'C', true);
                $this->Cell(40, 7, 'Telefono', 1, 0, 'C', true);
                $this->Cell(45, 7, 'Notas', 1, 1, 'C', true);
                
                $this->SetFont('Arial', '', 9);
                $this->SetTextColor(50, 50, 50);
            }
            
            // Alternar colores de fila
            $fillColor = ($this->GetY() / 6) % 2 == 0 ? [255, 255, 255] : [250, 248, 245];
            $this->SetFillColor($fillColor[0], $fillColor[1], $fillColor[2]);
            
            $time = isset($res['time']) ? $res['time'] : '';
            $name = isset($res['name']) ? substr($res['name'], 0, 35) : '';
            $phone = isset($res['phone']) ? $res['phone'] : '';
            $notes = isset($res['notes']) ? substr($res['notes'], 0, 25) : '';
            
            $this->Cell(30, 6, $time, 1, 0, 'C', true);
            $this->Cell(70, 6, $name, 1, 0, 'L', true);
            $this->Cell(40, 6, $phone, 1, 0, 'C', true);
            $this->Cell(45, 6, $notes, 1, 1, 'L', true);
        }
        
        $this->Ln(6);
    }
    
    // Función para dibujar resumen
    function DrawSummary($totalReservations, $totalDays) {
        // Verificar si necesitamos una nueva página
        if ($this->GetY() > 230) {
            $this->AddPage();
        }
        
        $this->Ln(5);
        
        // Fondo del resumen
        $this->SetFillColor(239, 233, 225);
        $startY = $this->GetY();
        $this->Rect(15, $startY, 185, 20, 'F');
        
        // Borde
        $this->SetDrawColor(139, 110, 85);
        $this->SetLineWidth(0.3);
        $this->Rect(15, $startY, 185, 20);
        
        // Título del resumen
        $this->SetXY(15, $startY + 3);
        $this->SetFont('Arial', 'B', 12);
        $this->SetTextColor(80, 60, 45);
        $this->Cell(185, 6, 'Resumen del Periodo', 0, 1, 'C');
        
        // Estadísticas
        $this->SetFont('Arial', '', 10);
        $this->SetTextColor(60, 60, 60);
        $this->SetX(15);
        $this->Cell(185, 5, "Total de Reservaciones: $totalReservations", 0, 1, 'C');
        $this->SetX(15);
        $this->Cell(185, 5, "Total de Días con Reservaciones: $totalDays", 0, 1, 'C');
    }
}

try {
    // Crear instancia del PDF
    $logoPath = __DIR__ . '/auralogo2.png';
    $pdf = new CalendarPDF($logoPath);
    $pdf->AliasNbPages();
    $pdf->AddPage();
    $pdf->SetAutoPageBreak(true, 25);
    
    // Dibujar cada fecha con sus reservas
    foreach ($reservationsByDate as $date => $dateReservations) {
        $pdf->DrawDateCard($date, $dateReservations);
    }
    
    // Agregar resumen al final
    $totalReservations = count($reservations);
    $totalDays = count($reservationsByDate);
    $pdf->DrawSummary($totalReservations, $totalDays);
    
    // Generar nombre de archivo
    $timestamp = date('Y-m-d_His');
    $filename = "calendario_reservas_aura_{$timestamp}.pdf";
    $filepath = __DIR__ . '/pdfs/' . $filename;
    
    // Asegurar que el directorio existe
    if (!is_dir(__DIR__ . '/pdfs')) {
        mkdir(__DIR__ . '/pdfs', 0755, true);
    }
    
    // Guardar PDF
    $pdf->Output('F', $filepath);
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'filename' => $filename,
        'filepath' => 'pdfs/' . $filename,
        'message' => 'Calendario exportado exitosamente'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error al generar PDF: ' . $e->getMessage()
    ]);
}
?>
