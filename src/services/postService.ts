import { Post, User } from '../models';
import { toNewPostEntry } from '../utils/postsUtils';
import { NewPostEntry } from '../utils/types';
import userService from './userService';

const getAllPosts = async () => {
  const posts = await Post.findAll({
    include: [
      {
        model: User
      }
    ]
  });

  if (posts.length === 0) {
    return {'posts': []};
  }

  return posts;
};

const getPostById = async (id: number) => {
  const post = await Post.findByPk(id);

  if (!post) {
    throw new Error('post not found');
  }

  return post;
};

const createPost = async(postInput: any) => {
  try {
    const newPost: NewPostEntry = toNewPostEntry(postInput);

    const createdPost: Post = await Post.create(newPost);
    return createdPost;
  } catch (err) {
    throw new Error(`error creating post ${err}`);
  }
};

// verify if the userId in the token matches the userId in the post
// if it matches, return post. Throw error otherwise
const getPostIfUserIsOwner = async (postId: number, token: string) => {
  const userId: number = await userService.getUserIdByToken(token);

  const post = await Post.findByPk(postId);
  if (!post || post.userId !== userId) {
    throw new Error('InsufficientPermission');
  }

  return post;
};

const editPostById = async (id: number, newBody: string, token: string) => {
  const postToEdit = await getPostIfUserIsOwner(id, token);

  const updatedPost = await postToEdit.update({
    body: newBody
  });

  return updatedPost;
};

const deletePostById = async (id: number, token: string) => {
  const postToDelete = await getPostIfUserIsOwner(id, token);

  await postToDelete.destroy();
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  editPostById,
  deletePostById
};