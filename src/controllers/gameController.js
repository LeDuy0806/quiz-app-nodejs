import mongoose from 'mongoose';
import Game from '../models/gameModel.js';
import PlayerResult from '../models/playerResultModel.js';
import constants from '../constants/httpStatus.js';
import asyncHandler from 'express-async-handler';

const createGame = asyncHandler(async (req, res) => {
    const { host, quiz, pin, isLive, playerList, playerResultList } = req.body;

    console.log(req.body);
    if (host === null) {
        res.status(constants.NOT_FOUND);
        throw new Error('Host is missing');
    }

    if (quiz === null) {
        res.status(constants.NOT_FOUND);
        throw new Error('Quiz is missing');
    }

    if (pin === null) {
        res.status(constants.NOT_FOUND);
        throw new Error('Pin is missing');
    }

    const game = await Game.create({
        host: host._id,
        quiz: quiz._id,
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
        const games = await Game.find().populate('host').populate('quiz');
        res.status(constants.OK).json(games);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getGame = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const game = await Game.findById(id)
            .populate('host')
            .populate({
                path: 'quiz',
                populate: {
                    path: 'questionList',
                    model: 'Question'
                }
            })
            .populate('playerList')
            .exec();
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

    let game = await Game.findById(gameId);

    try {
        game.playerList.push(playerId);
        const updatedGame = await game.save();
        res.status(constants.OK).json(updatedGame);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const removePlayer = asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    const { playerId } = req.body;

    let game = await Game.findById(gameId);

    try {
        game.playerList = game.playerList.filter(
            (player) => String(player) !== playerId
        );
        const updatedGame = await game.save();
        res.status(constants.OK).json(updatedGame);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const addPlayerResult = asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    const { playerResultId } = req.body;

    try {
        const game = await Game.findById(gameId);
        game.playerResultList.push(playerResultId);

        const updatedGame = await game.save();
        res.status(constants.OK).json(updatedGame);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

export {
    createGame,
    getGames,
    getGame,
    deleteGame,
    updateGame,
    addPlayer,
    removePlayer,
    addPlayerResult
};
