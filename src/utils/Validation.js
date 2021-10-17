import DateExtension from '@joi/date';
import * as JoiImport from 'joi';
import * as response from '../utils/response';
import statusCodes from '../utils/statusCodes';
const { errorResponse } = response
const Joi = JoiImport.extend(DateExtension);
class Validation {
  signupValidation = (data) => {
    const schema = Joi.object({
      firstName: Joi.string().regex(new RegExp("^([a-zA-Z]{3,})+$")),
      lastName: Joi.string().regex(new RegExp("^([a-zA-Z]{3,})+$")),
      phoneNumber: Joi.string().regex(new RegExp("^[+](250)(7)(8|3|2)[0-9]{7}$")),
      email: Joi.string().email().required(),
      password: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,16}$/)
        .required(),
    });
    return schema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
    });
  }
  
  
  loginValidation = (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });
    return schema.validate(data, {
      abortEarly: false,
      allowUnknown: false,
    });
  }

  resetValidation = (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required()
    });
    return schema.validate(data, {
      abortEarly: false,
      allowUnknown: false,
    });
  }

  

  updatePasswordValidation = (data) => {
    const schema = Joi.object({
      password: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,16}$/)
        .required(),
        password_confirmation: Joi.any().equal(Joi.ref('password'))
        .required()
    });
    return schema.validate(data, {
      abortEarly: false,
      allowUnknown: false,
    });
  }

  updateProfileValidation = (data) => {
    const schema = Joi.object({
      firstName: Joi.string().regex(new RegExp("^([a-zA-Z]{3,})+$")).empty(""),
      lastName: Joi.string().regex(new RegExp("^([a-zA-Z]{3,})+$")).empty(""),
      phoneNumber: Joi.string().regex(new RegExp("^[+](250)(7)(8|3|2)[0-9]{7}$")).empty(""),
      email: Joi.string().email().empty(""),
    });
    return schema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
    });
  }

  employeeCreateValidation = (data) => {
    const schema = Joi.object({
      firstName: Joi.string().regex(new RegExp("^([a-zA-Z]{3,})+$")),
      lastName: Joi.string().regex(new RegExp("^([a-zA-Z]{3,})+$")),
      nationalId: Joi.string().regex(new RegExp("^([0-9]{16})+$")),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().regex(new RegExp("^[+](250)(7)(8|3|2)[0-9]{7}$")),
      dateOfBirth: Joi.date().format('YYYY-MM-DD').required(),
      status: Joi.string().regex(new RegExp("^(ACTIVE|INACTIVE)$")),
      position: Joi.string().regex(new RegExp("^(MANAGER|DEVELOPER|DESIGNER|TESTER|DEVOPS)$")),
    });
    return schema.validate(data, {
      abortEarly: false,
      allowUnknown: false,
    });
  }

  employeeUpdateValidation = (data) => {
    const schema = Joi.object({
      firstName: Joi.string().regex(new RegExp("^([a-zA-Z]{3,})+$")).empty(''),
      lastName: Joi.string().regex(new RegExp("^([a-zA-Z]{3,})+$")).empty(''),
      nationalId: Joi.string().regex(new RegExp("^([0-9]{16})+$")).empty(''),
      email: Joi.string().email().empty(''),
      phoneNumber: Joi.string().regex(new RegExp("^[+](250)(7)(8|3|2)[0-9]{7}$")).empty(''),
      dateOfBirth: Joi.date().format('YYYY-MM-DD').empty(''),
      status: Joi.string().regex(new RegExp("^(ACTIVE|INACTIVE)$")).empty(''),
      position: Joi.string().regex(new RegExp("^(MANAGER|DEVELOPER|DESIGNER|TESTER|DEVOPS)$")).empty(''),
    });
    return schema.validate(data, {
      abortEarly: false,
      allowUnknown: false,
    });
  }

  employeeActivationValidation = (data) => {
    const schema = Joi.object({
      status: Joi.string().regex(new RegExp("^(ACTIVE|INACTIVE)$"))
    });
    return schema.validate(data, {
      abortEarly: false,
      allowUnknown: false,
    });
  }


  employeeSuspensionValidation = (data) => {
    const schema = Joi.object({
      isSuspended: Joi.string().regex(new RegExp("^(0|1)$"))
    });
    return schema.validate(data, {
      abortEarly: false,
      allowUnknown: false,
    });
  }

      /**
* @param {object} error
* @param {object} res
* @param {object} next
* @returns {object} return body assigned to their validation methods
*/
displayErrorMessages = (error, res, next) => {
  if (error) {
    const { details } = error;
    const messages = details.map((err) => err.message.replace(/['"]/g, '')).join(', ');
    return errorResponse(res, statusCodes.badRequest, messages);
  }
  return next();
};


}

export default new Validation();
