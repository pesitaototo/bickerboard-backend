
interface BaseUserEntry {
  id: number;
  username: string;
  email: string;
  password: string;
}

export type UserEntryNoPassword = Omit<BaseUserEntry, 'password'>

export type NewUserEntry = Omit<BaseUserEntry, 'id'>

interface BaseTopicEntry {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export type NewTopicEntry = Omit<BaseTopicEntry, 'id'>