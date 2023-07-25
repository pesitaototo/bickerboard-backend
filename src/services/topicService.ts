import { Topic, User } from '../models';
import { NewTopicEntry } from '../utils/types';
import userService from './userService';

const getAllTopics = async () => {
  const topics = await Topic.findAll({
    include: [
      {
        model: User
      }
    ]
  });

  if (topics.length === 0) {
    return {'topics': []};
  }

  return topics;
};

const getTopicById = async (id: number) => {
  const topic = await Topic.findByPk(id);

  if (!topic) {
    throw new Error('topic not found');
  }

  return topic;
};

const createTopic = async (topicInput: NewTopicEntry) => {
  try {
    const createdTopic = await Topic.create(topicInput);
    return createdTopic;
  } catch (err) {
    throw new Error(`error creating topic ${err}`);
  }
};

// verify if the userId in the token matches the userId in the topic
// if it matches, return topic. Throw error otherwise
const getTopicIfUserIsOwner = async (topicId: number, token: string) => {
  const userId: number = await userService.getUserIdByToken(token);

  const topic = await Topic.findByPk(topicId);
  if (!topic || topic.userId !== userId) {
    throw new Error('InsufficientPermission');
  }

  return topic;
};

const editTopicById = async (id: number, newBody: string, token: string) => {
  const topicToEdit = await getTopicIfUserIsOwner(id, token);

  const updatedTopic = await topicToEdit.update({
    body: newBody
  });

  return updatedTopic;
};

const deleteTopicById = async (id: number, token: string) => {
  const topicToDelete = await getTopicIfUserIsOwner(id, token);

  await topicToDelete.destroy();
};

export default {
  getAllTopics,
  getTopicById,
  createTopic,
  editTopicById,
  deleteTopicById
};