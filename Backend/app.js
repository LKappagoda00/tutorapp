

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Product API');
});


// User management routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Example usage of MONGO_URI (not connecting yet)
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));