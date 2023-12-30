import express from 'express';
const questionRouter = express.Router();

import {
    getQuestion,
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getAllQuestion
} from '../controllers/questionController.js';

import { verifyAccessToken } from '../middlewares/authMiddleware.js';

questionRouter.use(verifyAccessToken);

questionRouter.get('/', getAllQuestion);
questionRouter.get('/:id', getQuestion);
questionRouter.post('/', createQuestion);
questionRouter.patch('/:id', updateQuestion);
questionRouter.delete('/:id', deleteQuestion);

export default questionRouter;
