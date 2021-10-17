import UserService from "../services/UserService";
import EmployeeService from '../services/EmployeeService';
import * as response from '../utils/response';
import statusCodes from '../utils/statusCodes';
import * as customMessages from '../utils/customMessages';
import moment from "moment";

const { conflict } = statusCodes;
const { existError, isYoung } = customMessages;
const { errorResponse } = response

function isExist(key, data, res, next) {
    if (data) {
    return errorResponse(res, conflict, existError(key))
    }
    next()
}

function generateRandom() {
    const randomNum = 1000 + Math.random() * 1000;
    return Math.round(randomNum / 100) * 100;
  }

class IfExistMiddleware {


  async userEmail(req, res, next) {
    const {email: mail} = req.body
    if (mail) {
      const checkEmail = await UserService.getOneBy({ email: mail.toLowerCase() });
    return isExist("email", checkEmail, res, next)
    } else {
      next()
    }
    
  }

  async employeeEmail(req, res, next) {
    const {email: mail} = req.body
    if (mail) {
    const checkEmail = await EmployeeService.getOneBy({ email: mail.toLowerCase() });
    return isExist("email", checkEmail, res, next)
    } else {
      next()
    }
    
  }

  async nationalId(req, res, next) {
    const {nationalId} = req.body
    if (nationalId) {
      const checkNationalId = await EmployeeService.getOneBy({ nationalId });
    return isExist("nationalId", checkNationalId, res, next)
    } else {
      next()
    }
  }

  async code(req, res, next, genNber = generateRandom()) {
    const self = this;
    const code = `EMP${genNber}`
    const checkCode = await EmployeeService.getOneBy({ code });
    if (checkCode) {
        self.code(req, res, next, genNber)
    }
    req.genNber = genNber
    next()
  }

  async phoneNumber(req, res, next) {
    const {phoneNumber} = req.body
    if (phoneNumber) {
      const checkPhoneNumber = await EmployeeService.getOneBy({ phoneNumber });
    return isExist("phoneNumber", checkPhoneNumber, res, next)
    } else {
      next()
    }
    
  }

  isOld(req, res, next) {
    const {dateOfBirth} = req.body
    var years = moment().diff(dateOfBirth, 'years',false);
    if (years < 18) {
      return errorResponse(res, statusCodes.conflict, isYoung)
    }
    next()
  }

}

export default new IfExistMiddleware();
