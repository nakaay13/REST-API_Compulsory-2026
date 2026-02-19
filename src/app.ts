import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import { func } from 'joi/lib';

dotenvFlow.config();    
const app: Application = express();

export function startServer() {
    app.listen(4000, function() {
        console.log('Server is running on port 4000');
    });
}