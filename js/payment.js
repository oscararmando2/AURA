/**
 * MERCADO PAGO - Payment Flow
 * Handles payment creation, return detection, and post-payment processing
 */

// CONFIGURACIÓN DE PRODUCCIÓN - Token movido al backend por seguridad
const BACKEND_URL = '/api/create-preference';
const RETURN_URL = 'https://aurapilates.app';

// Constants for the application
const COUNTRY_CODE = '52'; // Mexico country code
const DEFAULT_NAME = 'Sin nombre';
const DEFAULT_PHONE = 'Sin teléfono';
const MAX_CAPACITY = 5; // Maximum number of people per time slot

// Constants for Firebase initialization
const MAX_FIREBASE_INIT_ATTEMPTS = 20;
const FIREBASE_POLLING_INTERVAL_MS = 500;

// NUEVO FLUJO: Attach click handlers to all "Agendar Clase" buttons
document.addEventListener('DOMContentLoaded', () => {
    // Attach click handlers to all "Agendar Clase" buttons
    const planButtons = document.querySelectorAll('.plan-btn');
    planButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Extract clases from data-title (e.g., "1 Clases" -> 1)
            const dataTitle = button.getAttribute('data-title');
            if (!dataTitle) {
                console.error('Missing data-title attribute on button');
                return;
            }
            const match = dataTitle.match(/\d+/);
            if (!match) {
                console.error('Invalid data-title format (expected number):', dataTitle);
                return;
            }
            const clases = parseInt(match[0], 10);
            if (isNaN(clases) || clases <= 0) {
                console.error('Invalid number of classes (must be positive):', clases);
                return;
            }
            
            // Extract precio from data-price
            const dataPrecio = button.getAttribute('data-price');
            if (!dataPrecio) {
                console.error('Missing data-price attribute on button');
                return;
            }
            const precio = parseInt(dataPrecio, 10);
            if (isNaN(precio) || precio <= 0) {
                console.error('Invalid price (must be positive):', precio);
                return;
            }
            
            // console.log(`Plan button clicked: ${clases} clases, $${precio}`);
            // NUEVO FLUJO: Llamar directamente a selectPlan (muestra calendario inmediatamente)
            window.selectPlan(clases, precio);
        });
    });
    
    // Setup payment button click handler
    const finalPaymentBtn = document.getElementById('final-payment-btn');
    if (finalPaymentBtn) {
        finalPaymentBtn.addEventListener('click', () => {
            // Mostrar modal para pedir nombre y teléfono antes de proceder al pago
            showFinalReservationModal();
        });
    }
    
    // Setup time selection modal cancel button
    const timeCancelBtn = document.getElementById('time-cancel');
    if (timeCancelBtn) {
        timeCancelBtn.addEventListener('click', () => {
            // Clear the time slots container to prevent any potential duplication issues
            const slotsContainer = document.getElementById('time-slots-container');
            if (slotsContainer) {
                slotsContainer.innerHTML = '';
            }
            document.getElementById('time-selection-modal').style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
});

/**
 * Create Mercado Pago preference and redirect to payment
 * @param {string} nombre - Customer name
 * @param {string} telefono - Customer phone
 */
async function crearPreferenciaYRedirigir(nombre, telefono) {
    // Validar que tenemos los datos necesarios
    if (!nombre || !telefono) {
        console.error('❌ Faltan datos del cliente:', { nombre, telefono });
        alert('❌ Error: Faltan datos del cliente. Por favor, completa el formulario.');
        return;
    }
    
    // Usar selectedPlan para obtener clases y precio
    const classes = selectedPlan.classes || parseInt(localStorage.getItem('tempPlanClasses') || '1');
    const price = selectedPlan.price || parseInt(localStorage.getItem('tempPlanPrice') || '150');
    
    // Validar que hay clases y precio válidos
    if (classes <= 0 || price <= 0) {
        console.error('❌ Plan inválido:', { classes, price });
        alert('❌ Error: Plan no válido. Por favor, selecciona un plan nuevamente.');
        return;
    }
    
    // Mostrar indicador de carga
    // console.log(`⏳ Procesando pago de ${classes} clase${classes > 1 ? 's' : ''} por $${price}...`);

    try {
        // Llamar al backend seguro en lugar de exponer el token
        const res = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `${classes} clase${classes > 1 ? 's' : ''} en Aura Studio`,
                price: price,
                payer_name: nombre,
                payer_phone: telefono
            })
        });
        
        // Verificar si la respuesta es exitosa
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('❌ Error del servidor:', res.status, errorData);
            
            if (res.status === 400) {
                alert(`❌ Datos inválidos: ${errorData.details || errorData.error || 'Verifica tus datos'}`);
            } else if (res.status === 500) {
                const errorMsg = errorData.details || errorData.error || 'Error del servidor';
                alert(`❌ ${errorMsg}\n\nPor favor, intenta nuevamente en unos minutos o contacta con soporte.`);
            } else {
                alert(`❌ Error al procesar pago (${res.status}). Por favor, intenta nuevamente.`);
            }
            return;
        }
        
        const data = await res.json();
        if (!data.init_point) {
            console.error('❌ Error en respuesta del servidor:', data);
            alert('❌ Error al crear preferencia de pago. Por favor, intenta nuevamente.');
            return;
        }
        
        // console.log('✅ Preferencia creada:', data.preference_id || 'OK');
        // console.log('🔗 Redirigiendo a MercadoPago...');
        
        // Verificar una última vez que las reservas están guardadas
        const verificacionFinal = localStorage.getItem('tempReservations');
        if (!verificacionFinal) {
            console.error('⚠️ ADVERTENCIA: tempReservations no está en localStorage antes de redirigir');
            alert('⚠️ Error al guardar las reservas.\n\nPor favor, intenta nuevamente.');
            return;
        }
        // console.log('✅ Verificación final: tempReservations presente en localStorage');
        
        // Redirigir a MercadoPago
        location.href = data.init_point;
    } catch (e) {
        console.error('❌ Error al procesar pago:', e);
        
        // Verificar si es un error de red
        if (e.name === 'TypeError' && e.message.includes('fetch')) {
            alert('❌ Error de conexión. Verifica tu internet e intenta nuevamente.');
        } else {
            alert('❌ Error al procesar pago. Por favor, intenta nuevamente.');
        }
    }
}

