import express from 'express';
import routes from '../routes';
import errorHandler from '../middlewares/errorHandler';
import connectDb from '../config/dbConnection';

import dotenv from 'dotenv';

dotenv.config();

function createServer() {
    const app = express();

    connectDb();

    app.use(express.json());
    app.use(errorHandler);
    app.use(routes);

    const server = app.listen(4113, () => {
        console.log('Test server running on port 4113');
    });

    return server;
}

export default createServer;
