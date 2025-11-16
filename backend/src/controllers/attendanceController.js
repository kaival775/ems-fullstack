/**
 * Attendance Controller
 * Handles attendance tracking operations
 */

import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// @desc    Mark attendance (Check-in/Check-out)
// @route   POST /api/attendance
// @access  Private
export const markAttendance = async (req, res) => {
  try {
    const { checkIn, checkOut, notes } = req.body;
    const userId = req.user.id;
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Check if attendance already exists for today
    let attendance = await Attendance.findOne({
      user: userId,
      date: dateOnly
    });

    if (attendance) {
      // Update existing attendance (check-out)
      if (checkOut && !attendance.checkOut) {
        attendance.checkOut = checkOut;
        attendance.notes = notes || attendance.notes;
        await attendance.save();
        
        return res.status(200).json({
          success: true,
          message: 'Check-out recorded successfully',
          data: attendance
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Attendance already marked for today'
        });
      }
    } else {
      // Create new attendance (check-in)
      if (!checkIn) {
        return res.status(400).json({
          success: false,
          message: 'Check-in time is required'
        });
      }

      // Determine status based on check-in time
      const checkInTime = new Date(`1970-01-01T${checkIn}:00`);
      const standardTime = new Date('1970-01-01T09:00:00'); // 9 AM
      let status = 'Present';
      
      if (checkInTime > standardTime) {
        const lateMinutes = (checkInTime - standardTime) / (1000 * 60);
        status = lateMinutes > 30 ? 'Late' : 'Present';
      }

      attendance = await Attendance.create({
        user: userId,
        date: dateOnly,
        checkIn,
        checkOut,
        status,
        notes
      });

      await attendance.populate('user', 'name email');

      res.status(201).json({
        success: true,
        message: 'Attendance marked successfully',
        data: attendance
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
export const getAttendance = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // If not admin, only show own attendance
    if (req.user.role !== 'Admin') {
      query.user = req.user.id;
    }

    // Filter by user (admin only)
    if (req.query.userId && req.user.role === 'Admin') {
      query.user = req.query.userId;
    }

    // Filter by date range
    if (req.query.fromDate || req.query.toDate) {
      query.date = {};
      if (req.query.fromDate) {
        query.date.$gte = new Date(req.query.fromDate);
      }
      if (req.query.toDate) {
        query.date.$lte = new Date(req.query.toDate);
      }
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const attendance = await Attendance.find(query)
      .populate('user', 'name email department')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Attendance.countDocuments(query);

    res.status(200).json({
      success: true,
      data: attendance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get today's attendance
// @route   GET /api/attendance/today
// @access  Private
export const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let query = { date: dateOnly };

    // If not admin, only show own attendance
    if (req.user.role !== 'Admin') {
      query.user = req.user.id;
    }

    const attendance = await Attendance.find(query)
      .populate('user', 'name email department position')
      .sort({ checkIn: 1 });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats
// @access  Private (Admin)
export const getAttendanceStats = async (req, res) => {
  try {
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Today's attendance summary
    const todayStats = await Attendance.aggregate([
      { $match: { date: dateOnly } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // This month's attendance
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyStats = await Attendance.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Average working hours this month
    const avgWorkingHours = await Attendance.aggregate([
      { 
        $match: { 
          date: { $gte: startOfMonth },
          workingHours: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          avgHours: { $avg: '$workingHours' }
        }
      }
    ]);

    // Late arrivals this month
    const lateArrivals = await Attendance.countDocuments({
      date: { $gte: startOfMonth },
      status: 'Late'
    });

    // Total employees
    const totalEmployees = await User.countDocuments({ status: 'Active' });

    // Present today
    const presentToday = await Attendance.countDocuments({
      date: dateOnly,
      status: { $in: ['Present', 'Late'] }
    });

    res.status(200).json({
      success: true,
      data: {
        todayStats,
        monthlyStats,
        avgWorkingHours: avgWorkingHours[0]?.avgHours || 0,
        lateArrivals,
        totalEmployees,
        presentToday,
        attendanceRate: totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private (Admin)
export const updateAttendance = async (req, res) => {
  try {
    let attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete attendance
// @route   DELETE /api/attendance/:id
// @access  Private (Admin)
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    await Attendance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};