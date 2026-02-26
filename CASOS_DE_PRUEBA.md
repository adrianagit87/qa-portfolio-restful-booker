# Casos de Prueba Automatizados
## Proyecto: Restful-Booker-Platform QA Portfolio

**Aplicación bajo prueba:** https://automationintesting.online
**Framework:** Playwright + TypeScript
**Total de casos:** 39
**Resultado:** ✅ 39/39 pasando

---

## Resumen ejecutivo

| Tipo | Archivo | Casos | Estado |
|------|---------|-------|--------|
| API | `tests/api/auth.spec.ts` | 3 | ✅ Todos pasan |
| API | `tests/api/rooms.spec.ts` | 12 | ✅ Todos pasan |
| API | `tests/api/bookings.spec.ts` | 13 | ✅ Todos pasan |
| UI | `tests/ui/contact.spec.ts` | 4 | ✅ Todos pasan |
| UI | `tests/ui/booking.spec.ts` | 3 | ✅ Todos pasan |
| UI + API | `tests/ui/cross-validation.spec.ts` | 4 | ✅ Todos pasan |

---

## Pruebas de API

### AUTH-001 · Login con credenciales válidas
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/auth.spec.ts` |
| **Endpoint** | `POST /api/auth/login` |
| **Tipo** | Positivo |
| **Precondición** | Credenciales admin: `admin` / `password` |
| **Pasos** | 1. Enviar POST con `{username, password}` válidos |
| **Resultado esperado** | HTTP 200 · body contiene `token` de tipo string no vacío |
| **Resultado obtenido** | ✅ HTTP 200 · token recibido correctamente |

---

### AUTH-002 · Login con contraseña incorrecta
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/auth.spec.ts` |
| **Endpoint** | `POST /api/auth/login` |
| **Tipo** | Negativo |
| **Precondición** | Password incorrecto: `wrongpassword` |
| **Pasos** | 1. Enviar POST con password inválido |
| **Resultado esperado** | HTTP 401 o conexión rechazada (ECONNRESET por Cloudflare) |
| **Resultado obtenido** | ✅ Acceso denegado confirmado |
| **Nota** | El servidor a veces cierra la conexión TCP antes de completar la respuesta HTTP. El test acepta ambos escenarios como válidos. |

---

