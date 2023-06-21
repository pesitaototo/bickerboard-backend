import supertest from 'supertest';
import app from '../index';
import { connectToDatabase, rollbackMigration, sequelize } from '../utils/db';
import { User } from '../models';

const api = supertest(app);

// jest.setTimeout(15000)

beforeEach(async () => {
  await connectToDatabase();
});

afterEach(async () => {
  await rollbackMigration();
});

test('users api is reachable', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

describe('when a user exists', () => {
  beforeEach(async () => {
    await User.create({
      handle: 'testuser',
      email: 'test@test.com',
      passwordHash: 'password',
    });
  });

  test('cannot create a user with the same handle', async () => {
    const newUser = {
      handle: 'testuser',
      email: 'another@test.com',
      password: 'testpassword'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('handle must be unique');

  });
});

describe('when a user does not exist', () => {
  test('we can create a user with a password that is at least 8 characters', async () => {
    const newUser = {
      handle: 'testuser1',
      email: 'testemail@example.com',
      password: 'talofalava',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/users');

    expect(response.body).toHaveLength(1);
    expect(response.body[0].handle).toContain('testuser1');
    expect(response.body[0].email).toContain('testemail@example.com');
  });

  test('we can NOT create a user with password less than 8 characters', async () => {
    const newUser = {
      handle: 'testuser2',
      email: 'testemail@example.com',
      password: 'hello',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password must contain at least 8 characters');
  });

  test('we can NOT create a user with username more than 20 characters', async () => {
    const newUser = {
      handle: 'abcdefghijklmnopqrstuvwxyz',
      email: 'testemail@example.com',
      password: 'thisismypassword',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Username can only be 20 characters');
  });

});

afterAll( async() => {
  await rollbackMigration();
  await sequelize.close();
});

