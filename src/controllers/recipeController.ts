import { Request, Response } from "express";
import { RecipeModel } from "../modules/recipeModel";
import { connect, disconnect } from "../repository/database";

export async function createRecipe(req: Request, res: Response): Promise<void> {

    const data = req.body;

    try {

        await connect();
        const recipe = new RecipeModel(data);
        const result = await recipe.save();
        res.status(201).json(result);

    } catch (error) {

        res.status(500).json({ error: "Failed to create recipe: " + error });

    } finally {

        await disconnect();
        
    }
}
