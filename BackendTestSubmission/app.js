require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { requestLoggerMiddleware } = require('../LoggingMiddleware'); // Import the middleware function
const shorturlRoutes = require('./routes/shorturls');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLoggerMiddleware); // Use the proper middleware function

// Routes
app.use('/shorturls', shorturlRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'URL Shortener Microservice API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;