### AUTH-003 · Login con body vacío
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/auth.spec.ts` |
| **Endpoint** | `POST /api/auth/login` |
| **Tipo** | Negativo / Borde |
| **Precondición** | Body vacío `{}` |
| **Pasos** | 1. Enviar POST sin username ni password |
| **Resultado esperado** | Cualquier código distinto de 200 |
| **Resultado obtenido** | ✅ Error retornado, no se genera token |

---

### ROOM-001 · Listar habitaciones (endpoint público)
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `GET /api/room` |
| **Tipo** | Positivo |
| **Precondición** | Ninguna (endpoint público) |
| **Pasos** | 1. Enviar GET sin autenticación |
| **Resultado esperado** | HTTP 200 · body contiene propiedad `rooms` de tipo array |
| **Resultado obtenido** | ✅ HTTP 200 · array de habitaciones recibido |

---

### ROOM-002 · Validación de schema de habitación
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `GET /api/room` |
| **Tipo** | Positivo / Schema |
| **Precondición** | Al menos una habitación registrada en el sistema |
| **Pasos** | 1. Obtener listado · 2. Validar campos del primer elemento |
| **Resultado esperado** | Cada habitación tiene: `roomid` (Number), `roomName` (String), `type` (String), `roomPrice` (Number) |
| **Resultado obtenido** | ✅ Schema validado correctamente |

---

### ROOM-003 · Crear habitación sin autenticación
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `POST /api/room` |
| **Tipo** | Negativo / Seguridad |
| **Precondición** | Sin cookie de token |
| **Pasos** | 1. Enviar POST con datos de habitación válidos, sin header de autenticación |
| **Resultado esperado** | HTTP 401 Unauthorized |
| **Resultado obtenido** | ✅ HTTP 401 |

---

### ROOM-004 · Crear habitación con token válido
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `POST /api/room` |
| **Tipo** | Positivo |
| **Precondición** | Token admin obtenido vía `/api/auth/login` |
| **Pasos** | 1. Obtener token · 2. POST con cookie `token=<value>` y datos de habitación |
| **Resultado esperado** | HTTP 200 · habitación creada y verificable en el listado con `roomid` numérico |
| **Resultado obtenido** | ✅ Habitación creada correctamente |
| **Cleanup** | `afterEach` elimina la habitación creada |

---

### ROOM-005 · Eliminar habitación con token válido
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `DELETE /api/room/:id` |
| **Tipo** | Positivo |
| **Precondición** | Token admin · habitación previamente creada |
| **Pasos** | 1. Crear habitación · 2. Obtener su `roomid` · 3. DELETE `/api/room/{id}` con token |
| **Resultado esperado** | HTTP 200 |
| **Resultado obtenido** | ✅ HTTP 200 · habitación eliminada |

---

### ROOM-006 · Obtener habitación por ID existente
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `GET /api/room/:id` |
| **Tipo** | Positivo |
| **Precondición** | Al menos una habitación registrada en el sistema |
| **Pasos** | 1. GET `/api/room` para obtener un ID válido · 2. GET `/api/room/{id}` |
| **Resultado esperado** | HTTP 200 · body contiene `roomid`, `roomName`, `type`, `roomPrice` |
| **Resultado obtenido** | ✅ HTTP 200 · schema validado correctamente |

---

### ROOM-007 · Obtener habitación con ID inexistente
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `GET /api/room/:id` |
| **Tipo** | Negativo |
| **Precondición** | ID `99999` no existe en el sistema |
| **Pasos** | 1. GET `/api/room/99999` |
| **Resultado esperado** | Código distinto de 200 (timeout o error documentado) |
| **Resultado obtenido** | ✅ Comportamiento real documentado: no retorna 200 |
| **Nota** | La API puede hacer timeout en lugar de retornar 404. El test acepta ambos como comportamiento válido. |

---

### ROOM-008 · Crear habitación con precio negativo
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `POST /api/room` |
| **Tipo** | Negativo / Validación |
| **Precondición** | Token admin válido |
| **Pasos** | 1. POST con `roomPrice: -50` en el body |
| **Resultado esperado** | Código distinto de 200 (rechazo de datos inválidos) |
| **Resultado obtenido** | ✅ Precio negativo rechazado correctamente |

---

### ROOM-009 · Crear habitación con nombre duplicado
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `POST /api/room` |
| **Tipo** | Borde / Comportamiento real |
| **Precondición** | Token admin · primera habitación creada via helper |
| **Pasos** | 1. Crear habitación con nombre único · 2. POST con el mismo `roomName` |
| **Resultado esperado** | HTTP 200 (duplicados permitidos) o HTTP 409 (duplicados rechazados) |
| **Resultado obtenido** | ✅ Comportamiento documentado · cleanup ejecutado en ambos casos |
| **Cleanup** | `afterEach` elimina todas las habitaciones creadas incluyendo duplicados |

---

### ROOM-011 · Actualizar habitación con token válido
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `PUT /api/room/:id` |
| **Tipo** | Positivo |
| **Precondición** | Token admin · habitación previamente creada |
| **Pasos** | 1. Crear habitación · 2. PUT `/api/room/{id}` con token y datos actualizados (`roomPrice: 200`) |
| **Resultado esperado** | HTTP 200 |
| **Resultado obtenido** | ✅ HTTP 200 |
| **Nota** | La API retorna `{"success":true}`, no el objeto actualizado. Se verifica solo el status code. |
| **Cleanup** | Habitación eliminada tras el test |

---

### ROOM-012 · Actualizar habitación sin autenticación
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `PUT /api/room/:id` |
| **Tipo** | Negativo / Seguridad |
| **Precondición** | Token admin · habitación previamente creada |
| **Pasos** | 1. Crear habitación con token · 2. PUT sin cookie de autenticación |
| **Resultado esperado** | HTTP 401 Unauthorized |
| **Resultado obtenido** | ✅ HTTP 401 · recurso protegido correctamente |
| **Cleanup** | Habitación eliminada con token válido tras el test |

---

### ROOM-010 · Eliminar habitación sin autenticación
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/rooms.spec.ts` |
| **Endpoint** | `DELETE /api/room/:id` |
| **Tipo** | Negativo / Seguridad |
| **Precondición** | Token admin · habitación previamente creada |
| **Pasos** | 1. Crear habitación con token · 2. DELETE sin enviar cookie de autenticación |
| **Resultado esperado** | HTTP 401 Unauthorized |
| **Resultado obtenido** | ✅ HTTP 401 · recurso protegido correctamente |
| **Cleanup** | Habitación eliminada con token válido tras el test |

---

