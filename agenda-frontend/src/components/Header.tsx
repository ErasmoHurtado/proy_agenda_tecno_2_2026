import React, { memo } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useAppTheme } from '../context/ThemeContext';

/**
 * ============================================================================
 * COMPONENTE: Header (Memoizado con React.memo)
 * ============================================================================
 * Al estar envuelto en React.memo, cuando el usuario escribe en el buscador
 * o interactúa con el CRUD, este Header NO se re-renderiza innecesariamente.
 * Solo se re-renderizará cuando toggleTheme() cambie el ThemeContext.
 */
const HeaderComponent: React.FC = () => {
  const { mode, toggleTheme } = useAppTheme();

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <EventAvailableIcon sx={{ mr: 1.5, fontSize: 28 }} />
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Agenda de Eventos
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Modo {mode === 'dark' ? 'Oscuro' : 'Claro'}
          </Typography>
          <Tooltip title={`Cambiar a modo ${mode === 'dark' ? 'claro' : 'oscuro'}`}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              aria-label="Alternar modo claro y oscuro"
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export const Header = memo(HeaderComponent);
