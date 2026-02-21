import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import {connect, testConnection} from './repository/database';

import routes from './routes';
import { disconnect } from './repository/database';

dotenvFlow.config();    
const app: Application = express();


export function startServer() {

    app.use('/api', routes);

    testConnection();
    
    const PORT:number = parseInt(process.env.PORT as string) || 4000;
    app.listen(PORT, function() {
        console.log(`Server is running on port ${PORT}`);
    });
}