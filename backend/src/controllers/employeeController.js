const Employee = require('../models/Employee');
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
    const employee = await Employee.create(req.body);
    return sendResponse(res, 201, true, 'Employee created', { employee });
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
