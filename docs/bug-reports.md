# Reporte de Bugs — Restful-Booker-Platform
## Proyecto: QA Portfolio

**Aplicación bajo prueba:** https://automationintesting.online
**Fecha inicio:** Marzo 2026
**Autor:** Adriana Troche — Senior QA Engineer

---

## Resumen ejecutivo

| Total bugs | Críticos | Altos | Medios | Bajos |
|-----------|---------|-------|--------|-------|
| 12 | 0 | 3 | 5 | 4 |

**Revalidación septiembre 2026:** la API cambió de comportamiento. BUG-005 quedó resuelto y apareció
BUG-012. El resto sigue abierto.

---

## Clasificación de severidad

| Severidad | Descripción |
|-----------|-------------|
| 🔴 Crítico | Bloquea funcionalidad principal — no hay workaround |
| 🟠 Alto | Impacto significativo en funcionalidad o seguridad |
| 🟡 Medio | Funcionalidad afectada parcialmente — hay workaround |
| 🔵 Bajo | Problema menor, cosmético o de documentación |

---

## Bugs de contrato API (encontrados en automatización)

### BUG-001 · Endpoint de autenticación no coincide con la documentación
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-001 |
| **Módulo** | API — Autenticación |
| **Severidad** | 🟠 Alto |
| **Tipo** | Bug de contrato API |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación oficial indica `POST /api/auth` pero el servidor responde únicamente en `POST /api/auth/login`. El endpoint documentado retorna 404. |
| **Pasos para reproducir** | 1. `POST https://automationintesting.online/api/auth` con body `{ "username": "admin", "password": "password" }` |
| **Resultado esperado** | HTTP 200 con token |
| **Resultado obtenido** | HTTP 404 |
| **Workaround** | Usar `POST /api/auth/login` |
| **Estado** | 🟡 Abierto |

---

### BUG-002 · Código de respuesta incorrecto en login con credenciales inválidas
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-002 |
| **Módulo** | API — Autenticación |
| **Severidad** | 🔵 Bajo |
| **Tipo** | Bug de contrato API |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación indica HTTP 403 para login con credenciales incorrectas. El servidor retorna HTTP 401. |
| **Pasos para reproducir** | 1. `POST /api/auth/login` con password incorrecto |
| **Resultado esperado** | HTTP 403 según documentación |
| **Resultado obtenido** | HTTP 401 |
| **Nota** | HTTP 401 es semánticamente más correcto — posible error de documentación. |
| **Estado** | 🟡 Abierto |

---

### BUG-003 · Código de respuesta incorrecto al crear habitación sin autenticación
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-003 |
| **Módulo** | API — Habitaciones |
| **Severidad** | 🔵 Bajo |
| **Tipo** | Bug de contrato API |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación indica HTTP 403 al crear habitación sin token. El servidor retorna HTTP 401. |
| **Pasos para reproducir** | 1. `POST /api/room` sin cookie de autenticación |
| **Resultado esperado** | HTTP 403 |
| **Resultado obtenido** | HTTP 401 |
| **Estado** | 🟡 Abierto |

---

### BUG-004 · Respuesta al crear habitación no cumple el contrato documentado
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-004 |
| **Módulo** | API — Habitaciones |
| **Severidad** | 🟠 Alto |
| **Tipo** | Bug de contrato API |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación indica HTTP 201 con el objeto habitación creada incluyendo `roomid`. El servidor retorna HTTP 200 con `{"success": true}` sin incluir el objeto ni el ID generado. |
| **Pasos para reproducir** | 1. `POST /api/room` con token válido y datos de habitación |
| **Resultado esperado** | HTTP 201 + objeto habitación con `roomid` |
| **Resultado obtenido** | HTTP 200 + `{ "success": true }` |
| **Impacto** | Los clientes deben hacer GET adicional para obtener el ID — mayor acoplamiento y latencia |
| **Estado** | 🟡 Abierto |

---

