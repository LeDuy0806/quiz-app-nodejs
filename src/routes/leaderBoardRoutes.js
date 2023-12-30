import express from 'express';
const leaderBoardRouter = express.Router();

import {
    getHistory,
    createLeaderBoard,
    deleteLeaderBoard,
    getLeaderBoard,
    addPlayerResult,
    updateCurrentLeaderBoard,
    updateLeaderBoard,
    getLeaderBoards
} from '../controllers/leaderBoardController.js';
import { verifyAccessToken } from '../middlewares/authMiddleware.js';

leaderBoardRouter.use(verifyAccessToken);
leaderBoardRouter.get('/', getLeaderBoards);
leaderBoardRouter.get('/:leaderBoardId', getLeaderBoard);
leaderBoardRouter.get('/history/:id', getHistory);

leaderBoardRouter.post('/', createLeaderBoard);

leaderBoardRouter.put(':id', updateLeaderBoard);
leaderBoardRouter.delete('/:id', deleteLeaderBoard);

leaderBoardRouter.patch('/:leaderBoardId/addPlayerResult', addPlayerResult);

leaderBoardRouter.patch(
    '/:leaderBoardId/currentLeaderBoard',
    updateCurrentLeaderBoard
);

export default leaderBoardRouter;
