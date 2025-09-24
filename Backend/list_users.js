const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tutorapp')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

const User = require('./models/User');

async function listUsers() {
  try {
    const users = await User.find({}, 'fullName userName email role');
    console.log('All users in database:');
    console.log('=====================');
    users.forEach(user => {
      console.log(`Name: ${user.fullName}`);
      console.log(`Username: ${user.userName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`ID: ${user._id}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    mongoose.connection.close();
  }
}

listUsers();