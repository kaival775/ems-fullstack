import express from 'express';
import {
  getAllDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllDepartments)
  .post(adminOnly, createDepartment);

router.route('/:id')
  .get(getDepartment)
  .put(adminOnly, updateDepartment)
  .delete(adminOnly, deleteDepartment);

export default router;