### BOOK-001 · Crear reserva con datos válidos
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `POST /api/booking` |
| **Tipo** | Positivo |
| **Precondición** | Room ID 1 disponible para las fechas 2026-06-01 / 2026-06-05 |
| **Pasos** | 1. POST con `firstname`, `lastname`, `roomid`, `bookingdates` válidos |
| **Resultado esperado** | HTTP 201 · body contiene `bookingid` (Number), `roomid`, `firstname`, `lastname` correctos |
| **Resultado obtenido** | ✅ Reserva creada y schema validado |
| **Cleanup** | `afterEach` elimina la reserva por su `bookingid` |

---

### BOOK-002 · Crear reserva con fechas inválidas (checkout antes que checkin)
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `POST /api/booking` |
| **Tipo** | Negativo |
| **Precondición** | `checkin: 2026-06-10` · `checkout: 2026-06-05` (checkout anterior al checkin) |
| **Pasos** | 1. POST con rango de fechas lógicamente inválido |
| **Resultado esperado** | HTTP 409 Conflict |
| **Resultado obtenido** | ✅ HTTP 409 |

---

### BOOK-003 · Listar reservas con token válido
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `GET /api/booking?roomid=1` |
| **Tipo** | Positivo |
| **Precondición** | Token admin |
| **Pasos** | 1. GET con cookie de autenticación y query param `roomid=1` |
| **Resultado esperado** | HTTP 200 · body contiene propiedad `bookings` de tipo array |
| **Resultado obtenido** | ✅ HTTP 200 · lista de reservas recibida |

---

### BOOK-004 · Listar reservas sin autenticación
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `GET /api/booking?roomid=1` |
| **Tipo** | Negativo / Seguridad |
| **Precondición** | Sin cookie de token |
| **Pasos** | 1. GET sin header de autenticación |
| **Resultado esperado** | HTTP 401 Unauthorized |
| **Resultado obtenido** | ✅ HTTP 401 |

---

### BOOK-005 · Eliminar reserva con token válido
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `DELETE /api/booking/:id` |
| **Tipo** | Positivo |
| **Precondición** | Token admin · reserva previamente creada (fechas 2026-09-01 / 2026-09-05) |
| **Pasos** | 1. Crear reserva · 2. DELETE `/api/booking/{bookingid}` con token |
| **Resultado esperado** | HTTP 200 |
| **Resultado obtenido** | ✅ HTTP 200 · reserva eliminada |

---

### BOOK-006 · Crear reserva sin firstname
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `POST /api/booking` |
| **Tipo** | Negativo / Campo requerido |
| **Precondición** | Datos válidos excepto `firstname` omitido del body |
| **Pasos** | 1. POST con todos los campos válidos excepto `firstname` |
| **Resultado esperado** | Código distinto de 201 (campo requerido rechazado) |
| **Resultado obtenido** | ✅ Reserva no creada |

---

### BOOK-007 · Crear reserva sin roomid
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `POST /api/booking` |
| **Tipo** | Negativo / Campo requerido |
| **Precondición** | Datos válidos excepto `roomid` omitido del body |
| **Pasos** | 1. POST con todos los campos válidos excepto `roomid` |
| **Resultado esperado** | Código distinto de 201 (campo requerido rechazado) |
| **Resultado obtenido** | ✅ Reserva no creada |

---

### BOOK-008 · Crear reserva con checkin igual a checkout
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `POST /api/booking` |
| **Tipo** | Negativo / Borde |
| **Precondición** | `checkin: 2026-11-01` · `checkout: 2026-11-01` (misma fecha) |
| **Pasos** | 1. POST con fechas iguales en checkin y checkout |
| **Resultado esperado** | Código distinto de 201 (estancia de 0 noches inválida) |
| **Resultado obtenido** | ✅ Reserva rechazada correctamente |

---

### BOOK-009 · Obtener reserva por ID con token válido
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `GET /api/booking/:id` |
| **Tipo** | Positivo |
| **Precondición** | Token admin · reserva creada via helper con fechas 2026-12-01 / 2026-12-05 |
| **Pasos** | 1. Crear reserva · 2. GET `/api/booking/{bookingid}` con cookie de autenticación |
| **Resultado esperado** | HTTP 200 |
| **Resultado obtenido** | ✅ HTTP 200 · reserva retornada correctamente |
| **Cleanup** | Reserva eliminada tras el test |

---

