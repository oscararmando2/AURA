-- Base de datos para El Mexiquense Market - Sistema de Facturación
-- Creado: 2025-11-10

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS el_mexiquense_market CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE el_mexiquense_market;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    upc VARCHAR(50) NOT NULL UNIQUE,
    producto VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    unidad VARCHAR(50) DEFAULT 'PZA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_upc (upc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS facturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    cliente VARCHAR(255) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    creditos DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    pdf_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_fecha (fecha),
    INDEX idx_cliente (cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de detalle de facturas
CREATE TABLE IF NOT EXISTS detalle_factura (
    id INT AUTO_INCREMENT PRIMARY KEY,
    factura_id INT NOT NULL,
    producto_id INT,
    upc VARCHAR(50),
    descripcion VARCHAR(255) NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL,
    INDEX idx_factura_id (factura_id),
    INDEX idx_producto_id (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar algunos productos de ejemplo
INSERT INTO productos (upc, producto, precio, unidad) VALUES
('7501000123456', 'Coca Cola 600ml', 15.50, 'PZA'),
('7501000234567', 'Pan Blanco Bimbo Grande', 38.00, 'PZA'),
('7501000345678', 'Leche Lala Entera 1L', 24.50, 'LT'),
('7501000456789', 'Huevo San Juan 12 pzas', 45.00, 'KG'),
('7501000567890', 'Aceite Nutrioli 1L', 52.00, 'LT'),
('7501000678901', 'Arroz Verde Valle 1kg', 28.50, 'KG'),
('7501000789012', 'Frijol Negro 1kg', 32.00, 'KG'),
('7501000890123', 'Azúcar Estándar 1kg', 25.00, 'KG'),
('7501000901234', 'Sal La Fina 1kg', 12.50, 'KG'),
('7501001012345', 'Café Nescafé Clásico 200g', 89.00, 'PZA'),
('7501001123456', 'Jabón Zote Rosa 200g', 15.00, 'PZA'),
('7501001234567', 'Papel Higiénico Regio 4 rollos', 42.00, 'PZA'),
('7501001345678', 'Detergente Ariel 1kg', 68.00, 'KG'),
('7501001456789', 'Tortillas de Maíz 1kg', 18.00, 'KG'),
('7501001567890', 'Agua Bonafont 1.5L', 12.00, 'LT'),
('7501001678901', 'Aguacate Hass', 65.00, 'KG'),
('7501001789012', 'Jitomate Bola', 28.00, 'KG'),
('7501001890123', 'Cebolla Blanca', 22.00, 'KG'),
('7501001901234', 'Papa Blanca', 25.00, 'KG'),
('7501002012345', 'Limón Persa', 18.00, 'KG');

-- Mensaje de confirmación
SELECT 'Base de datos creada exitosamente con productos de ejemplo' as mensaje;
