const Payment = require('../models/Payment');

// Create a payment
exports.create = async (req, res) => {
  try {
    console.log('Payment creation request received:', req.body);
    const { student, teacher, classId, subject, courseName, amount, notes } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!student) missingFields.push('student');
    if (!teacher) missingFields.push('teacher');
    if (!classId) missingFields.push('classId');
    if (!subject) missingFields.push('subject');
    if (!courseName) missingFields.push('courseName');
    if (!amount) missingFields.push('amount');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        message: 'Amount must be greater than 0'
      });
    }

    // Create payment object
    const paymentData = {
      student,
      teacher,
      classId,
      subject,
      courseName,
      amount: Number(amount),
      notes,
      status: 'pending'
    };

    console.log('Creating payment with data:', paymentData);
    const payment = new Payment(paymentData);

    try {
      await payment.save();
      console.log('Payment saved successfully:', payment);
    } catch (saveError) {
      console.error('Error saving payment:', saveError);
      throw saveError;
    }
    res.status(201).json({ 
      success: true,
      message: 'Payment created successfully', 
      payment 
    });
  } catch (err) {
    console.error('Payment creation error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error creating payment', 
      error: err.message 
    });
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
