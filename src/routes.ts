import { Router, Request, Response } from "express";
import { createRecipe, deleteRecipeById, getAllRecipes, getRecipeById, updateRecipeById } from "./controllers/recipeController";
import { loginUser, registerUser } from "./controllers/authcontroller";

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the API');
});

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);

router.post('/recipes', createRecipe);
router.get('/recipes', getAllRecipes);
router.get('/recipes/:id', getRecipeById);
router.put('/recipes/:id', updateRecipeById);
router.delete('/recipes/:id', deleteRecipeById);

export default router;