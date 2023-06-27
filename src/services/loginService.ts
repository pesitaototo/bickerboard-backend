import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userService from './userService';
import { SECRET } from '../utils/config';

// verify login, if verified, return token
const verifyLogin = async (handle: string, password: string) => {
  const user = await userService.getUserByHandle(handle);

  if (user) {
  // if username and password is correct, generate token
    if (await bcrypt.compare(password, user.passwordHash)) {
      const dataForToken = {
        id: user.id,
        handle: user.handle
      };
      const token = jwt.sign(dataForToken,
        SECRET, 
        { expiresIn: 60*60 } // token expires in 1 hour
      );
      return token;
    }
  }
  
  throw new Error('invalid handle or password');
};

export default {
  verifyLogin
};