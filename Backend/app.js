require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

// CORS configuration to allow frontend requests
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL (Vite default)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
  res.send('Welcome to the Product API');
});
// Marks routes
const marksRoutes = require('./routes/marksRoutes');
app.use('/api/marks', marksRoutes);
// Payment routes
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

// User management routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Example usage of MONGO_URI (not connecting yet)
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));