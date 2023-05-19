import express, { ErrorRequestHandler } from 'express'
import 'express-async-errors' // must be imported before creating any express.Router objects
import usersRouter from './controllers/user';
import { connectToDatabase } from './utils/db';
import { errorHandler } from './utils/middleware';

const app = express()
app.use(express.json())


app.use('/api/users', usersRouter)
app.use(errorHandler as ErrorRequestHandler)

const start = async () => {
  if (process.env.NODE_ENV !== 'test') {
    await connectToDatabase()
    app.listen(3001, () => {
      console.log('Server started');
    })
  }
}

start()


export default app