### BOOK-010 · Obtener reserva con ID inexistente
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `GET /api/booking/:id` |
| **Tipo** | Negativo |
| **Precondición** | Token admin · ID `99999` no existe |
| **Pasos** | 1. GET `/api/booking/99999` con cookie de autenticación |
| **Resultado esperado** | HTTP 404 Not Found |
| **Resultado obtenido** | ✅ HTTP 404 |

---

### BOOK-012 · Actualizar reserva con token válido
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `PUT /api/booking/:id` |
| **Tipo** | Positivo |
| **Precondición** | Token admin · reserva creada (fechas 2027-05-01 / 2027-05-05) |
| **Pasos** | 1. Crear reserva · 2. PUT `/api/booking/{id}` con token y **fechas distintas** a las originales (2027-06-01 / 2027-06-05) |
| **Resultado esperado** | HTTP 200 |
| **Resultado obtenido** | ✅ HTTP 200 |
| **Nota** | La API retorna `{"success":true}`. Actualizar con las mismas fechas originales causa 409 — la plataforma las trata como conflicto consigo misma. Se usan fechas distintas para evitar este comportamiento conocido. |
| **Cleanup** | Reserva eliminada tras el test |

---

### BOOK-013 · Actualizar reserva sin autenticación
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `PUT /api/booking/:id` |
| **Tipo** | Negativo / Seguridad |
| **Precondición** | Token admin · reserva previamente creada |
| **Pasos** | 1. Crear reserva con token · 2. PUT sin cookie de autenticación |
| **Resultado esperado** | Código distinto de 200 |
| **Resultado obtenido** | ✅ Acceso denegado |
| **Cleanup** | Reserva eliminada con token válido tras el test |

---

### BOOK-011 · Eliminar reserva sin autenticación
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/api/bookings.spec.ts` |
| **Endpoint** | `DELETE /api/booking/:id` |
| **Tipo** | Negativo / Seguridad |
| **Precondición** | Token admin · reserva previamente creada |
| **Pasos** | 1. Crear reserva con token · 2. DELETE sin enviar cookie de autenticación |
| **Resultado esperado** | HTTP 401 Unauthorized |
| **Resultado obtenido** | ✅ HTTP 401 · recurso protegido correctamente |
| **Cleanup** | Reserva eliminada con token válido tras el test |

---

## Pruebas de UI (Chromium)

### UI-CONTACT-001 · Enviar formulario de contacto con datos válidos
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/ui/contact.spec.ts` |
| **Página** | `https://automationintesting.online/#contact` |
| **Tipo** | Positivo / Flujo completo |
| **Precondición** | Página cargada y sección de contacto visible |
| **Datos de prueba** | Nombre: Alice Tester · Email: alice@example.com · Teléfono: 01234567890 · Asunto: Test enquiry about rooms · Mensaje: 72 caracteres |
| **Pasos** | 1. Navegar a home · 2. Scrollear a sección contacto · 3. Llenar todos los campos · 4. Click Submit |
| **Resultado esperado** | Heading `h3` con texto "Thanks for getting in touch Alice Tester!" visible |
| **Resultado obtenido** | ✅ Mensaje de éxito mostrado correctamente |

---

### UI-CONTACT-002 · Enviar formulario con teléfono inválido (muy corto)
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/ui/contact.spec.ts` |
| **Página** | `https://automationintesting.online/#contact` |
| **Tipo** | Negativo / Validación de campo |
| **Precondición** | Todos los campos válidos excepto teléfono |
| **Datos de prueba** | Teléfono: `123` (3 caracteres — mínimo requerido: 11) |
| **Pasos** | 1. Llenar formulario con teléfono corto · 2. Click Submit |
| **Resultado esperado** | `.alert.alert-danger` contiene "Phone must be between 11 and 21 characters" |
| **Resultado obtenido** | ✅ Error de validación mostrado |

---

### UI-CONTACT-003 · Enviar formulario sin email
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/ui/contact.spec.ts` |
| **Página** | `https://automationintesting.online/#contact` |
| **Tipo** | Negativo / Campo requerido |
| **Precondición** | Todos los campos válidos excepto email |
| **Datos de prueba** | Email: vacío |
| **Pasos** | 1. Llenar formulario sin email · 2. Click Submit |
| **Resultado esperado** | `.alert.alert-danger` contiene "Email may not be blank" |
| **Resultado obtenido** | ✅ Error de campo requerido mostrado |

---

