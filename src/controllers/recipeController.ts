import e, { Request, Response } from "express";
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

export async function getAllRecipes(req: Request, res: Response){
    try {

        await connect();
        const recipes = await RecipeModel.find({});
        res.status(200).json(recipes);

    } catch (error) {

        res.status(500).json({ error: "Failed to retrieve recipes: " + error });

    } finally {

        await disconnect();

    }
}

export async function getRecipeById(req: Request, res: Response){
    try {

        await connect();
        const recipe = await RecipeModel.findById({ _id: req.params.id });
        if (!recipe) {
            res.status(404).json({ error: "Recipe not found" });
            return;
        }
        res.status(200).json(recipe);

    } catch (error) {

        res.status(500).json({ error: "Failed to retrieve recipe: " + error });

    } finally {

        await disconnect();

    }
}


export async function updateRecipeById(req: Request, res: Response){

    const id = req.params.id;
    const updateData = req.body;

    try {

        await connect();
        const recipe = await RecipeModel.findByIdAndUpdate(id, updateData);
        if (!recipe) {
            res.status(404).json({ error: "Recipe not found" });
            return;
        } else {
            res.status(200).json({ message: "Recipe updated successfully" });
        }
        

    } catch (error) {

        res.status(500).json({ error: "Failed to update recipe: " + error });

    } finally {

        await disconnect();

    }
}

export async function deleteRecipeById(req: Request, res: Response){

    const id = req.params.id;

    try {

        await connect();
        const recipe = await RecipeModel.findByIdAndDelete(id);
        if (!recipe) {
            res.status(404).json({ error: "Recipe not found" });
            return;
        } else {
            res.status(200).json({ message: "Recipe deleted successfully" });
        }
        

    } catch (error) {

        res.status(500).json({ error: "Failed to delete recipe: " + error });

    } finally {

        await disconnect();

    }
}
