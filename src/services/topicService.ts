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

const getTopicById = async (id: number) => {
  const topic = await Topic.findByPk(id);

  if (!topic) {
    throw new Error('topic id cannot be found');
  }

  return topic;
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

const editTopicById = async (id: number, newBody: string) => {
  const topicToChange = await getTopicById(id);

  const updatedTopic = await topicToChange.update({
    body: newBody
  });

  return updatedTopic;
};

const deleteTopicById = async (id: number) => {
  await Topic.destroy({
    where: { id }
  });

};

export default {
  getAllTopics,
  getTopicById,
  createTopic,
  editTopicById,
  deleteTopicById
};