### UI-CONTACT-004 · Enviar formulario completamente vacío
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/ui/contact.spec.ts` |
| **Página** | `https://automationintesting.online/#contact` |
| **Tipo** | Negativo / Múltiples validaciones |
| **Precondición** | Ningún campo llenado |
| **Pasos** | 1. Click Submit sin llenar ningún campo |
| **Resultado esperado** | `.alert.alert-danger` visible con múltiples errores (texto > 50 caracteres) |
| **Resultado obtenido** | ✅ Múltiples errores mostrados: email, teléfono, asunto, mensaje |

---

### UI-BOOKING-001 · Flujo completo de reserva — confirmación visible
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/ui/booking.spec.ts` |
| **Página** | `/reservation/1?checkin=<fecha_dinámica>&checkout=<fecha_dinámica>` |
| **Tipo** | Positivo / Flujo end-to-end |
| **Precondición** | Fechas generadas dinámicamente (3000+ días en el futuro) para garantizar disponibilidad |
| **Datos de prueba** | Nombre: Jane Tester · Email: jane.tester@example.com · Teléfono: 01234567890 |
| **Pasos** | 1. Navegar a página de reserva con fechas pre-cargadas · 2. Click "Reserve Now" (abre formulario) · 3. Llenar datos del huésped · 4. Click "Reserve Now" (envía reserva) |
| **Resultado esperado** | Heading `h2` con texto "Booking Confirmed" visible |
| **Resultado obtenido** | ✅ Confirmación mostrada |
| **Cleanup** | `afterEach` elimina la reserva vía API (`DELETE /api/booking/:id`) |

---

### UI-BOOKING-003 · Intento de reserva en fechas ya ocupadas → sin confirmación
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/ui/booking.spec.ts` |
| **Página** | `/reservation/{roomId}?checkin=<fecha_bloqueada>&checkout=<fecha_bloqueada>` |
| **Tipo** | Negativo / Flujo de error |
| **Precondición** | Fechas bloqueadas previamente via API · room ID obtenido dinámicamente |
| **Pasos** | 1. Crear reserva via API para bloquear fechas · 2. Navegar a la misma URL con esas fechas · 3. Abrir formulario · 4. Llenar datos del huésped · 5. Enviar reserva |
| **Resultado esperado** | Heading "Booking Confirmed" **no** visible tras el envío |
| **Resultado obtenido** | ✅ Confirmación no aparece — conflicto de fechas manejado correctamente |
| **Cleanup** | Reserva bloqueadora eliminada vía API tras el test |

---

### UI-BOOKING-002 · Confirmación de reserva para un segundo huésped
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/ui/booking.spec.ts` |
| **Página** | `/reservation/1?checkin=<fecha_dinámica>&checkout=<fecha_dinámica>` |
| **Tipo** | Positivo / Flujo end-to-end |
| **Precondición** | Fechas distintas al TC anterior (3010+ días en el futuro) |
| **Datos de prueba** | Nombre: Carlos Portfolio · Email: carlos@example.com · Teléfono: 07700900123 |
| **Pasos** | 1. Navegar a página de reserva · 2. Click "Reserve Now" · 3. Llenar datos · 4. Click "Reserve Now" |
| **Resultado esperado** | Heading "Booking Confirmed" visible |
| **Resultado obtenido** | ✅ Confirmación mostrada |
| **Cleanup** | `afterEach` elimina la reserva vía API |

---

## Pruebas de Validación Cruzada UI vs API

### CROSS-001 · Reserva creada por UI aparece en la API
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/ui/cross-validation.spec.ts` |
| **Tipo** | Positivo / Consistencia UI→API |
| **Precondición** | Token admin · Room ID 1 disponible para fechas ~3500 días en el futuro |
| **Pasos** | 1. Navegar a `/reservation/1?checkin=...&checkout=...` · 2. Llenar y enviar formulario de reserva · 3. Verificar que "Booking Confirmed" sea visible · 4. Consultar `GET /api/booking?roomid=1` · 5. Buscar la reserva por firstname/lastname |
| **Resultado esperado** | Reserva creada en UI es retornada por la API con firstname "CrossTest" y lastname "UIvsAPI" |
| **Resultado obtenido** | ✅ Consistencia confirmada — datos creados en UI visibles en API |
| **Cleanup** | Reserva eliminada vía API tras el test |

---

