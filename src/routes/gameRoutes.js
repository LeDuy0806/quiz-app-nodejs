import express from 'express';
const gameRouter = express.Router();

import {
    createGame,
    getGames,
    getGame,
    updateGame,
    deleteGame,
    addPlayer,
    removePlayer
} from '../controllers/gameController.js';

import { verifyAccessToken } from '../middlewares/authMiddleware.js';

gameRouter.use(verifyAccessToken);
gameRouter.get('/:id', getGame);
gameRouter.get('/', getGames);

gameRouter.post('/', createGame);
gameRouter.put('/:id', updateGame);
gameRouter.delete('/:id', deleteGame);
gameRouter.patch('/:gameId/addPlayer', addPlayer);
gameRouter.patch('/:gameId/removePlayer', removePlayer);

export default gameRouter;
