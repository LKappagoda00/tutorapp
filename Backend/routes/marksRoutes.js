const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');

// Create marks
router.post('/', marksController.create);

// Get all marks
router.get('/', marksController.getAll);

// Get marks by teacher ID
router.get('/teacher/:teacherId', marksController.getMarksByTeacher);

// Get marks by student ID
router.get('/student/:studentId', marksController.getMarksByStudent);

// Get marks by teacher AND student ID
router.get('/teacher/:teacherId/student/:studentId', marksController.getMarksByTeacherAndStudent);

// Get marks by ID
router.get('/:id', marksController.getById);

// Update marks
router.put('/:id', marksController.update);

// Delete marks
router.delete('/:id', marksController.delete);

module.exports = router;
