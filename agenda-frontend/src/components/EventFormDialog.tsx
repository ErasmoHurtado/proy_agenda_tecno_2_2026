import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  FormHelperText,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { EventItem, EventFormData, Priority } from '../types/event.types';
import { useEventForm } from '../hooks/useEventForm';

/**
 * ============================================================================
 * COMPONENTE: EventFormDialog
 * ============================================================================
 * DEMOSTRACIÓN DE PILAR 3 (useReducer y Custom Hooks):
 * Este componente delega completamente la máquina de estados de su formulario
 * al custom hook `useEventForm`, el cual opera mediante `useReducer`.
 *
 * Ningún estado del formulario se maneja mediante useState directo aquí.
 * Todo cambio de campo despacha una acción 'SET_FIELD' al reductor, manteniendo
 * el componente visual declarativo, limpio y fácil de mantener.
 */

interface EventFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => Promise<void> | void;
  initialData?: EventItem | null;
  isLoading?: boolean;
}

export const EventFormDialog: React.FC<EventFormDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}) => {
  // Consumo del custom hook basado en useReducer
  const {
    values,
    errors,
    handleFieldChange,
    loadEventData,
    resetForm,
    validate,
  } = useEventForm(initialData);

  // Sincronización del estado del reducer cuando se abre el modal para crear o editar
  useEffect(() => {
    if (open) {
      if (initialData) {
        loadEventData({
          title: initialData.title,
          description: initialData.description,
          date: initialData.date,
          priority: initialData.priority,
          is_completed: initialData.is_completed ?? false,
        });
      } else {
        resetForm();
      }
    }
  }, [open, initialData, loadEventData, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return; // Si el reducer determinó errores, detenemos el envío
    }

    try {
      await onSave(values);
      onClose();
    } catch {
      // El error es gestionado por el store global
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        noValidate: true,
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Título del Evento"
            fullWidth
            required
            value={values.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            error={Boolean(errors.title)}
            helperText={errors.title}
            disabled={isLoading}
          />

          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            required
            value={values.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            error={Boolean(errors.description)}
            helperText={errors.description}
            disabled={isLoading}
          />

          <TextField
            label="Fecha del Evento"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={values.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            error={Boolean(errors.date)}
            helperText={errors.date}
            disabled={isLoading}
          />

          <FormControl fullWidth>
            <InputLabel id="priority-select-label">Prioridad</InputLabel>
            <Select
              labelId="priority-select-label"
              id="priority-select"
              value={values.priority}
              label="Prioridad"
              onChange={(e) =>
                handleFieldChange('priority', e.target.value as Priority)
              }
              disabled={isLoading}
            >
              <MenuItem value="Alta">Alta</MenuItem>
              <MenuItem value="Media">Media</MenuItem>
              <MenuItem value="Baja">Baja</MenuItem>
            </Select>
            {errors.priority && (
              <FormHelperText error>{errors.priority}</FormHelperText>
            )}
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(values.is_completed)}
                onChange={(e) => handleFieldChange('is_completed', e.target.checked)}
                color="primary"
                disabled={isLoading}
              />
            }
            label="Marcar evento como completado"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isLoading} color="inherit">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={18} /> : null}
        >
          {isLoading
            ? 'Guardando...'
            : isEditing
            ? 'Actualizar Cambios'
            : 'Crear Evento'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
