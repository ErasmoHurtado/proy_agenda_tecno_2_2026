const pool = require('./db');

/**
 * ============================================================================
 * CONTROLADOR: eventController.js
 * ============================================================================
 * Buenas prácticas aplicadas:
 * 1. Consultas Parametrizadas ($1, $2...):
 *    Prevención total de ataques de inyección SQL (SQL Injection).
 * 2. Formato de fecha con TO_CHAR:
 *    Evita el desfase de zona horaria (-1 día) que produce la serialización
 *    nativa de objetos Date de JavaScript.
 * 3. Compatibilidad con el frontend React:
 *    Retorna tanto 'event_date' como el alias 'date' para mapeo directo con el cliente.
 * 4. Manejo estricto de códigos de estado HTTP (200, 201, 400, 404, 500).
 */

/**
 * GET /api/events
 * Obtener todos los eventos ordenados cronológicamente por fecha.
 */
const getEvents = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        title,
        description,
        TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
        TO_CHAR(event_date, 'YYYY-MM-DD') AS date,
        priority,
        is_completed,
        created_at
      FROM events
      ORDER BY event_date ASC, id ASC;
    `;
    const { rows } = await pool.query(query);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('[Error getEvents]:', error.message);
    return res.status(500).json({
      error: 'Error interno del servidor al obtener los eventos',
      details: error.message,
    });
  }
};

/**
 * POST /api/events
 * Crear un nuevo evento en la base de datos PostgreSQL.
 */
const createEvent = async (req, res) => {
  try {
    const { title, description, event_date, date, priority, is_completed } = req.body;

    // Normalizar fecha (soporta tanto 'event_date' como 'date' enviados por el cliente)
    const targetDate = event_date || date;

    // Validación básica de entrada
    if (!title || !targetDate) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'El título y la fecha del evento son obligatorios',
      });
    }

    const validPriority = ['Alta', 'Media', 'Baja'].includes(priority) ? priority : 'Media';
    const completedStatus = typeof is_completed === 'boolean' ? is_completed : false;

    const query = `
      INSERT INTO events (title, description, event_date, priority, is_completed)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        id,
        title,
        description,
        TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
        TO_CHAR(event_date, 'YYYY-MM-DD') AS date,
        priority,
        is_completed,
        created_at;
    `;

    const values = [
      title.trim(),
      description ? description.trim() : '',
      targetDate,
      validPriority,
      completedStatus,
    ];

    const { rows } = await pool.query(query, values);
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error('[Error createEvent]:', error.message);
    return res.status(500).json({
      error: 'Error interno del servidor al crear el evento',
      details: error.message,
    });
  }
};

/**
 * PUT /api/events/:id
 * Actualizar los datos de un evento o modificar su estado 'is_completed'.
 */
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, event_date, date, priority, is_completed } = req.body;

    // Verificar primero si el evento existe
    const checkQuery = `SELECT * FROM events WHERE id = $1;`;
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Evento no encontrado',
        message: `No existe ningún evento con el ID: ${id}`,
      });
    }

    const currentEvent = checkResult.rows[0];
    const targetDate = event_date || date || currentEvent.event_date;

    const query = `
      UPDATE events
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        event_date = COALESCE($3, event_date),
        priority = COALESCE($4, priority),
        is_completed = COALESCE($5, is_completed)
      WHERE id = $6
      RETURNING 
        id,
        title,
        description,
        TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
        TO_CHAR(event_date, 'YYYY-MM-DD') AS date,
        priority,
        is_completed,
        created_at;
    `;

    const values = [
      title !== undefined ? title.trim() : null,
      description !== undefined ? description.trim() : null,
      targetDate,
      priority !== undefined ? priority : null,
      is_completed !== undefined ? is_completed : null,
      id,
    ];

    const { rows } = await pool.query(query, values);
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('[Error updateEvent]:', error.message);
    return res.status(500).json({
      error: 'Error interno del servidor al actualizar el evento',
      details: error.message,
    });
  }
};

/**
 * DELETE /api/events/:id
 * Eliminar físicamente un evento por su ID.
 */
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM events WHERE id = $1 RETURNING id;`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Evento no encontrado',
        message: `No se pudo eliminar: el ID ${id} no existe`,
      });
    }

    return res.status(200).json({
      message: 'Evento eliminado correctamente',
      deletedId: id,
    });
  } catch (error) {
    console.error('[Error deleteEvent]:', error.message);
    return res.status(500).json({
      error: 'Error interno del servidor al eliminar el evento',
      details: error.message,
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
