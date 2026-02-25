# Resumen del Proyecto: Playwright QA Portfolio — Restful-Booker-Platform

## Lo que construí

Creé un proyecto de portafolio QA profesional completo desde cero en `~/restful-booker-tests`. Aquí el resumen:

---

### 1. Inicialización del proyecto
- Creé el directorio del proyecto y lo inicialicé con `npm`
- Instalé `@playwright/test`, `typescript` y `@types/node` como dependencias de desarrollo
- Descargué el browser Chromium para las pruebas UI

---

### 2. Configuración (`playwright.config.ts` + `tsconfig.json`)
- Configuré dos **proyectos de Playwright**:
  - `chromium` → para pruebas UI (con browser real)
  - `api` → para pruebas API (sin browser, mucho más rápido)
- `baseURL` apunta a `https://automationintesting.online`
- Reporters: `html` (reporte visual) + `list` (consola)
- TypeScript en modo estricto

---

### 3. Datos de prueba centralizados (`fixtures/test-data.ts`)
Credenciales admin, datos válidos/inválidos de booking, y datos del formulario de contacto — todo en un solo lugar para fácil mantenimiento.

---

### 4. Helpers de API (`helpers/api.helpers.ts`)
Cinco funciones reutilizables:
- `getAuthToken()` — hace POST /api/auth y devuelve el token
- `createRoom()` / `deleteRoom()` — con cookie de autenticación
- `createBooking()` / `deleteBooking()` — para el CRUD de reservas

---

### 5. Page Object Model (`pages/`)
- **`HomePage.ts`** — encapsula abrir el widget de reserva, seleccionar fechas en el calendario (drag & drop), llenar el formulario y verificar confirmación
- **`ContactPage.ts`** — encapsula llenar el formulario de contacto, enviarlo y verificar mensajes de éxito o errores de validación

---

### 6. Pruebas API (`tests/api/`) — 24 casos
- **`auth.spec.ts`** (3) — login válido, password incorrecto, body vacío
- **`rooms.spec.ts`** (10) — GET list + schema, GET por ID, POST sin/con token, POST precio negativo, POST nombre duplicado, DELETE con/sin token
- **`bookings.spec.ts`** (11) — POST válido/inválido, campos requeridos, fechas borde, GET list/por ID/sin auth, DELETE con/sin token, cleanup en `afterEach`

---

### 7. Pruebas UI (`tests/ui/`) — 10 casos
- **`contact.spec.ts`** (4) — formulario completo exitoso, teléfono inválido, sin email, formulario vacío
- **`booking.spec.ts`** (2) — flujo end-to-end de reserva con fechas dinámicas y cleanup via API
- **`cross-validation.spec.ts`** (4) — validación cruzada UI vs API: booking UI→API, delete API→UI, room API→UI, precio API↔UI

---

### Verificación final
**34/34 pruebas pasando** · `tsc --noEmit` sin errores de compilación · reporte HTML disponible con `npm run test:report`.

---

## Comandos para correr las pruebas

```bash
cd ~/restful-booker-tests

npm run test:api      # API tests only (fast, headless)
npm run test:ui       # UI tests only (Chromium)
npm test              # All tests
npm run test:report   # Open HTML report
```

## Estructura del proyecto

```
restful-booker-tests/
├── tests/
│   ├── ui/
│   │   ├── booking.spec.ts          # 2 tests — flujo end-to-end
│   │   ├── contact.spec.ts          # 4 tests — formulario de contacto
│   │   └── cross-validation.spec.ts # 4 tests — consistencia UI vs API
│   └── api/
│       ├── auth.spec.ts             # 3 tests — autenticación
│       ├── rooms.spec.ts            # 10 tests — CRUD habitaciones
│       └── bookings.spec.ts         # 11 tests — CRUD reservas
├── pages/
│   ├── HomePage.ts
│   └── ContactPage.ts
├── fixtures/
│   └── test-data.ts
├── helpers/
│   └── api.helpers.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── CASOS_DE_PRUEBA.md
└── RESUMEN.md
```
