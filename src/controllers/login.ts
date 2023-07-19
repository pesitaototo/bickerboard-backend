import express from 'express';
import loginService from '../services/loginService';
// import loginService from '../services/loginService';
const router = express.Router();

// login user
router.post('/', async (req, res) => {
  const { handle, password } = req.body;

  const token = await loginService.verifyLogin(handle, password);

  if (!token) {
    return res.status(401).json({ error: 'incorrect username or password' });
  }

  res.status(200).send({ token });

});

export default router;