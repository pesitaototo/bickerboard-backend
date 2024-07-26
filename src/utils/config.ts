import dotenv from 'dotenv';
dotenv.config();

//  DATABASE_URL;

// if (process.env.NODE_ENV === 'test') {
//   DATABASE_URL = process.env.DEV_DATABASE_URL
// }

export const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.PROD_DATABASE_URL;

export const SECRET = process.env.SECRET || 'secret';

// console.log("env", process.env);