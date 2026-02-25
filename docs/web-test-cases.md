# Casos de Prueba Manuales — Web UI
## Proyecto: Restful-Booker-Platform QA Portfolio

**Aplicación bajo prueba:** https://automationintesting.online
**Fecha de ejecución:** 25 de febrero 2026
**Autor:** Adriana Troche — Senior QA Engineer
**Total de casos:** 25

---

## Resumen ejecutivo

| Módulo | Casos | Pasaron | Fallaron | Estado |
|--------|-------|---------|---------|--------|
| Navegación y carga | 3 | 3 | 0 | ✅ Completo |
| Formulario de contacto | 4 | 4 | 0 | ✅ Automatizado |
| Flujo de reserva (guest) | 2 | 2 | 0 | ✅ Automatizado |
| Calendario de disponibilidad | 4 | 3 | 1 | ⚠️ Bug encontrado |
| Panel admin — Login | 4 | 3 | 1 | ⚠️ Bug encontrado |
| Panel admin — Habitaciones | 5 | 4 | 1 | ⚠️ Bug encontrado |
| Panel admin — Reservas | 3 | 2 | 1 | ⚠️ Bug encontrado |

**Total ejecutados manualmente:** 19 | **Pasaron:** 15 | **Fallaron:** 4

---

## Módulo 1 — Navegación y Carga

### NAV-001 · Carga correcta de la página principal
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / Smoke |
| **Precondición** | Navegador abierto |
| **Pasos** | 1. Navegar a `https://automationintesting.online` |
| **Resultado esperado** | Página carga correctamente · nombre del hotel visible · imagen principal visible · formulario de contacto visible al hacer scroll |
| **Resultado obtenido** | ✔️ Página carga correctamente con todos los elementos esperados |
| **Estado** | ✔️ Pasó |

---

### NAV-002 · Sección de contacto accesible desde la navegación
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo |
| **Precondición** | Página principal cargada |
| **Pasos** | 1. Hacer scroll hacia abajo hasta la sección de contacto · 2. Verificar que el formulario es visible y los campos están habilitados |
| **Resultado esperado** | Sección de contacto visible con campos: nombre, email, teléfono, asunto y mensaje habilitados |
| **Resultado obtenido** | ✔️ Formulario de contacto visible con todos los campos habilitados |
| **Estado** | ✔️ Pasó |

---

### NAV-003 · Acceso al panel de administración desde la URL
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / Smoke |
| **Precondición** | Ninguna |
| **Pasos** | 1. Navegar a `https://automationintesting.online/admin` |
| **Resultado esperado** | Página de login del panel de administración visible con campos usuario y contraseña |
| **Resultado obtenido** | ✔️ Pantalla de login visible con campos de usuario y contraseña |
| **Estado** | ✔️ Pasó |

---

## Módulo 2 — Formulario de Contacto
> ✅ Casos cubiertos por automatización — ver `tests/ui/contact.spec.ts`

### UI-CONTACT-001 · Enviar formulario con datos válidos
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / Flujo completo |
| **Datos de prueba** | Nombre: Alice Tester · Email: alice@example.com · Teléfono: 01234567890 · Asunto: Test enquiry about rooms · Mensaje: 72 caracteres |
| **Resultado esperado** | Mensaje de éxito: "Thanks for getting in touch Alice Tester!" |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### UI-CONTACT-002 · Enviar formulario con teléfono inválido
| Campo | Detalle |
|-------|---------|
| **Tipo** | Negativo |
| **Resultado esperado** | Error: "Phone must be between 11 and 21 characters" |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### UI-CONTACT-003 · Enviar formulario sin email
| Campo | Detalle |
|-------|---------|
| **Tipo** | Negativo |
| **Resultado esperado** | Error: "Email may not be blank" |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### UI-CONTACT-004 · Enviar formulario completamente vacío
| Campo | Detalle |
|-------|---------|
| **Tipo** | Negativo / Múltiples validaciones |
| **Resultado esperado** | Múltiples errores visibles |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

## Módulo 3 — Flujo de Reserva (Guest)
> ✅ Casos cubiertos por automatización — ver `tests/ui/booking.spec.ts`

### UI-BOOKING-001 · Flujo completo de reserva
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / E2E |
| **Resultado esperado** | Heading "Booking Confirmed" visible |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### UI-BOOKING-002 · Confirmación de reserva para un segundo huésped
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / E2E |
| **Resultado esperado** | Heading "Booking Confirmed" visible |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

