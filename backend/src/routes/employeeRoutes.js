/**
 * Employee Routes
 */

import express from 'express';
import {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} from '../controllers/employeeController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/stats', adminOnly, getEmployeeStats);
router.route('/')
  .get(adminOnly, getAllEmployees)
  .post(adminOnly, createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(adminOnly, updateEmployee)
  .delete(adminOnly, deleteEmployee);

export default router;