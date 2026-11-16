const { Pool } = require('pg');
require('dotenv').config();

/**
 * ============================================================================
 * CONFIGURACIÓN DE BASE DE DATOS: PostgreSQL Connection Pool
 * ============================================================================
 * Buenas prácticas aplicadas:
 * 1. Connection Pool en lugar de Client individual:
 *    Reutiliza conexiones activas evitando la sobrecarga de TCP Handshake y 
 *    autenticación en cada petición HTTP, soportando alta concurrencia.
 * 2. Variables de entorno:
 *    Credenciales desacopladas del código mediante dotenv.
 * 3. Manejo de eventos del Pool:
 *    Captura caídas imprevistas del socket sin tumbar el proceso de Node.js.
 */
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'agenda_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  max: 20, // Máximo de conexiones concurrentes en el pool
  idleTimeoutMillis: 30000, // Cierra conexiones inactivas tras 30s
  connectionTimeoutMillis: 2000, // Timeout de 2s para adquirir una conexión
});

// Evento: Conexión exitosa al pool
pool.on('connect', () => {
  // Conexión adquirida o creada satisfactoriamente
});

// Evento: Error crítico en cliente inactivo del pool
pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]: Error inesperado en un cliente inactivo', err);
});

module.exports = pool;
