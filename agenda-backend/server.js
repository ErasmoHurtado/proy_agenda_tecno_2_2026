const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const eventRoutes = require('./eventRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

/**
 * ============================================================================
 * MIDDLEWARES GLOBALES
 * ============================================================================
 */

// 1. Configuración de CORS permitiendo explícitamente el origen de Vite
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// 2. Parser para solicitudes con payload en formato JSON
app.use(express.json());

// 3. Logger simple para auditoría de peticiones en desarrollo
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * ============================================================================
 * REGISTRO DE RUTAS
 * ============================================================================
 */

// Endpoint de verificación de salud (Health Check)
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS server_time;');
    res.status(200).json({
      status: 'UP',
      database: 'Connected to PostgreSQL (agenda_db)',
      timestamp: result.rows[0].server_time,
    });
  } catch (error) {
    res.status(500).json({
      status: 'DOWN',
      database: 'PostgreSQL connection failed',
      error: error.message,
    });
  }
});

// Rutas de eventos registradas bajo el prefijo /api/events
app.use('/api/events', eventRoutes);

// Manejador para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `El endpoint ${req.method} ${req.originalUrl} no existe en este servidor`,
  });
});

// Manejador centralizado de errores no capturados
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(500).json({
    error: 'Error interno no controlado',
    message: err.message,
  });
});

/**
 * ============================================================================
 * ARRANQUE DEL SERVIDOR
 * ============================================================================
 */
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Servidor REST ejecutándose en: http://localhost:${PORT}`);
  console.log(`📡 CORS configurado para: ${CLIENT_ORIGIN}`);
  console.log(`📌 Endpoints base: http://localhost:${PORT}/api/events`);
  console.log(`=======================================================`);
});

// Cierre elegante (Graceful Shutdown) del Connection Pool
const shutdown = () => {
  console.log('\nCerrando servidor HTTP y conexiones a PostgreSQL...');
  server.close(async () => {
    await pool.end();
    console.log('Pool de PostgreSQL cerrado correctamente. Proceso finalizado.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
