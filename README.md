# 📅 Agenda de Eventos: Gestión de Estado Avanzado y Performance

> **Tema 12:** React: Gestión de Estado Avanzado y Performance (Context API, librerías globales como Zustand/Redux Toolkit, Hooks avanzados y optimización de renderizado).  
> **Repositorio Oficial:** [https://github.com/ErasmoHurtado/proy_agenda_tecno_2_2026](https://github.com/ErasmoHurtado/proy_agenda_tecno_2_2026)  
> **Ecosistema:** React + TypeScript + Material-UI (Frontend) | Node.js + Express + PostgreSQL (Backend) | S.O. Fedora Linux / Windows

---

## 📖 1. Descripción del Proyecto y Objetivo

### ¿Qué es este proyecto?
Es una aplicación web Full-Stack tipo **Agenda de Eventos (CRUD)** diseñada con arquitectura modular de alto rendimiento. Permite registrar, listar, filtrar, editar, completar y eliminar eventos con persistencia relacional en una base de datos **PostgreSQL**.

### Objetivo Técnico y Académico
El propósito central no es solo cumplir una funcionalidad CRUD, sino servir como **demostración técnica rigurosa** para la defensa universitaria del **Tema 12**, demostrando cómo resolver los dos mayores problemas en aplicaciones corporativas en React:
1. **La mala clasificación del estado:** Tratar estados globales, locales, de baja y de alta frecuencia con la misma herramienta.
2. **Los re-renderizados innecesarios en cascada:** Degradación de la fluidez del Virtual DOM por falta de memoización adecuada.

---

## 🏛️ 2. Los 4 Pilares Arquitectónicos del Frontend

| Pilar | Tecnología / Hook | Propósito en el Proyecto | Justificación de Rendimiento |
|---|---|---|---|
| **1. Estado de Baja Frecuencia** | `Context API` + Material-UI `ThemeProvider` | Alternar entre Modo Claro y Modo Oscuro. | El tema cambia esporádicamente. Context API es idóneo aquí porque un re-render de consumidores no degrada la interacción diaria. |
| **2. Estado Global de Alta Frecuencia** | `Zustand` (`useAgendaStore`) | Operaciones CRUD y sincronización REST con PostgreSQL. | Opera fuera del árbol de React con el patrón Publish/Subscribe. Sus **suscripciones atómicas por selector** evitan re-renders globales. |
| **3. Estado Complejo Local** | `useReducer` + Custom Hook (`useEventForm`) | Formulario del modal de creación/edición de eventos. | Centraliza campos interdependientes (título, descripción, fecha, prioridad, estado) en una función pura reductora con `dispatch` inmutable. |
| **4. Optimización de Renderizado** | `React.memo` + `useCallback` + `useMemo` | Tarjetas `<EventCard />`, handlers y búsqueda. | `React.memo` evita redibujar tarjetas no modificadas; `useCallback` mantiene estables las referencias de funciones; `useMemo` optimiza el filtro $O(N)$. |

---

## 🗄️ 3. Scripts de Base de Datos PostgreSQL (`agenda_db`)

La tabla requerida por el backend es `events`, la cual almacena los eventos de la agenda.

### Opción A: Script para Consola de Fedora Linux (`psql`)
Ejecuta los siguientes comandos en tu terminal de Fedora:

```bash
# 1. Ingresar a la consola de PostgreSQL
sudo -u postgres psql

# 2. Crear la base de datos
CREATE DATABASE agenda_db;

# 3. Conectarse a la base de datos
\c agenda_db

# 4. Crear la tabla de eventos
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    priority VARCHAR(50) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# 5. Insertar datos de prueba
INSERT INTO events (title, description, event_date, priority, is_completed) 
VALUES 
('Defensa del Tema 12', 'Exponer sobre gestión de estado avanzado y performance en React', '2026-11-20 10:00:00', 'Alta', false),
('Configurar el Backend Node', 'Asegurar conexión con PostgreSQL en Fedora VM', '2026-11-16 15:30:00', 'Media', true),
('Defensa en Fedora', 'Demostración en vivo conectando Vite con Express REST API', '2026-11-20 10:00:00', 'Alta', false);

# 6. Salir de psql
\q
```

---

### Opción B: Script para TablePlus / DBeaver / pgAdmin (GUI)
Abre una conexión hacia tu base de datos y ejecuta el siguiente script SQL directo:

```sql
CREATE DATABASE agenda_db;

-- Conectarse a agenda_db y ejecutar:
DROP TABLE IF EXISTS events;

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    priority VARCHAR(50) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO events (title, description, event_date, priority, is_completed) 
VALUES 
('Defensa del Tema 12', 'Exponer sobre gestión de estado avanzado y performance en React', '2026-11-20 10:00:00', 'Alta', false),
('Configurar el Backend Node', 'Asegurar conexión con PostgreSQL en Fedora VM', '2026-11-16 15:30:00', 'Media', true),
('Defensa en Fedora', 'Demostración en vivo conectando Vite con Express REST API', '2026-11-20 10:00:00', 'Alta', false);
```

---

## 🚀 4. Guía Paso a Paso: Instalación y Ejecución

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/ErasmoHurtado/proy_agenda_tecno_2_2026.git
cd proy_agenda_tecno_2_2026
```

---

### Paso 2: Configurar Variables de Entorno del Backend
Dentro de la carpeta `agenda-backend`, el archivo `.env` ya viene preparado por defecto:

```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=agenda_db
DB_PASSWORD=postgres
DB_PORT=5432
CLIENT_ORIGIN=http://localhost:5173
```
*(Modifica `DB_PASSWORD` o `DB_USER` únicamente si configuraste credenciales personalizadas en tu PostgreSQL).*

---

### 🐧 Ejecución en Fedora Linux

Abre **2 consolas (terminales)** independientes:

#### 🖥️ Terminal 1: Backend (API REST en Node.js + Express)
```bash
cd agenda-backend
npm install
npm run dev
```
* **Estado:** Servidor activo en `http://localhost:3000`
* **Test de conexión con PostgreSQL:** Abre en el navegador `http://localhost:3000/api/health`

#### 💻 Terminal 2: Frontend (React + Vite + Material-UI)
```bash
cd agenda-frontend
npm install
npm run dev
```
* **Estado:** Aplicación disponible en `http://localhost:5173`

---

### 🪟 Ejecución en Windows (PowerShell / CMD)

De igual manera, abre **2 consolas**:

#### 🖥️ Consola 1: Backend
```powershell
cd agenda-backend
npm install
npm run dev
```

#### 💻 Consola 2: Frontend
```powershell
cd agenda-frontend
npm install
npm run dev
```
Abre tu navegador en `http://localhost:5173/`.

---

## 📡 5. Endpoints de la API REST

Todas las rutas del backend se sirven bajo el prefijo `/api/events`:

| Método | Endpoint | Descripción | Código HTTP |
|---|---|---|---|
| **GET** | `/api/health` | Diagnóstico de salud y verificación de conexión con PostgreSQL | `200 OK` |
| **GET** | `/api/events` | Obtener todos los eventos ordenados cronológicamente | `200 OK` |
| **POST** | `/api/events` | Crear un nuevo evento | `201 Created` |
| **PUT** | `/api/events/:id` | Actualizar datos de un evento o conmutar su estado `is_completed` | `200 OK` |
| **DELETE** | `/api/events/:id` | Eliminar físicamente un evento por su ID | `200 OK` |

---

## 📂 6. Estructura de Archivos del Proyecto

```text
proy_agenda_tecno_2_2026/
├── agenda-backend/                # Microservicio API REST
│   ├── .env                       # Variables de entorno (DB, puerto, CORS)
│   ├── .env.example               # Plantilla de variables de entorno
│   ├── db.js                      # Configuración de pg.Pool (Connection Pool)
│   ├── eventController.js         # Lógica SQL (SELECT, INSERT, UPDATE, DELETE)
│   ├── eventRoutes.js             # Definición de rutas Express
│   ├── package.json               # Dependencias (express, pg, cors, dotenv)
│   ├── schema.sql                 # Script SQL para Fedora / TablePlus
│   └── server.js                  # Inicialización de Express y CORS
│
├── agenda-frontend/               # Aplicación Cliente React
│   ├── src/
│   │   ├── types/
│   │   │   └── event.types.ts     # Interfaces TypeScript (EventItem, Priority)
│   │   ├── context/
│   │   │   └── ThemeContext.tsx   # [PILAR 1] Context API (Modo Claro/Oscuro)
│   │   ├── store/
│   │   │   └── useAgendaStore.ts  # [PILAR 2] Zustand Store (CRUD + Selectors)
│   │   ├── hooks/
│   │   │   └── useEventForm.ts    # [PILAR 3] useReducer para formulario modal
│   │   ├── components/
│   │   │   ├── Header.tsx         # Barra superior con Switch de Tema
│   │   │   ├── Toolbar.tsx        # Buscador y botón "+ Nuevo Evento"
│   │   │   ├── EventCard.tsx      # [PILAR 4] Tarjeta con React.memo
│   │   │   ├── EventGrid.tsx      # Cuadrícula responsiva de eventos
│   │   │   └── EventFormDialog.tsx# Modal conectado a useEventForm
│   │   ├── App.tsx                # Orquestador con useMemo y useCallback
│   │   └── main.tsx               # Punto de entrada con ThemeProvider
│   ├── package.json               # Dependencias (React 18, Vite 5, MUI, Zustand)
│   ├── tsconfig.json              # Configuración TypeScript estricta
│   └── vite.config.ts             # Configuración del servidor de desarrollo Vite
│
├── .gitignore                     # Exclusión de node_modules y temporales
└── README.md                      # Documentación completa y guía de defensa
```

---

## 🎓 7. Resumen Rápido para la Exposición

* **Context API:** Se defiende explicando que solo se utiliza para estados globales de **baja frecuencia** (tema visual), previniendo re-renderizados masivos en la lógica de negocio.
* **Zustand:** Se defiende explicando el desacoplamiento del árbol de React y sus **suscripciones atómicas con selectores** (`state => state.events`).
* **useReducer:** Se defiende explicando que unifica las transiciones de estado de un formulario complejo en una función pura, entregando un `dispatch` con referencia inmutable.
* **Optimización (React.memo + useCallback + useMemo):** Se defiende explicando cómo `React.memo` evita pintar tarjetas no modificadas, `useCallback` mantiene vivas las referencias de los callbacks para no romper dicha memoización, y `useMemo` evita recalcular el filtro de búsqueda innecesariamente.
