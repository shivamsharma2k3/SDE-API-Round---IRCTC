const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get Specific Booking Details
// GET /bookings/:bookingId
router.get('/:bookingId', authenticateToken, async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [bookingId, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
