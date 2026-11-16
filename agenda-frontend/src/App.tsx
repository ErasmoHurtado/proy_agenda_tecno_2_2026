import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Container,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Header } from './components/Header';
import { AppToolbar } from './components/Toolbar';
import { EventGrid } from './components/EventGrid';
import { EventFormDialog } from './components/EventFormDialog';
import { useAgendaStore } from './store/useAgendaStore';
import { EventItem, EventFormData } from './types/event.types';

export const App: React.FC = () => {
  /**
   * ==========================================================================
   * PILAR 2: ZUSTAND - SUSCRIPCIONES ATÓMICAS (SELECTORS)
   * ==========================================================================
   * JUSTIFICACIÓN TÉCNICA:
   * Al usar selectores individuales como `state => state.events`, Zustand compara
   * el valor devuelto por igualdad estricta (o shallow) antes de notificar un re-render.
   * Las funciones de acción (`fetchEvents`, `addEvent`, etc.) son referencias estables
   * que no mutan nunca, previniendo re-renderizados accidentales.
   */
  const events = useAgendaStore((state) => state.events);
  const isLoading = useAgendaStore((state) => state.isLoading);
  const error = useAgendaStore((state) => state.error);
  const fetchEvents = useAgendaStore((state) => state.fetchEvents);
  const addEvent = useAgendaStore((state) => state.addEvent);
  const updateEvent = useAgendaStore((state) => state.updateEvent);
  const deleteEvent = useAgendaStore((state) => state.deleteEvent);

  // Estado local para el filtro de búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // Estado local para el control del modal (Dialog)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Notificación de feedback (Snackbar)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carga inicial de eventos al montar el componente (conecta con VM Fedora / PostgreSQL)
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /**
   * ==========================================================================
   * PILAR 4: OPTIMIZACIÓN CON useMemo (Filtrado de alta eficiencia)
   * ==========================================================================
   * JUSTIFICACIÓN TÉCNICA PARA LA DEFENSA:
   * `useMemo` memoriza el resultado del cálculo de filtrado entre renders.
   * 
   * ¿Por qué es crucial aquí?
   * Si el usuario abre/cierra el modal, cambia el tema (Dark/Light) o se ejecuta
   * cualquier otro ciclo de renderizado en App, el filtrado de la lista
   * NO se recalcula, a menos que `events` o `searchQuery` hayan cambiado realmente.
   * Esto ahorra ciclos de CPU O(N) en listas con cientos de elementos.
   */
  const filteredEvents = useMemo(() => {
    // console.log('[useMemo] Recalculando filteredEvents...');
    if (!searchQuery.trim()) {
      return events;
    }

    const query = searchQuery.toLowerCase().trim();
    return events.filter(
      (evt) =>
        evt.title.toLowerCase().includes(query) ||
        evt.description.toLowerCase().includes(query)
    );
  }, [events, searchQuery]);

  /**
   * ==========================================================================
   * PILAR 4: OPTIMIZACIÓN CON useCallback (Identidad referencial estable)
   * ==========================================================================
   * JUSTIFICACIÓN TÉCNICA PARA LA DEFENSA:
   * Cada vez que un componente React se re-renderiza, recrea todas las funciones
   * definidas en su cuerpo con una NUEVA dirección de memoria (`fn !== fn_anterior`).
   *
   * Si pasamos funciones recreadas a componentes memoizados con `React.memo` (como
   * `<EventCard />`), la comparación superficial de props detecta que la prop cambió,
   * ROMPIENDO la memoización y provocando que todas las tarjetas se re-rendericen.
   *
   * `useCallback` garantiza que la referencia en memoria de la función sea IDÉNTICA
   * mientras sus dependencias no cambien, permitiendo que `React.memo` funcione.
   */
  const handleOpenCreate = useCallback(() => {
    setSelectedEvent(null);
    setIsDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((event: EventItem) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  }, []);

  const handleDeleteEvent = useCallback(
    async (id: string | number) => {
      try {
        await deleteEvent(id);
        setToastMessage('Evento eliminado exitosamente');
      } catch {
        setToastMessage('Error al eliminar el evento');
      }
    },
    [deleteEvent]
  );

  const handleSaveEvent = useCallback(
    async (formData: EventFormData) => {
      if (selectedEvent) {
        await updateEvent(selectedEvent.id, formData);
        setToastMessage('Evento actualizado correctamente');
      } else {
        await addEvent(formData);
        setToastMessage('Evento creado correctamente');
      }
    },
    [selectedEvent, updateEvent, addEvent]
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* PILAR 1: Header con Theme Switcher */}
      <Header />

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Barra de herramientas: Búsqueda y Botón + Nuevo Evento */}
        <AppToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCreateModal={handleOpenCreate}
          totalEvents={events.length}
          filteredCount={filteredEvents.length}
        />

        {/* Indicador de carga inicial */}
        {isLoading && events.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Cargando agenda desde PostgreSQL...
            </Typography>
          </Box>
        ) : (
          /* PILAR 4: Grid que renderiza los EventCards memoizados */
          <EventGrid
            events={filteredEvents}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteEvent}
          />
        )}

        {/* PILAR 3: Modal con Formulario manejado mediante useReducer */}
        <EventFormDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveEvent}
          initialData={selectedEvent}
          isLoading={isLoading}
        />

        {/* Notificaciones y errores */}
        <Snackbar
          open={Boolean(toastMessage || error)}
          autoHideDuration={4000}
          onClose={() => setToastMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity={error ? 'error' : 'success'}
            onClose={() => setToastMessage(null)}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {error || toastMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};
