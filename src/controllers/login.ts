import express from 'express';
import loginService from '../services/loginService';
// import loginService from '../services/loginService';
const router = express.Router();

// login user
router.post('/', async (req, res) => {
  const { handle, password } = req.body;
  
  console.log(req.body);
  console.log(handle);

  const token = await loginService.verifyLogin(handle, password);

  res.send({ token });

});

export default router;