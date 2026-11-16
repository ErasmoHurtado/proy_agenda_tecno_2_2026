export type Priority = 'Alta' | 'Media' | 'Baja';

export interface EventItem {
  id: string | number;
  title: string;
  description: string;
  date: string; // Formato YYYY-MM-DD
  event_date?: string; // Formato TIMESTAMP original de PostgreSQL
  priority: Priority;
  is_completed?: boolean;
  created_at?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  priority: Priority;
  is_completed?: boolean;
}

export type ThemeMode = 'light' | 'dark';
