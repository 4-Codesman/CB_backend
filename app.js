const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const testRoute = require('./Routes/testRoute');
const userRoutes = require('./Routes/userRoutes');
const viewRoute = require('./Routes/viewRoute');
const friendsRoutes = require('./Routes/friendsRoutes');
const stokvelRoute = require('./Routes/stokvelRoute');
const joinRoute= require('./Routes/joinRoute');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/test', testRoute);
app.use('/api/view', viewRoute);
app.use('/api/friends', friendsRoutes);
app.use('/api/stokvels', stokvelRoute);
app.use('/api/join', joinRoute);

module.exports = app;
