
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

interface BaseTopicEntry {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export type NewTopicEntry = Omit<BaseTopicEntry, 'id'>