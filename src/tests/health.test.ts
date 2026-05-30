import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Application } from 'express';
import { createTestApp } from './testSetup';

describe('Health Check', () => {
  let app: Application;
  let teardown: () => Promise<void>;

  beforeAll(async () => {
    const res = await createTestApp();
    app = res.app;
    teardown = res.teardown;
  });

  afterAll(async () => {
    if (teardown) await teardown();
  });

  it('should return welcome message on root path', async () => {
    const response = await request(app).get('/api/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Welcome to the API');
  });
});
