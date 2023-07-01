import express, { Request, Response } from 'express';
import userService from '../services/userService';
import { authorizeToken } from '../utils/middleware';
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
// todo: send email verification to user email before enabling their account
// captcha protect endpoint to prevent abuse
router.post('/', async (req, res) => {
  const createdUser = await userService.createUser(req.body);
  res.status(201).json(createdUser);
});

router.delete('/:id', authorizeToken, async (req: Request, res: Response) => {
  if (!req.token) return;
  const id = Number(req.params.id);

  await userService.deleteUserById(id, req.token);

  res.status(204).end();
});

export default router;