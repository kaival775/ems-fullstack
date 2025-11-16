import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from '../models/Department.js';

dotenv.config();

const seedDepartments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    await Department.deleteMany({});
    console.log('Existing departments cleared');

    const departments = [
      { name: 'Human Resources', description: 'Manages employee relations, recruitment, and HR policies' },
      { name: 'Finance', description: 'Handles financial planning, accounting, and budget management' },
      { name: 'Sales', description: 'Responsible for revenue generation and client acquisition' },
      { name: 'Marketing', description: 'Manages brand promotion, advertising, and market research' },
      { name: 'Engineering', description: 'Develops and maintains software products and technical solutions' },
      { name: 'Product Management', description: 'Oversees product strategy, development, and lifecycle management' },
      { name: 'IT & Infrastructure', description: 'Maintains IT systems, networks, and technical infrastructure' },
      { name: 'Operations', description: 'Manages day-to-day business operations and process optimization' },
      { name: 'Admin / Office Management', description: 'Handles administrative tasks and office management' },
      { name: 'Research & Development (R&D)', description: 'Conducts research and develops new technologies and products' }
    ];

    await Department.insertMany(departments);
    console.log(`✅ ${departments.length} departments created successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding departments:', error);
    process.exit(1);
  }
};

seedDepartments();