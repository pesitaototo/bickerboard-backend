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

describe('when a user exists', () => {
  let token = '';
  beforeEach(async () => {
    await User.sync({ force: true });
    await api
      .post('/api/users')
      .send({
        handle: 'testuser',
        email: 'test@test.com',
        password: 'password',
      });
    const response = await api
      .post('/api/login')
      .send({
        handle: 'testuser',
        password: 'password'
      });
    token = response.body.token;
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

  test('user can own delete account', async () => {
    await api
      .delete('/api/users/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(users.body).toHaveLength(0);
  });

  test('other user cannot delete user', async () => {
    // create another user
    await api
      .post('/api/users')
      .send({
        handle: 'newuser',
        email: 'test2@test.com',
        password: 'newuserpass123',
      })
      .expect(201);
    // generate token for new user
    let user2Token = '';
    const response = await api
      .post('/api/login')
      .send({
        handle: 'newuser',
        password: 'newuserpass123'
      })
      .expect(200);
    user2Token = response.body.token;
    // send delete request for another user
    await api
      .delete('/api/users/1')
      .set('Authorization', `Bearer ${user2Token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);
    const users = await api
      .get('/api/users')
      .expect(200);
    expect(users.body).toHaveLength(2);
    expect(users.body[1].handle).toContain('testuser');
  });

  test('when user is deleted, all topics by user is also deleted', async () => {
    // create some topics
    await api
      .post('/api/topics')
      .send({
        title: 'Le tolotolo i matautu',
        body: 'Ma le penisula i mulinuu'
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const topicsBeforeDelete = await api.get('/api/topics');
    expect(topicsBeforeDelete.body).toHaveLength(1);
    expect(topicsBeforeDelete.body[0].title).toContain('Le tolotolo i matautu');
    // delete user
    await api
      .delete('/api/users/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const users = await api.get('/api/users');
    expect(users.body).toHaveLength(0);

    const topicsAfterDelete = await api.get('/api/topics');
    expect(topicsAfterDelete.body).toHaveLength(0);
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

  // test('we can NOT create a user with username more than 20 characters', async () => {
  //   const newUser = {
  //     handle: 'abcdefghijklmnopqrstuvwxyz',
  //     email: 'testemail@example.com',
  //     password: 'thisismypassword',
  //   };

  //   const result = await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(400)
  //     .expect('Content-Type', /application\/json/);

  //   expect(result.body.error).toContain('Username can only be 20 characters');
  // });

});

afterAll( async() => {
  await rollbackMigration();
  await sequelize.close();
});

