import { User } from "./user";

export interface Recipe extends Document {
    title: string;
    imageUrl: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    createdAt: Date;
    updatedAt: Date;
    author: User | string;
}