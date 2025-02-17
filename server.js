const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const trainRoutes = require('./routes/trains');
const bookingRoutes = require('./routes/bookings');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/trains', trainRoutes);
app.use('/bookings', bookingRoutes);

// Export the app 
module.exports = app;
