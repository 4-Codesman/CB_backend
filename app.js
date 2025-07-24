const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const testRoute = require('./Routes/testRoute');
app.use('/api/test', testRoute);

module.exports = app;
