/**
 * User Model
 * Handles both Admin and Employee user types
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['Admin', 'Employee'],
    default: 'Employee'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary cannot be negative']
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  profileImage: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Hash passwords for bulk insert
userSchema.pre('insertMany', async function(next, docs) {
  if (Array.isArray(docs)) {
    const salt = await bcrypt.genSalt(10);
    for (let doc of docs) {
      if (doc.password) {
        doc.password = await bcrypt.hash(doc.password, salt);
      }
    }
  }
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Update department employee count and manager after save
userSchema.post('save', async function() {
  if (this.department) {
    const Department = mongoose.model('Department');
    const count = await mongoose.model('User').countDocuments({ department: this.department });
    
    const updateData = { employeeCount: count };
    
    // If this user is a manager, set them as department manager
    if (this.position === 'Manager') {
      updateData.manager = this._id;
    }
    
    await Department.findByIdAndUpdate(this.department, updateData);
  }
});

// Update department employee count and manager after remove
userSchema.post('findOneAndDelete', async function(doc) {
  if (doc && doc.department) {
    const Department = mongoose.model('Department');
    const count = await mongoose.model('User').countDocuments({ department: doc.department });
    
    const updateData = { employeeCount: count };
    
    // If deleted user was manager, remove manager reference
    if (doc.position === 'Manager') {
      updateData.manager = null;
    }
    
    await Department.findByIdAndUpdate(doc.department, updateData);
  }
});

// Update department manager when position changes
userSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.position === 'Manager' || update.$set?.position === 'Manager') {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate && docToUpdate.department) {
      const Department = mongoose.model('Department');
      await Department.findByIdAndUpdate(docToUpdate.department, { manager: docToUpdate._id });
    }
  }
  next();
});

export default mongoose.model('User', userSchema);