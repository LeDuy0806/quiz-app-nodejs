import express from 'express';
const gameRouter = express.Router();

import {
    createGame,
    getGames,
    getGame,
    updateGame,
    deleteGame,
    addPlayer
} from '../controllers/gameController.js';

import { verifyAccessToken } from '../middlewares/authMiddleware.js';

gameRouter.use(verifyAccessToken);
gameRouter.get('/', getGames);
gameRouter.get('/:id', getGame);

gameRouter.post('/', createGame);
gameRouter.put('/:id', updateGame);
gameRouter.delete('/:id', deleteGame);
gameRouter.patch('/:gameId/players', addPlayer);

export default gameRouter;
