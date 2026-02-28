import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';

/**
 * Sets up Swagger documentation for the API.
 * @param app - The Express application instance.
 */
export function setupDocumentation(app: Application) {
    const swaggerDefinition = {
        openapi: '3.0.0',
        info: {
            title: 'Recipe API',
            version: '1.0.0',
            description: 'API documentation for the Recipe API',
        },
        servers: [
            {
                url: 'http://localhost:4000/api/',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'auth-token',
                }
            },
            schemas: {
                Recipe: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        imageUrl: { type: 'string' },
                        description: { type: 'string' },
                        ingredients: { type: 'array', items: { type: 'string' } },
                        instructions: { type: 'array', items: { type: 'string' } },
                        _createdBy: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        registeredAt: { type: 'string', format: 'date-time' },
                    }
                }
            }
        }
    };
  const options = {
    swaggerDefinition,
    apis: ['**/*.ts']
  }

  const swaggerSpec = swaggerJSDoc(options);

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}