import React, { memo } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { EventItem, Priority } from '../types/event.types';

/**
 * ============================================================================
 * PILAR 4: OPTIMIZACIÓN DE RENDERIZADO (Componente Memoizado con React.memo)
 * ============================================================================
 * Sincronizado con la base de datos PostgreSQL (agenda_db).
 */

interface EventCardProps {
  event: EventItem;
  onEdit: (event: EventItem) => void;
  onDelete: (id: string | number) => void;
}

const getPriorityColor = (
  priority: Priority
): 'error' | 'warning' | 'info' | 'default' => {
  switch (priority) {
    case 'Alta':
      return 'error';
    case 'Media':
      return 'warning';
    case 'Baja':
      return 'info';
    default:
      return 'default';
  }
};

const EventCardComponent: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2,
        opacity: event.is_completed ? 0.85 : 1,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1.5}
        >
          <Typography
            variant="h6"
            component="h3"
            fontWeight={600}
            sx={{
              wordBreak: 'break-word',
              lineHeight: 1.3,
              textDecoration: event.is_completed ? 'line-through' : 'none',
              color: event.is_completed ? 'text.secondary' : 'text.primary',
            }}
          >
            {event.title}
          </Typography>
          <Box display="flex" gap={0.5} ml={1}>
            <Chip
              label={event.priority}
              color={getPriorityColor(event.priority)}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: '40px',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
          }}
        >
          {event.description}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={0.8} color="text.secondary">
            <CalendarTodayIcon fontSize="small" sx={{ opacity: 0.7 }} />
            <Typography variant="caption" fontWeight={500}>
              Fecha: {event.date}
            </Typography>
          </Box>

          <Chip
            icon={event.is_completed ? <CheckCircleOutlineIcon /> : <PendingOutlinedIcon />}
            label={event.is_completed ? 'Completado' : 'Pendiente'}
            color={event.is_completed ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        </Box>
      </CardContent>

      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          px: 2,
          pb: 1.5,
          pt: 0,
        }}
      >
        <Tooltip title="Editar evento">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(event)}
            aria-label={`Editar evento ${event.title}`}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar evento">
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(event.id)}
            aria-label={`Eliminar evento ${event.title}`}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export const EventCard = memo(EventCardComponent);
