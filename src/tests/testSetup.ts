import express from 'express';
import dotenvFlow from 'dotenv-flow';
import mongoose from 'mongoose';
import routes from '../routes';
import { UserModel } from '../models/userModel';
import { RecipeModel } from '../models/recipeModel';

dotenvFlow.config();

export async function createTestApp() {
  process.env.NODE_ENV = 'test';

  const app = express();
  app.use(express.json());
  app.use('/api', routes);

  const dbUri = process.env.DBHOST_TEST;
  if (!dbUri) throw new Error('DBHOST_TEST environment variable not set');

  await mongoose.connect(dbUri);
  await UserModel.deleteMany({});
  await RecipeModel.deleteMany({});

  async function teardown() {
    try {
      if (mongoose.connection.readyState === 1) {
        await UserModel.deleteMany({});
        await RecipeModel.deleteMany({});
      }
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch (error) {
      // swallow cleanup errors
      // eslint-disable-next-line no-console
      console.error('Cleanup warning:', error);
    }
  }

  return { app, teardown };
}
