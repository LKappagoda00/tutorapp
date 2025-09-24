const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tutorapp')
  .then(() => console.log('MongoDB connected for testing'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Import models
const User = require('./models/User');
const Payment = require('./models/Payment');

async function createTestPayments() {
  try {
    console.log('Creating test payments...');
    
    // Find a teacher and student (or create them if they don't exist)
    let teacher = await User.findOne({ role: 'teacher' });
    let student = await User.findOne({ role: 'student' });
    
    if (!teacher) {
      console.log('No teacher found. Creating test teacher...');
      teacher = new User({
        fullName: 'Test Teacher',
        userName: 'teacher1',
        email: 'teacher@test.com',
        password: '$2b$10$K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', // hashed 'password'
        role: 'teacher',
        subject: 'Mathematics',
        bankDetails: {
          accountName: 'Test Teacher',
          accountNumber: '1234567890',
          bankName: 'Test Bank',
          branch: 'Main Branch'
        }
      });
      await teacher.save();
    }
    
    if (!student) {
      console.log('No student found. Creating test student...');
      student = new User({
        fullName: 'Test Student',
        userName: 'student1',
        email: 'student@test.com',
        password: '$2b$10$K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', // hashed 'password'
        role: 'student'
      });
      await student.save();
    }
    
    console.log(`Using teacher: ${teacher.fullName} (ID: ${teacher._id})`);
    console.log(`Using student: ${student.fullName} (ID: ${student._id})`);
    
    // Create test payments for the current month and previous months
    const payments = [
      {
        teacher: teacher._id,
        student: student._id,
        classId: 'CL001',
        subject: 'Mathematics',
        courseName: 'Algebra Basics',
        amount: 5000,
        status: 'completed',
        adminCommission: 750, // 15%
        teacherPayment: 4250, // 85%
        createdAt: new Date(2025, 8, 1) // September 1, 2025
      },
      {
        teacher: teacher._id,
        student: student._id,
        classId: 'CL002',
        subject: 'Mathematics',
        courseName: 'Geometry',
        amount: 6000,
        status: 'completed',
        adminCommission: 900, // 15%
        teacherPayment: 5100, // 85%
        createdAt: new Date(2025, 8, 10) // September 10, 2025
      },
      {
        teacher: teacher._id,
        student: student._id,
        classId: 'CL003',
        subject: 'Mathematics',
        courseName: 'Trigonometry',
        amount: 4500,
        status: 'pending',
        adminCommission: 0,
        teacherPayment: 0,
        createdAt: new Date(2025, 8, 20) // September 20, 2025
      },
      {
        teacher: teacher._id,
        student: student._id,
        classId: 'CL004',
        subject: 'Mathematics',
        courseName: 'Statistics',
        amount: 5500,
        status: 'completed',
        adminCommission: 825, // 15%
        teacherPayment: 4675, // 85%
        createdAt: new Date(2025, 7, 15) // August 15, 2025
      },
      {
        teacher: teacher._id,
        student: student._id,
        classId: 'CL005',
        subject: 'Mathematics',
        courseName: 'Calculus',
        amount: 7000,
        status: 'completed',
        adminCommission: 1050, // 15%
        teacherPayment: 5950, // 85%
        createdAt: new Date(2025, 7, 25) // August 25, 2025
      }
    ];
    
    // Delete existing test payments to avoid duplicates
    await Payment.deleteMany({ teacher: teacher._id });
    
    // Insert new test payments
    const insertedPayments = await Payment.insertMany(payments);
    
    console.log(`Created ${insertedPayments.length} test payments:`);
    insertedPayments.forEach((payment, index) => {
      console.log(`${index + 1}. ${payment.courseName} - ₹${payment.amount} (${payment.status}) - ${payment.createdAt.toDateString()}`);
    });
    
    console.log('\nTest teacher login credentials:');
    console.log('Username: teacher1');
    console.log('Password: password');
    
    console.log('\nTeacher salary summary:');
    const completedPayments = insertedPayments.filter(p => p.status === 'completed');
    const totalEarnings = completedPayments.reduce((sum, p) => sum + p.teacherPayment, 0);
    console.log(`Total teacher earnings: ₹${totalEarnings}`);
    console.log(`Completed payments: ${completedPayments.length}`);
    console.log(`Pending payments: ${insertedPayments.filter(p => p.status === 'pending').length}`);
    
  } catch (error) {
    console.error('Error creating test payments:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

createTestPayments();