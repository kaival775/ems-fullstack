/**
 * Authentication Middleware
 * Handles JWT token verification and role-based access
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password').populate('department');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (req.user.status === 'Inactive') {
        return res.status(401).json({
          success: false,
          message: 'Account is inactive'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Admin access middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

// Employee or Admin access
export const employeeOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'Employee')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Employee or Admin privileges required.'
    });
  }
};

// Check if user can access their own data or admin can access any
export const ownerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user._id.toString() === req.params.id)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own data.'
    });
  }
};