## Módulo 4 — Calendario de Disponibilidad

### CAL-001 · Selección de fechas válidas en el calendario
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo |
| **Precondición** | Página principal cargada · habitación visible |
| **Pasos** | 1. Click en "Book this room" · 2. Seleccionar rango de fechas en el calendario |
| **Resultado esperado** | Rango de fechas seleccionado visualmente destacado · formulario de datos del huésped habilitado |
| **Resultado obtenido** | ✔️ Calendario se abre correctamente · selección de fechas funciona · formulario se habilita |
| **Estado** | ✔️ Pasó |

---

### CAL-002 · Intento de selección de fecha pasada
| Campo | Detalle |
|-------|---------|
| **Tipo** | Negativo |
| **Precondición** | Calendario abierto |
| **Pasos** | 1. Intentar seleccionar una fecha anterior a hoy · 2. Completar el formulario · 3. Enviar la reserva |
| **Resultado esperado** | Fechas pasadas deshabilitadas o no seleccionables · si se seleccionan, la API debe rechazarlas |
| **Resultado obtenido** | ❌ El calendario permite seleccionar fechas pasadas · el sistema confirma la reserva con fechas 2026-02-10 / 2026-02-14 sin ningún error |
| **Bug** | BUG-008 |
| **Estado** | ❌ Falló |

---

### CAL-003 · Visualización de fechas no disponibles
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / Visual |
| **Precondición** | Existir al menos una reserva activa en la habitación |
| **Pasos** | 1. Abrir calendario de habitación con reservas · 2. Observar el calendario |
| **Resultado esperado** | Las fechas ocupadas se muestran visualmente distintas |
| **Resultado obtenido** | ✔️ Las fechas ocupadas se muestran con etiqueta "Unavailable" en color azul, claramente diferenciadas |
| **Estado** | ✔️ Pasó |

---

### CAL-004 · Navegación entre meses en el calendario
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo |
| **Precondición** | Calendario abierto |
| **Pasos** | 1. Click en "Next" · 2. Click en "Back" |
| **Resultado esperado** | Calendario navega correctamente entre meses |
| **Resultado obtenido** | ✔️ Navegación entre meses funciona correctamente con botones Today, Back y Next |
| **Estado** | ✔️ Pasó |

---

## Módulo 5 — Panel de Administración: Login

### ADMIN-LOGIN-001 · Login con credenciales válidas
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / Smoke |
| **Datos de prueba** | Usuario: `admin` · Password: `password` |
| **Pasos** | 1. Navegar a `/admin` · 2. Ingresar credenciales · 3. Click Login |
| **Resultado esperado** | Acceso al panel · dashboard con habitaciones y reservas visible |
| **Resultado obtenido** | ✔️ Acceso exitoso · panel muestra listado de habitaciones con Room #, Type, Accessible, Price, Room details |
| **Estado** | ✔️ Pasó |

---

### ADMIN-LOGIN-002 · Login con contraseña incorrecta
| Campo | Detalle |
|-------|---------|
| **Tipo** | Negativo |
| **Datos de prueba** | Usuario: `admin` · Password: `wrongpassword` |
| **Pasos** | 1. Ingresar password incorrecto · 2. Click Login |
| **Resultado esperado** | Mensaje de error · permanece en pantalla de login |
| **Resultado obtenido** | ✔️ Mensaje de error mostrado · acceso denegado · permanece en login |
| **Estado** | ✔️ Pasó |

---

### ADMIN-LOGIN-003 · Login con campos vacíos
| Campo | Detalle |
|-------|---------|
| **Tipo** | Negativo |
| **Pasos** | 1. Click Login sin ingresar datos |
| **Resultado esperado** | Mensaje de error o validación de campos requeridos |
| **Resultado obtenido** | ✔️ Mensaje "Invalid credentials" mostrado |
| **Estado** | ✔️ Pasó |

---

### ADMIN-LOGIN-004 · Logout desde el panel de administración
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo |
| **Precondición** | Sesión de administrador activa |
| **Pasos** | 1. Click en Logout · 2. Usar botón "atrás" del navegador · 3. Intentar realizar alguna acción |
| **Resultado esperado** | Sesión cerrada · no es posible acceder al panel ni ejecutar acciones sin autenticarse |
| **Resultado obtenido** | ❌ El botón "atrás" permite volver a la vista de rooms después del logout. Las acciones muestran "Authentication required" pero la pantalla es accesible visualmente |
| **Bug** | BUG-009 |
| **Estado** | ❌ Falló parcialmente |

