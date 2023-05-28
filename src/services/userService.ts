import { UniqueConstraintError } from 'sequelize';
import { User } from '../models';
import { NewUserEntry, UserEntry } from '../utils/types';

const createUser = async (newUser: NewUserEntry) => {
  try {
    const createdUser = await User.create(newUser);
    return createdUser;
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new Error(`${err.errors[0].message}`);
    }
    throw new Error('something unexpected happened');
  }

};

export default {
  createUser
};