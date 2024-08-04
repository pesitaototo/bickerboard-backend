
interface BaseUserEntry {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface UserEntryNoPassword extends Omit<BaseUserEntry, 'password'> {
  isEnabled: boolean;
}

export type NewUserEntry = Omit<BaseUserEntry, 'id'>
export type NewUserEntryConfirmPassword = NewUserEntry & { passwordConfirm: string; }

interface BaseTopicEntry {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export type NewTopicEntry = Omit<BaseTopicEntry, 'id'>

interface BasePostEntry {
  id: number;
  body: string;
  userId: number;
  topicId: number;
}

export type NewPostEntry = Omit<BasePostEntry, 'id'>