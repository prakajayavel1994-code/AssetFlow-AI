const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { sendResponse } = require('../utils/apiResponse');
const { body } = require('express-validator');

const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'Employees fetched', { employees });
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return sendResponse(res, 404, false, 'Employee not found', {});
    return sendResponse(res, 200, true, 'Employee fetched', { employee });
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: String(req.body.email || '').trim().toLowerCase() });
    if (existingUser) {
      return sendResponse(res, 400, false, 'Employee account already exists', {});
    }

    const employee = await Employee.create(req.body);
    const tempPassword = 'Welcome@123';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const user = await User.create({
      fullName: req.body.name,
      email: String(req.body.email || '').trim().toLowerCase(),
      password: hashedPassword,
      phone: req.body.phone || '',
      role: 'employee',
      mustChangePassword: true,
      temporaryPassword: tempPassword,
    });

    return sendResponse(res, 201, true, 'Employee created', {
      employee,
      account: {
        email: user.email,
        temporaryPassword: tempPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!employee) return sendResponse(res, 404, false, 'Employee not found', {});
    return sendResponse(res, 200, true, 'Employee updated', { employee });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return sendResponse(res, 404, false, 'Employee not found', {});
    await User.deleteOne({ email: String(employee.email || '').trim().toLowerCase() });
    return sendResponse(res, 200, true, 'Employee deleted', {});
  } catch (error) {
    next(error);
  }
};

const employeeValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('email').isEmail().withMessage('Valid email is required')
];

module.exports = { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, employeeValidation };
