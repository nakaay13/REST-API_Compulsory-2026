// imports
import {
  type Request,
  type Response,
  type NextFunction
} from "express";

import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

// Project imports
import { userModel } from "../models/userModel";
import { User } from "../interfaces/user";
import { connect, disconnect } from '../repository/database';

export async function registerUser(req: Request, res: Response) {
    try {
        const { error } = validateUserRegistrationInfo(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
 
    } catch (error) {

    } finally {

    }
}

export function validateUserRegistrationInfo(data: User): ValidationResult {
    const schema = Joi.object({
        username: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

export function validateUserLoginInfo(data: User): ValidationResult {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

