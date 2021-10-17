import Validation from '../utils/Validation';

const { displayErrorMessages, signupValidation, updateProfileValidation, loginValidation, resetValidation, updatePasswordValidation, employeeCreateValidation, employeeUpdateValidation, employeeActivationValidation, employeeSuspensionValidation } = Validation;

class ValidationMiddleware {
  signupValMid(req, res, next) {
    const { error } = signupValidation(req.body);
    displayErrorMessages(error, res, next)
  }

  loginValMid(req, res, next) {
    const { error } = loginValidation(req.body);
    displayErrorMessages(error, res, next)
  }

  resetValMid(req, res, next) {
    const { error } = resetValidation(req.body);
    displayErrorMessages(error, res, next)
  }

  updatePasswordValMid(req, res, next) {
    const { error } = updatePasswordValidation(req.body);
    displayErrorMessages(error, res, next)
  }

  updateProfileValMid(req, res, next) {
    const { error } = updateProfileValidation(req.body);
    displayErrorMessages(error, res, next)
  }

  employeeCreateValMid(req, res, next) {
    const { error } = employeeCreateValidation(req.body);
    displayErrorMessages(error, res, next)
  }

  employeeUpdateValMid(req, res, next) {
    const { error } = employeeUpdateValidation(req.body);
    displayErrorMessages(error, res, next)
  }

  employeeActivationMid(req, res, next) {
    const { error } = employeeActivationValidation(req.body);
    displayErrorMessages(error, res, next)
  }

  employeeSuspensioMid(req, res, next) {
    const { error } = employeeSuspensionValidation(req.body);
    displayErrorMessages(error, res, next)
  }

}

export default new ValidationMiddleware();
