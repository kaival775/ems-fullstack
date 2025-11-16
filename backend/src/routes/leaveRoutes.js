import express from 'express';
import { getAllLeaves, createLeave, updateLeaveStatus, deleteLeave } from '../controllers/leaveController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllLeaves);
router.post('/', protect, createLeave);
router.patch('/:id/status', protect, adminOnly, updateLeaveStatus);
router.delete('/:id', protect, deleteLeave);

export default router;
