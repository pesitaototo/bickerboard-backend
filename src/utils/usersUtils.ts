import { NewUserEntry } from './types';
import { isString } from './utilsCommon';

const parseHandle = (username: unknown): string => {
  if (!isString(username)) {
    throw new Error('bad or missing username');
  }

  return username;
};

const parseEmail = (email: unknown): string => {
  if (!isString(email)) {
    throw new Error('bad or missing email');
  }

  return email;
};

const parsePassword = (password: unknown): string => {
  if (!isString(password)) {
    throw new Error('bad or missing password');
  }

  if(password.length < 8) {
    throw new Error('password must contain at least 8 characters');
  }


  return password;
};

export const toNewUserEntry = (object: unknown): NewUserEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('bad user data');
  }

  if ('username' in object && 'email' in object && 'password' in object && 'passwordConfirm' in object) {
    if (object.password !== object.passwordConfirm) {
      throw new Error('passwords does not match');
    }

    const newUser: NewUserEntry = {
      username: parseHandle(object.username),
      email: parseEmail(object.email),
      password: parsePassword(object.password)
    };

    return newUser;
  }

  throw new Error('bad user data: a field is missing');
};

