<?php
/**
 * Clase FPDF simplificada para generación de PDFs
 * Versión minimalista adaptada para El Mexiquense Market
 */

class FPDF {
    protected $page;
    protected $y;
    protected $x;
    protected $fontSize = 12;
    protected $fontFamily = 'Arial';
    protected $fontStyle = '';
    protected $pages = [];
    protected $currentPage = 0;
    protected $pageWidth = 216; // 8.5 inches in mm
    protected $pageHeight = 279; // 11 inches in mm
    protected $leftMargin = 10;
    protected $topMargin = 10;
    protected $rightMargin = 10;
    protected $lineHeight = 5;
    protected $fillColor = [255, 255, 255];
    protected $textColor = [0, 0, 0];
    protected $drawColor = [0, 0, 0];
    
    public function __construct($orientation = 'P', $unit = 'mm', $size = 'Letter') {
        $this->AddPage();
    }
    
    public function AddPage() {
        $this->currentPage++;
        $this->pages[$this->currentPage] = '';
        $this->y = $this->topMargin;
        $this->x = $this->leftMargin;
    }
    
    public function SetFont($family, $style = '', $size = 12) {
        $this->fontFamily = $family;
        $this->fontStyle = $style;
        $this->fontSize = $size;
    }
    
    public function SetFillColor($r, $g, $b) {
        $this->fillColor = [$r, $g, $b];
    }
    
    public function SetTextColor($r, $g, $b) {
        $this->textColor = [$r, $g, $b];
    }
    
    public function SetDrawColor($r, $g, $b) {
        $this->drawColor = [$r, $g, $b];
    }
    
    public function SetXY($x, $y) {
        $this->x = $x;
        $this->y = $y;
    }
    
    public function SetX($x) {
        $this->x = $x;
    }
    
    public function SetY($y) {
        $this->y = $y;
    }
    
    public function GetX() {
        return $this->x;
    }
    
    public function GetY() {
        return $this->y;
    }
    
    public function Cell($w, $h = 0, $txt = '', $border = 0, $ln = 0, $align = '', $fill = false) {
        $h = $h ?: $this->lineHeight;
        $this->pages[$this->currentPage] .= $this->formatText($txt, $align, $w);
        
        if ($ln == 1) {
            $this->Ln($h);
        } elseif ($ln == 2) {
            $this->x = $this->leftMargin;
        } else {
            $this->x += $w;
        }
    }
    
    public function MultiCell($w, $h, $txt, $border = 0, $align = 'L', $fill = false) {
        $lines = explode("\n", $txt);
        foreach ($lines as $line) {
            $this->Cell($w, $h, $line, $border, 1, $align, $fill);
        }
    }
    
    public function Ln($h = null) {
        $this->y += $h ?: $this->lineHeight;
        $this->x = $this->leftMargin;
        $this->pages[$this->currentPage] .= "\n";
    }
    
    public function Image($file, $x, $y, $w = 0, $h = 0) {
        // Simplificado: solo añadir marcador de imagen
        $this->pages[$this->currentPage] .= "[IMAGE: $file]";
    }
    
    public function Line($x1, $y1, $x2, $y2) {
        $this->pages[$this->currentPage] .= str_repeat('_', 80) . "\n";
    }
    
    protected function formatText($txt, $align, $width) {
        $txt = iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $txt);
        
        switch ($align) {
            case 'C':
                return str_pad($txt, $width, ' ', STR_PAD_BOTH);
            case 'R':
                return str_pad($txt, $width, ' ', STR_PAD_LEFT);
            default:
                return str_pad($txt, $width, ' ', STR_PAD_RIGHT);
        }
    }
    
    public function Output($dest = '', $name = '') {
        $content = $this->buildPDF();
        
        if ($dest == 'F') {
            return file_put_contents($name, $content);
        } elseif ($dest == 'S') {
            return $content;
        } else {
            header('Content-Type: application/pdf');
            header('Content-Disposition: inline; filename="' . $name . '"');
            echo $content;
        }
    }
    
    protected function buildPDF() {
        // Generar estructura básica de PDF
        $content = "%PDF-1.4\n";
        $content .= "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
        $content .= "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
        
        // Contenido de la página
        $pageContent = '';
        foreach ($this->pages as $page) {
            $pageContent .= $page;
        }
        
        $stream = "BT\n/F1 {$this->fontSize} Tf\n50 750 Td\n";
        $lines = explode("\n", $pageContent);
        $y = 750;
        foreach ($lines as $line) {
            $stream .= "({$line}) Tj\n0 -" . ($this->lineHeight * 2) . " Td\n";
            $y -= $this->lineHeight * 2;
        }
        $stream .= "ET\n";
        
        $streamLength = strlen($stream);
        
        $content .= "3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n";
        $content .= "4 0 obj\n<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>\nendobj\n";
        $content .= "5 0 obj\n<< /Length $streamLength >>\nstream\n$stream\nendstream\nendobj\n";
        
        $content .= "xref\n0 6\n0000000000 65535 f \n";
        $content .= "0000000009 00000 n \n";
        $content .= "0000000058 00000 n \n";
        $content .= sprintf("%010d 00000 n \n", strpos($content, "3 0 obj"));
        $content .= sprintf("%010d 00000 n \n", strpos($content, "4 0 obj"));
        $content .= sprintf("%010d 00000 n \n", strpos($content, "5 0 obj"));
        
        $content .= "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n";
        $content .= strlen($content) + 9;
        $content .= "\n%%EOF";
        
        return $content;
    }
}
?>
