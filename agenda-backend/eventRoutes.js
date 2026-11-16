const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('./eventController');

/**
 * ============================================================================
 * RUTAS: eventRoutes.js
 * ============================================================================
 * Endpoints RESTful para el recurso 'events'
 * Se montan bajo el prefijo '/api/events' en server.js
 */

// GET /api/events - Listar todos los eventos
router.get('/', getEvents);

// POST /api/events - Crear un nuevo evento
router.post('/', createEvent);

// PUT /api/events/:id - Actualizar datos de un evento existente o su estado
router.put('/:id', updateEvent);

// DELETE /api/events/:id - Eliminar un evento por ID
router.delete('/:id', deleteEvent);

module.exports = router;
