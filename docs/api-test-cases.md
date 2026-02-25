# Casos de Prueba Manuales — API REST
## Proyecto: Restful-Booker-Platform QA Portfolio

**Aplicación bajo prueba:** https://automationintesting.online
**Herramienta:** Postman
**Fecha:** Marzo 2026
**Autor:** Adriana Troche — Senior QA Engineer
**Total de casos:** 28

---

## Resumen ejecutivo

| Módulo | Casos | Estado |
|--------|-------|--------|
| Autenticación | 3 | ✅ Automatizado |
| Habitaciones (Rooms) | 5 | ✅ Automatizado |
| Reservas (Bookings) | 5 | ✅ Automatizado |
| Habitaciones — casos adicionales | 5 | ⬜ Pendiente |
| Reservas — casos adicionales | 6 | ⬜ Pendiente |
| Validación cruzada UI vs API | 4 | ⬜ Pendiente |

---

## Base URL y autenticación

```
Base URL: https://automationintesting.online
Auth: Cookie — token=<valor obtenido de POST /api/auth/login>
```

Para obtener el token antes de ejecutar los casos que lo requieren:

```
POST /api/auth/login
Body: { "username": "admin", "password": "password" }
Respuesta: { "token": "<valor>" }
Usar como cookie: token=<valor>
```

---

## Módulo 1 — Autenticación
> ✅ Casos cubiertos por automatización — ver `tests/api/auth.spec.ts`

### AUTH-001 · Login con credenciales válidas
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/auth/login` |
| **Tipo** | Positivo |
| **Body** | `{ "username": "admin", "password": "password" }` |
| **Resultado esperado** | HTTP 200 · body contiene `token` no vacío |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### AUTH-002 · Login con contraseña incorrecta
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/auth/login` |
| **Tipo** | Negativo |
| **Body** | `{ "username": "admin", "password": "wrongpassword" }` |
| **Resultado esperado** | HTTP 401 · acceso denegado |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### AUTH-003 · Login con body vacío
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/auth/login` |
| **Tipo** | Negativo / Borde |
| **Body** | `{}` |
| **Resultado esperado** | Código distinto de 200 · no se genera token |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

## Módulo 2 — Habitaciones (automatizados)
> ✅ Casos cubiertos por automatización — ver `tests/api/rooms.spec.ts`

### ROOM-001 · Listar habitaciones (endpoint público)
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `GET /api/room` |
| **Tipo** | Positivo |
| **Auth** | No requerida |
| **Resultado esperado** | HTTP 200 · body contiene `rooms` array |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### ROOM-002 · Validación de schema de habitación
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `GET /api/room` |
| **Tipo** | Positivo / Schema |
| **Resultado esperado** | Cada habitación tiene: `roomid` (Number), `roomName` (String), `type` (String), `roomPrice` (Number) |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### ROOM-003 · Crear habitación sin autenticación
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/room` |
| **Tipo** | Negativo / Seguridad |
| **Auth** | Sin token |
| **Resultado esperado** | HTTP 401 |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### ROOM-004 · Crear habitación con token válido
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/room` |
| **Tipo** | Positivo |
| **Auth** | Cookie token válido |
| **Resultado esperado** | HTTP 200 · habitación creada |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### ROOM-005 · Eliminar habitación con token válido
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `DELETE /api/room/:id` |
| **Tipo** | Positivo |
| **Auth** | Cookie token válido |
| **Resultado esperado** | HTTP 200 |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

## Módulo 3 — Reservas (automatizadas)
> ✅ Casos cubiertos por automatización — ver `tests/api/bookings.spec.ts`

### BOOK-001 · Crear reserva con datos válidos
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/booking` |
| **Tipo** | Positivo |
| **Resultado esperado** | HTTP 201 · body contiene `bookingid`, `roomid`, `firstname`, `lastname` |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### BOOK-002 · Crear reserva con fechas inválidas
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/booking` |
| **Tipo** | Negativo |
| **Resultado esperado** | HTTP 409 Conflict |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### BOOK-003 · Listar reservas con token válido
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `GET /api/booking?roomid=1` |
| **Tipo** | Positivo |
| **Resultado esperado** | HTTP 200 · body contiene `bookings` array |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### BOOK-004 · Listar reservas sin autenticación
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `GET /api/booking?roomid=1` |
| **Tipo** | Negativo / Seguridad |
| **Resultado esperado** | HTTP 401 |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

### BOOK-005 · Eliminar reserva con token válido
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `DELETE /api/booking/:id` |
| **Tipo** | Positivo |
| **Resultado esperado** | HTTP 200 |
| **Resultado obtenido** | ✅ Automatizado — pasando |
| **Estado** | ✅ Automatizado |

---

## Módulo 4 — Habitaciones: Casos Adicionales Manuales

### ROOM-006 · Obtener habitación por ID
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `GET /api/room/:id` |
| **Tipo** | Positivo |
| **Auth** | No requerida |
| **Pasos** | 1. Obtener un `roomid` válido del listado · 2. GET `/api/room/{id}` |
| **Resultado esperado** | HTTP 200 · body contiene datos de la habitación: `roomid`, `roomName`, `type`, `roomPrice` |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |

---

### ROOM-007 · Obtener habitación con ID inexistente
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `GET /api/room/:id` |
| **Tipo** | Negativo |
| **Auth** | No requerida |
| **Pasos** | 1. GET `/api/room/99999` (ID que no existe) |
| **Resultado esperado** | HTTP 404 · mensaje de error descriptivo |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |

---

### ROOM-008 · Crear habitación con precio negativo
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/room` |
| **Tipo** | Negativo / Borde |
| **Auth** | Cookie token válido |
| **Body** | `{ "roomName": "Test", "type": "Single", "accessible": false, "roomPrice": -50 }` |
| **Resultado esperado** | HTTP 400 o error de validación · habitación no creada |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |

