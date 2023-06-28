import supertest from 'supertest';
import app from '../index';
import { connectToDatabase, rollbackMigration } from '../utils/db';
import { Topic, User } from '../models';

const api = supertest(app);

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  await rollbackMigration();
});

describe('when a topic exists and a user does not have a valid token', () => {
  beforeAll(async () => {
    await User.create({
      handle: 'testuser',
      email: 'test@test.com',
      passwordHash: 'password',
    });
    await Topic.create({
      title: 'The tale of two cities',
      body: 'Once upon a time...',
      userId: 1
    });
  });
  
  test('can view list of topics', async () => {
    const result = await api
      .get('/api/topics')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body[0].title).toContain('The tale of two cities');
    expect(result.body[0].body).toContain('Once upon a time...');
  });

  test('can view a topic by id', async () => {
    const result = await api
      .get('/api/topics/1')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body.title).toContain('The tale of two cities');
    expect(result.body.body).toContain('Once upon a time...');
  });

  test('cannot create a topic', async () => {
    const newTopic = {
      title: 'New topic',
      body: 'I should not be able to create this topic',
      userId: 1
    };

    const response = await api
      .post('/api/topics')
      .send(newTopic)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('missing token');

    const result = await api
      .get('/api/topics')
      .expect('Content-Type', /application\/json/);

    expect(result.body).toHaveLength(1);
  });

  test('cannot delete a topic', async () => {
    await api
      .delete('/api/topics/1')
      .expect(403)
      .expect('Content-Type', /application\/json/);
    
    const result = await api
      .get('/api/topics')
      .expect('Content-Type', /application\/json/);
    
    expect(result.body).toHaveLength(1);
  });

  test('cannot edit a topic', async () => {
    const editedTopic = {
      body: 'I edited this topic'
    };

    await api
      .put('/api/topics/1')
      .send(editedTopic)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    const result = await api
      .get('/api/topics/1')
      .expect('Content-Type', /application\/json/);

    expect(result.body.body).toContain('Once upon a time...');
    expect(result.body.title).toContain('The tale of two cities');
  });
});

// describe('when a user has a valid token', () => {
//   test('can create own topic', async () => {

//   });

//   test('can edit own topic', async () => {

//   });

//   test('can delete own topic', async () => {

//   });

//   test ('can not delete other user topic', async () => {

//   });

//   test('can not edit other user topic', async () => {

//   });
// })