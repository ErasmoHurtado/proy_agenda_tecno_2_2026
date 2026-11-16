import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useAppTheme } from '../context/ThemeContext';

/**
 * ============================================================================
 * COMPONENTE: Header
 * ============================================================================
 * DEMOSTRACIÓN DE PILAR 1 (Context API):
 * Este componente es el consumidor directo del `ThemeContext`.
 * Al pulsar el botón de alternar tema, dispara `toggleTheme()`.
 * Como el cambio de tema es de BAJA FRECUENCIA, la actualización del Context
 * es idónea y no degrada la interacción del usuario.
 */
export const Header: React.FC = () => {
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
