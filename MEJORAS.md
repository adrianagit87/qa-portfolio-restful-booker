# Plan de Mejoras — QA Portfolio

Mejoras priorizadas para fortalecer el proyecto como portafolio profesional.
El badge de CI ya está en verde ✅ — las mejoras se ordenan por impacto visual/técnico.

---

## Prioridad 1 — Impacto inmediato en LinkedIn

### MEJORA-001 · Screenshot del reporte HTML en el README

**Por qué:** Es lo primero que ve un reclutador. Sin evidencia visual, muchos no llegan al código.

**Qué hacer:**
1. Correr `npm test` localmente
2. Abrir `npm run test:report` y tomar screenshot del reporte con todos los tests en verde
3. Guardar en `docs/assets/report-screenshot.png`
4. Agregar al README debajo de las métricas:
   ```markdown
   ![Playwright HTML Report](docs/assets/report-screenshot.png)
   ```

**Resultado esperado:** Imagen visible en el README de GitHub mostrando 34/34 passing.

---

### MEJORA-002 · GIF de los tests corriendo en CI

**Por qué:** Un GIF de la consola mostrando tests pasando uno a uno tiene más impacto que cualquier texto.

**Qué hacer:**
1. Usar [Terminalizer](https://github.com/faressoft/terminalizer) o [asciinema](https://asciinema.org/) para grabar `npm run test:api`
2. Convertir a GIF y guardar en `docs/assets/demo.gif`
3. Agregar al README en la sección de ejecución

**Alternativa más simple:** Screenshot del run de GitHub Actions mostrando el pipeline verde con tiempos de ejecución.

---

## Prioridad 2 — Profundidad técnica

### MEJORA-003 · Tests negativos de UI (booking con fechas ocupadas)

**Por qué:** Los tests de UI actuales solo cubren el camino feliz. Un QA senior cubre también los flujos de error.

**Qué hacer:** Agregar en `tests/ui/booking.spec.ts`:

```
UI-BOOKING-003 · Intentar reservar en fechas ya ocupadas → mensaje de error visible
```

**Pasos del test:**
1. Crear una reserva via API para fechas específicas
2. Intentar crear otra reserva UI para las mismas fechas y room
3. Verificar que aparece un mensaje de error (no confirmación)
4. Cleanup: eliminar la reserva creada en el paso 1

**Complejidad:** Media — requiere entender qué mensaje muestra la UI en conflicto de fechas.

---

### MEJORA-004 · Eliminar `roomid: 1` hardcodeado en fixtures

**Por qué:** Usar siempre `roomid: 1` asume que esa habitación siempre existe. Un QA senior usa datos dinámicos.

**Qué hacer:**
1. En `helpers/api.helpers.ts`, agregar función `getFirstAvailableRoomId(request)` que consulta `GET /api/room` y retorna el primer `roomid`
2. En los tests que dependen de `roomid`, obtenerlo dinámicamente en `beforeEach`
3. Actualizar `VALID_BOOKING` en fixtures para que `roomid` sea opcional o parametrizable

**Impacto:** El suite se vuelve resiliente a resets del entorno demo.

---

### MEJORA-005 · Test de actualización (PUT) de reserva

**Por qué:** El CRUD de bookings está incompleto — falta el Update. Cubre un endpoint real de la API.

**Qué hacer:** Agregar en `tests/api/bookings.spec.ts`:

```
BOOK-012 · PUT /api/booking/:id con token → 200 y datos actualizados
BOOK-013 · PUT /api/booking/:id sin token → 403
```

**Endpoint:** `PUT /api/booking/{id}` con cookie `token=<value>`

---

### MEJORA-006 · Test de actualización (PUT) de habitación

**Por qué:** Mismo argumento que MEJORA-005 para el CRUD de rooms.

**Qué hacer:** Agregar en `tests/api/rooms.spec.ts`:

```
ROOM-011 · PUT /api/room/:id con token → 200 y datos actualizados
ROOM-012 · PUT /api/room/:id sin token → 401
```

---

## Prioridad 3 — Madurez del framework

### MEJORA-007 · Separar configuración en variables de entorno

**Por qué:** Las credenciales admin (`admin` / `password`) están en `fixtures/test-data.ts`. En un proyecto real irían en `.env`.

**Qué hacer:**
1. Crear `.env.example` con:
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=password
   BASE_URL=https://automationintesting.online
   ```
2. Leer desde `process.env` en `fixtures/test-data.ts`
3. Agregar `.env` al `.gitignore` (ya está cubierto)
4. Actualizar el README con instrucciones de setup

**Resultado:** Demuestra conocimiento de buenas prácticas de seguridad en CI/CD.

---

### MEJORA-008 · Agregar `test.step()` en tests de UI complejos

**Por qué:** Los `test.step()` aparecen en el reporte HTML como pasos numerados, haciendo el reporte mucho más legible para stakeholders.

**Qué hacer:** En `tests/ui/booking.spec.ts` y `cross-validation.spec.ts`, envolver las acciones en steps:

```typescript
await test.step('Navigate to reservation page', async () => { ... });
await test.step('Fill guest information', async () => { ... });
await test.step('Submit booking form', async () => { ... });
await test.step('Verify confirmation heading', async () => { ... });
```

---

### MEJORA-009 · Agregar Allure Report como reporter alternativo

**Por qué:** Allure genera reportes con historial de ejecuciones y gráficas de tendencia — mucho más impresionante visualmente que el reporter nativo de Playwright.

**Qué hacer:**
1. `npm install --save-dev allure-playwright`
2. Agregar a `playwright.config.ts`:
   ```typescript
   reporter: [['html'], ['list'], ['allure-playwright']]
   ```
3. Publicar el reporte en GitHub Pages o Vercel
4. Agregar link en el README: "Ver último reporte →"

**Impacto:** Un reporte público en URL es el mayor diferenciador de portafolio.

---

## Resumen de prioridades

| # | Mejora | Impacto en portafolio | Dificultad | Estado |
|---|--------|----------------------|------------|--------|
| 001 | Screenshot del reporte en README | 🔴 Alto | Baja | ⏳ Pendiente (manual) |
| 002 | GIF de tests corriendo | 🔴 Alto | Baja | ⏳ Pendiente (manual) |
| 003 | Tests negativos UI | 🟠 Medio | Media | ✅ Completado |
| 004 | `roomid` dinámico | 🟠 Medio | Media | ✅ Completado |
| 005 | PUT booking | 🟡 Bajo-medio | Baja | ✅ Completado |
| 006 | PUT room | 🟡 Bajo-medio | Baja | ✅ Completado |
| 007 | Variables de entorno | 🟠 Medio | Baja | ✅ Completado |
| 008 | `test.step()` en UI | 🟠 Medio | Baja | ✅ Completado |
| 009 | Allure Report público | 🔴 Alto | Media | ✅ Completado |

---

## Orden de implementación sugerido

```
MEJORA-001 → MEJORA-007 → MEJORA-008 → MEJORA-004 → MEJORA-003 → MEJORA-005 → MEJORA-006 → MEJORA-009 → MEJORA-002
```

Empezar por lo visual (001) para que el README mejore de inmediato, luego las buenas prácticas de framework (007, 008), luego la cobertura técnica (004, 003, 005, 006), y terminar con Allure como cierre del portafolio (009).
