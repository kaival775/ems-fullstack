/**
 * Attendance Model
 * Tracks employee check-in/check-out times
 */

import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
  },
  checkIn: {
    type: String,
    required: [true, 'Check-in time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  checkOut: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Absent', 'Half Day'],
    default: 'Present'
  },
  workingHours: {
    type: Number,
    default: 0
  },
  overtime: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

// Ensure one attendance record per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

// Calculate working hours before saving
attendanceSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    const checkInTime = new Date(`1970-01-01T${this.checkIn}:00`);
    const checkOutTime = new Date(`1970-01-01T${this.checkOut}:00`);
    const diffMs = checkOutTime - checkInTime;
    this.workingHours = Math.max(0, diffMs / (1000 * 60 * 60)); // Convert to hours
    
    // Calculate overtime (assuming 8 hours is standard)
    this.overtime = Math.max(0, this.workingHours - 8);
  }
  next();
});

export default mongoose.model('Attendance', attendanceSchema);