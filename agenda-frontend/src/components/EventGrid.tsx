import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { EventItem } from '../types/event.types';
import { EventCard } from './EventCard';

/**
 * ============================================================================
 * COMPONENTE: EventGrid
 * ============================================================================
 * Renderiza la cuadrícula responsiva de eventos.
 * Itera sobre la lista pre-calculada (`filteredEvents`) y pasa los callbacks
 * memorizados a cada <EventCard />.
 */
interface EventGridProps {
  events: EventItem[];
  onEdit: (event: EventItem) => void;
  onDelete: (id: string | number) => void;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  onEdit,
  onDelete,
}) => {
  if (events.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          py: 8,
          px: 2,
          textAlign: 'center',
          backgroundColor: 'transparent',
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <EventBusyIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No se encontraron eventos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No hay eventos que coincidan con la búsqueda actual o la agenda está vacía.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <EventCard
              event={event}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
