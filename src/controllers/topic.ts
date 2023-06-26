import express from 'express';
const router = express.Router();
import topicService from '../services/topicService';

// get all topics
router.get('/', async (_req, res) => {
  const topics = await topicService.getAllTopics();

  res.json(topics);
});

// get topic by id

// create new topic
router.post('/', async (req, res) => {
  const createdTopic = await topicService.createTopic(req.body);
  res.status(201).json(createdTopic);
});

// delete topic by id

export default router;