### BUG-005 · Código de respuesta incorrecto al eliminar recursos
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-005 |
| **Módulo** | API — Habitaciones / Reservas |
| **Severidad** | 🔵 Bajo |
| **Tipo** | Bug de contrato API |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación indica HTTP 202 para operaciones DELETE. El servidor retorna HTTP 200. |
| **Pasos para reproducir** | 1. `DELETE /api/room/{id}` con token válido |
| **Resultado esperado** | HTTP 202 |
| **Resultado obtenido** | HTTP 200 |
| **Afecta** | `DELETE /api/room/:id` y `DELETE /api/booking/:id` |
| **Revalidación** | Septiembre 2026: el servidor retorna HTTP 202, como indica la documentación. `PUT /api/room/:id` también retorna 202. Los tests se actualizaron al nuevo código. |
| **Estado** | ✅ Resuelto (septiembre 2026) |

---

### BUG-006 · GET /api/booking requiere parámetro roomid no documentado
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-006 |
| **Módulo** | API — Reservas |
| **Severidad** | 🟠 Alto |
| **Tipo** | Bug de contrato API |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación indica que `GET /api/booking` retorna todas las reservas sin parámetros. El servidor requiere `?roomid=<id>` obligatoriamente. |
| **Pasos para reproducir** | 1. `GET /api/booking` con token válido, sin query params |
| **Resultado esperado** | HTTP 200 con listado de reservas |
| **Resultado obtenido** | Respuesta vacía — requiere `?roomid=<id>` |
| **Impacto** | Clientes que implementen según documentación no obtendrán reservas |
| **Estado** | 🟡 Abierto |

---

### BUG-007 · POST /api/booking requiere campo roomid no documentado
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-007 |
| **Módulo** | API — Reservas |
| **Severidad** | 🟡 Medio |
| **Tipo** | Bug de contrato API |
| **Fecha** | Marzo 2026 |
| **Descripción** | El campo `roomid` no está documentado como requerido en `POST /api/booking` pero es obligatorio en la implementación real. |
| **Pasos para reproducir** | 1. `POST /api/booking` con body sin `roomid` |
| **Resultado esperado** | HTTP 201 con reserva creada |
| **Resultado obtenido** | Error — campo `roomid` requerido |
| **Estado** | 🟡 Abierto |

---

### BUG-012 · Código inconsistente para requests sin autenticación según el método HTTP
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-012 |
| **Módulo** | API — Habitaciones / Reservas |
| **Severidad** | 🔵 Bajo |
| **Tipo** | Bug de contrato API |
| **Fecha** | Septiembre 2026 |
| **Descripción** | Un request sin token recibe HTTP 401 en `POST` y `GET`, pero HTTP 403 en `PUT` y `DELETE`. Hasta marzo 2026 todos respondían 401. Un cliente no puede tratar "sin autenticación" de forma uniforme. |
| **Pasos para reproducir** | 1. `POST /api/room` sin cookie → 401 · 2. `PUT /api/room/{id}` sin cookie → 403 · 3. `DELETE /api/room/{id}` sin cookie → 403 |
| **Resultado esperado** | El mismo código para la misma condición (sin autenticación) en todos los métodos |
| **Resultado obtenido** | 401 en `POST`/`GET` · 403 en `PUT`/`DELETE` |
| **Afecta** | `PUT /api/room/:id`, `DELETE /api/room/:id`, `DELETE /api/booking/:id` |
| **Detectado por** | Regresión de la suite automatizada: ROOM-010, ROOM-012 y BOOK-011 empezaron a fallar |
| **Estado** | 🟡 Abierto |

---

## Bugs funcionales (encontrados en ejecución manual)

### BUG-008 · El sistema permite crear reservas con fechas pasadas
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-008 |
| **Módulo** | UI — Calendario / API — Reservas |
| **Severidad** | 🟠 Alto |
| **Tipo** | Bug funcional — validación de negocio |
| **Fecha** | 25 de febrero 2026 |
| **Descripción** | El calendario de la UI no bloquea la selección de fechas pasadas. Además, la API no valida que las fechas de check-in sean futuras. El sistema confirma reservas con fechas anteriores a la fecha actual sin ningún error ni advertencia. |
| **Pasos para reproducir** | 1. Navegar a la página principal · 2. Click en "Book this room" · 3. Seleccionar fechas pasadas (ej. 2026-02-10 / 2026-02-14) · 4. Completar el formulario · 5. Click "Reserve Now" |
| **Resultado esperado** | Fechas pasadas deshabilitadas en el calendario · si se envían por API, retornar error de validación |
| **Resultado obtenido** | Reserva confirmada con mensaje "Booking Confirmed" para fechas 2026-02-10 / 2026-02-14 |
| **Evidencia** | Screenshot adjunto — confirmación de reserva con fechas pasadas |
| **Impacto** | Reservas inválidas en el sistema · datos inconsistentes · posibles problemas operativos |
| **Estado** | 🟡 Abierto |

