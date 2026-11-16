import { useReducer, useCallback } from 'react';
import { EventFormData, Priority } from '../types/event.types';

/**
 * ============================================================================
 * PILAR 3: USEREDUCER Y CUSTOM HOOKS (Estado complejo local)
 * ============================================================================
 * JUSTIFICACIÓN TÉCNICA PARA LA DEFENSA:
 * ¿Por qué `useReducer` en lugar de múltiples `useState`?
 * 1. Cohesión de Estado:
 *    Un formulario tiene múltiples campos interrelacionados (título, descripción,
 *    fecha, prioridad). Manejarlos con 4 o 5 `useState` independientes dispersa
 *    la lógica de actualización y puede provocar estados inconsistentes (race conditions).
 * 2. Referencia Estable del Despachador:
 *    La función `dispatch` devuelta por `useReducer` tiene una identidad de referencia
 *    garantizada e inmutable por React. No cambia entre re-renderizados, lo que evita
 *    romper optimizaciones de `useCallback` o `useEffect` que dependan de ella.
 * 3. Lógica Predecible y Testeable:
 *    La función reductora es pura: `(state, action) => newState`. Puede extraerse
 *    y someterse a pruebas unitarias sin montar ningún componente de interfaz.
 */

interface FormState {
  values: EventFormData;
  errors: Partial<Record<keyof EventFormData, string>>;
  isDirty: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof EventFormData; value: string | boolean }
  | { type: 'SET_INITIAL_DATA'; payload: EventFormData }
  | { type: 'RESET_FORM' }
  | { type: 'SET_ERRORS'; payload: Partial<Record<keyof EventFormData, string>> };

const INITIAL_FORM_VALUES: EventFormData = {
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0], // Fecha actual por defecto YYYY-MM-DD
  priority: 'Media',
  is_completed: false,
};

const initialFormState: FormState = {
  values: INITIAL_FORM_VALUES,
  errors: {},
  isDirty: false,
};

/**
 * Reducer puro para la gestión de estados del formulario de eventos.
 */
function eventFormReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD': {
      const nextValues = {
        ...state.values,
        [action.field]: action.value,
      };

      // Limpiamos el error del campo que se está modificando en tiempo real
      const nextErrors = { ...state.errors };
      if (nextErrors[action.field]) {
        delete nextErrors[action.field];
      }

      return {
        ...state,
        values: nextValues,
        errors: nextErrors,
        isDirty: true,
      };
    }

    case 'SET_INITIAL_DATA': {
      return {
        values: { ...action.payload },
        errors: {},
        isDirty: false,
      };
    }

    case 'SET_ERRORS': {
      return {
        ...state,
        errors: action.payload,
      };
    }

    case 'RESET_FORM': {
      return initialFormState;
    }

    default:
      return state;
  }
}

export const useEventForm = (initialData?: EventFormData | null) => {
  const [state, dispatch] = useReducer(
    eventFormReducer,
    initialData
      ? { values: initialData, errors: {}, isDirty: false }
      : initialFormState
  );

  /**
   * Actualizador de campo genérico memorizado con useCallback
   */
  const handleFieldChange = useCallback(
    (field: keyof EventFormData, value: string | boolean) => {
      dispatch({ type: 'SET_FIELD', field, value });
    },
    [] // dispatch es estable, dependencias vacías
  );

  /**
   * Cargar datos de un evento para modo edición
   */
  const loadEventData = useCallback((data: EventFormData) => {
    dispatch({ type: 'SET_INITIAL_DATA', payload: data });
  }, []);

  /**
   * Reiniciar el formulario a sus valores limpios
   */
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  /**
   * Validación de campos requeridos antes de guardar
   */
  const validate = useCallback((): boolean => {
    const errors: Partial<Record<keyof EventFormData, string>> = {};

    if (!state.values.title.trim()) {
      errors.title = 'El título del evento es obligatorio';
    } else if (state.values.title.trim().length < 3) {
      errors.title = 'El título debe tener al menos 3 caracteres';
    }

    if (!state.values.date) {
      errors.date = 'La fecha del evento es obligatoria';
    }

    if (!state.values.description.trim()) {
      errors.description = 'La descripción es obligatoria';
    }

    const isValid = Object.keys(errors).length === 0;

    if (!isValid) {
      dispatch({ type: 'SET_ERRORS', payload: errors });
    }

    return isValid;
  }, [state.values]);

  return {
    values: state.values,
    errors: state.errors,
    isDirty: state.isDirty,
    handleFieldChange,
    loadEventData,
    resetForm,
    validate,
  };
};
