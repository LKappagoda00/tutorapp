const Marks = require('../models/Marks');

// Create marks
exports.create = async (req, res) => {
  try {
    const marks = new Marks(req.body);
    await marks.save();
    res.status(201).json({ message: 'Marks added', marks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all marks
exports.getAll = async (req, res) => {
  try {
    const allMarks = await Marks.find().populate('student');
    res.json(allMarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get marks by ID
exports.getById = async (req, res) => {
  try {
    const marks = await Marks.findById(req.params.id).populate('student');
    if (!marks) return res.status(404).json({ error: 'Marks not found' });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update marks
exports.update = async (req, res) => {
  try {
    const marks = await Marks.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!marks) return res.status(404).json({ error: 'Marks not found' });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete marks
exports.delete = async (req, res) => {
  try {
    const marks = await Marks.findByIdAndDelete(req.params.id);
    if (!marks) return res.status(404).json({ error: 'Marks not found' });
    res.json({ message: 'Marks deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
