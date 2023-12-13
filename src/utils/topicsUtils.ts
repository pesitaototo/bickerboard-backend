import { NewTopicEntry } from './types';
import { isInt, isString } from './utilsCommon';

const parseUserId = (userId: unknown): number => {
  if (!isInt(userId)) {
    throw new Error('bad or missing userId');
  }

  return userId;
};

const parseString = (iStr: unknown, data: string): string => {
  if (!isString(iStr)) {
    throw new Error(`bad or missing ${data}`);
  }

  return iStr;
};

export const toNewTopicEntry = (object: unknown): NewTopicEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('bad user data');
  }

  if ('title' in object && 'body' in object && 'userId' in object) {
    const newTopic: NewTopicEntry = {
      title: parseString(object.title, 'title'),
      body: parseString(object.body, 'body'),
      userId: parseUserId(object.userId)
    };

    return newTopic;
  }

  throw new Error('bad topic data: a field is missing');
};