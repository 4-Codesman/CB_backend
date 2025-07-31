const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const testRoute = require('./Routes/testRoute');
const userRoutes = require('./Routes/userRoutes');
const router = require('./Routes/userRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/test', testRoute);
app.use('/api/transactions', router);                       

module.exports = app;
