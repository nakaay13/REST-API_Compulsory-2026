import { Router, Request, Response } from "express";
import {
  createRecipe,
  deleteRecipeById,
  getAllRecipes,
  getRecipeById,
  updateRecipeById
} from "./controllers/recipeController";
import {
  loginUser,
  registerUser,
  verifyToken
} from "./controllers/AuthController";

const router: Router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - General
 *     summary: Welcome message
 *     description: Health check endpoint to verify that the API is running.
 *     responses:
 *       200:
 *         description: Welcome message for the API
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the API");
});

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new user account and stores the user credentials securely in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post("/user/register", registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login an existing user
 *     description: Authenticates a user using email and password and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Registered user email address
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: User logged in successfully and JWT token returned
 *       400:
 *         description: Invalid email or password
 */
router.post("/user/login", loginUser);

/**
 * @swagger
 * /recipes:
 *   post:
 *     tags:
 *       - Recipes
 *     summary: Create a recipe
 *     description: Creates a new recipe. Requires authentication via JWT token.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       401:
 *         description: Unauthorized – missing or invalid token
 */
router.post("/recipes", verifyToken, createRecipe);

/**
 * @swagger
 * /recipes:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Get all recipes
 *     description: Retrieves a list of all recipes stored in the database.
 *     responses:
 *       200:
 *         description: List of recipes returned successfully
 */
router.get("/recipes", getAllRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Get recipe by ID
 *     description: Retrieves a single recipe by its unique MongoDB ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ID of the recipe
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe found and returned
 *       404:
 *         description: Recipe not found
 */
router.get("/recipes/:id", getRecipeById);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     tags:
 *       - Recipes
 *     summary: Update recipe
 *     description: Updates an existing recipe by its ID. Requires authentication.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ID of the recipe to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       404:
 *         description: Recipe not found
 */
router.put("/recipes/:id", verifyToken, updateRecipeById);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     tags:
 *       - Recipes
 *     summary: Delete recipe
 *     description: Deletes a recipe by its ID. Requires authentication.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ID of the recipe to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *       404:
 *         description: Recipe not found
 */
router.delete("/recipes/:id", verifyToken, deleteRecipeById);

export default router;