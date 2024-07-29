import express, { Request, Response } from 'express';
import loginService from '../services/loginService';
// import loginService from '../services/loginService';
const router = express.Router();

// login user
router.post('/', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const token = await loginService.verifyLogin(username, password);

  if (!token) {
    return res.status(401).json({ error: 'incorrect username or password' });
  }

  res.status(200).send({ token });

});

export default router;