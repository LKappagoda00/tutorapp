const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create payment
router.post('/', authMiddleware, paymentController.create);

// Get all payments
router.get('/', paymentController.getAll);

// Get payment by ID
router.get('/:id', paymentController.getById);

// Update payment
router.put('/:id', paymentController.update);

// Delete payment
router.delete('/:id', paymentController.delete);

module.exports = router;
