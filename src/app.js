const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const quantityRoutes = require('./routes/quantityRoutes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quantities', quantityRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;