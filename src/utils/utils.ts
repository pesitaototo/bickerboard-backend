import { NewUserEntry } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseHandle = (handle: unknown): string => {
  if (!isString(handle)) {
    throw new Error('bad or missing handle');
  }

  return handle;
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

  return password;
};

export const toNewUserEntry = (object: unknown): NewUserEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('bad user data');
  }

  if ('handle' in object && 'email' in object && 'password' in object) {
    const newUser: NewUserEntry = {
      handle: parseHandle(object.handle),
      email: parseEmail(object.email),
      passwordHash: parsePassword(object.password)
    };

    return newUser;
  }

  throw new Error('bad user data: a field is missing');
};

