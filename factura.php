<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Facturación - El Mexiquense Market</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --verde-principal: #1D8445;
            --rojo-principal: #D45438;
            --fondo-claro: #FAFAFA;
            --blanco: #FFFFFF;
            --texto-oscuro: #333333;
            --gris-claro: #E0E0E0;
            --sombra: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: var(--fondo-claro);
            color: var(--texto-oscuro);
            line-height: 1.6;
        }

        .header {
            background: linear-gradient(135deg, var(--verde-principal) 0%, #157a3c 100%);
            color: var(--blanco);
            padding: 25px 40px;
            box-shadow: var(--sombra);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 14px;
            font-weight: 300;
            opacity: 0.9;
        }

        .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 30px 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        .panel {
            background: var(--blanco);
            border-radius: 16px;
            padding: 30px;
            box-shadow: var(--sombra);
        }

        .panel h2 {
            color: var(--verde-principal);
            font-size: 22px;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--texto-oscuro);
            font-size: 14px;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--gris-claro);
            border-radius: 10px;
            font-size: 14px;
            font-family: 'Poppins', sans-serif;
            transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: var(--verde-principal);
            box-shadow: 0 0 0 3px rgba(29, 132, 69, 0.1);
        }

        .help-text {
            font-size: 12px;
            color: #777;
            margin-top: 5px;
            font-style: italic;
        }

        .productos-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 13px;
        }

        .productos-table thead {
            background-color: var(--verde-principal);
            color: var(--blanco);
        }

        .productos-table th {
            padding: 12px 10px;
            text-align: left;
            font-weight: 600;
        }

        .productos-table td {
            padding: 10px;
            border-bottom: 1px solid var(--gris-claro);
        }

        .productos-table tbody tr:hover {
            background-color: #f5f5f5;
        }

        .productos-table input {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--gris-claro);
            border-radius: 6px;
            font-size: 13px;
        }

        .productos-table input:focus {
            outline: none;
            border-color: var(--verde-principal);
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: var(--verde-principal);
            color: var(--blanco);
        }

        .btn-primary:hover {
            background: #157a3c;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(29, 132, 69, 0.3);
        }

        .btn-secondary {
            background: var(--gris-claro);
            color: var(--texto-oscuro);
        }

        .btn-secondary:hover {
            background: #d0d0d0;
        }

        .btn-danger {
            background: var(--rojo-principal);
            color: var(--blanco);
            padding: 6px 12px;
            font-size: 12px;
        }

        .btn-danger:hover {
            background: #c04332;
        }

        .btn-group {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }

        .totales {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 12px;
            margin-top: 20px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 15px;
        }

        .total-row.final {
            border-top: 2px solid var(--verde-principal);
            margin-top: 10px;
            padding-top: 12px;
        }

        .total-row.final .label {
            font-size: 20px;
            font-weight: 700;
            color: var(--texto-oscuro);
        }

        .total-row.final .value {
            font-size: 24px;
            font-weight: 700;
            color: var(--rojo-principal);
        }

        .pdf-viewer {
            width: 100%;
            height: 800px;
            border: none;
            border-radius: 12px;
            background: var(--blanco);
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 400px;
            color: #999;
            text-align: center;
        }

        .empty-state-icon {
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.3;
        }

        .alert {
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: none;
        }

        .alert.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .alert.show {
            display: block;
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: var(--blanco);
            animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Autocomplete dropdown styles */
        .autocomplete-container {
            position: relative;
        }

        .autocomplete-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--blanco);
            border: 2px solid var(--verde-principal);
            border-top: none;
            border-radius: 0 0 8px 8px;
            max-height: 250px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: none;
        }

        .autocomplete-dropdown.show {
            display: block;
        }

        .autocomplete-item {
            padding: 10px 12px;
            cursor: pointer;
            border-bottom: 1px solid var(--gris-claro);
            transition: background-color 0.2s ease;
        }

        .autocomplete-item:last-child {
            border-bottom: none;
        }

        .autocomplete-item:hover,
        .autocomplete-item.selected {
            background-color: #e8f5e9;
        }

        .autocomplete-item-upc {
            font-weight: 600;
            color: var(--verde-principal);
            font-size: 13px;
        }

        .autocomplete-item-name {
            color: var(--texto-oscuro);
            font-size: 12px;
            margin-top: 2px;
        }

        .autocomplete-item-price {
            color: var(--rojo-principal);
            font-weight: 600;
            font-size: 12px;
            margin-top: 2px;
        }

        .autocomplete-no-results {
            padding: 12px;
            text-align: center;
            color: #999;
            font-size: 12px;
            font-style: italic;
        }

        @media (max-width: 1200px) {
            .container {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .header {
                padding: 20px;
            }

            .header h1 {
                font-size: 22px;
            }

            .panel {
                padding: 20px;
            }

            .productos-table {
                font-size: 11px;
            }

            .productos-table th,
            .productos-table td {
                padding: 8px 5px;
            }
        }
    </style>
</head>
<body>
    <!-- Cabecera -->
    <div class="header">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div>
                <h1>🛒 EL MEXIQUENSE MARKET</h1>
                <p>Sistema de Facturación Profesional</p>
            </div>
            <a href="index.html" style="background: rgba(255, 255, 255, 0.2); color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: 500; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;" onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                ← Volver a AURA Studio
            </a>
        </div>
    </div>

    <div class="container">
        <!-- Panel de Factura -->
        <div class="panel">
            <h2>📋 Nueva Factura</h2>
            
            <div id="alertContainer"></div>

            <!-- Información General -->
            <div class="form-group">
                <label for="fecha">Fecha</label>
                <input type="date" id="fecha" required>
            </div>

            <div class="form-group">
                <label for="cliente">Cliente</label>
                <input type="text" id="cliente" placeholder="Nombre del cliente" required>
            </div>

            <!-- Tabla de Productos -->
            <h3 style="margin: 25px 0 15px; color: var(--texto-oscuro); font-size: 18px;">Productos</h3>
            <p class="help-text">💡 Ingresa el UPC y el sistema autocompletará el producto y precio</p>

            <table class="productos-table" id="tablaProductos">
                <thead>
                    <tr>
                        <th style="width: 120px;">UPC</th>
                        <th>Descripción</th>
                        <th style="width: 80px;">Cantidad</th>
                        <th style="width: 100px;">Precio</th>
                        <th style="width: 100px;">Total</th>
                        <th style="width: 60px;"></th>
                    </tr>
                </thead>
                <tbody id="productosBody">
                    <tr class="producto-row">
                        <td>
                            <div class="autocomplete-container">
                                <input type="text" class="upc-input" placeholder="7501000..." maxlength="20" autocomplete="off">
                                <div class="autocomplete-dropdown"></div>
                            </div>
                        </td>
                        <td><input type="text" class="descripcion-input" placeholder="Nombre del producto"></td>
                        <td><input type="number" class="cantidad-input" value="1" min="0" step="0.01"></td>
                        <td><input type="number" class="precio-input" value="0" min="0" step="0.01"></td>
                        <td><input type="number" class="total-input" value="0" readonly></td>
                        <td><button class="btn btn-danger btn-eliminar" onclick="eliminarLinea(this)">✕</button></td>
                    </tr>
                </tbody>
            </table>

            <button class="btn btn-secondary" onclick="agregarLinea()">➕ Agregar Línea</button>

            <!-- Totales -->
            <div class="totales">
                <div class="total-row">
                    <span class="label">Subtotal:</span>
                    <span class="value" id="subtotal">$0.00</span>
                </div>
                <div class="total-row">
                    <span class="label">Créditos:</span>
                    <span class="value">
                        <input type="number" id="creditos" value="0" min="0" step="0.01" 
                               style="width: 120px; padding: 6px; border: 1px solid var(--gris-claro); border-radius: 6px;"
                               onchange="calcularTotales()">
                    </span>
                </div>
                <div class="total-row final">
                    <span class="label">TOTAL:</span>
                    <span class="value" id="total">$0.00</span>
                </div>
            </div>

            <!-- Botones -->
            <div class="btn-group">
                <button class="btn btn-primary" onclick="guardarFactura()" id="btnGuardar">
                    💾 Guardar Factura
                </button>
                <button class="btn btn-secondary" onclick="limpiarFormulario()">
                    🔄 Nueva Factura
                </button>
            </div>
        </div>

        <!-- Panel de PDF -->
        <div class="panel">
            <h2>📄 Vista Previa del PDF</h2>
            <div id="pdfContainer">
                <div class="empty-state">
                    <div class="empty-state-icon">📄</div>
                    <p><strong>Sin PDF generado</strong></p>
                    <p>Guarda una factura para ver el PDF aquí</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Inicializar fecha actual
        document.getElementById('fecha').valueAsDate = new Date();

        // Variables para el autocomplete
        let autocompleteTimeout = null;
        let selectedIndex = -1;

        // Autocompletar producto por UPC
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('upc-input')) {
                const upc = e.target.value.trim();
                
                // Mostrar dropdown de autocomplete si hay al menos 3 caracteres
                if (upc.length >= 3) {
                    clearTimeout(autocompleteTimeout);
                    autocompleteTimeout = setTimeout(() => {
                        mostrarAutocomplete(upc, e.target);
                    }, 300);
                } else {
                    ocultarAutocomplete(e.target);
                }
                
                // Auto-completar si el UPC es completo (al menos 7 caracteres)
                if (upc.length >= 7) {
                    buscarProducto(upc, e.target);
                }
            }

            // Calcular total de la línea
            if (e.target.classList.contains('cantidad-input') || e.target.classList.contains('precio-input')) {
                calcularLineaTotal(e.target);
            }
        });

        // Manejar navegación con teclado en autocomplete
        document.addEventListener('keydown', function(e) {
            if (!e.target.classList.contains('upc-input')) return;
            
            const dropdown = e.target.closest('.autocomplete-container').querySelector('.autocomplete-dropdown');
            if (!dropdown.classList.contains('show')) return;
            
            const items = dropdown.querySelectorAll('.autocomplete-item');
            if (items.length === 0) return;
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                actualizarSeleccionAutocomplete(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                actualizarSeleccionAutocomplete(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < items.length) {
                    items[selectedIndex].click();
                }
            } else if (e.key === 'Escape') {
                ocultarAutocomplete(e.target);
            }
        });

        // Cerrar autocomplete al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.autocomplete-container')) {
                document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });

        // Buscar producto por UPC
        async function buscarProducto(upc, inputElement) {
            try {
                const response = await fetch(`buscar.php?upc=${encodeURIComponent(upc)}`);
                const data = await response.json();

                if (data.success) {
                    const row = inputElement.closest('tr');
                    const descripcionInput = row.querySelector('.descripcion-input');
                    const precioInput = row.querySelector('.precio-input');

                    descripcionInput.value = data.producto.nombre;
                    precioInput.value = data.producto.precio;

                    calcularLineaTotal(precioInput);
                }
            } catch (error) {
                console.error('Error al buscar producto:', error);
            }
        }

        // Mostrar dropdown de autocomplete
        async function mostrarAutocomplete(search, inputElement) {
            try {
                const response = await fetch(`buscar_autocomplete.php?search=${encodeURIComponent(search)}`);
                const data = await response.json();
                
                const container = inputElement.closest('.autocomplete-container');
                const dropdown = container.querySelector('.autocomplete-dropdown');
                dropdown.innerHTML = '';
                selectedIndex = -1;
                
                if (data.success && data.productos.length > 0) {
                    data.productos.forEach(producto => {
                        const item = document.createElement('div');
                        item.className = 'autocomplete-item';
                        item.innerHTML = `
                            <div class="autocomplete-item-upc">UPC: ${producto.upc}</div>
                            <div class="autocomplete-item-name">${producto.nombre}</div>
                            <div class="autocomplete-item-price">$${producto.precio} / ${producto.unidad}</div>
                        `;
                        
                        item.addEventListener('click', function() {
                            seleccionarProducto(producto, inputElement);
                        });
                        
                        dropdown.appendChild(item);
                    });
                    
                    dropdown.classList.add('show');
                } else if (search.length >= 3) {
                    dropdown.innerHTML = '<div class="autocomplete-no-results">No se encontraron productos</div>';
                    dropdown.classList.add('show');
                }
            } catch (error) {
                console.error('Error al buscar autocomplete:', error);
            }
        }

        // Ocultar dropdown de autocomplete
        function ocultarAutocomplete(inputElement) {
            const container = inputElement.closest('.autocomplete-container');
            const dropdown = container.querySelector('.autocomplete-dropdown');
            dropdown.classList.remove('show');
            dropdown.innerHTML = '';
            selectedIndex = -1;
        }

        // Seleccionar producto del autocomplete
        function seleccionarProducto(producto, inputElement) {
            const row = inputElement.closest('tr');
            const upcInput = row.querySelector('.upc-input');
            const descripcionInput = row.querySelector('.descripcion-input');
            const precioInput = row.querySelector('.precio-input');
            
            // Llenar los campos
            upcInput.value = producto.upc;
            descripcionInput.value = producto.nombre;
            precioInput.value = producto.precio;
            
            // Calcular total de la línea
            calcularLineaTotal(precioInput);
            
            // Ocultar dropdown
            ocultarAutocomplete(inputElement);
        }

        // Actualizar selección visual en autocomplete
        function actualizarSeleccionAutocomplete(items) {
            items.forEach((item, index) => {
                if (index === selectedIndex) {
                    item.classList.add('selected');
                    item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                } else {
                    item.classList.remove('selected');
                }
            });
        }

        // Calcular total de una línea
        function calcularLineaTotal(inputElement) {
            const row = inputElement.closest('tr');
            const cantidad = parseFloat(row.querySelector('.cantidad-input').value) || 0;
            const precio = parseFloat(row.querySelector('.precio-input').value) || 0;
            const totalInput = row.querySelector('.total-input');

            const total = cantidad * precio;
            totalInput.value = total.toFixed(2);

            calcularTotales();
        }

        // Calcular totales generales
        function calcularTotales() {
            let subtotal = 0;
            
            document.querySelectorAll('.producto-row').forEach(row => {
                const total = parseFloat(row.querySelector('.total-input').value) || 0;
                subtotal += total;
            });

            const creditos = parseFloat(document.getElementById('creditos').value) || 0;
            const total = subtotal - creditos;

            document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
            document.getElementById('total').textContent = '$' + total.toFixed(2);
        }

        // Agregar nueva línea de producto
        function agregarLinea() {
            const tbody = document.getElementById('productosBody');
            const newRow = document.createElement('tr');
            newRow.className = 'producto-row';
            newRow.innerHTML = `
                <td>
                    <div class="autocomplete-container">
                        <input type="text" class="upc-input" placeholder="7501000..." maxlength="20" autocomplete="off">
                        <div class="autocomplete-dropdown"></div>
                    </div>
                </td>
                <td><input type="text" class="descripcion-input" placeholder="Nombre del producto"></td>
                <td><input type="number" class="cantidad-input" value="1" min="0" step="0.01"></td>
                <td><input type="number" class="precio-input" value="0" min="0" step="0.01"></td>
                <td><input type="number" class="total-input" value="0" readonly></td>
                <td><button class="btn btn-danger btn-eliminar" onclick="eliminarLinea(this)">✕</button></td>
            `;
            tbody.appendChild(newRow);
        }

        // Eliminar línea de producto
        function eliminarLinea(button) {
            const row = button.closest('tr');
            const tbody = document.getElementById('productosBody');
            
            // No permitir eliminar si solo queda una línea
            if (tbody.children.length > 1) {
                row.remove();
                calcularTotales();
            } else {
                mostrarAlerta('Debe haber al menos una línea de producto', 'error');
            }
        }

        // Guardar factura
        async function guardarFactura() {
            // Validar campos
            const fecha = document.getElementById('fecha').value;
            const cliente = document.getElementById('cliente').value;

            if (!fecha || !cliente) {
                mostrarAlerta('Por favor complete fecha y cliente', 'error');
                return;
            }

            // Recopilar productos
            const productos = [];
            let hasError = false;

            document.querySelectorAll('.producto-row').forEach(row => {
                const upc = row.querySelector('.upc-input').value.trim();
                const descripcion = row.querySelector('.descripcion-input').value.trim();
                const cantidad = parseFloat(row.querySelector('.cantidad-input').value) || 0;
                const precio = parseFloat(row.querySelector('.precio-input').value) || 0;
                const total = parseFloat(row.querySelector('.total-input').value) || 0;

                if (descripcion && cantidad > 0 && precio >= 0) {
                    productos.push({
                        upc: upc,
                        descripcion: descripcion,
                        cantidad: cantidad,
                        precio: precio,
                        total: total
                    });
                } else if (descripcion || cantidad > 0 || precio > 0) {
                    hasError = true;
                }
            });

            if (hasError) {
                mostrarAlerta('Hay líneas con datos incompletos', 'error');
                return;
            }

            if (productos.length === 0) {
                mostrarAlerta('Debe agregar al menos un producto', 'error');
                return;
            }

            const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('$', ''));
            const creditos = parseFloat(document.getElementById('creditos').value) || 0;
            const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));

            // Preparar datos
            const data = {
                fecha: fecha,
                cliente: cliente,
                productos: productos,
                subtotal: subtotal,
                creditos: creditos,
                total: total
            };

            // Mostrar loading
            const btnGuardar = document.getElementById('btnGuardar');
            const btnText = btnGuardar.innerHTML;
            btnGuardar.disabled = true;
            btnGuardar.innerHTML = '<span class="loading"></span> Guardando...';

            try {
                const response = await fetch('guardar_factura.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    mostrarAlerta('✅ Factura guardada exitosamente', 'success');
                    
                    // Mostrar PDF
                    const pdfContainer = document.getElementById('pdfContainer');
                    pdfContainer.innerHTML = `
                        <iframe class="pdf-viewer" src="${result.pdf_url}"></iframe>
                        <div style="margin-top: 15px; text-align: center;">
                            <button class="btn btn-primary" onclick="window.open('${result.pdf_url}', '_blank')">
                                🖨️ Imprimir / Descargar PDF
                            </button>
                        </div>
                    `;
                } else {
                    mostrarAlerta('❌ Error: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarAlerta('❌ Error al guardar la factura', 'error');
            } finally {
                btnGuardar.disabled = false;
                btnGuardar.innerHTML = btnText;
            }
        }

        // Mostrar alerta
        function mostrarAlerta(mensaje, tipo) {
            const container = document.getElementById('alertContainer');
            const alert = document.createElement('div');
            alert.className = `alert ${tipo} show`;
            alert.textContent = mensaje;
            
            container.innerHTML = '';
            container.appendChild(alert);

            setTimeout(() => {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 300);
            }, 5000);
        }

        // Limpiar formulario
        function limpiarFormulario() {
            document.getElementById('fecha').valueAsDate = new Date();
            document.getElementById('cliente').value = '';
            document.getElementById('creditos').value = '0';
            
            const tbody = document.getElementById('productosBody');
            tbody.innerHTML = `
                <tr class="producto-row">
                    <td>
                        <div class="autocomplete-container">
                            <input type="text" class="upc-input" placeholder="7501000..." maxlength="20" autocomplete="off">
                            <div class="autocomplete-dropdown"></div>
                        </div>
                    </td>
                    <td><input type="text" class="descripcion-input" placeholder="Nombre del producto"></td>
                    <td><input type="number" class="cantidad-input" value="1" min="0" step="0.01"></td>
                    <td><input type="number" class="precio-input" value="0" min="0" step="0.01"></td>
                    <td><input type="number" class="total-input" value="0" readonly></td>
                    <td><button class="btn btn-danger btn-eliminar" onclick="eliminarLinea(this)">✕</button></td>
                </tr>
            `;

            calcularTotales();

            const pdfContainer = document.getElementById('pdfContainer');
            pdfContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📄</div>
                    <p><strong>Sin PDF generado</strong></p>
                    <p>Guarda una factura para ver el PDF aquí</p>
                </div>
            `;
        }

        // Inicializar
        calcularTotales();
    </script>
</body>
</html>
