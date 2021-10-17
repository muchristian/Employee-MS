import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

class authUtil {
    hashPassword = async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash
    }

    isPasswordTrue = async (password, hashedPassword) => {
        const compare = await bcrypt.compare(password, hashedPassword);
        return compare
    }

    generateToken = (data) => {
        const tokenData = _.omit(data, 'password');
        const token = jwt.sign(tokenData, process.env.JWT_KEY, { expiresIn: `${process.env.JWT_EXP}` });
        return token;
    }
    verifyToken = (token) => {
        const decode = jwt.verify(token, process.env.JWT_KEY);
        return decode;
      };
}

export default new authUtil();
