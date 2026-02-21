import { Router, Request, Response } from "express";
import { createRecipe, getAllRecipes } from "./controllers/recipeController";

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the API');
});

router.post('/recipes', createRecipe);

router.get('/recipes', getAllRecipes);

export default router;