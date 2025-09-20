const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware to check admin role
function adminOnly(req, res, next) {
	if (req.user && req.user.role === 'admin') {
		return next();
	}
	return res.status(403).json({ error: 'Access denied: Admins only' });
}

// Register user
router.post('/register', userController.register);

// Get all users (admin only)
router.get('/', userController.getAll);

// Get user by ID
router.get('/:id', userController.getById);

// Get teacher's subjects
router.get('/:teacherId/subjects', authMiddleware, userController.getTeacherSubjects);

// Update user
router.put('/:id', userController.update);

// Delete user (admin only)
router.delete('/:id', authMiddleware, adminOnly, userController.delete);

module.exports = router;
