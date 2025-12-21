# Pruebas de Funcionalidad de Búsqueda en Panel de Administrador

## Objetivo
Verificar que la búsqueda por cliente funcione correctamente buscando por número de teléfono y que al hacer clic en un cliente, se muestre toda su información.

## Pre-requisitos
1. Tener acceso al panel de administrador
2. Tener reservas existentes en Firestore con datos de clientes
3. Los datos de clientes deben incluir:
   - Nombre completo
   - Número de teléfono
   - Notas (opcional)

## Casos de Prueba

### Caso 1: Búsqueda por Nombre Completo
**Pasos:**
1. Acceder al panel de administrador
2. En el campo "🔍 Buscar por nombre o teléfono...", escribir un nombre de cliente existente
3. Verificar que aparezcan los eventos de ese cliente

**Resultado Esperado:**
- ✅ El calendario filtra y muestra solo las reservas del cliente buscado
- ✅ Se muestran todas las reservas asociadas a ese nombre

### Caso 2: Búsqueda por Nombre Parcial
**Pasos:**
1. En el campo de búsqueda, escribir solo el primer nombre de un cliente
2. Observar los resultados

**Resultado Esperado:**
- ✅ Se muestran todas las reservas de clientes cuyo nombre contenga el texto buscado

### Caso 3: Búsqueda por Número de Teléfono Completo
**Pasos:**
1. En el campo de búsqueda, escribir un número de teléfono completo (ej: "5551234567")
2. Verificar los resultados

**Resultado Esperado:**
- ✅ Se muestra la reserva del cliente con ese número de teléfono
- ✅ Funciona independientemente del formato del número almacenado

### Caso 4: Búsqueda por Número de Teléfono Parcial
**Pasos:**
1. En el campo de búsqueda, escribir solo los últimos 4 dígitos de un teléfono
2. Observar los resultados

**Resultado Esperado:**
- ✅ Se muestran todas las reservas de clientes cuyo teléfono contenga esos dígitos

### Caso 5: Búsqueda con Formato de Teléfono
**Pasos:**
1. Escribir un número de teléfono con formato (ej: "555-123-4567" o "(555) 123-4567")
2. Verificar los resultados

**Resultado Esperado:**
- ✅ La búsqueda funciona correctamente ignorando los caracteres de formato
- ✅ Se normaliza el número eliminando espacios, guiones y paréntesis

### Caso 6: Hacer Clic en un Cliente (Evento Individual)
**Pasos:**
1. Realizar una búsqueda para mostrar eventos específicos
2. Hacer clic en un evento del calendario
3. Observar el modal que aparece

**Resultado Esperado:**
- ✅ Se abre el modal "👤 Detalle de Reserva"
- ✅ Se muestra el nombre completo del cliente
- ✅ Se muestra el número de teléfono del cliente
- ✅ Se muestra la fecha de la reserva
- ✅ Se muestra el horario de la reserva
- ✅ Se muestran las notas (si existen)
- ✅ Aparece el botón "📧 Contactar" que abre WhatsApp

### Caso 7: Hacer Clic en un Evento Agrupado
**Pasos:**
1. Si existen eventos agrupados (múltiples clientes en el mismo horario)
2. Hacer clic en un evento agrupado
3. Observar el modal

**Resultado Esperado:**
- ✅ Se abre el modal "👥 Detalle de Reserva - X Personas"
- ✅ Se muestra la lista de todos los participantes
- ✅ Para cada participante se muestra:
  - Nombre completo
  - Número de teléfono
  - Notas (si existen)

### Caso 8: Búsqueda Sin Resultados
**Pasos:**
1. Escribir un nombre o teléfono que no existe
2. Observar el calendario

**Resultado Esperado:**
- ✅ El calendario se vacía, no se muestran eventos
- ✅ No hay errores en la consola

### Caso 9: Limpiar Filtros
**Pasos:**
1. Realizar una búsqueda
2. Hacer clic en el botón "✖️ Limpiar"
3. Observar el calendario

**Resultado Esperado:**
- ✅ El campo de búsqueda se vacía
- ✅ Se muestran todas las reservas nuevamente

### Caso 10: Búsqueda en Tiempo Real
**Pasos:**
1. Comenzar a escribir en el campo de búsqueda
2. Observar cómo cambian los resultados mientras escribes

**Resultado Esperado:**
- ✅ Los resultados se actualizan automáticamente después de 300ms
- ✅ No se requiere presionar Enter o un botón de búsqueda

## Mejoras Implementadas

### Normalización de Números de Teléfono
Se agregó la función `normalizePhoneNumber()` que:
- Elimina espacios
- Elimina guiones (-)
- Elimina paréntesis ()
- Elimina signos de más (+)
- Elimina puntos (.)

Esto permite que la búsqueda funcione sin importar el formato del número de teléfono.

### Placeholder Actualizado
Se cambió el placeholder de "🔍 Buscar por cliente..." a "🔍 Buscar por nombre o teléfono..." para hacer explícito que se puede buscar por número de teléfono.

## Verificación Técnica

### Código JavaScript Relevante
- Función de búsqueda: `applyFilters()` (línea ~7528)
- Normalización de teléfono: `normalizePhoneNumber()` (línea ~7523)
- Modal de detalle: `showEventDetailModal()` (línea ~7791)
- Event listener de búsqueda: `setupAdminCalendarControls()` (línea ~6987)

### Logs de Consola
Al aplicar filtros, deberías ver en la consola:
```
🔍 Filtro aplicado: X de Y eventos
```

Donde X es el número de eventos filtrados y Y es el total de eventos.

## Notas Importantes
- La búsqueda es case-insensitive (no distingue mayúsculas/minúsculas)
- La búsqueda es incremental (busca coincidencias parciales)
- La búsqueda funciona en tiempo real con debounce de 300ms
- El botón "Contactar" abre WhatsApp con un mensaje predefinido
