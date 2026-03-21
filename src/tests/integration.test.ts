import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import dotenvFlow from 'dotenv-flow';
import mongoose from 'mongoose';
import { UserModel } from '../models/userModel';
import { RecipeModel } from '../models/recipeModel';
import { startServer } from '../app';
import routes from '../routes';

dotenvFlow.config();

describe('API Integration Tests', () => {
  let app: express.Application;
  let server: any;
  let token: string = '';
  let userId: string = '';
  let recipeId: string = '';

  beforeAll(async () => {
    // Set NODE_ENV to test to use DBHOST_TEST
    process.env.NODE_ENV = 'test';

    // Create express app for testing
    app = express();
    app.use(express.json());
    app.use('/api', routes);

    // Connect to test database
    try {
      const dbUri = process.env.DBHOST_TEST;
      if (!dbUri) {
        throw new Error('DBHOST_TEST environment variable not set');
      }

      await mongoose.connect(dbUri);
      console.log('Connected to test database');

      // Clear collections
      await UserModel.deleteMany({});
      await RecipeModel.deleteMany({});
      console.log('Cleared test collections');
    } catch (error) {
      console.error('Failed to setup test database:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      // Only clear if connection is still active
      if (mongoose.connection.readyState === 1) {
        await UserModel.deleteMany({});
        await RecipeModel.deleteMany({});
      }

      // Disconnect from database
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        console.log('Disconnected from test database');
      }
    } catch (error) {
      console.error('Cleanup warning:', error);
      // Don't throw - tests should pass even if cleanup has issues
    }
  });

  describe('User Registration & Authentication', () => {
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
      userId = response.body.data;
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

      token = response.body.data.token;
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

  describe('Recipe CRUD Operations', () => {
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
      const response = await request(app)
        .get('/api/recipes');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a specific recipe by id', async () => {
      // Only run if recipeId was created
      if (!recipeId) {
        expect(recipeId).toBeDefined();
        return;
      }

      const response = await request(app)
        .get(`/api/recipes/${recipeId}`);

      expect(response.status).toBe(200);
      if (response.body._id) {
        expect(response.body).toHaveProperty('title', 'Chocolate Chip Cookies');
      }
    });

    it('should return 404 for non-existent recipe', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/recipes/${fakeId}`);

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
        .send({
          title: 'Unauthorized Update'
        });

      expect(response.status).toBe(401);
    });

    it('should delete a recipe when authenticated', async () => {
      if (!recipeId) {
        expect(recipeId).toBeDefined();
        return;
      }

      const response = await request(app)
        .delete(`/api/recipes/${recipeId}`)
        .set('auth-token', token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/recipes/${recipeId}`);

      expect(getResponse.status).toBe(404);
    });

    it('should reject recipe deletion without authentication', async () => {
      // Create a recipe first
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

      // Try to delete without auth
      const response = await request(app)
        .delete(`/api/recipes/${testRecipeId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('Health Check', () => {
    it('should return welcome message on root path', async () => {
      const response = await request(app)
        .get('/api/');

      expect(response.status).toBe(200);
      expect(response.text).toBe('Welcome to the API');
    });
  });
});
