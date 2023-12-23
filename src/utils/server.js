import express from 'express';
import routes from '../routes';
import errorHandler from '../middlewares/errorHandler';

function createServer() {
    console.log('Duoc ne');
    const app = express();

    app.use(express.json());
    app.use(errorHandler);
    app.use(routes);

    return app;
}

export default createServer;
