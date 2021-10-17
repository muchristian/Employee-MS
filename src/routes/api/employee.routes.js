import express from 'express';
import employeeController from '../../controllers/employeeController';
import ValidationMiddleware from '../../middlewares/validationMiddleware';
import {uploadFile} from '../../middlewares/fileUploadMiddleware';
import ifExist from '../../middlewares/ifExist';
import authMiddleware from '../../middlewares/authMiddleware';

const { employeeCreateValMid, employeeUpdateValMid, employeeActivationMid, employeeSuspensioMid } = ValidationMiddleware;
const { isOld, employeeEmail, nationalId, code, phoneNumber } = ifExist;
const { createEmployee, uploadEmployeesData, getAllEmployee, getEmployee, searchEmployee, updateEmployee, activateEmployee, suspendEmployee, destroyEmployee } = employeeController;
const { isUserAuthInAndVerified } = authMiddleware;

const employeeRoute = express.Router();

employeeRoute.post('/create', isUserAuthInAndVerified, employeeCreateValMid, isOld, employeeEmail, nationalId, code, phoneNumber, createEmployee);
employeeRoute.post('/upload-data', isUserAuthInAndVerified, uploadFile, uploadEmployeesData)
employeeRoute.get('/', isUserAuthInAndVerified, getAllEmployee);
employeeRoute.get('/search', isUserAuthInAndVerified, searchEmployee);
employeeRoute.get('/:id', isUserAuthInAndVerified, getEmployee);
employeeRoute.put('/:id/edit', isUserAuthInAndVerified, employeeUpdateValMid, employeeEmail, nationalId, phoneNumber, updateEmployee);
employeeRoute.patch('/:id/activate', isUserAuthInAndVerified, employeeActivationMid, activateEmployee)
employeeRoute.patch('/:id/suspend', isUserAuthInAndVerified, employeeSuspensioMid, suspendEmployee);
employeeRoute.delete('/:id/delete', isUserAuthInAndVerified, destroyEmployee);
export default employeeRoute;