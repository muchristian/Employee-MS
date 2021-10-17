import UserServices from "../services/UserService";
import authUtils from "../utils/authUtil";
import * as response from '../utils/response';
import statusCodes from '../utils/statusCodes';
import * as customMessages from '../utils/customMessages';
import userConfirmationEmail from '../utils/emails/userConfirmationMail';
import userResetPasswordMail from '../utils/emails/userResetPasswordMail'; 
import _ from 'lodash';
import redisClient from "../redis.config";

const { errorResponse, successResponse } = response;
const { ok, badRequest, unAuthorized, created, forbidden } = statusCodes;
const { confirmationsuccess, loginsuccess, loginfailed, resetIncorrectEmailError, resetsuccess, updatePasswordsuccess, updateProfileSuccess, loggedOutSuccessfully } = customMessages;

const { hashPassword, isPasswordTrue, generateToken, verifyToken:decodeToken } = authUtils;
export default class authController {
  static async signup(req, res) {
      const { email, password } = req.body;
      const hashedPassword = await hashPassword(password);
      const userData = {
        ...req.body,
        email: email.toLowerCase(),
        password: hashedPassword
      };
      const savedUser = await UserServices.saveAll(userData);
      const { dataValues } = savedUser;
      const token = generateToken(_.omit(dataValues, ['password']))
      const url = `http://localhost:3002/api/auth/confirmation/${token}`
      await userConfirmationEmail(res, _.omit(dataValues, ['password']), url, token)
    
  };

  static async confirmation(req, res) {
    const { token } = req.params;
    const {id} = decodeToken(token, process.env.JWT_KEY);
    const result = await UserServices.updateBy({confirmed: true}, {id})
    return successResponse(res, ok, confirmationsuccess, result, undefined)
  
  }

  static async login(req, res) {
      const { password } = req.body;
      const {password:pass} = req.userData;
      if (!await isPasswordTrue(password, pass)) {
        return errorResponse(res, unAuthorized, loginfailed)
      }
      return successResponse(res, ok, loginsuccess, _.omit(req.userData, ['password']), generateToken(_.omit(req.userData, ['password'])))

  };

  static async reset(req, res) {
    const { email } = req.body;
      const user = await UserServices.getOneBy({ email: email.toLowerCase() });
      if (user) {
        const result = user.dataValues;
        const token = generateToken(_.omit(result, ['password']));
        const url = `http://localhost:3002/api/auth/update-password/${token}`
        await userResetPasswordMail(res, _.omit(result, ['password']), url, token)
      } else {
        return errorResponse(res, forbidden, resetIncorrectEmailError)
      }
      
  }

  static async updatePassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    const {email} = decodeToken(token, process.env.JWT_KEY);
    const hashedPassword = await hashPassword(password);
    const user = await UserServices.updateBy({ password: hashedPassword }, { email });
    const {dataValues} = user[1][0];
    return successResponse(res, ok, updatePasswordsuccess, _.omit(dataValues, ['password']), undefined)
  }

  static async updateProfile(req, res) {
    const { id } = req.sessionUser;
    const user = await UserServices.updateBy({ ...req.body }, {id});
    const {dataValues} = user[1][0];
    return successResponse(res, ok, updateProfileSuccess, _.omit(dataValues, ['password']), undefined)
  }

  static logout(req, res) {
    const {token} = req.query
    console.log("====")
    console.log(token)
    console.log("===")
    redisClient.sadd('token', token);
    return successResponse(res, ok, loggedOutSuccessfully, undefined, undefined)
  }
  
}
