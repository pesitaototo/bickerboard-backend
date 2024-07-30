import express, { ErrorRequestHandler } from 'express';
import 'express-async-errors'; // must be imported before creating any express.Router objects
import usersRouter from './controllers/user';
import postsRouter from './controllers/post';
import topicsRouter from './controllers/topic';
import { connectToDatabase, rollbackMigration } from './utils/db';
import { authorizeToken, errorHandler } from './utils/middleware';
import loginRouter from './controllers/login';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerOutput from '../swagger_output.json';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use('/api/login', loginRouter);
// app.use(authorizeToken);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/topics', topicsRouter);
app.use(errorHandler as ErrorRequestHandler);

const start = async () => {
  if (process.env.NODE_ENV !== 'test') {
    await connectToDatabase();
    app.listen(3001, () => {
      console.log('Server started');
    });
    // await rollbackMigration();
  }
};

start();


export default app;