const Payment = require('../models/Payment');

// Create a payment
exports.create = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json({ message: 'Payment created', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all payments
exports.getAll = async (req, res) => {
  try {
    const payments = await Payment.find().populate('student teacher');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get payment by ID
exports.getById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('student teacher');
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update payment
exports.update = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete payment
exports.delete = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
