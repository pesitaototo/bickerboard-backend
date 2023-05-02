import { Post, Topic, User } from "../models"

const router = require('express').Router()

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
  res.json(users)
})