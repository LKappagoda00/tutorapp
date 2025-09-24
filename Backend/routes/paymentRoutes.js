const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create payment
router.post('/', authMiddleware, paymentController.create);

// Get all payments
router.get('/', paymentController.getAll);

// Get all payments with population (for salary management)
router.get('/all-populated', paymentController.getAllWithPopulation);

// Get teacher's month-wise salary data
router.get('/teacher/:teacherId/salary', authMiddleware, paymentController.getTeacherSalary);

// Get payments by month (with query parameters: ?month=9&year=2025)
router.get('/by-month', paymentController.getPaymentsByMonth);

// Update payment status
router.put('/:id/status', paymentController.updateStatus);

// Get payment by ID
router.get('/:id', paymentController.getById);

// Update payment
router.put('/:id', paymentController.update);

// Delete payment
router.delete('/:id', paymentController.delete);

module.exports = router;
