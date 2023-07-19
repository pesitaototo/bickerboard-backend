import { UniqueConstraintError } from 'sequelize';
import { Post, Topic, User } from '../models';
import { NewUserEntry } from '../utils/types';
import { toNewUserEntry } from '../utils/usersUtils';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SECRET } from '../utils/config';

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

// redeclare jsonwebtoken module that extends Payload
// from https://stackoverflow.com/a/68641439/19470043
declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    id: string
  }
}

const getUserIdByToken = async (token: string) => {
  const { id } = <jwt.UserIDJwtPayload>jwt.verify(token, SECRET);
  return Number(id);
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

// todo: verify by user email before deleting user
const deleteUserById = async (id: number, token: string) => {
  const userId = await getUserIdByToken(token);

  if (id !== userId) {
    throw new Error('permission denied');
  }

  // https://github.com/sequelize/sequelize/issues/8444#issuecomment-811744952
  // using await User.destroy({ where: { id }}) does not seem to be triggering cascade deletion
  const user = await User.findByPk(id);
  if (user) {
    await user.destroy();
  }
};

export default {
  getAllUsers,
  getUserById,
  getUserByHandle,
  getUserIdByToken,
  createUser,
  deleteUserById
};