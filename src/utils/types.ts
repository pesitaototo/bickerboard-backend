
interface BaseUserEntry {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
}

export type UserEntry = Omit<BaseUserEntry, 'passwordHash'>

export type NewUserEntry = Omit<BaseUserEntry, 'id'>