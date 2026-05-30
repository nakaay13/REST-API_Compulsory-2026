import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createTestApp } from './testSetup';

describe('Recipe CRUD Operations', () => {
  let app: any;
  let teardown: () => Promise<void>;
  let token = '';
  let userId = '';
  let recipeId = '';

  beforeAll(async () => {
    const res = await createTestApp();
    app = res.app;
    teardown = res.teardown;

    // create user and login to get token
    const register = await request(app)
      .post('/api/user/register')
      .send({ name: 'Recipe User', email: 'recipeuser@example.com', password: 'password123' });

    userId = register.body.data;

    const login = await request(app)
      .post('/api/user/login')
      .send({ email: 'recipeuser@example.com', password: 'password123' });

    token = login.body.data.token;
  });

  afterAll(async () => {
    if (teardown) await teardown();
  });

  it('should create a recipe when authenticated', async () => {
    const response = await request(app)
      .post('/api/recipes')
      .set('auth-token', token)
      .send({
        title: 'Chocolate Chip Cookies',
        imageUrl: 'https://example.com/cookies.jpg',
        description: 'Delicious homemade chocolate chip cookies that are soft and chewy with rich chocolate.',
        ingredients: ['flour', 'butter', 'sugar', 'eggs', 'chocolate chips'],
        instructions: ['Mix ingredients', 'Bake at 350F for 12 minutes', 'Cool and serve'],
        _createdBy: userId
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('title', 'Chocolate Chip Cookies');
    recipeId = response.body._id;
  });

  it('should reject recipe creation without authentication', async () => {
    const response = await request(app)
      .post('/api/recipes')
      .send({
        title: 'Pasta',
        imageUrl: 'https://example.com/pasta.jpg',
        description: 'Delicious italian pasta with fresh tomatoes and basil sauce.',
        ingredients: ['pasta', 'tomato sauce', 'garlic'],
        instructions: ['Boil pasta', 'Add sauce', 'Serve']
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  it('should get all recipes', async () => {
    const response = await request(app).get('/api/recipes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a specific recipe by id', async () => {
    if (!recipeId) {
      expect(recipeId).toBeDefined();
      return;
    }

    const response = await request(app).get(`/api/recipes/${recipeId}`);
    expect(response.status).toBe(200);
    if (response.body._id) {
      expect(response.body).toHaveProperty('title', 'Chocolate Chip Cookies');
    }
  });

  it('should return 404 for non-existent recipe', async () => {
    const fakeId = '000000000000000000000000';
    const response = await request(app).get(`/api/recipes/${fakeId}`);
    expect(response.status).toBe(404);
  });

  it('should update a recipe when authenticated', async () => {
    if (!recipeId) {
      expect(recipeId).toBeDefined();
      return;
    }

    const response = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .set('auth-token', token)
      .send({
        title: 'Updated Chocolate Chip Cookies',
        imageUrl: 'https://example.com/cookies-updated.jpg',
        description: 'Even more delicious chocolate chip cookies with premium ingredients.',
        ingredients: ['flour', 'butter', 'brown sugar', 'eggs', 'dark chocolate chips'],
        instructions: ['Mix ingredients', 'Bake at 350F for 13 minutes', 'Cool and enjoy'],
        _createdBy: userId
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('should reject recipe update without authentication', async () => {
    if (!recipeId) {
      expect(recipeId).toBeDefined();
      return;
    }

    const response = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .send({ title: 'Unauthorized Update' });

    expect(response.status).toBe(401);
  });

  it('should delete a recipe when authenticated', async () => {
    if (!recipeId) {
      expect(recipeId).toBeDefined();
      return;
    }

    const response = await request(app).delete(`/api/recipes/${recipeId}`).set('auth-token', token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');

    const getResponse = await request(app).get(`/api/recipes/${recipeId}`);
    expect(getResponse.status).toBe(404);
  });

  it('should reject recipe deletion without authentication', async () => {
    const createResponse = await request(app)
      .post('/api/recipes')
      .set('auth-token', token)
      .send({
        title: 'Test Recipe',
        imageUrl: 'https://example.com/test.jpg',
        description: 'A test recipe for deletion with sufficient length for validation.',
        ingredients: ['ingredient1', 'ingredient2'],
        instructions: ['step1', 'step2'],
        _createdBy: userId
      });

    if (createResponse.status !== 201) {
      expect(createResponse.status).toBe(201);
      return;
    }

    const testRecipeId = createResponse.body._id;

    const response = await request(app).delete(`/api/recipes/${testRecipeId}`);
    expect(response.status).toBe(401);
  });
});
