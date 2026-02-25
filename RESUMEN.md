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

### 6. Pruebas API (`tests/api/`)
- **`auth.spec.ts`** — login válido, password incorrecto, body vacío
- **`rooms.spec.ts`** — GET con validación de schema, POST sin/con token, DELETE
- **`bookings.spec.ts`** — POST válido/inválido, GET con auth, DELETE, cleanup en `afterEach`

---

### 7. Pruebas UI (`tests/ui/`)
- **`contact.spec.ts`** — formulario completo exitoso, nombre corto, sin email, formulario vacío
- **`booking.spec.ts`** — selección de fechas en calendario y confirmación de reserva

---

### Verificación final
Corrí `tsc --noEmit` y el proyecto **compila sin errores**. Todo está listo para ejecutar.

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
│   │   ├── booking.spec.ts
│   │   └── contact.spec.ts
│   └── api/
│       ├── auth.spec.ts
│       ├── rooms.spec.ts
│       └── bookings.spec.ts
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
└── RESUMEN.md
```
