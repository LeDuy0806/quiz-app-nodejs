import express from 'express';
const communityRouter = express.Router();

import {
    getCommunities,
    createCommunity,
    updateCommunity,
    deletedCommunity,
    addQuizCommunity,
    deleteQuizCommunity,
    addMessageChatBox,
    getCommunity
} from '../controllers/communityController.js';

import { verifyAccessToken } from '../middlewares/authMiddleware.js';

communityRouter.use(verifyAccessToken);

communityRouter.get('/', getCommunities);
communityRouter.get('/:id', getCommunity);

communityRouter.post('/', createCommunity);

communityRouter.put('/:id/quiz/:quizId', addQuizCommunity);
communityRouter.put('/:id/deleteQuiz/:quizId', deleteQuizCommunity);
communityRouter.put('/addMessage/:id', addMessageChatBox);
communityRouter.put('/:id', updateCommunity);

communityRouter.delete('/:id', deletedCommunity);

export default communityRouter;
