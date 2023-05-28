import { NextFunction, Request, Response } from 'express';

export const errorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
  if ('message' in error) {
    return response.status(400).send({ error: error.message });
  }

  response.status(500).send({ error: 'something unexpected happened' });

};