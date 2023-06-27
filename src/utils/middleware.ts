import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from './config';

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  if ('message' in error) {
    return res.status(400).send({ error: error.message });
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

export const authorizeToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(500).json({ error: 'missing token' });
  }

  if (token.toLowerCase().startsWith('bearer')) {
    token = token.substr(7);

    // verify token
    const decodedToken = jwt.verify(token, SECRET);

    if (decodedToken) {
      req.token = token;
      return next();
    }
  }

  throw new Error('invalid token');
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