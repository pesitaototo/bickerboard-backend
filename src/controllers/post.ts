import express, { Request, Response } from 'express';
const router = express.Router();
import postService from '../services/postService';
import { authorizeToken } from '../utils/middleware';
import userService from '../services/userService';

// get all posts
router.get('/', async (_req, res) => {
  const posts = await postService.getAllPosts();

  res.json(posts);
});

// get post by id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const post = await postService.getPostById(id);

  res.json(post);
});

// create new post
router.post('/', authorizeToken, async (req: Request, res: Response) => {
  if (!req.token) return;

  const userId = await userService.getUserIdByToken(req.token);

  const newPost = {
    ...req.body,
    userId: userId
  };

  const createdPost = await postService.createPost(newPost);
  res.status(200).json(createdPost);
});

// user should only be able to edit post body
router.put('/:id', authorizeToken, async (req: Request, res: Response) => {
  if (!req.token) return;
  const postId = Number(req.params.id);
  const body = req.body.body;

  const updatedPost = await postService.editPostById(postId, body, req.token);

  res.status(200).json(updatedPost);
});

// delete post by id
router.delete('/:id', authorizeToken, async (req: Request, res: Response) => {
  if (!req.token) return;
  const postId = Number(req.params.id);

  await postService.deletePostById(postId, req.token);

  res.status(204).end();
});

export default router;