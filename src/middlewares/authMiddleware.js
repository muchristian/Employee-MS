import Utils from '../utils/authUtil';
import UserService from '../services/UserService';
import redisClient from '../redis.config';
import * as response from '../utils/response';
import statusCodes from '../utils/statusCodes';
import * as customMessages from '../utils/customMessages';

const { verifyToken } = Utils
const {errorResponse} = response
const { loginfailed, notConfirmed, alreadyLoggedOut, tokenNotFound, tokenInvalid } = customMessages
// const { verifyToken } = Utils;

class authMiddleware {
     isUserAuthInAndVerified = async (req, res, next) => {
        let token = req.get('Authorization');
        if (!token) {
          return errorResponse(res, statusCodes.notFound, tokenNotFound)
        }
        token = token.split(' ').pop();
        console.log(token)
        try {
          const decodedToken = verifyToken(token, process.env.JWT_KEY);
          console.log(decodedToken)
          const user = await UserService.getOneBy({ email: decodedToken.email });
          console.log(user)
          return redisClient.smembers('token', (err, userToken) => {
            if (userToken.includes(token) || !user) {
                return errorResponse(res, statusCodes.notFound, alreadyLoggedOut)
            }
            // if (user.is_verified < 1) {
            //     return res.status(401).json({
            //         message: 'Please check if you have verified your account first'
            //     })
            // }
            req.sessionUser = decodedToken;
            return next();
          });
        } catch (error) { 
            return errorResponse(res, statusCodes.unAuthorized, tokenInvalid)
        }
      }

    //   isRole = (passedInRole) => {
    //     return (req, res, next) => {
    //       const { role } = req.sessionUser;
    //       if (role === passedInRole) {
    //         req.userData = req.sessionUser;
    //         return next()
    //       }
    //       return res.status(401).json({
    //         message: `Only ${passedInRole} can access this endpoint`
    //       })
    //     }
    //   }

      hasConfirmed = async (req, res, next) => {
        const { confirmed } = req.userData;
        if (!confirmed) {
            return errorResponse(res, statusCodes.unAuthorized, notConfirmed)
          }
        next()
      }

      userExist = async (req, res, next) => {
        const {email} = req.body
        let findUser = await UserService.getOneBy({ email: email.toLowerCase() });
        if (!findUser) {
          return errorResponse(res, statusCodes.unAuthorized, loginfailed)
        }
        const { dataValues } = findUser;
        req.userData = dataValues
        next()
      }
}

export default new authMiddleware();