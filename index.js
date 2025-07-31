require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const cron = require('node-cron');
const { generateMonthlyPairs } = require('./Controllers/friendsController');

const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
  
// Schedule monthly pair generation to run on the 1st of every month at midnight
cron.schedule('0 0 1 * *', () => {
  console.log('🕐 Generating monthly pairs...');
  generateMonthlyPairs(
    { body: {} }, // fake request
    {
      status: (code) => ({
        json: (data) => console.log(`Status ${code}`, data)
      })
    }
  );
});