// Flag para evitar ejecución múltiple
let paymentReturnProcessed = false;

/**
 * Detect return from Mercado Pago and process payment result
 */
async function detectarRetorno() {
    // Evitar doble procesamiento (DOMContentLoaded + load)
    if (paymentReturnProcessed) {
        // console.log('⏭️ Retorno ya procesado, saltando...');
        return;
    }
    
    // Check if localStorage is available
    if (!window.localStorage) {
        console.error('❌ localStorage no está disponible en este navegador');
        alert('⚠️ Tu navegador no soporta almacenamiento local.\n\nNo se pueden recuperar tus reservas.\n\nPor favor, contacta con soporte con tu comprobante de pago.');
        return;
    }
    
    // Usar la función helper para verificar si es un retorno de pago
    if (typeof isPaymentReturnFromMercadoPago === 'function' && !isPaymentReturnFromMercadoPago()) {
        return; // No hay parámetros de pago, no hacer nada
    }
    
    const params = new URLSearchParams(location.search);
    
    // Check if this is a payment return
    const hasPaymentParams = params.has('success') || 
                            params.has('payment_id') || 
                            params.has('collection_id') || 
                            params.has('status') ||
                            params.has('error') ||
                            params.has('pending');
    
    if (!hasPaymentParams) {
        return; // No payment parameters
    }
    
    // Verificar estados de pago de MercadoPago
    const status = params.get('status');
    const paymentId = params.get('payment_id') || params.get('collection_id');
    const hasSuccessParam = params.has('success') && params.get('success') === '1';
    
    // Determinar el estado del pago
    const isApproved = status === 'approved' || hasSuccessParam;
    const isPending = status === 'pending' || status === 'in_process';
    const isRejected = status === 'rejected' || (params.has('error') && params.get('error') === '1');
    
    // Solo procesar si hay parámetros de pago
    if (!isApproved && !isPending && !isRejected && !paymentId) {
        return; // No hay parámetros de pago, no hacer nada
    }
    
    // Marcar como procesado para evitar doble ejecución
    paymentReturnProcessed = true;
    // console.log('💳 Retorno de Mercado Pago detectado:', { status, paymentId, isApproved, isPending, isRejected });
    
    // Manejar pago rechazado
    if (isRejected) {
        // console.log('❌ Pago rechazado');
        history.replaceState({}, document.title, location.pathname);
        alert('❌ El pago fue rechazado.\n\nPor favor, verifica tu método de pago e intenta nuevamente.\n\nTus reservas temporales se mantienen.');
        return;
    }
    
    // Manejar pago pendiente
    if (isPending) {
        // console.log('⏳ Pago pendiente');
        history.replaceState({}, document.title, location.pathname);
        alert('⏳ Tu pago está siendo procesado.\n\nTe notificaremos cuando se confirme.\n\nNo cierres esta ventana.');
        // No limpiar localStorage, ya que el pago aún no está confirmado
        return;
    }
    
    // Solo continuar si el pago fue aprobado
    if (!isApproved) {
        // console.log('⚠️ Estado de pago no reconocido:', status);
        history.replaceState({}, document.title, location.pathname);
        return;
    }
    
    // console.log('✅ Pago aprobado, procesando reservas...');
    
    // 1. Limpiar URL inmediatamente (quitar parámetros de pago)
    history.replaceState({}, document.title, location.pathname);
    // console.log('🧹 URL limpiada');
    
    // 2. Recuperar reservas temporales de localStorage
    // console.log('🔍 Verificando localStorage...');
    // console.log('📦 Claves en localStorage:', Object.keys(localStorage));
    
    const tempReservationsStr = localStorage.getItem('tempReservations');
    
    if (!tempReservationsStr) {
        console.error('❌ No hay reservas temporales en localStorage');
        // console.log('📋 Estado de localStorage:', {
            tempReservations: localStorage.getItem('tempReservations'),
            tempPlanClasses: localStorage.getItem('tempPlanClasses'),
            tempPlanPrice: localStorage.getItem('tempPlanPrice'),
            userNombre: localStorage.getItem('userNombre'),
            userTelefono: localStorage.getItem('userTelefono')
        });
        alert('⚠️ No se encontraron reservas pendientes.\n\nEsto puede suceder si:\n- El navegador bloqueó el almacenamiento\n- Se limpió el caché\n- Se usó modo incógnito\n\nPor favor, selecciona un plan nuevamente o contacta con soporte si ya pagaste.');
        return;
    }
    
    // console.log('✅ Reservas encontradas en localStorage:', tempReservationsStr.substring(0, 100) + '...');
    
    let tempData;
    try {
        tempData = JSON.parse(tempReservationsStr);
    } catch (e) {
        console.error('❌ Error al parsear reservas temporales:', e);
        alert('❌ Error al recuperar reservas. Por favor, contacta con soporte.');
        return;
    }
    
    // Validar estructura de datos
    const { reservations, userInfo } = tempData;
    if (!reservations || !Array.isArray(reservations) || reservations.length === 0) {
        console.error('❌ Estructura de reservas inválida:', tempData);
        alert('❌ Error: Reservas no válidas. Por favor, contacta con soporte.');
        return;
    }
    
    const nombre = userInfo?.nombre || localStorage.getItem('userNombre') || 'Cliente';
    const telefono = userInfo?.telefono || localStorage.getItem('userTelefono') || '';
    
    if (!telefono) {
        console.error('❌ Falta el teléfono del usuario');
        alert('❌ Error: Información del usuario incompleta.\n\nPor favor, contacta con soporte con tu comprobante de pago.');
        return;
    }
    
    // console.log(`📋 Reservas recuperadas: ${reservations.length} clases para ${nombre} (${telefono})`);
    
    // 3. Mostrar mensaje de éxito inicial
    alert(`¡Pago recibido, ${nombre}!\n\nGuardando tus ${reservations.length} clases...`);
    
    // 4. Esperar a que Firebase esté listo
    const waitForFirebase = async () => {
        let attempts = 0;
        
        while (attempts < MAX_FIREBASE_INIT_ATTEMPTS) {
            if (window.firebaseReady && window.db && typeof window.saveReservationToFirestore === 'function') {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, FIREBASE_POLLING_INTERVAL_MS));
            attempts++;
            // console.log(`⏳ Esperando Firebase... (${attempts}/${MAX_FIREBASE_INIT_ATTEMPTS})`);
        }
        return false;
    };
    
    const firebaseReady = await waitForFirebase();
    if (!firebaseReady) {
        console.error('❌ Firebase no está listo');
        // NO limpiar localStorage para que el usuario pueda reintentar
        alert('❌ Error: Sistema de reservas no disponible.\n\nTus reservas están guardadas temporalmente.\nPor favor, recarga la página para reintentar o contacta con soporte.');
        return;
    }
    
    // console.log('✅ Firebase listo, guardando reservas...');
    
    // 5. Guardar todas las reservas en Firestore
    const savedReservations = [];
    const failedReservations = [];
    
    for (let i = 0; i < reservations.length; i++) {
        const reservation = reservations[i];
        try {
            // console.log(`💾 Guardando reserva ${i + 1}/${reservations.length}...`, reservation);
            
            // Validar datos de la reserva antes de guardar
            if (!reservation.nombre || !reservation.telefono || !reservation.fechaHora) {
                console.error(`❌ Reserva ${i + 1} tiene datos incompletos:`, reservation);
                failedReservations.push(reservation);
                continue;
            }
            
            const reservaId = await window.saveReservationToFirestore(
                reservation.nombre,
                reservation.telefono,
                reservation.fechaHora, // ISO format: YYYY-MM-DDTHH:mm:ss
                '' // notas vacías por ahora
            );
            
            savedReservations.push(reservaId);
            // console.log(`✅ Reserva ${i + 1} guardada con ID:`, reservaId);
        } catch (error) {
            console.error(`❌ Error al guardar reserva ${i + 1}:`, error);
            failedReservations.push(reservation);
        }
    }
    
    // 6. Solo limpiar datos temporales si se guardó al menos una reserva
    if (savedReservations.length > 0) {
        localStorage.removeItem('tempReservations');
        localStorage.removeItem('tempPlanClasses');
        localStorage.removeItem('tempPlanPrice');
        localStorage.removeItem('planClases');
        localStorage.removeItem('planPrecio');
        // console.log('🧹 Datos temporales limpiados');
    }
    
    // 7. Mostrar resultado
    if (savedReservations.length === reservations.length) {
        // Todas guardadas exitosamente
        // Show custom success message with WhatsApp button
        showPaymentSuccessWithWhatsApp(nombre, telefono, savedReservations.length);
        
        // 8. Recargar "Mis Clases" si el usuario está logueado
        if (telefono && typeof window.loadUserClasses === 'function') {
            // console.log('📚 Recargando "Mis Clases"...');
            try {
                await window.loadUserClasses(telefono);
            } catch (e) {
                console.error('Error al cargar clases del usuario:', e);
            }
        }
        
        // 9. Recargar panel admin si está disponible
        if (window.isAdmin && typeof window.loadReservationsFromFirestore === 'function') {
            // console.log('👨‍💼 Recargando panel admin...');
            try {
                await window.loadReservationsFromFirestore();
            } catch (e) {
                console.error('Error al recargar panel admin:', e);
            }
        }
        
        // 10. Scroll a "Mis Clases" si está visible
        const myClassesSection = document.getElementById('my-classes-section');
        if (myClassesSection && myClassesSection.style.display !== 'none') {
            setTimeout(() => {
                myClassesSection.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        }
    } else if (savedReservations.length > 0) {
        // Algunas guardadas
        alert(`⚠️ Pago recibido\n\n${savedReservations.length} de ${reservations.length} clases guardadas correctamente.\n\n${failedReservations.length} clases fallaron.\n\nPor favor, contacta con soporte.`);
    } else {
        // Ninguna guardada - NO limpiar localStorage
        alert('❌ Error al guardar las reservas.\n\nTu pago fue recibido pero hubo un error técnico.\n\nPor favor, recarga la página para reintentar o contacta con soporte inmediatamente.');
    }
}

/**
 * Show payment success message with WhatsApp button
 * @param {string} nombre - User's name
 * @param {string} telefono - User's phone number
 * @param {number} classCount - Number of classes
 */
function showPaymentSuccessWithWhatsApp(nombre, telefono, classCount) {
    // Create custom modal
    const modal = document.createElement('div');
    modal.id = 'payment-success-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #ffffff 0%, #EFE9E1 100%);
        border-radius: 25px;
        padding: 40px 30px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: fadeInUp 0.4s ease-out;
    `;
    
    modalContent.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
        <h2 style="color: #333; font-size: 1.8rem; margin-bottom: 15px; font-weight: 700;">¡Pago recibido!</h2>
        <p style="color: #666; font-size: 1.2rem; margin-bottom: 10px;">
            Gracias <strong>${nombre}</strong>
        </p>
        <p style="color: #666; font-size: 1.1rem; margin-bottom: 30px;">
            Tus <strong>${classCount}</strong> clases están confirmadas
        </p>
        <button id="send-classes-modal" type="button" style="
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            border: none;
            color: #fff;
            padding: 16px 40px;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 0 auto;
        ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
            </svg>
            Enviar mis clases
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Send classes button handler - sends WhatsApp and closes modal
    const sendBtn = modalContent.querySelector('#send-classes-modal');
    sendBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('📱 Enviar mis clases button clicked', { telefono, nombre });
        try {
            // Send WhatsApp message with class schedule
            if (typeof window.sendWhatsAppMessage === 'function') {
                await window.sendWhatsAppMessage(telefono, nombre);
            } else {
                console.error('❌ sendWhatsAppMessage function not available yet');
                // Fallback: open WhatsApp directly without class details
                const studioNumber = window.STUDIO_PHONE || '527151596586';
                const mensaje = `Hola, soy ${nombre}. Acabo de completar mi pago y me gustaría recibir el detalle de mis clases.`;
                const whatsappUrl = `https://wa.me/${studioNumber}?text=${encodeURIComponent(mensaje)}`;
                window.open(whatsappUrl, '_blank');
            }
            // Close modal after successful send
            modal.remove();
        } catch (error) {
            console.error('❌ Error sending WhatsApp message:', error);
            // Don't close modal if there was an error
            // Error is already shown by sendWhatsAppMessage function
        }
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Hover effect for send button
    sendBtn.addEventListener('mouseenter', () => {
        sendBtn.style.transform = 'translateY(-2px)';
        sendBtn.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)';
    });
    sendBtn.addEventListener('mouseleave', () => {
        sendBtn.style.transform = 'translateY(0)';
        sendBtn.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
    });
}

// Expose showPaymentSuccessWithWhatsApp to window for debugging and testing
window.showPaymentSuccessWithWhatsApp = showPaymentSuccessWithWhatsApp;

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', detectarRetorno);
window.addEventListener('load', detectarRetorno);
