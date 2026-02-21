import {Schema, model} from 'mongoose';
import {Recipe} from '../interfaces/recipe';

const recipeSchema = new Schema<Recipe>({
        title: {type: String, required: true, min: 2, max: 100},
        imageUrl: {type: String, required: true},
        description: {type: String, required: true, min: 10, max: 1000},
        ingredients: {type: [String], required: true},
        instructions: {type: [String], required: true}, 
        _createdBy: {type: String, ref: 'User', required: true},
        createdAt: {type: Date, required: true, default: Date.now},
        updatedAt: {type: Date, required: true, default: Date.now}
});

export const RecipeModel = model<Recipe>('Recipe', recipeSchema);