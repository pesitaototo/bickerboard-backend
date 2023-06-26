import { Post, Topic, User } from '../models';
// import bcrypt from 'bcrypt';

import express from 'express';
import userService from '../services/userService';
const router = express.Router();
// const router = require('express').Router()

// get all users
router.get('/', async (_req, res) => {
  const users = await userService.getAllUsers();
  // res.json(users)
  res.json(users);
});

// get user by id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const user = await userService.getUserById(id);

  res.json(user);
});

// create user
router.post('/', async (req, res) => {
  const createdUser = await userService.createUser(req.body);
  res.status(201).json(createdUser);
});

// todo delete user
// router.delete('/:id', async (req, res) => {
//   const id = Number(req.params.id);

//   await userService.deleteUserById(id);
// });

export default router;