import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userService from './userService';
import { SECRET } from '../utils/config';

// verify login, if verified, return token
const verifyLogin = async (username: string, password: string) => {
  const user = await userService.getUserByHandle(username);

  if (user) {
  // if username and password is correct, generate token
    if (await bcrypt.compare(password, user.password)) {
      const dataForToken = {
        id: user.id,
        username: user.username
      };
      const token = jwt.sign(dataForToken,
        SECRET, 
        { expiresIn: 60*60 } // token expires in 1 hour
      );
      return token;
    }
  }

  return null;
};

export default {
  verifyLogin
};