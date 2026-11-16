# 🚀 Agenda de Eventos - Gestión de Estado Avanzado & Performance en React

Proyecto frontend desarrollado con **Vite**, **React**, **TypeScript** y **Material-UI (MUI)**. Diseñado como demostración técnica universitaria sobre arquitectura frontend, optimización de renderizado y patrones avanzados de gestión de estado.

---

## 🏛️ Los 4 Pilares Arquitectónicos Implementados

| Pilar | Tecnología | Caso de Uso | Justificación de Rendimiento |
|---|---|---|---|
| **1. Estado de Baja Frecuencia** | `Context API` + MUI `ThemeProvider` | Modo Claro / Oscuro | Cambios esporádicos. Los consumidores del contexto se re-renderizan solo al alternar el tema, sin interferir con la lógica de negocio. |
| **2. Estado Global de Alta Frecuencia** | `Zustand` (`useAgendaStore`) | CRUD de Eventos + REST PostgreSQL | Patrón Publish/Subscribe externo al árbol de React. Soporta suscripciones atómicas (selectores). Previene re-renders globales innecesarios. |
| **3. Estado Complejo Local** | `useReducer` + Custom Hook (`useEventForm`) | Formulario Modal (Dialog) | Máquina de estados predecible y pura. Evita race conditions, dispersión de setters de `useState` y ofrece referencias estables (`dispatch`). |
| **4. Optimización de Renderizado** | `React.memo` + `useCallback` + `useMemo` | `<EventCard />`, Handlers, Filtrado | `<EventCard />` memorizado con `React.memo`; funciones pasadas memorizadas con `useCallback`; filtrado de búsqueda memorizado con `useMemo`. |

---

## 📂 Estructura del Proyecto

```text
src/
├── types/
│   └── event.types.ts           # Definiciones de TypeScript (EventItem, Priority, etc.)
├── context/
│   └── ThemeContext.tsx         # [PILAR 1] Context API para Light/Dark Mode
├── store/
│   └── useAgendaStore.ts        # [PILAR 2] Zustand Store con acciones asíncronas REST
├── hooks/
│   └── useEventForm.ts          # [PILAR 3] Custom Hook con useReducer para el formulario
├── components/
│   ├── Header.tsx               # Barra superior con Switch de Tema
│   ├── Toolbar.tsx              # Input de búsqueda y botón "+ Nuevo Evento"
│   ├── EventCard.tsx            # [PILAR 4] Tarjeta memoizada con React.memo
│   ├── EventGrid.tsx            # Cuadrícula responsiva de MUI
│   └── EventFormDialog.tsx      # Modal que consume useEventForm
├── App.tsx                      # Orquestador con useMemo, useCallback y Selectors
└── main.tsx                     # Entry point con ThemeContextProvider
```

---

## 💡 Guía de Argumentación Técnica para la Defensa

### 1. ¿Por qué NO usar Context API para el CRUD de eventos?
> **Respuesta:**  
> En React, cuando el valor proporcionado por un `Context.Provider` cambia, **todos los componentes consumidores suscritos a ese contexto se re-renderizan forzosamente**, saltándose las barreras de `React.memo`. Si tuviéramos cientos de eventos y usáramos Context, cada inserción, actualización o eliminación provocaría re-renderizados masivos en toda la aplicación. Zustand soluciona esto usando el patrón Observer fuera del ciclo de vida de React, permitiendo suscripciones atómicas (`state => state.events`).

### 2. ¿Por qué `React.memo` requiere obligatoriamente `useCallback` en el padre?
> **Respuesta:**  
> `React.memo` realiza una comparación superficial (`shallow compare`) de las `props`. En JavaScript, cada vez que una función padre se re-renderiza, crea **nuevas instancias de funciones en memoria** (`() => {} !== () => {}`). Si pasamos funciones de callback inline sin `useCallback`, las referencias en memoria cambian en cada render, lo cual hace que `prevProps.onDelete !== nextProps.onDelete`, anulando completamente el efecto de `React.memo`.

### 3. ¿Por qué `useReducer` supera a múltiples `useState` en formularios complejos?
> **Respuesta:**  
> - **Cohesión y atomicidad:** Los campos del evento (título, descripción, fecha, prioridad) evolucionan juntos. `useReducer` centraliza las transiciones de estado en una función pura `(state, action) => newState`.
> - **Referencia inmutable de `dispatch`:** React garantiza que la función `dispatch` devuelta por `useReducer` nunca cambia de referencia entre renders, lo que previene que los hooks que la usen requieran dependencias volátiles.
> - **Testabilidad:** El reducer puede someterse a pruebas unitarias puras sin necesidad de montar componentes de React.

### 4. ¿Cuál es el rol de `useMemo` en el filtrado de eventos?
> **Respuesta:**  
> La operación de filtrado `events.filter(...)` tiene una complejidad algorítmica $O(N)$. Con `useMemo`, solo ejecutamos este filtrado si la referencia de `events` o el texto de `searchQuery` cambian. Si el usuario realiza acciones no relacionadas (por ejemplo, abrir el modal o cambiar el tema), el resultado ya calculado se reutiliza al instante sin consumir ciclos de CPU.
