import { Post, Topic, User } from '../models'

import express from 'express'
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
  res.json({hello: 'hello', users: users})
})

router.post('/', async (req, res) => {
  const { handle: string, email: string, password: string } = req.body

  const newUser = {
    handle,
    email,
    password
  }
})

export default router