import { Topic, User } from '../models';

const getAllTopics = async () => {
  const topics = await Topic.findAll({
    include: [
      {
        model: User
      }
    ]
  });

  return topics;
};

const createTopic = async (topicInput: any) => {
  try {
    const newTopic = topicInput;

    const createdTopic = await Topic.create(newTopic);
    return createdTopic;
  } catch (err) {
    throw new Error(`error creating topic ${err}`);
  }
};

export default {
  getAllTopics,
  createTopic
};