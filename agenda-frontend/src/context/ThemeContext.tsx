import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme, CssBaseline } from '@mui/material';
import { ThemeMode } from '../types/event.types';

/**
 * ============================================================================
 * PILAR 1: CONTEXT API (Estado de baja frecuencia)
 * ============================================================================
 * JUSTIFICACIÓN TÉCNICA PARA LA DEFENSA:
 * React Context API está diseñado para estados globales que cambian con poca
 * frecuencia (baja tasa de mutación), como el tema (light/dark), la sesión del usuario
 * o el idioma.
 *
 * ¿Por qué NO usar Context para el CRUD de eventos?
 * Cada vez que el valor de un Context cambia, TODOS los componentes que consumen
 * `useContext(ThemeContext)` se re-renderizan de forma obligatoria, saltándose
 * las optimizaciones de React.memo intermedias si no se estructuran con split contexts.
 * Por tanto, aislar el tema en un Context propio garantiza que los cambios de tema
 * no interfieran con la lógica de negocio ni provoquen cascadas de renders en el CRUD.
 */

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  // Estado local para almacenar el modo actual ('light' o 'dark')
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Persistencia opcional en localStorage o preferencia por defecto
    const saved = localStorage.getItem('app_theme_mode') as ThemeMode | null;
    return saved === 'dark' ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('app_theme_mode', nextMode);
      return nextMode;
    });
  };

  /**
   * OPTIMIZACIÓN CON useMemo:
   * Creamos la instancia del tema de Material-UI solo cuando `mode` cambie,
   * evitando recrear el objeto Theme en cada render del Provider.
   */
  const muiTheme: Theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'dark' ? '#90caf9' : '#1976d2',
        },
        secondary: {
          main: mode === 'dark' ? '#f48fb1' : '#dc004e',
        },
        background: {
          default: mode === 'dark' ? '#121212' : '#f5f5f5',
          paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
            },
          },
        },
      },
    });
  }, [mode]);

  // Memorizamos el valor expuesto por el Context para no emitir nuevas referencias de objeto innecesarias
  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        {/* CssBaseline normaliza los estilos y aplica el color de fondo del tema en el body */}
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Custom Hook para consumir el ThemeContext con validación de existencia.
 */
export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme debe ser utilizado dentro de un ThemeContextProvider');
  }
  return context;
};
