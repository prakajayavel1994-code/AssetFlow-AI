const express = require('express');
const router = express.Router();
const { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, employeeValidation } = require('../controllers/employeeController');
const { validate } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getEmployees);
router.get('/:id', protect, getEmployeeById);
router.post('/', protect, employeeValidation, validate, createEmployee);
router.put('/:id', protect, employeeValidation, validate, updateEmployee);
router.delete('/:id', protect, deleteEmployee);

module.exports = router;
