import express from 'express';
const playerResultRouter = express.Router();

import {
    createPlayerResult,
    getPlayerResults,
    getPlayerResult,
    updatePlayerResult,
    deletePlayerResult,
    addAnswer,
    getAnswers,
    getAnswer,
    updateAnswer,
    deleteAnswer,
    addPlayerResult
} from '../controllers/playerResultController.js';

import { verifyAccessToken } from '../middlewares/authMiddleware.js';

playerResultRouter.use(verifyAccessToken);
playerResultRouter.get('/', getPlayerResults);
playerResultRouter.get('/:id', getPlayerResult);
playerResultRouter.get('/:playerResultId/answers', getAnswers);
playerResultRouter.get('/:playerResultId/answers/:answerId', getAnswer);

playerResultRouter.post('/', createPlayerResult);

playerResultRouter.patch('/:id', updatePlayerResult);
playerResultRouter.patch('/:playerId/results/:gameId', addPlayerResult);
playerResultRouter.patch('/:playerResultId/answers/:answerId', updateAnswer);
playerResultRouter.patch('/:playerResultId/answers', addAnswer);

playerResultRouter.delete('/:id', deletePlayerResult);
playerResultRouter.delete('/:playerResultId/answers/:answerId', deleteAnswer);

export default playerResultRouter;
