import React from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

/**
 * ============================================================================
 * COMPONENTE: AppToolbar
 * ============================================================================
 * Permite filtrar eventos mediante búsqueda en tiempo real y disparar
 * la apertura del modal para registrar un nuevo evento.
 */
interface AppToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenCreateModal: () => void;
  totalEvents: number;
  filteredCount: number;
}

export const AppToolbar: React.FC<AppToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  totalEvents,
  filteredCount,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ flex: 1, maxWidth: { sm: 450 } }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por título o descripción..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Mostrando: <strong>{filteredCount}</strong> de {totalEvents} eventos
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={onOpenCreateModal}
          sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}
        >
          + Nuevo Evento
        </Button>
      </Box>
    </Paper>
  );
};
