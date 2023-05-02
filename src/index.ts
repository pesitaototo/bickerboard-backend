import express from 'express'
import usersRouter from './controllers/user';
import { connectToDatabase } from './utils/db';

const app = express()

app.use('/api/users', usersRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(3001, () => {
    console.log('Server started');
  })
}

start()