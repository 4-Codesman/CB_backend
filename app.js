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
const stokvelRoute = require('./Routes/stokvelRoute');
const savingLeagueRoute = require('./Routes/savingLeagueRoute'); // ✅ added this line

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/test', testRoute);
app.use('/api/view', viewRoute);
app.use('/api/stokvels', stokvelRoute);
app.use('/api/saving-leagues', savingLeagueRoute); // ✅ added this line

module.exports = app;
