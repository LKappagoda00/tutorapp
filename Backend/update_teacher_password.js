const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tutorapp')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

const User = require('./models/User');

async function updateTeacherPassword() {
  try {
    const teacher = await User.findOne({ userName: 'kappa', role: 'teacher' });
    
    if (!teacher) {
      console.log('Teacher "kappa" not found');
      return;
    }
    
    console.log('Found teacher:', teacher.fullName, '(', teacher.userName, ')');
    
    // Hash the password 'password'
    const hashedPassword = await bcrypt.hash('password', 10);
    
    // Update the teacher's password
    teacher.password = hashedPassword;
    await teacher.save();
    
    console.log('Password updated successfully!');
    console.log('Teacher login credentials:');
    console.log('Username: kappa');
    console.log('Password: password');
    
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateTeacherPassword();