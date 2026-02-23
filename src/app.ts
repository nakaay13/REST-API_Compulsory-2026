import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import {connect, testConnection} from './repository/database';
import cors from 'cors';
import routes from './routes';
import { disconnect } from './repository/database';

dotenvFlow.config();    
const app: Application = express();


export function startServer() {

    app.use(cors({

    // Allow request from any origin
    origin: "*",

    // allow HTTP methods
    methods: ["GET", "PUT", "POST", "DELETE"],

    // allow headers
    allowedHeaders: ['auth-token', 'Origin', 'X-Requested-Width', 'Content-Type', 'Accept'],

    // allow credentials
    credentials:true
    }))

    app.use(express.json());
    
    app.use('/api', routes);

    testConnection();

    const PORT:number = parseInt(process.env.PORT as string) || 4000;
    app.listen(PORT, function() {
        console.log(`Server is running on port ${PORT}`);
    });
}