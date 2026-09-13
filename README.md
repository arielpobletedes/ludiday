# 🚀 LudiDay Monorepo

<div align="center">
  <p><strong>Suite moderna de administración de Portafolios, Proyectos y Tareas para Mobile y Escritorio</strong></p>
  <p>Construida con principios de <strong>Arquitectura Limpia (Clean Architecture)</strong> en un <strong>Monorepo con TypeScript</strong>.</p>
</div>

---

## 📖 Tabla de Contenidos
- [Descripción General](#-descripción-general)
- [Estructura del Monorepo](#-estructura-del-monorepo)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura Limpia (Clean Architecture)](#-arquitectura-limpia-clean-architecture)
- [Vistas y Funcionalidades](#-vistas-y-funcionalidades)
- [Instalación y Primeros Pasos](#-instalación-y-primeros-pasos)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estrategia de Versionamiento y Git](#-estrategia-de-versionamiento-y-git)

---

## 🌟 Descripción General

**LudiDay** es una plataforma integral diseñada para resolver la gestión ejecutiva, táctica y operativa de iniciativas empresariales a través de tres niveles jerárquicos (**Portafolios**, **Proyectos**, y **Tareas**), complementados por un **Dashboard Kanban Semanal** y un **Dashboard Mensual** con matriz de actividad diaria, objetivos, registro manual de hitos y lecciones aprendidas.

---

## 🏗️ Estructura del Monorepo

El monorepo está organizado mediante **NPM Workspaces**, desacoplando la lógica de negocio de las capas de presentación:

```text
ludiday/
├── packages/
│   ├── core/                        # @ludiday/core: Dominio, Casos de Uso y Repositorios
│   │   ├── src/
│   │   │   ├── domain/              # Entidades puras y contratos (DIP)
│   │   │   ├── use-cases/           # Casos de uso de la aplicación
│   │   │   └── data/                # Implementaciones de almacenamiento / Mock Repositories
│   │   └── package.json
│   └── ui/                          # @ludiday/ui: Sistema de diseño y componentes compartidos
│       ├── src/
│       │   └── index.tsx            # Badges de estado, prioridad y celdas interactivas
│       └── package.json
└── apps/
    ├── web/                         # @ludiday/web: Aplicación Web & Desktop (React 18 + Vite)
    │   ├── src/
    │   │   ├── components/          # KanbanDashboard, MonthlyDashboard, Modales, etc.
    │   │   ├── context/             # Proveedor de estado global
    │   │   └── App.tsx              # Shell responsivo y simulador móvil
    │   ├── index.html
    │   ├── vite.config.ts
    │   └── package.json
    └── mobile/                      # @ludiday/mobile: Aplicación Móvil React Native (Expo)
        ├── App.tsx                  # Consumo nativo de @ludiday/core
        └── package.json
```

---

## 🛠️ Stack Tecnológico

### Capa de Negocio & Core (`packages/core`)
- **TypeScript (v5.7+)**: Tipado estricto y seguro sin dependencias de frameworks externos.
- **Clean Architecture Pattern**: Separación en capas de Dominio, Casos de Uso y Adaptadores de Datos.

### Capa de UI Compartida (`packages/ui`)
- **React 18**: Componentes compartidos y reutilizables.
- **Lucide React**: Iconografía vectorial uniforme y moderna.
- **Tailwind CSS**: Clases de utilidad y soporte para modo oscuro nativo.

### Aplicación Web & Escritorio (`apps/web`)
- **Vite 6**: Empaquetador ultrarrápido con Hot Module Replacement (HMR).
- **React 18 (TypeScript)**: Renderizado reactivo de interfaces de usuario.
- **Tailwind CSS 3**: Estilos utilitarios de alto rendimiento y diseño responsivo adaptativo.
- **PostCSS & Autoprefixer**: Procesamiento y compatibilidad de hojas de estilo entre navegadores.

### Aplicación Móvil (`apps/mobile`)
- **React Native & Expo**: Base para compilación nativa multiplataforma (iOS y Android).
- Reutilización directa de la capa `@ludiday/core` para validaciones y lógica de dominio.

---

## 🧩 Arquitectura Limpia (Clean Architecture)

El paquete [`@ludiday/core`](packages/core) garantiza que la lógica no dependa de la interfaz visual:

1. **Dominio (`src/domain`)**:
   - `entities.ts`: Definición de `Portfolio`, `Project`, `Task`, `Milestone`, `Learning` y `FilterCriteria`.
   - `repositories.ts`: Contratos e interfaces (`IPortfolioRepository`, `ITaskRepository`, etc.) aplicando el **Principio de Inversión de Dependencias (DIP)**.

2. **Casos de Uso (`src/use-cases`)**:
   - `GetWeeklyKanbanTasksUseCase`: Lógica de cálculo semanal y filtrado multidimensional.
   - `GetMonthlyActivityGridUseCase`: Construcción de la matriz mensual (28 a 31 días) por tareas activas.
   - Casos de uso dedicados para operaciones CRUD sobre tareas, proyectos, portafolios, hitos y lecciones aprendidas.

3. **Capa de Datos (`src/data`)**:
   - Repositorios desacoplados que permiten intercambiar fácilmente un almacenamiento en memoria por bases de datos locales (SQLite/WatermelonDB) o APIs remotas (REST/GraphQL) sin alterar el código de la UI.

---

## 🖥️ Vistas y Funcionalidades

| Vista / Nivel | Descripción |
| :--- | :--- |
| **Tablero Kanban Semanal** | Planificación de 7 días (Lunes a Domingo) o por columnas de estado (*Por hacer, En progreso, En revisión, Completada*) con filtros dinámicos por portafolio, proyecto y estado. |
| **Dashboard Mensual** | **Panel Izquierdo:** Grilla de actividad diaria del mes (filas = días, columnas = tareas con indicadores coloreados e íconos y tooltips).<br>**Panel Derecho (4 secciones):** Proyectos del mes, Objetivos, Hitos y Aprendizajes. |
| **Nivel 1: Portafolios** | Supervisión estratégica global con indicadores de salud (*En meta, En riesgo, Retrasado*), presupuesto, avance consolidado y proyectos asociados. |
| **Nivel 2: Proyectos** | Visión táctica con barras de progreso, hitos, fechas de inicio/fin y filtrado contextual. |
| **Nivel 3: Tareas** | Lista detallada con buscador en vivo, prioridades (*Urgente, Alta, Media, Baja*), asignados y editor modal con checklist de subtareas. |
| **Simulador Móvil** | Selector en cabecera para alternar entre vista responsiva de escritorio y marco de simulación móvil. |

---

## ⚡ Instalación y Primeros Pasos

### Prerrequisitos
- **Node.js**: `v18.0.0` o superior (Recomendado Node `v20+` o `v24+`).
- **NPM**: `v9.0.0` o superior.

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <url-del-repositorio>
cd ludiday
npm install
```

### 2. Ejecutar la aplicación Web en desarrollo
```bash
npm run dev
```
La aplicación estará disponible localmente en `http://localhost:5173`.

### 3. Compilar todos los paquetes del Monorepo
```bash
npm run build
```

---

## 📜 Scripts Disponibles

Desde la raíz del monorepo puedes ejecutar:

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo Vite para la aplicación web (`apps/web`). |
| `npm run build` | Compila todos los workspaces (`@ludiday/core`, `@ludiday/ui`, `@ludiday/web`). |
| `npm run build:core` | Compila el paquete de lógica de negocio `@ludiday/core`. |
| `npm run build:ui` | Compila el paquete de componentes visuales `@ludiday/ui`. |
| `npm run build:web` | Genera los bundles de producción optimizados para la app web en `apps/web/dist`. |

---

## 🛡️ Estrategia de Versionamiento y Git

El monorepo cuenta con archivos `.gitignore` segmentados para garantizar un control de versiones óptimo:
- **Raíz (`/.gitignore`)**: Excluye `node_modules/`, cachés globales (`.turbo/`, `.cache/`), salidas de compilación y archivos `.env`.
- **`packages/core` & `packages/ui`**: Excluyen compilados `dist/` y metadatos `*.tsbuildinfo`.
- **`apps/web`**: Excluye cachés de Vite y carpetas de distribución `dist/`.
- **`apps/mobile`**: Excluye carpetas nativas generadas por Expo/Metro (`.expo/`, `ios/Pods`, `android/build`).

---

<div align="center">
  <sub>Desarrollado con ❤️ para LudiDay Suite &copy; 2026</sub>
</div>
