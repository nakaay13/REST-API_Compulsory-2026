import { User } from "./user";

export interface Recipe extends Document {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    createdBy: User['id'];
    createdAt: Date;
    updatedAt: Date;
}