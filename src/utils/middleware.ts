import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from './config';
import userService from '../services/userService';

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  // if ('message' in error) {
  //   return res.status(400).send({ error: error.message });
  // }

  if (error instanceof Error) {
    if (error.message === 'InsufficientPermission') {
      return res.status(403).send({ error: 'permission denied' });
    }

    if (error.message === 'topic id cannot be found') {
      return res.status(400).send({ error: error.message });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).send({ error: error.message });
    }

    // return res.status(400).send({ error: error.message });
  }

  res.status(500).send({ error: 'something unexpected happened' });

};

// following pattern from https://stackoverflow.com/a/68641439/19470043
// for extending type from a module
declare module 'express' {
  export interface Request extends Express.Request {
    token?: string;
  }
}

export const authorizeToken = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: 'missing token' });
  }

  if (token.toLowerCase().startsWith('bearer')) {
    token = token.substr(7);

    // verify token
    if (jwt.verify(token, SECRET)) {
      // verify user is not disabled
      const user = await userService.getUserById(
        Number(await userService.getUserIdByToken(token))
      );

      if (user && user.isEnabled) { 
        req.token = token;
        return next();
      }
    }
  }

  return res.status(403).json({ error: 'invalid or unauthorized token' });
};

// export const extractUserToken = (request: Request, _response: Response) => {
//   if (request.headers.authorization &&
//         request.headers.authorization.toLowerCase().includes('Bearer')) {
//     const token = request.headers.authorization.toLowerCase().substr(7);
//     if (jwt.verify(token, SECRET)) {
//       request.token = token;
//     }
//   }
// };