---

### BUG-009 · Panel admin accesible visualmente después del logout
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-009 |
| **Módulo** | UI — Panel de Administración — Sesión |
| **Severidad** | 🟡 Medio |
| **Tipo** | Bug de seguridad — gestión de sesión |
| **Fecha** | 25 de febrero 2026 |
| **Descripción** | Después de hacer logout, el botón "atrás" del navegador permite volver a la vista `/admin/rooms`. La pantalla es visible aunque las acciones muestran el mensaje "Authentication required". La sesión debería invalidarse completamente y redirigir al login. |
| **Pasos para reproducir** | 1. Login en `/admin` · 2. Click en Logout · 3. Click en botón "atrás" del navegador |
| **Resultado esperado** | Redirige al login · pantalla de rooms no accesible sin autenticación |
| **Resultado obtenido** | Vista de rooms visible · acciones protegidas pero pantalla expuesta |
| **Impacto** | Exposición visual de datos de habitaciones a usuarios no autenticados |
| **Estado** | 🟡 Abierto |

---

### BUG-010 · Imagen de habitación recién creada no se renderiza
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-010 |
| **Módulo** | UI — Panel de Administración — Habitaciones |
| **Severidad** | 🔵 Bajo |
| **Tipo** | Bug visual |
| **Fecha** | 25 de febrero 2026 |
| **Descripción** | Al crear una habitación nueva y acceder a su detalle, el campo Image muestra el texto "Room: 201 preview image" pero la imagen no se renderiza. Las habitaciones preexistentes con imagen configurada sí la muestran correctamente. |
| **Pasos para reproducir** | 1. Login en panel admin · 2. Crear habitación nueva · 3. Acceder al detalle de la habitación creada |
| **Resultado esperado** | Imagen placeholder o mensaje indicando que no hay imagen configurada |
| **Resultado obtenido** | Texto alternativo visible sin imagen — elemento img roto |
| **Nota** | Habitaciones preexistentes (ej. Room 103) muestran imagen correctamente |
| **Estado** | 🟡 Abierto |

---

### BUG-011 · Click en reserva del calendario no muestra detalle
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-011 |
| **Módulo** | UI — Panel de Administración — Reporte |
| **Severidad** | 🟡 Medio |
| **Tipo** | Bug funcional |
| **Fecha** | 25 de febrero 2026 |
| **Descripción** | En la vista de reporte del panel admin, hacer click en una reserva del calendario no abre ningún panel de detalle ni muestra información adicional del huésped. Se esperaría acceder a los datos completos de la reserva. |
| **Pasos para reproducir** | 1. Login en panel admin · 2. Click en "Report" · 3. Click en cualquier reserva del calendario |
| **Resultado esperado** | Panel o modal con detalle de la reserva: nombre, email, teléfono, habitación, fechas |
| **Resultado obtenido** | Ninguna acción — click sin respuesta visual |
| **Workaround** | Ver reservas desde el detalle de cada habitación en `/admin/room/:id` |
| **Estado** | 🟡 Abierto |

---

## Plantilla para nuevos bugs

```markdown
### BUG-XXX · [Título descriptivo]
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-XXX |
| **Módulo** | |
| **Severidad** | 🔴 Crítico / 🟠 Alto / 🟡 Medio / 🔵 Bajo |
| **Tipo** | Bug funcional / Bug de contrato API / Bug visual |
| **Fecha** | |
| **Descripción** | |
| **Pasos para reproducir** | 1. · 2. · 3. |
| **Resultado esperado** | |
| **Resultado obtenido** | |
| **Evidencia** | [screenshot o video si aplica] |
| **Estado** | 🟡 Abierto |
```

---

*Proyecto de portafolio QA — Adriana Troche · Senior QA Engineer*
