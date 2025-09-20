
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

// Product routes
const products = [
  { id: 1, name: 'Product A', price: 100 },
  { id: 2, name: 'Product B', price: 200 },
];

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  res.json(product);
});

app.post('/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).send('Name and price required');
  const newProduct = {
    id: products.length + 1,
    name,
    price,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Example usage of MONGO_URI (not connecting yet)
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));