import { NewPostEntry } from './types';
import { isInt, isString } from './utilsCommon';

const parseInt = (iInt: unknown, data: string): number => {
  if (!isInt(iInt)) {
    throw new Error(`bad or missing ${data}`);
  }

  return iInt;
};

const parseString = (iStr: unknown, data: string): string => {
  if (!isString(iStr)) {
    throw new Error(`bad or missing ${data}`);
  }

  return iStr;
};

export const toNewPostEntry = (object: unknown): NewPostEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('bad user data');
  }

  if ('body' in object && 'userId' in object && 'topicId' in object) {
    const newPost: NewPostEntry = {
      body: parseString(object.body, 'body'),
      userId: parseInt(object.userId, 'userId'),
      topicId: parseInt(object.topicId, 'topicId')
    };

    return newPost;
  }
  console.log(object);

  throw new Error('bad post data: a field is missing');
};