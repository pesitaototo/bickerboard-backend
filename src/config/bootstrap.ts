import dotenv from 'dotenv';
import userService from '../services/userService';
import { NewTopicEntry, NewUserEntry } from '../utils/types';
import { Topic } from '../models';
import topicService from '../services/topicService';
dotenv.config();

const populateUser = async () => {
  const devUser: NewUserEntry = {
    username: 'devuser',
    password: 'devuserpassword',
    email: 'devuser@example.com'
  };
  await userService.createUser(devUser);
};

const populateTopic = async () => {
  const newTopic1: NewTopicEntry = {
    title: 'Post 1: The things I realized',
    body: 'Body: Stay tuned for a list of things I realized',
    userId: 1
  };

  const newTopic2: NewTopicEntry = {
    title: 'Post 2: Kula lou ulu',
    body: 'Pili ulu kukula',
    userId: 1
  };

  await topicService.createTopic(newTopic1);
  await topicService.createTopic(newTopic2);
};



// bootstrap development environment with data
const bootstrap = async() => {
  if (process.env.NODE_ENV === 'development') {
    await populateUser();
    await populateTopic();
  }
};

export default bootstrap;