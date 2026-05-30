import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createTestApp } from './testSetup';

describe('User Registration & Authentication', () => {
  let app: any;
  let teardown: () => Promise<void>;

  beforeAll(async () => {
    const res = await createTestApp();
    app = res.app;
    teardown = res.teardown;
  });

  afterAll(async () => {
    if (teardown) await teardown();
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('error', null);
    expect(response.body).toHaveProperty('data');
  });

  it('should reject duplicate email on registration', async () => {
    const response = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Test User 2',
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should login successfully with correct credentials', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('error', null);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user).toHaveProperty('id');
    expect(response.body.data.user).toHaveProperty('email', 'testuser@example.com');
  });

  it('should reject login with incorrect password', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should reject login with non-existent user', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});
