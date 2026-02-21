import { Router, Request, Response } from "express";
import { createRecipe, getAllRecipes, getRecipeById, updateRecipeById } from "./controllers/recipeController";

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the API');
});

router.post('/recipes', createRecipe);
router.get('/recipes', getAllRecipes);
router.get('/recipes/:id', getRecipeById);
router.put('/recipes/:id', updateRecipeById);

export default router;