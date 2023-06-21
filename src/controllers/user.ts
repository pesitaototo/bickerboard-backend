import { Post, Topic, User } from '../models';
// import bcrypt from 'bcrypt';

import express from 'express';
import userService from '../services/userService';
const router = express.Router();
// const router = require('express').Router()

// get all users
router.get('/', async (_req, res) => {
  const users = userService.getAllUsers();
  // res.json(users)
  res.json(users);
});

// get user by id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const user = userService.getUserById(id);

  return user;
});

// create user
router.post('/', async (req, res) => {
  const createdUser = await userService.createUser(req.body);
  return res.status(201).json(createdUser);
});

// todo delete user

export default router;