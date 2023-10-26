import mongoose from 'mongoose';
import LeaderBoard from '../models/leaderBoardModel.js';
import Quiz from '../models/quizModel.js';
import Game from '../models/gameModel.js';
import constants from '../constants/httpStatus.js';
import asyncHandler from 'express-async-handler';

const getHistory = asyncHandler(async (req, res) => {
    const leaderBoards = await Leaderboard.find();

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
        // const gameWithQuiz = await Promise.all(
        //     games.map(async (game) => {
        //         const quiz = await Quiz.find({
        //             _id: game.quizId
        //         });
        //         return {
        //             ...game._doc,
        //             quiz
        //         };
        //     })
        // );

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

const createLeaderBoard = asyncHandler(async (req, res) => {
    const { game, quiz, pin, playerResultList, currentLeaderBoard } = req.body;

    const leaderBoard = new LeaderBoard({
        game: game._id,
        quiz: quiz._id,
        playerResultList,
        pin,
        currentLeaderBoard
    });

    quiz.questionList.forEach((question) => {
        leaderBoard.currentLeaderBoard.push({
            questionIndex: question.questionIndex,
            leaderBoardList: []
        });
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
            .json(`No leaderboard with id: ${id}`);
    }

    try {
        await Leaderboard.findByIdAndRemove(id);
        res.status(constants.OK).json({
            message: 'Leaderboard deleted succesfully'
        });
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getLeaderBoard = asyncHandler(async (req, res) => {
    let leaderboard;
    try {
        leaderboard = await Leaderboard.findById(req.params.id);
        if (leaderboard == null) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Leaderboard not found' });
        }
        res.status(constants.OK).json(leaderboard);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const addPlayerResult = asyncHandler(async (req, res) => {
    const { leaderboardId } = req.params;
    const { playerResultId } = req.body;
    let leaderboard;

    try {
        leaderboard = await Leaderboard.findById(leaderboardId);
        leaderboard.playerResultList.push(playerResultId);
        const newLeaderboard = await leaderboard.save();
        res.status(constants.OK).json(newLeaderboard);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const updateQuestionLeaderBoard = asyncHandler(async (req, res) => {
    const { leaderboardId } = req.params;
    const { questionIndex, playerId, playerPoints } = req.body;
    let leaderboard;

    try {
        leaderboard = await Leaderboard.findById(leaderboardId);
        leaderboard.questionLeaderboard[
            questionIndex - 1
        ].questionResultList.push({
            playerId,
            playerPoints
        });

        const newLeaderboard = await leaderboard.save();
        res.status(constants.OK).json(newLeaderboard);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const updateCurrentLeaderBoard = asyncHandler(async (req, res) => {
    const { leaderboardId } = req.params;
    const { questionIndex, playerId, playerCurrentScore } = req.body;
    let leaderboard;
    try {
        leaderboard = await Leaderboard.findById(leaderboardId);
        leaderboard.currentLeaderboard[questionIndex - 1].leaderboardList.push({
            playerId,
            playerCurrentScore
        });

        const newLeaderboard = await leaderboard.save();
        res.status(constants.OK).json(newLeaderboard);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

export {
    getHistory,
    createLeaderBoard,
    deleteLeaderBoard,
    getLeaderBoard,
    addPlayerResult,
    updateQuestionLeaderBoard,
    updateCurrentLeaderBoard
};
