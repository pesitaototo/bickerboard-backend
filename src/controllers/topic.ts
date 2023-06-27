import express from 'express';
const router = express.Router();
import topicService from '../services/topicService';
import { authorizeToken } from '../utils/middleware';

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
router.post('/', authorizeToken, async (req, res) => {
  if (req.headers.authorization) {
    console.log(req.headers.authorization.substr(7));
  }
  const createdTopic = await topicService.createTopic(req.body);
  res.status(201).json(createdTopic);
});

// delete topic by id

export default router;