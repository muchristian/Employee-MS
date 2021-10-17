import EmployeeService from '../services/EmployeeService';
import * as response from '../utils/response';
import statusCodes from '../utils/statusCodes';
import {getPagination, getPagingData} from '../utils/paginate';
import moment from 'moment'
import * as messages from '../utils/customMessages';
import _ from 'lodash';
import {sendEmployeeRegistrationConfirmationEmail, sendMultiEmployeesRegistrationConfirmationEmail} from '../utils/emails/employeeMail';
import { Op } from 'sequelize';
import xlsx from 'xlsx';
import path from 'path';

const { employeeCreateSuccess, employeereturnSuccess, employeesreturnSuccess, employeeSearchreturnSuccess, employeeUpdateSuccess, employeeStatusSuccess, employeeSuspensionSuccess, employeeDeleteSuccess } = messages

const { successResponse } = response;
const { ok, created } = statusCodes

function getSearch(filters) {
  let queries = {}
  let arr = []
  for (const key in filters) {
    console.log(filters[key]);
    queries[key] = key === 'position' ? { [Op.eq]: filters[key] } : { [Op.like]: `%${filters[key]}%` };
    arr.push({[key]: queries[key]})
  }
  return arr
}


/**
 * @description employee controller class
 */
export default class employeeController {

    /**
     * 
     * @param {Request} req Node/express request
     * @param {Response} res Node/express response 
     * @returns {Object} Custom success response of creation of employee response
     * @description create employee
     */
    static async createEmployee(req, res) {
    const {firstName, lastName} = req.body;
    const result = await EmployeeService.saveAll({
      ..._.omit(req.body, ['firstName', 'lastName']),
      name: `${firstName} ${lastName}`,
      code: `EMP${req.genNber}`,
      CreateDate: moment(new Date()).format()
    });
    const {dataValues} = result
    await sendEmployeeRegistrationConfirmationEmail(res, dataValues)
    }



    /**
     * 
     * @param {Request} req Node/express request
     * @param {Response} res Node/express response 
     * @returns {Object} Custom success response of creation of employee response
     * @description create employee
     */
    static async uploadEmployeesData(req, res) {
      const { filename } = req.file
      const filePath = path.join(__dirname, '../../')
      const md = xlsx.readFile(filePath + `/public/uploads/${filename}`);
      const sht = md.Sheets[md.SheetNames[0]]
      const data = xlsx.utils.sheet_to_json(sht)
      console.log(data)
      for (const dt of data) {
        await EmployeeService.saveAll({
          name: `${dt.firstName} ${dt.lastName}`,
          email: dt.email,
          nationalId: dt.nationalId,
          phoneNumber: `+${dt.phoneNumber}`,
          code: dt.code,
          dateOfBirth: dt.dateOfBirth,
          status: dt.status,
          position: dt.position,
          CreateDate: moment(new Date()).format()
        })
        }
        for (const dt of data) {
        await sendMultiEmployeesRegistrationConfirmationEmail(res, dt)
        }
        return successResponse(res, statusCodes.created, employeeCreateSuccess, data, undefined);
    }

    /**
     * 
     * @param {Request} req Node/express request
     * @param {Response} res Node/express response 
     * @returns {Object} Custom success response of all returned employees
     * @description get all employees
     */
    static async getAllEmployee(req, res) {
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);
      const result = await EmployeeService.getAndCountAllIncludeAssociation({}, offset, limit);
      return successResponse(res, ok, employeesreturnSuccess, getPagingData(result, page, limit), undefined);
    }


    /**
     * 
     * @param {Request} req Node/express request
     * @param {Response} res Node/express response 
     * @returns {Object} Custom success response of all returned employees
     * @description get all employees
     */
     static async searchEmployee(req, res) {
      const { page, size } = req.query;
      const filters = _.omit(req.query, ['page', 'size'])
      console.log(filters)
      const retQueries = getSearch(filters);
      console.log(retQueries)
      const { limit, offset } = getPagination(page, size);
      const result = await EmployeeService.getAndCountAllIncludeAssociation({
        [Op.and]: [
          ...retQueries
        ]
      }, offset, limit);
      return successResponse(res, ok, employeeSearchreturnSuccess, getPagingData(result, page, limit), undefined);
    }

    /**
     * 
     * @param {Request} req Node/express request
     * @param {Response} res Node/express response 
     * @returns {Object} Custom success response for searched employee
     * @description get searched employee
     */
    static async getEmployee(req, res) {
      const { id } = req.params;
      const result = await EmployeeService.getOneBy({id});
      return successResponse(res, ok, employeereturnSuccess, result, undefined);
    }

    /**
     * 
     * @param {Request} req Node/express request
     * @param {Response} res Node/express response 
     * @returns {Object} Custom success response of updated employee
     * @description update employee
     */
    static async updateEmployee(req, res) {
      const { id } = req.params;
        const data = await EmployeeService.updateBy({
          ...req.body,
        }, {id});
        return successResponse(res, ok, employeeUpdateSuccess, data, undefined);
    }

    /**
     * 
     * @param {Request} req Node/express request
     * @param {Response} res Node/express response 
     * @returns {Object} Custom success response for employee activation
     * @description activate employee
     */
     static async activateEmployee(req, res) {
      const { id } = req.params;
        const {status} = req.body
        const data = await EmployeeService.updateBy({
          status
        }, {id});
        return successResponse(res, ok, employeeStatusSuccess, data, undefined);
    }


    /**
     * 
     * @param {Request} req Node/express request
     * @param {Response} res Node/express response 
     * @returns {Object} Custom success response for employee suspension
     * @description suspend employee
     */
     static async suspendEmployee(req, res) {
      const { id } = req.params;
      const {isSuspended} = req.body;
        const data = await EmployeeService.updateBy({
          isSuspended
        }, {id});
        return successResponse(res, ok, employeeSuspensionSuccess, data, undefined);
    }


    /**
     * 
     * @param {Request} req Node/express request
     * @param {Response} res Node/express response 
     * @returns {Object} Custom success response of deleted employee
     * @description destroy employee
     */
    static async destroyEmployee(req, res) {
      const { id } = req.params;
      await EmployeeService.temporaryDelete({id});
      return successResponse(res, ok, employeeDeleteSuccess, undefined, undefined);
    }

}
