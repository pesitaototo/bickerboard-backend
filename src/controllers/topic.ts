import express, { Request, Response } from 'express';
const router = express.Router();
import topicService from '../services/topicService';
import { authorizeToken } from '../utils/middleware';
import userService from '../services/userService';

// get all topics
router.get('/', async (_req, res) => {
  const topics = await topicService.getAllTopics();

  res.json(topics);
});

// get topic by id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const topic = await topicService.getTopicById(id);

  res.json(topic);
});

// following pattern from https://stackoverflow.com/a/68641439/19470043
// for extending type from a module
// declare module 'express' {
//   export interface Request extends Express.Request {
//     token?: string;
//   }
// }

// create new topic
router.post('/', authorizeToken, async (req: Request, res: Response) => {
  if (!req.token) {
    throw new Error('invalid token');
  }
  const userId = await userService.getUserIdByToken(req.token);

  const newTopic = {
    ...req.body,
    userId: userId
  };

  const createdTopic = await topicService.createTopic(newTopic);
  res.status(201).json(createdTopic);
});

// delete topic by id

export default router;