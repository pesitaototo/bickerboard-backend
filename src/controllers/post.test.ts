import supertest from 'supertest';
import app from '../index';
import { connectToDatabase, rollbackMigration } from '../utils/db';
import { Post, Topic, User } from '../models';

const api = supertest(app);

let token = '';
beforeAll(async () => {
  await connectToDatabase();

  await User.sync({ force: true });

  await api
    .post('/api/users')
    .send({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password',
    });
  
  const response = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'password'
    });

  token = response.body.token;
});

afterAll(async () => {
  await rollbackMigration();
});

describe('when a post exists and a user does not have a valid token', () => {
  beforeEach(async () => {
    await Post.sync({ force: true });

    await Topic.create({
      title: 'The tale of two cities',
      body: 'Once upon a time...',
      userId: 1,
    });

    await Post.create({
      body: 'I heard this story before',
      userId: 1,
      topicId: 1,
    });
  });

  test('can view list of posts', async () => {
    const result = await api
      .get('/api/posts')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body[0].body).toContain('I heard this story before');
  });

  test('can view a post by id', async () => {
    const result = await api
      .get('/api/posts/1')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body.body).toContain('I heard this story before');
  });

  test('cannot create a post', async () => {
    const newPost = {
      body: 'I should not be able to create this post',
      userId: 1
    };

    const response = await api
      .post('/api/topics/1/new')
      .send(newPost)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('missing token');

    const result = await api
      .get('/api/posts')
      .expect('Content-Type', /application\/json/);

    expect(result.body).toHaveLength(1);
  });

  test('cannot delete a post', async () => {
    await api
      .delete('/api/posts/1')
      .expect(403)
      .expect('Content-Type', /application\/json/);

    const result = await api
      .get('/api/posts')
      .expect('Content-Type', /application\/json/);

    expect(result.body).toHaveLength(1);
  });

  test('cannot edit a post', async () => {
    const editedPost = {
      body: 'I edited this post'
    };

    await api
      .put('/api/posts/1')
      .send(editedPost)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    const result = await api
      .get('/api/posts/1')
      .expect('Content-Type', /application\/json/);

    expect(result.body.body).toContain('I heard this story before');
  });
});

describe('when user has a valid token', () => {
  beforeEach(async () => {
    // await User.sync({ force: true });
    await Post.sync({ force: true });
  });

  test('can create own post', async () => {
    await api
      .post('/api/topics/1/new')
      .send({
        body: 'I created new post in topic 1'
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const result = await api
      .get('/api/posts')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body).toHaveLength(1);
    expect(result.body[0].body).toContain('I created new post in topic 1');

  });

  describe('when user has an existing post', () => {
    beforeEach(async () => {
      await Post.sync({ force: true });
      await api
        .post('/api/topics/1/new')
        .send({
          body: 'I created new post in topic 1'
        })
        .set('Authorization', `Bearer ${token}`);
    });

    test('user can edit own post body', async () => {
      await api
        .put('/api/posts/1')
        .send({
          body: 'We can change body, though'
        })
        .set('Authorization', `Bearer ${token}`);
      const result = await api
        .get('/api/posts/1')
        .expect(200)
        .expect('Content-Type', /application\/json/);
      expect(result.body.body).toContain('We can change body, though');
    });

    test('user can delete own post', async () => {
      await api
        .delete('/api/posts/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
      const result = await api
        .get('/api/posts/1')
        .expect(400)
        .expect('Content-Type', /application\/json/);
      expect(result.body.title).toBeUndefined();
      // expect(result.body.error).toContain('post id cannot be found');
      const listOfPosts = await api
        .get('/api/posts')
        .expect(200)
        .expect('Content-Type', /application\/json/);
      expect(listOfPosts.body).toHaveLength(0);
    });

    describe('other users', () => {
      let anotherToken = '';
      beforeEach(async () => {
        await api
          .post('/api/users')
          .send({
            username: 'anotheruser',
            email: 'anotheruser@example.com',
            password: 'anotherpassword'
          });
        const response = await api
          .post('/api/login')
          .send({
            username: 'anotheruser',
            password: 'anotherpassword'
          });
        anotherToken = response.body.token;
      });

      test ('cannot delete user\'s post', async () => {
        const result = await api
          .delete('/api/posts/1')
          .set('Authorization', `Bearer ${anotherToken}`)
          .expect(403)
          .expect('Content-Type', /application\/json/);
        expect(result.body.error).toContain('permission denied');
        const posts = await api
          .get('/api/posts')
          .expect(200)
          .expect('Content-Type', /application\/json/);
        expect(posts.body).toHaveLength(1);
        expect(posts.body[0].body).toContain('I created new post in topic 1');
      });

      test('cannot edit user\'s post', async () => {
        const result = await api
          .put('/api/posts/1')
          .send({
            body: 'Totally new body'
          })
          .set('Authorization', `Bearer ${anotherToken}`)
          .expect(403)
          .expect('Content-Type', /application\/json/);
        expect(result.body.error).toContain('permission denied');
        const posts = await api
          .get('/api/posts/1')
          .expect(200)
          .expect('Content-Type', /application\/json/);
        expect(posts.body.body).not.toContain('Totally new body');
      });
    });
  });
});