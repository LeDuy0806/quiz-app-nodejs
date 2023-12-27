import express from 'express';
import routes from '../routes';
import errorHandler from '../middlewares/errorHandler';

import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.DB_TEST_URL, {
            // const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(
            'Database connected: ',
            connect.connection.host,
            connect.connection.name
        );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

function createServer() {
    const app = express();

    connectDb();

    app.use(express.json());
    app.use(routes);
    app.use(errorHandler);

    const server = app.listen(4113, () => {
        console.log('Test server running on port 4113');
    });

    return server;
}

export default createServer;
