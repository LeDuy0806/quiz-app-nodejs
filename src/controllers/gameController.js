import mongoose from 'mongoose';
import Game from '../models/gameModel.js';
import PlayerResult from '../models/playerResultModel.js';
import constants from '../constants/httpStatus.js';
import asyncHandler from 'express-async-handler';

const createGame = asyncHandler(async (req, res) => {
    const { hostId, quizId, pin, isLive, playerList, playerResultList } =
        req.body;

    const game = new Game({
        host: hostId,
        quiz: quizId,
        date: new Date().toISOString(),
        pin,
        isLive,
        playerList,
        playerResultList
    });

    try {
        const newGame = await game.save();
        res.status(constants.CREATE).json(newGame);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getGames = asyncHandler(async (req, res) => {
    try {
        const games = await Game.find();
        res.status(constants.OK).json(games);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getGame = asyncHandler(async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Game not found' });
        }
        res.status(constants.OK).json(game);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const deleteGame = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(constants.NOT_FOUND).json(`No game with id: ${id}`);
    }

    try {
        await Game.findByIdAndRemove(id);
        res.status(constants.OK).json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const updateGame = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(constants.NOT_FOUND).json(`No game with id: ${id}`);
    }

    const { hostId, quizId, pin, isLive, playerList } = req.body;

    const playerResultList = await PlayerResult.find({ gameId: id });
    const game = new Game({
        _id: id,
        host: hostId,
        quiz: quizId,
        pin,
        isLive,
        playerList,
        playerResultList
    });

    try {
        const updatedGame = await Game.findByIdAndUpdate(id, game, {
            new: true
        });
        res.status(constants.OK).json(updatedGame);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const addPlayer = asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    const { playerId } = req.body;
    let game;
    try {
        game = await Game.findById(gameId);
        game.playerList.push(playerId);
        const updatedGame = await game.save();
        res.status(constants.OK).json(updatedGame);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

export { createGame, getGames, getGame, deleteGame, updateGame, addPlayer };
