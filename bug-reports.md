# Reporte de Bugs — Restful-Booker-Platform
## Proyecto: QA Portfolio

**Aplicación bajo prueba:** https://automationintesting.online
**Fecha inicio:** Marzo 2026
**Autor:** Adriana Troche — Senior QA Engineer

---

## Resumen ejecutivo

| Total bugs | Críticos | Altos | Medios | Bajos | Cerrados |
|-----------|---------|-------|--------|-------|---------|
| 7 | 0 | 2 | 4 | 1 | 0 |

---

## Clasificación de severidad

| Severidad | Descripción |
|-----------|-------------|
| 🔴 Crítico | Bloquea funcionalidad principal — no hay workaround |
| 🟠 Alto | Impacto significativo en funcionalidad o seguridad |
| 🟡 Medio | Funcionalidad afectada parcialmente — hay workaround |
| 🔵 Bajo | Problema menor, cosmético o de documentación |

---

## Bugs reportados

### BUG-001 · Endpoint de autenticación no coincide con la documentación
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-001 |
| **Módulo** | API — Autenticación |
| **Severidad** | 🟠 Alto |
| **Tipo** | Bug de contrato API |
| **Ambiente** | https://automationintesting.online |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación oficial indica que el endpoint de autenticación es `POST /api/auth`, pero el servidor responde únicamente en `POST /api/auth/login`. El endpoint documentado retorna 404. |
| **Pasos para reproducir** | 1. Enviar `POST https://automationintesting.online/api/auth` con body `{ "username": "admin", "password": "password" }` |
| **Resultado esperado** | HTTP 200 con token según documentación |
| **Resultado obtenido** | HTTP 404 — endpoint no encontrado |
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
| **Ambiente** | https://automationintesting.online |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación indica que un login con credenciales incorrectas debe retornar HTTP 403 (Forbidden). El servidor retorna HTTP 401 (Unauthorized), que semánticamente es más correcto para este caso, pero no cumple el contrato documentado. |
| **Pasos para reproducir** | 1. `POST /api/auth/login` con body `{ "username": "admin", "password": "wrongpassword" }` |
| **Resultado esperado** | HTTP 403 según documentación |
| **Resultado obtenido** | HTTP 401 |
| **Nota** | HTTP 401 es semánticamente más correcto — este bug podría considerarse un error de documentación más que de implementación. |
| **Estado** | 🟡 Abierto |

---

### BUG-003 · Código de respuesta incorrecto al crear habitación sin autenticación
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-003 |
| **Módulo** | API — Habitaciones |
| **Severidad** | 🔵 Bajo |
| **Tipo** | Bug de contrato API |
| **Ambiente** | https://automationintesting.online |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación indica HTTP 403 al intentar crear una habitación sin token de autenticación. El servidor retorna HTTP 401. |
| **Pasos para reproducir** | 1. `POST /api/room` sin cookie de autenticación con body de habitación válido |
| **Resultado esperado** | HTTP 403 según documentación |
| **Resultado obtenido** | HTTP 401 |
| **Nota** | Igual que BUG-002 — HTTP 401 es más correcto semánticamente para recursos sin autenticar. |
| **Estado** | 🟡 Abierto |

---

### BUG-004 · Respuesta al crear habitación no cumple el contrato documentado
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-004 |
| **Módulo** | API — Habitaciones |
| **Severidad** | 🟠 Alto |
| **Tipo** | Bug de contrato API |
| **Ambiente** | https://automationintesting.online |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación indica que `POST /api/room` debe retornar HTTP 201 con el objeto de la habitación creada (incluyendo el `roomid` asignado). El servidor retorna HTTP 200 con `{"success": true}`, sin incluir el objeto de la habitación ni el ID generado. Esto obliga al cliente a hacer una llamada adicional para obtener el ID de la habitación recién creada. |
| **Pasos para reproducir** | 1. `POST /api/room` con token válido y body: `{ "roomName": "Test", "type": "Single", "accessible": false, "roomPrice": 100, "features": [] }` |
| **Resultado esperado** | HTTP 201 + objeto habitación con `roomid` |
| **Resultado obtenido** | HTTP 200 + `{ "success": true }` |
| **Impacto** | Los clientes que dependan del contrato documentado deben hacer GET adicional para obtener el ID — mayor acoplamiento y latencia |
| **Estado** | 🟡 Abierto |

