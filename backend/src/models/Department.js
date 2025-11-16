/**
 * Department Model
 * Manages organizational departments
 */

import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Department name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Department description is required'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  employeeCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Update employee count when referenced
departmentSchema.virtual('employees', {
  ref: 'User',
  localField: '_id',
  foreignField: 'department',
  count: true
});

export default mongoose.model('Department', departmentSchema);