import mongoose from 'mongoose';
import LeaderBoard from '../models/leaderBoardModel.js';
import Quiz from '../models/quizModel.js';
import Game from '../models/gameModel.js';
import constants from '../constants/httpStatus.js';
import asyncHandler from 'express-async-handler';

const getHistory = asyncHandler(async (req, res) => {
    const leaderBoards = await LeaderBoard.find();

    const games = await Game.find();
    const leaderBoardWithGame = await Promise.all(
        leaderBoards.map(async (leaderBoard) => {
            const game = await Game.find({
                _id: leaderBoard.gameId
            });
            return {
                ...leaderBoard._doc,
                game
            };
        })
    );
    try {
        const leaderBoardWithGameQuiz = await Promise.all(
            leaderBoardWithGame.map(async (leaderBoard) => {
                const quiz = await Quiz.find({
                    _id: leaderBoard.game[0].quizId
                });
                return {
                    ...leaderBoard,
                    quiz
                };
            })
        );

        res.status(constants.OK).json(leaderBoardWithGameQuiz);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getLeaderBoards = asyncHandler(async (req, res) => {
    try {
        const leaderBoards = await LeaderBoard.find()
            .populate('game')
            .populate('quiz');
        res.status(constants.OK).json(leaderBoards);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const createLeaderBoard = asyncHandler(async (req, res) => {
    const { game, quiz, pin, playerResultList, currentLeaderBoard } = req.body;

    if (game === null) {
        res.status(constants.NOT_FOUND);
    }

    if (quiz === null) {
        res.status(constants.NOT_FOUND);
    }

    if ((pin === null) | undefined) {
        res.status(constants.NOT_FOUND);
    }

    const leaderBoard = new LeaderBoard({
        game: game._id,
        quiz: quiz._id,
        playerResultList,
        pin,
        currentLeaderBoard
    });

    try {
        const newLeaderBoard = await leaderBoard.save();
        res.status(constants.CREATE).json(newLeaderBoard);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const deleteLeaderBoard = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(constants.NOT_FOUND)
            .json(`No leaderBoard with id: ${id}`);
    }

    try {
        const leaderBoard = new LeaderBoard({
            game: game._id,
            quiz: quiz._id,
            playerResultList,
            pin,
            currentLeaderBoard
        });
        await LeaderBoard.findByIdAndRemove(id);
        res.status(constants.OK).json({
            message: 'LeaderBoard deleted successfully'
        });
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getLeaderBoard = asyncHandler(async (req, res) => {
    const { leaderBoardId } = req.params;

    try {
        const leaderBoard = await LeaderBoard.findById(leaderBoardId)
            .populate({
                path: 'currentLeaderBoard.leaderBoardList',
                populate: {
                    path: 'player',
                    model: 'User'
                }
            })
            .exec();
        if (!leaderBoard) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'LeaderBoard not found' });
        }

        res.status(constants.OK).json(leaderBoard);
    } catch (error) {
        console.log(error);
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const updateLeaderBoard = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(constants.NOT_FOUND)
            .json(`No leaderboard with id: ${id}`);
    }

    const { game, quiz, playerResultList, pin, currentLeaderBoard } = req.body;

    const leaderBoard = new LeaderBoard({
        game,
        quiz,
        playerResultList,
        pin,
        currentLeaderBoard
    });

    try {
        const newLeaderBoard = await Game.findByIdAndUpdate(id, leaderBoard, {
            new: true
        });
        res.status(constants.OK).json(newLeaderBoard);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const addPlayerResult = asyncHandler(async (req, res) => {
    const { leaderBoardId } = req.params;
    const { playerResultId } = req.body;

    try {
        const leaderBoard = await LeaderBoard.findById(leaderBoardId);
        leaderBoard.playerResultList.push(playerResultId);

        const newLeaderBoard = await leaderBoard.save();
        res.status(constants.OK).json(newLeaderBoard);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const updateCurrentLeaderBoard = asyncHandler(async (req, res) => {
    const { leaderBoardId } = req.params;
    const { questionIndex, formUpdate } = req.body;

    const leaderBoardCurrent = { questionIndex, leaderBoardList: formUpdate };

    try {
        const leaderBoard = await LeaderBoard.findById(leaderBoardId);
        leaderBoard.currentLeaderBoard.push(leaderBoardCurrent);

        const newLeaderBoard = await leaderBoard.save();
        res.status(constants.OK).json(newLeaderBoard);
    } catch (error) {
        console.log(error);
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

export {
    getHistory,
    getLeaderBoards,
    createLeaderBoard,
    updateLeaderBoard,
    deleteLeaderBoard,
    getLeaderBoard,
    addPlayerResult,
    updateCurrentLeaderBoard
};
