import { User } from "./user";

export interface Recipe extends Document {
    title: string;
    imageUrl: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    _createdBy: User['id'];
    createdAt: Date;
    updatedAt: Date;
}