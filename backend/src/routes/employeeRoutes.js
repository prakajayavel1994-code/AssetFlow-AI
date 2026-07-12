const express = require('express');
const router = express.Router();
const { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, employeeValidation } = require('../controllers/employeeController');
const { validate } = require('../middleware/validateMiddleware');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRoles('admin'), getEmployees);
router.get('/:id', protect, authorizeRoles('admin'), getEmployeeById);
router.post('/', protect, authorizeRoles('admin'), employeeValidation, validate, createEmployee);
router.put('/:id', protect, authorizeRoles('admin'), employeeValidation, validate, updateEmployee);
router.delete('/:id', protect, authorizeRoles('admin'), deleteEmployee);

module.exports = router;
