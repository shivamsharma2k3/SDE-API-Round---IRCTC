const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get Trains & Seat Availability between two stations
// Example: GET /trains?source=Delhi&destination=Mumbai
router.get('/', async (req, res) => {
  const { source, destination } = req.query;
  if (!source || !destination) {
    return res.status(400).json({ message: 'Source and destination are required' });
  }
  try {
    const [rows] = await pool.query(
      'SELECT * FROM trains WHERE source = ? AND destination = ?',
      [source, destination]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book a Seat on a particular Train
router.post('/:trainId/book', authenticateToken, async (req, res) => {
  const { trainId } = req.params;
  const userId = req.user.id;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Lock the train row to prevent race conditions
    const [trains] = await connection.query(
      'SELECT * FROM trains WHERE id = ? FOR UPDATE',
      [trainId]
    );
    if (trains.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Train not found' });
    }
    const train = trains[0];
    if (train.available_seats <= 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'No seats available' });
    }

    // Decrement available seats
    await connection.query(
      'UPDATE trains SET available_seats = available_seats - 1 WHERE id = ?',
      [trainId]
    );

    // Create booking record
    const [result] = await connection.query(
      'INSERT INTO bookings (user_id, train_id) VALUES (?, ?)',
      [userId, trainId]
    );

    await connection.commit();
    res.status(201).json({
      message: 'Seat booked successfully',
      bookingId: result.insertId
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

module.exports = router;