---

### BUG-005 · Código de respuesta incorrecto al eliminar recursos
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-005 |
| **Módulo** | API — Habitaciones / Reservas |
| **Severidad** | 🟡 Medio |
| **Tipo** | Bug de contrato API |
| **Ambiente** | https://automationintesting.online |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación indica que las operaciones DELETE deben retornar HTTP 202 (Accepted). El servidor retorna HTTP 200 (OK) tanto para `DELETE /api/room/:id` como para `DELETE /api/booking/:id`. |
| **Pasos para reproducir** | 1. Crear una habitación con token válido · 2. `DELETE /api/room/{id}` con token |
| **Resultado esperado** | HTTP 202 según documentación |
| **Resultado obtenido** | HTTP 200 |
| **Afecta** | `DELETE /api/room/:id` y `DELETE /api/booking/:id` |
| **Estado** | 🟡 Abierto |

---

### BUG-006 · GET /api/booking requiere parámetro roomid no documentado
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-006 |
| **Módulo** | API — Reservas |
| **Severidad** | 🟠 Alto |
| **Tipo** | Bug de contrato API |
| **Ambiente** | https://automationintesting.online |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación indica que `GET /api/booking` retorna todas las reservas sin parámetros adicionales. El servidor requiere el query param `?roomid=<id>` para retornar resultados. Sin este parámetro, la respuesta está vacía o retorna error. |
| **Pasos para reproducir** | 1. `GET /api/booking` con token válido, sin query params |
| **Resultado esperado** | HTTP 200 con listado de todas las reservas |
| **Resultado obtenido** | Respuesta vacía o sin reservas — requiere `?roomid=<id>` |
| **Impacto** | Clientes que implementen según documentación no obtendrán reservas — funcionalidad rota desde la perspectiva del contrato |
| **Estado** | 🟡 Abierto |

---

### BUG-007 · POST /api/booking requiere campo roomid no documentado
| Campo | Detalle |
|-------|---------|
| **ID** | BUG-007 |
| **Módulo** | API — Reservas |
| **Severidad** | 🟡 Medio |
| **Tipo** | Bug de contrato API |
| **Ambiente** | https://automationintesting.online |
| **Fecha** | Marzo 2026 |
| **Descripción** | La documentación del body para `POST /api/booking` no incluye el campo `roomid` como requerido. Al intentar crear una reserva sin este campo, la operación falla. El campo es obligatorio en la implementación real. |
| **Pasos para reproducir** | 1. `POST /api/booking` con body sin `roomid`: `{ "firstname": "Jane", "lastname": "Tester", "bookingdates": { "checkin": "2026-09-01", "checkout": "2026-09-05" } }` |
| **Resultado esperado** | HTTP 201 con reserva creada según documentación |
| **Resultado obtenido** | Error — campo `roomid` requerido |
| **Estado** | 🟡 Abierto |

---

## Bugs pendientes de investigación

Los siguientes casos manuales están pendientes de ejecución y son candidatos a generar nuevos bugs:

| Caso | Escenario | Sospecha |
|------|-----------|----------|
| ROOM-008 | Precio negativo en habitación | Posible falta de validación — podría aceptar valores negativos |
| ROOM-009 | Nombre de habitación duplicado | Posible falta de validación de unicidad |
| BOOK-008 | Checkin igual al checkout | Posible falta de validación de rango mínimo |
| CAL-002 | Selección de fecha pasada en UI | Posible que el calendario no bloquee fechas pasadas |

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
| **Ambiente** | https://automationintesting.online |
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
