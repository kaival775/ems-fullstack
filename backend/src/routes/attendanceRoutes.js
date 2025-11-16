/**
 * Attendance Routes
 */

import express from 'express';
import {
  markAttendance,
  getAttendance,
  getTodayAttendance,
  getAttendanceStats,
  updateAttendance,
  deleteAttendance
} from '../controllers/attendanceController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/today', getTodayAttendance);
router.get('/stats', adminOnly, getAttendanceStats);
router.route('/')
  .get(getAttendance)
  .post(markAttendance);

router.route('/:id')
  .put(adminOnly, updateAttendance)
  .delete(adminOnly, deleteAttendance);

export default router;