import express, { Request, Response } from 'express';
const router = express.Router();
import topicService from '../services/topicService';
import { authorizeToken } from '../utils/middleware';
import userService from '../services/userService';
import postService from '../services/postService';
import { NewPostEntry, NewTopicEntry } from '../utils/types';

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

// create new topic
router.post('/', authorizeToken, async (req: Request, res: Response) => {
  if (!req.token) return;

  const userId = await userService.getUserIdByToken(req.token);

  const newTopic: NewTopicEntry = {
    title: req.body.title,
    body: req.body.body,
    userId
  };

  const createdTopic = await topicService.createTopic(newTopic);
  res.status(200).json(createdTopic);
});

// create new post for topic by id
router.post('/:topicId/new', authorizeToken, async (req: Request, res: Response) => {
  if (!req.token) return;
  const topicId = Number(req.params.topicId);

  const userId = await userService.getUserIdByToken(req.token);

  const newPost: NewPostEntry = {
    body: req.body.body,
    topicId,
    userId
  };

  const createdPost = await postService.createPost(newPost);
  res.status(200).json(createdPost);
});

// user should only be able to edit topic body submission
router.put('/:id', authorizeToken, async (req: Request, res: Response) => {
  if (!req.token) return;
  const topicId = Number(req.params.id);
  const body = req.body.body;

  const updatedTopic = await topicService.editTopicById(topicId, body, req.token);

  res.status(200).json(updatedTopic);
});

// delete topic by id
router.delete('/:id', authorizeToken, async (req: Request, res: Response) => {
  if (!req.token) return;
  const topicId = Number(req.params.id);

  await topicService.deleteTopicById(topicId, req.token);

  res.status(204).end();
});

export default router;