---

## Módulo 6 — Panel de Administración: Gestión de Habitaciones

### ADMIN-ROOM-001 · Visualizar listado de habitaciones
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / Smoke |
| **Pasos** | 1. Navegar a sección Rooms en el panel |
| **Resultado esperado** | Listado con: Room #, Type, Accessible, Price, Room details |
| **Resultado obtenido** | ✔️ Listado visible con todas las columnas esperadas |
| **Estado** | ✔️ Pasó |

---

### ADMIN-ROOM-002 · Crear nueva habitación con datos válidos
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo |
| **Datos de prueba** | Room #: 201 · Type: Single · Accessible: false · Price: 150 · Features: WiFi |
| **Pasos** | 1. Llenar formulario · 2. Click Create |
| **Resultado esperado** | Habitación creada y visible en el listado |
| **Resultado obtenido** | ✔️ Habitación 201 creada y visible en el listado con los datos correctos |
| **Estado** | ✔️ Pasó |
| **Cleanup** | Habitación eliminada al finalizar el test |

---

### ADMIN-ROOM-003 · Intentar crear habitación sin nombre
| Campo | Detalle |
|-------|---------|
| **Tipo** | Negativo |
| **Pasos** | 1. Dejar Room # vacío · 2. Click Create |
| **Resultado esperado** | Mensaje de error · habitación no creada |
| **Resultado obtenido** | ✔️ Mensaje de error: "Room name must be set" |
| **Estado** | ✔️ Pasó |

---

### ADMIN-ROOM-004 · Editar habitación existente
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo |
| **Pasos** | 1. Click en habitación 201 · 2. Click Edit · 3. Modificar precio · 4. Guardar |
| **Resultado esperado** | Cambios guardados y reflejados |
| **Resultado obtenido** | ✔️ Edición funciona correctamente · precio actualizado. ⚠️ Imagen de la habitación no se renderiza (BUG-010) |
| **Bug** | BUG-010 |
| **Estado** | ✔️ Pasó parcialmente |

---

### ADMIN-ROOM-005 · Eliminar habitación existente
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo |
| **Pasos** | 1. Click en X de la habitación 201 |
| **Resultado esperado** | Habitación eliminada y no visible en el listado |
| **Resultado obtenido** | ✔️ Habitación eliminada correctamente del listado |
| **Estado** | ✔️ Pasó |

---

## Módulo 7 — Panel de Administración: Gestión de Reservas

### ADMIN-BOOK-001 · Visualizar listado de reservas
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / Smoke |
| **Pasos** | 1. Click en Report en el menú del panel |
| **Resultado esperado** | Listado de reservas con datos: huésped, habitación, fechas |
| **Resultado obtenido** | ✔️ Vista de calendario mensual con reservas activas mostrando nombre del huésped y número de habitación |
| **Estado** | ✔️ Pasó |

---

### ADMIN-BOOK-002 · Verificar detalle de una reserva
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo |
| **Pasos** | 1. Click en una reserva del calendario |
| **Resultado esperado** | Detalle con: nombre, email, teléfono, habitación, fechas |
| **Resultado obtenido** | ❌ Hacer click en una reserva del calendario no muestra ningún detalle ni abre ningún panel |
| **Bug** | BUG-011 |
| **Estado** | ❌ Falló |

---

### ADMIN-BOOK-003 · Eliminar reserva desde el panel
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo |
| **Pasos** | 1. Entrar al detalle de una habitación · 2. Localizar reserva en el listado · 3. Click en ícono eliminar |
| **Resultado esperado** | Reserva eliminada y no visible en el listado |
| **Resultado obtenido** | ✔️ Listado de reservas visible en el detalle de la habitación con botones de editar y eliminar funcionales |
| **Estado** | ✔️ Pasó |

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ Automatizado | Caso cubierto por la suite Playwright |
| ✔️ Pasó | Ejecutado manualmente — resultado correcto |
| ❌ Falló | Ejecutado manualmente — defecto encontrado |
| ⚠️ Parcial | Funcionalidad principal OK pero con observaciones |

---

*Proyecto de portafolio QA — Adriana Troche · Senior QA Engineer*
*Fecha de ejecución: 25 de febrero 2026*
