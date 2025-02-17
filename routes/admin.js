const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAdminApiKey } = require('../middleware/auth');

// Add a New Train (Admin Only)
router.post('/trains', requireAdminApiKey, async (req, res) => {
  const { name, source, destination, total_seats } = req.body;
  if (!name || !source || !destination || !total_seats) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await pool.query(
      'INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)',
      [name, source, destination, total_seats, total_seats]
    );
    res.status(201).json({ message: 'Train added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
