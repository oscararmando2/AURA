/**
 * Business Hours Real-Time Display Script
 * Updates business hours display to show real-time status
 * Business hours:
 * - Monday to Saturday: 06:00 AM - 11:00 AM, 05:00 PM - 07:00 PM
 * - Sunday: Closed
 */
function updateBusinessHoursDisplay() {
    const hoursElement = document.querySelector('.hours');
    if (!hoursElement) return;
    
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes; // Convert to minutes since midnight
    
    // Define business hours in minutes since midnight
    const morningStart = 6 * 60; // 06:00 AM
    const morningEnd = 11 * 60; // 11:00 AM
    const afternoonStart = 17 * 60; // 05:00 PM
    const afternoonEnd = 19 * 60; // 07:00 PM (last class)
    
    // Check if it's Sunday (closed)
    if (dayOfWeek === 0) {
        hoursElement.innerHTML = '🔴 <strong>Cerrado hoy</strong> (Domingo)<br>Abrimos el Lunes a las 06:00 a.m.';
        hoursElement.style.color = '#C51162';
        return;
    }
    
    // Check if currently open (Monday-Saturday, within business hours)
    const isMorningHours = currentTime >= morningStart && currentTime < morningEnd;
    const isAfternoonHours = currentTime >= afternoonStart && currentTime < afternoonEnd;
    
    if (isMorningHours) {
        // Open in morning
        hoursElement.innerHTML = '🟢 <strong>Abierto ahora</strong><br>Horario: 06:00 a.m. – 11:00 a.m.<br>Cerramos a las 11:00 a.m. (Abrimos 05:00 p.m.)';
        hoursElement.style.color = '#2E7D32';
    } else if (isAfternoonHours) {
        // Open in afternoon
        hoursElement.innerHTML = '🟢 <strong>Abierto ahora</strong><br>Horario: 05:00 p.m. – 07:00 p.m. (última clase)<br>Última clase a las 07:00 p.m.';
        hoursElement.style.color = '#2E7D32';
    } else if (currentTime < morningStart) {
        // Before morning opening
        hoursElement.innerHTML = '🔴 <strong>Cerrado</strong><br>Abrimos hoy a las 06:00 a.m.';
        hoursElement.style.color = '#C51162';
    } else if (currentTime >= morningEnd && currentTime < afternoonStart) {
        // Between morning and afternoon (lunch break)
        hoursElement.innerHTML = '🔴 <strong>Cerrado</strong> (Hora de comida)<br>Abrimos a las 05:00 p.m.';
        hoursElement.style.color = '#C51162';
    } else {
        // After evening closing - determine next opening day
        let nextOpening = 'mañana'; // Default for Monday-Thursday
        if (dayOfWeek === 6) {
            // Saturday evening -> opens Monday
            nextOpening = 'el Lunes';
        } else if (dayOfWeek === 5) {
            // Friday evening -> opens Saturday
            nextOpening = 'mañana Sábado';
        }
        hoursElement.innerHTML = `🔴 <strong>Cerrado</strong><br>Abrimos ${nextOpening} a las 06:00 a.m.`;
        hoursElement.style.color = '#C51162';
    }
}

// Update on page load
document.addEventListener('DOMContentLoaded', updateBusinessHoursDisplay);

// Update every minute to keep it current
setInterval(updateBusinessHoursDisplay, 60000); // Update every 60 seconds
