# 📋 QA Portfolio — Plan de Ejecución (1 mes)

**App:** [Restful Booker Platform](https://automationintesting.online/)
**Objetivo:** Demostrar amplitud QA — manual + automatizado + estrategia
**Duración:** 4 semanas

---

## 🔧 Setup Inicial

- [ ] 1. Crear repositorio público en GitHub: `qa-portfolio-restful-booker`
- [ ] 2. Definir estructura de carpetas desde el inicio (`docs/`, `tests/`, `.github/workflows/`)
- [ ] 3. Inicializar proyecto con Node.js + Playwright + TypeScript
- [ ] 4. Crear `README.md` base con descripción del proyecto

---

## 📄 Semana 1 — Estrategia y Pruebas Manuales

- [ ] 5. Explorar la app (web + API) y documentar el alcance
- [ ] 6. Escribir Test Plan (objetivo, alcance, riesgos, criterios de entrada/salida)
- [ ] 7. Análisis de riesgos — identificar qué flujos son críticos
- [ ] 8. Diseñar casos de prueba manuales — happy path + edge cases (web)
- [ ] 9. Diseñar casos de prueba manuales para API (usando Postman o similar)
- [ ] 10. Ejecutar casos de prueba y documentar resultados
- [ ] 11. Reportar bugs encontrados con estructura profesional (pasos, evidencia, severidad)

---

## 🤖 Semana 2 — Automatización Playwright + TypeScript

- [ ] 12. Configurar Playwright con TypeScript y Page Object Model
- [ ] 13. Automatizar flujos críticos web (los priorizados en semana 1)
- [ ] 14. Crear tests de API con Playwright `APIRequestContext`
- [ ] 15. Agregar validación cruzada UI vs API en al menos un flujo clave
- [ ] 16. Organizar tests por módulo y agregar tags (`@smoke`, `@regression`)

---

## ⚙️ Semana 3 — CI/CD

- [ ] 17. Crear workflow GitHub Actions para ejecución en push y PR
- [ ] 18. Configurar reporte de resultados con Playwright HTML Report
- [ ] 19. Publicar reporte como GitHub Pages o artifact descargable
- [ ] 20. Agregar badge de estado del pipeline en el README

---

## 🎁 Semana 4 — Presentación y LinkedIn

- [ ] 21. Completar README con: descripción, stack, estructura, cómo correr los tests, métricas
- [ ] 22. Agregar capturas o GIF del pipeline corriendo
- [ ] 23. Escribir post LinkedIn contando el proceso (no solo el resultado)
- [ ] 24. Publicar y anclar el repositorio en tu perfil GitHub

---

## 🗂️ Estructura de Carpetas Sugerida

```
qa-portfolio-restful-booker/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── docs/
│   ├── test-plan.md
│   ├── risk-analysis.md
│   ├── test-cases/
│   │   ├── web-test-cases.md
│   │   └── api-test-cases.md
│   └── bug-reports/
├── tests/
│   ├── pages/          # Page Object Model
│   ├── web/            # Tests UI
│   ├── api/            # Tests API
│   └── fixtures/
├── playwright.config.ts
├── package.json
└── README.md
```

---

## 🛠️ Stack Técnico

| Área | Herramienta |
|---|---|
| Automatización | Playwright + TypeScript |
| Patrón | Page Object Model |
| CI/CD | GitHub Actions |
| Reporte | Playwright HTML Report |
| API Testing | Playwright APIRequestContext |
| Gestión manual | Postman |

---

*Proyecto iniciado: marzo 2026*
