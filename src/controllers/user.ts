import { Post, Topic, User } from '../models';
import bcrypt from 'bcrypt';

import express from 'express'
import { toNewUserEntry } from '../utils/utils';
import userService from '../services/userService';
const router = express.Router()
// const router = require('express').Router()

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Post
      },
      {
        model: Topic
      }
    ]
  })
  // res.json(users)
  res.json(users)
})

router.post('/', async (req, res) => {
  // const password = req.body.password;
  // const passwordHash = await bcrypt.hash(password, 10)
  // console.log(passwordHash);

  const newUserEntry = toNewUserEntry(req.body)
  const createdUser = await userService.createUser(newUserEntry)
  return res.status(201).json(createdUser)
})

export default router