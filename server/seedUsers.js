import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@ticketsystem.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Support Agent 1',
    email: 'agent1@ticketsystem.com',
    password: 'agent123',
    role: 'support_agent'
  },
  {
    name: 'Support Agent 2',
    email: 'agent2@ticketsystem.com',
    password: 'agent123',
    role: 'support_agent'
  },
  {
    name: 'Regular User 1',
    email: 'user1@ticketsystem.com',
    password: 'user123',
    role: 'user'
  },
  {
    name: 'Regular User 2',
    email: 'user2@ticketsystem.com',
    password: 'user123',
    role: 'user'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ticketing_system');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create new users
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.email}`);
    }

    console.log('User seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();