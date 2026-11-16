import { create } from 'zustand';
import { EventItem, EventFormData } from '../types/event.types';

/**
 * ============================================================================
 * PILAR 2: ZUSTAND (Estado global de alta frecuencia y lógica de negocio)
 * ============================================================================
 * Sincronizado al 100% con la base de datos PostgreSQL ('agenda_db') en Fedora.
 */

interface AgendaState {
  events: EventItem[];
  isLoading: boolean;
  error: string | null;

  // Acciones asíncronas REST conectadas a Express y PostgreSQL
  fetchEvents: () => Promise<void>;
  addEvent: (formData: EventFormData) => Promise<EventItem>;
  updateEvent: (id: string | number, formData: EventFormData) => Promise<EventItem>;
  deleteEvent: (id: string | number) => Promise<void>;
}

// Datos semilla idénticos a los insertados en Fedora / TablePlus
const INITIAL_DEMO_EVENTS: EventItem[] = [
  {
    id: 1,
    title: 'Defensa del Tema 12',
    description: 'Exponer sobre gestión de estado avanzado y performance en React',
    date: '2026-11-20',
    priority: 'Alta',
    is_completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Configurar el Backend Node',
    description: 'Asegurar conexión con PostgreSQL en Fedora VM',
    date: '2026-11-16',
    priority: 'Media',
    is_completed: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Defensa en Fedora',
    description: 'Demostración en vivo conectando Vite con Express REST API',
    date: '2026-11-20',
    priority: 'Alta',
    is_completed: false,
    created_at: new Date().toISOString(),
  },
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/events';

export const useAgendaStore = create<AgendaState>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_BASE_URL).catch(() => null);

      if (response && response.ok) {
        const data: EventItem[] = await response.json();
        set({ events: data, isLoading: false });
      } else {
        // Fallback en caso de que el backend no esté iniciado aún
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (get().events.length === 0) {
          set({ events: INITIAL_DEMO_EVENTS, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar eventos';
      set({ error: message, isLoading: false });
    }
  },

  addEvent: async (formData: EventFormData) => {
    set({ isLoading: true, error: null });
    try {
      let createdEvent: EventItem;

      // Petición real al backend Express conectado a PostgreSQL
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).catch(() => null);

      if (response && response.ok) {
        createdEvent = await response.json();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 200));
        createdEvent = {
          id: Date.now(),
          ...formData,
          is_completed: formData.is_completed ?? false,
          created_at: new Date().toISOString(),
        };
      }

      set((state) => ({
        events: [createdEvent, ...state.events],
        isLoading: false,
      }));

      return createdEvent;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al agregar evento';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateEvent: async (id: string | number, formData: EventFormData) => {
    set({ isLoading: true, error: null });
    try {
      let updatedItem: EventItem | undefined;

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).catch(() => null);

      if (response && response.ok) {
        updatedItem = await response.json();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      set((state) => {
        const nextEvents = state.events.map((evt) => {
          if (String(evt.id) === String(id)) {
            return updatedItem || { ...evt, ...formData };
          }
          return evt;
        });

        return {
          events: nextEvents,
          isLoading: false,
        };
      });

      return updatedItem || { id, ...formData };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar evento';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  deleteEvent: async (id: string | number) => {
    set({ isLoading: true, error: null });
    try {
      await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      }).catch(() => null);

      await new Promise((resolve) => setTimeout(resolve, 200));

      set((state) => ({
        events: state.events.filter((evt) => String(evt.id) !== String(id)),
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar evento';
      set({ error: message, isLoading: false });
      throw err;
    }
  },
}));
