import supertest from 'supertest';
import app from '../index';
import { connectToDatabase, rollbackMigration, sequelize } from '../utils/db';
import { User } from '../models';

const api = supertest(app)

// jest.setTimeout(15000)

beforeEach(async () => {
  await connectToDatabase()
})

afterEach(async () => {
  await rollbackMigration()
})

test('users api is reachable', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

describe('when a user exists', () => {
  beforeEach(async () => {
    await User.create({
      handle: 'testuser',
      email: 'test@test.com',
      passwordHash: 'password',
    })
  })

  test('cannot create a user with the same handle', async () => {
    const newUser = {
      handle: 'testuser',
      email: 'another@test.com',
      password: 'testpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('handle must be unique')

  })
})

describe('when a user does not exist', () => {
  test('we can create a user with a post request', async () => {
    const newUser = {
      handle: 'testpost',
      email: 'testemail@example.com',
      password: 'talofalava',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(1)
    expect(response.body[0].handle).toContain('testpost')
    expect(response.body[0].email).toContain('testemail@example.com')
  })
})

afterAll( async() => {
  await rollbackMigration()
  await sequelize.close()
})

