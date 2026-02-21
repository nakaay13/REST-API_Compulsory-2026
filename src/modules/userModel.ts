import {Schema, model} from 'mongoose';
import {User} from '../interfaces/user';

const userSchema = new Schema<User>({
    name: {type: String, required: true, min: 2, max: 100},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, min: 6, max: 100},
    registeredAt: {type: Date, required: true, default: Date.now}
});

export const UserModel = model<User>('User', userSchema);