### CROSS-002 · Reserva eliminada por API desaparece del panel admin UI
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/ui/cross-validation.spec.ts` |
| **Tipo** | Positivo / Consistencia API→UI |
| **Precondición** | Token admin · reserva creada via helper (fechas 2027-03-01 / 2027-03-05) |
| **Pasos** | 1. Crear reserva vía API · 2. DELETE `/api/booking/{id}` con token · 3. Login en `/admin` · 4. Navegar a `/admin/report` · 5. Verificar que el booking ID no aparece |
| **Resultado esperado** | El ID de la reserva eliminada no es visible en el reporte de administración |
| **Resultado obtenido** | ✅ Reserva eliminada no aparece en el panel UI |

---

### CROSS-003 · Habitación creada por API aparece en el panel admin UI
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/ui/cross-validation.spec.ts` |
| **Tipo** | Positivo / Consistencia API→UI |
| **Precondición** | Token admin |
| **Pasos** | 1. Crear habitación vía `POST /api/room` · 2. Login en `/admin` · 3. Verificar que el nombre de la habitación aparece en la lista |
| **Resultado esperado** | `roomName` generado por el helper es visible en el panel de administración |
| **Resultado obtenido** | ✅ Habitación creada via API visible en UI inmediatamente |
| **Cleanup** | Habitación eliminada vía API tras el test |

---

### CROSS-004 · Precio de habitación en API coincide con precio mostrado en UI
| Campo | Detalle |
|-------|---------|
| **Archivo** | `tests/ui/cross-validation.spec.ts` |
| **Tipo** | Positivo / Consistencia datos API↔UI |
| **Precondición** | Al menos una habitación registrada con precio > 0 |
| **Pasos** | 1. GET `/api/room` · 2. Extraer `roomPrice` de la primera habitación · 3. Navegar a `/` · 4. Verificar que el texto `£{roomPrice}` es visible en la página |
| **Resultado esperado** | Precio retornado por la API coincide exactamente con el precio mostrado en el home |
| **Resultado obtenido** | ✅ Precio consistente entre API y UI |

---

## Patrones y decisiones de diseño

### Page Object Model (POM)
Los tests de UI no interactúan con el DOM directamente. Toda la lógica de selectores y navegación está encapsulada en:
- `pages/HomePage.ts` — flujo de reserva en la página de habitación
- `pages/ContactPage.ts` — formulario de contacto y verificación de resultados

### Helpers de API reutilizables
`helpers/api.helpers.ts` expone funciones puras que son usadas tanto por los tests de API como por el cleanup de los tests de UI:
- `getAuthToken()` — autenticación centralizada
- `createRoom()` / `deleteRoom()` — gestión de habitaciones
- `createBooking()` / `deleteBooking()` — gestión de reservas

### Gestión de datos de prueba
`fixtures/test-data.ts` centraliza todos los datos: credenciales, datos de reserva válidos e inválidos, datos de contacto. Ningún test hardcodea datos de negocio.

### Cleanup y aislamiento
- Tests de API: usan `afterEach` para eliminar recursos creados durante el test
- Tests de UI (booking): usan `afterEach` con el fixture `request` de Playwright para eliminar reservas vía API, evitando contaminación entre corridas
- Tests de cross-validation: cleanup inline al final de cada test
- Fechas dinámicas en tests de booking UI: generadas con semilla de timestamp (3000+ días) para garantizar disponibilidad en entorno compartido

### Validación cruzada UI vs API
`tests/ui/cross-validation.spec.ts` contiene pruebas híbridas que combinan el fixture `request` (API) con el fixture `page` (browser) para verificar la consistencia de datos entre capas. Se ubica en `tests/ui/` para ejecutarse con el proyecto `chromium` de Playwright, que es el único que provee ambos fixtures simultáneamente.

### Hallazgos del entorno real
Durante la implementación se identificaron diferencias entre la documentación del plan y el comportamiento real de la API:

| Diferencia | Plan | Real |
|-----------|------|------|
| Endpoint auth | `POST /api/auth` | `POST /api/auth/login` |
| Wrong password | 403 | 401 |
| POST /api/room sin auth | 403 | 401 |
| POST /api/room con auth | 201 + objeto room | 200 + `{"success":true}` |
| DELETE room/booking | 202 | 200 |
| GET /api/booking | Sin params | Requiere `?roomid=<id>` |
| POST /api/booking | Sin roomid | Requiere campo `roomid` |

---

## Comandos de ejecución

```bash
cd ~/restful-booker-tests

# Todas las pruebas
npm test

# Solo API (rápido, sin browser)
npm run test:api

# Solo UI (Chromium)
npm run test:ui

# Ver reporte HTML interactivo
npm run test:report
```
