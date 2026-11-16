-- ============================================================================
-- SCRIPT DE BASE DE DATOS: agenda_db (PostgreSQL en Fedora / TablePlus)
-- ============================================================================

CREATE DATABASE agenda_db;

\c agenda_db

DROP TABLE IF EXISTS events;

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    priority VARCHAR(50) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales de prueba (Seed Data)
INSERT INTO events (title, description, event_date, priority, is_completed) 
VALUES 
('Defensa del Tema 12', 'Exponer sobre gestión de estado avanzado y performance en React', '2026-11-20 10:00:00', 'Alta', false),
('Configurar el Backend Node', 'Asegurar conexión con PostgreSQL en Fedora VM', '2026-11-16 15:30:00', 'Media', true),
('Defensa en Fedora', 'Demostración en vivo conectando Vite con Express REST API', '2026-11-20 10:00:00', 'Alta', false);
