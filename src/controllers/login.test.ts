import supertest from 'supertest';
import app from '../index';

const api = supertest(app);

// todo: add some login tests