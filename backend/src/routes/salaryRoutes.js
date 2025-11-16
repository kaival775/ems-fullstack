import express from 'express';
import { getAllSalaries, createSalary, updateSalaryStatus, deleteSalary } from '../controllers/salaryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllSalaries);
router.post('/', protect, adminOnly, createSalary);
router.patch('/:id/status', protect, adminOnly, updateSalaryStatus);
router.delete('/:id', protect, adminOnly, deleteSalary);

export default router;
