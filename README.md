# 📅 Proyecto: Agenda de Eventos (Full Stack)

**Tema 12: React: Gestión de Estado Avanzado y Performance**  
Sistema integral compuesto por un frontend optimizado en React y un backend en Node.js/Express persistido en PostgreSQL sobre Fedora Linux.

---

## 📂 Estructura del Repositorio

```text
proy_exp_react/
├── agenda-backend/       # API REST con Express, pg (Pool) y PostgreSQL
├── agenda-frontend/      # Frontend con React, Vite, TypeScript, MUI, Zustand
├── .gitignore            # Exclusión de dependencias (node_modules) y temporales
└── README.md             # Guía de instalación y ejecución
```

---

## 🚀 Puesta en Marcha en Fedora Linux

### 1. Clonar el repositorio
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd proy_exp_react
```

### 2. Base de Datos PostgreSQL (en Fedora)
Si aún no has creado la tabla, puedes ejecutar el script SQL incluido:
```bash
sudo -u postgres psql -d agenda_db -f agenda-backend/schema.sql
```

---

### 3. Ejecución (Abrir 2 Terminales)

#### 🖥️ Terminal 1: Backend (Express + PostgreSQL)
```bash
cd agenda-backend
npm install
npm run dev
```
> *Servidor disponible en:* `http://localhost:3000`  
> *Endpoint de verificación:* `http://localhost:3000/api/health`

#### 💻 Terminal 2: Frontend (React + Vite)
```bash
cd agenda-frontend
npm install
npm run dev
```
> *Aplicación disponible en:* `http://localhost:5173`

---

## 🏛️ Resumen Arquitectónico (Tema 12)

1. **Context API:** Gestión de estado de baja frecuencia (Modo Claro / Modo Oscuro con Material-UI).
2. **Zustand:** Gestión de estado global de alta frecuencia (CRUD de eventos con suscripciones atómicas mediante selectores).
3. **useReducer & Custom Hook:** Gestión de estado complejo local (`useEventForm`) para el formulario modal.
4. **Optimización de Renderizado:** Memorización con `React.memo` (`<EventCard />`), referencias estables con `useCallback` y filtrado eficiente con `useMemo`.
