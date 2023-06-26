import { UniqueConstraintError } from 'sequelize';
import { Post, Topic, User } from '../models';
import { NewUserEntry, UserEntry } from '../utils/types';
import { toNewUserEntry } from '../utils/usersUtils';
import bcrypt from 'bcrypt';

const passwordHash = async (plainPassword: string): Promise<string> => {
  const hash = await bcrypt.hash(plainPassword, 10);

  return hash;
};

const getAllUsers = async () => {
  const users = await User.findAll({
    include: [
      {
        model: Post
      },
      {
        model: Topic
      }
    ]
  });

  return users;
};

const getUserById = async (id: number) => {
  const user = await User.findByPk(id);

  return user;
};

const getUserByHandle = async (handle: string) => {
  const user = await User.findOne({ where: { handle }});

  return user;
};

const createUser = async (userInfo: any) => {
  try {
    let newUser: NewUserEntry = toNewUserEntry(userInfo);

    const hash = await passwordHash(newUser.passwordHash);
    newUser = {
      ...newUser,
      passwordHash: hash 
    };

    const createdUser = await User.create(newUser);
    return createdUser;
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new Error(`${err.errors[0].message}`);
    }
    throw new Error('something unexpected happened' + err);
  }
};

// todo: implement deleteUserById
// const deleteUserById = async (id: number) => {
// };

export default {
  getAllUsers,
  getUserById,
  getUserByHandle,
  createUser,
  // deleteUserById
};