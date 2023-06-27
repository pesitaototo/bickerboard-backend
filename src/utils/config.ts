import dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.PROD_DATABASE_URL;

export const SECRET = process.env.SECRET || 'secret';

// console.log("env", process.env);