---

### ROOM-009 · Crear habitación con nombre duplicado
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/room` |
| **Tipo** | Negativo / Borde |
| **Auth** | Cookie token válido |
| **Pasos** | 1. Crear habitación con nombre "Test Room" · 2. Intentar crear otra con el mismo nombre |
| **Resultado esperado** | HTTP 409 Conflict o error de duplicado |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |
| **Cleanup** | Eliminar las habitaciones creadas |

---

### ROOM-010 · Eliminar habitación sin autenticación
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `DELETE /api/room/:id` |
| **Tipo** | Negativo / Seguridad |
| **Auth** | Sin token |
| **Pasos** | 1. Obtener un `roomid` válido · 2. DELETE sin cookie de autenticación |
| **Resultado esperado** | HTTP 401 Unauthorized |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |

---

## Módulo 5 — Reservas: Casos Adicionales Manuales

### BOOK-006 · Crear reserva sin firstname
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/booking` |
| **Tipo** | Negativo / Campo requerido |
| **Body** | `{ "roomid": 1, "lastname": "Tester", "bookingdates": { "checkin": "2026-09-01", "checkout": "2026-09-05" } }` |
| **Resultado esperado** | HTTP 400 · mensaje indicando campo requerido |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |

---

### BOOK-007 · Crear reserva sin roomid
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/booking` |
| **Tipo** | Negativo / Campo requerido |
| **Body** | `{ "firstname": "Jane", "lastname": "Tester", "bookingdates": { "checkin": "2026-09-01", "checkout": "2026-09-05" } }` |
| **Resultado esperado** | HTTP 400 · error de validación |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |

---

### BOOK-008 · Crear reserva con checkin igual al checkout
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `POST /api/booking` |
| **Tipo** | Negativo / Borde |
| **Body** | `{ "roomid": 1, "firstname": "Jane", "lastname": "Tester", "bookingdates": { "checkin": "2026-09-01", "checkout": "2026-09-01" } }` |
| **Resultado esperado** | HTTP 409 o error de validación — no se puede reservar 0 noches |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |

---

### BOOK-009 · Obtener reserva por ID con token válido
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `GET /api/booking/:id` |
| **Tipo** | Positivo |
| **Auth** | Cookie token válido |
| **Pasos** | 1. Crear reserva · 2. GET `/api/booking/{bookingid}` con token |
| **Resultado esperado** | HTTP 200 · body contiene datos de la reserva creada |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |
| **Cleanup** | Eliminar la reserva creada |

---

### BOOK-010 · Obtener reserva con ID inexistente
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `GET /api/booking/:id` |
| **Tipo** | Negativo |
| **Auth** | Cookie token válido |
| **Pasos** | 1. GET `/api/booking/99999` |
| **Resultado esperado** | HTTP 404 · mensaje de error |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |

---

### BOOK-011 · Eliminar reserva sin autenticación
| Campo | Detalle |
|-------|---------|
| **Endpoint** | `DELETE /api/booking/:id` |
| **Tipo** | Negativo / Seguridad |
| **Auth** | Sin token |
| **Pasos** | 1. Crear reserva · 2. DELETE sin cookie de autenticación |
| **Resultado esperado** | HTTP 401 Unauthorized |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |
| **Cleanup** | Eliminar la reserva vía API con token si el test falla |

---

## Módulo 6 — Validación Cruzada UI vs API

> Estos casos verifican consistencia entre lo que muestra la UI y lo que retorna la API. Demuestran criterio QA avanzado.

### CROSS-001 · Reserva creada en UI aparece en API
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / Integración |
| **Pasos** | 1. Crear una reserva desde la UI (flujo guest) · 2. Anotar los datos ingresados · 3. GET `/api/booking?roomid=1` con token · 4. Buscar la reserva en la respuesta |
| **Resultado esperado** | La reserva creada desde UI aparece en el listado de la API con los mismos datos (nombre, fechas) |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |

---

### CROSS-002 · Reserva eliminada en API desaparece de la UI
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / Integración |
| **Pasos** | 1. Crear reserva desde UI · 2. Obtener su ID vía API · 3. DELETE `/api/booking/{id}` · 4. Verificar en el panel admin que la reserva ya no existe |
| **Resultado esperado** | Reserva eliminada vía API no aparece en el panel de administración UI |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |

---

### CROSS-003 · Habitación creada en API aparece en la UI
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / Integración |
| **Pasos** | 1. Crear habitación vía `POST /api/room` con token · 2. Navegar al panel de administración · 3. Verificar que la habitación aparece en el listado |
| **Resultado esperado** | Habitación creada vía API visible en la UI del panel admin con los mismos datos |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |
| **Cleanup** | Eliminar la habitación creada |

---

### CROSS-004 · Precio de habitación en UI coincide con API
| Campo | Detalle |
|-------|---------|
| **Tipo** | Positivo / Consistencia de datos |
| **Pasos** | 1. GET `/api/room` · 2. Anotar el precio de una habitación · 3. Navegar a la UI y verificar el precio mostrado para esa habitación |
| **Resultado esperado** | El precio mostrado en la UI coincide exactamente con el valor retornado por la API |
| **Resultado obtenido** | |
| **Estado** | ⬜ Pendiente |

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ Automatizado | Caso cubierto por la suite Playwright |
| ⬜ Pendiente | Caso manual pendiente de ejecución |
| ✔️ Pasó | Ejecutado manualmente — resultado correcto |
| ❌ Falló | Ejecutado manualmente — defecto encontrado |

---

*Proyecto de portafolio QA — Adriana Troche · Senior QA Engineer*
