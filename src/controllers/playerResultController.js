import mongoose from 'mongoose';
import PlayerResult from '../models/playerResultModel.js';
import Quiz from '../models/quizModel.js';
import Game from '../models/gameModel.js';
import User from '../models/userModel.js';
import constants from '../constants/httpStatus.js';
import asyncHandler from 'express-async-handler';

const createPlayerResult = asyncHandler(async (req, res) => {
    const { playerId, gameId, score, answers } = req.body;
    const playerResult = new PlayerResult({
        playerId,
        gameId,
        score,
        answers
    });

    const playerExist = await PlayerResult.findOne({ playerId });
    const gameIdExist = await PlayerResult.findOne({ gameId });

    try {
        if (!(playerExist && gameIdExist)) {
            const newPlayerResult = await playerResult.save();
            res.status(constants.CREATE).json(newPlayerResult);
        }
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getPlayerResults = asyncHandler(async (req, res) => {
    try {
        const playerResults = await PlayerResult.find();
        res.status(constants.OK).json(playerResults);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getPlayerResult = asyncHandler(async (req, res) => {
    let playerResult;
    try {
        playerResult = await PlayerResult.findById(req.params.id);
        if (playerResult == null) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Player Result not found' });
        }
        res.status(constants.OK).json(playerResult);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const deletePlayerResult = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(constants.NOT_FOUND)
            .send(`No PlayerResult with id: ${id}`);
    }

    try {
        await PlayerResult.findByIdAndRemove(id);
        res.status(constants.OK).json({
            message: 'Player Result deleted successfully'
        });
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const updatePlayerResult = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(constants.NOT_FOUND)
            .json(`No PlayerResult with id: ${id}`);
    }

    const { playerId, gameId, score } = req.body;
    const playerResult = new PlayerResult({
        _id: id,
        playerId,
        gameId,
        score
    });

    try {
        const updatedPlayerResult = await PlayerResult.findByIdAndUpdate(
            id,
            playerResult,
            { new: true }
        );
        res.status(constants.OK).json(updatedPlayerResult);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const addAnswer = asyncHandler(async (req, res) => {
    const { playerResultId } = req.params;
    const {
        questionIndex,
        // answered,
        answers,
        time
    } = req.body.newAnswer;

    let playerResult;
    let game;
    let quiz;
    let correctAnswers;
    let pointType;
    let answerTime;
    let points = 0;
    try {
        playerResult = await PlayerResult.findById(playerResultId);
        game = await Game.findById(playerResult.gameId);
        quiz = await Quiz.findById(game.quizId);
        correctAnswers = quiz.questionList[questionIndex - 1].answerList
            .filter((answer) => answer.isCorrect === true)
            .map((answer) => answer.name);
        pointType = quiz.questionList[questionIndex - 1].pointType;
        answerTime = quiz.questionList[questionIndex - 1].answerTime;
        //posortować answers zeby indeksy szły w tej samej kolejności
        let sortedAnswers = answers.sort();

        if (answers.length > 0) {
            let a = 0;
            for (let i = 0; i < correctAnswers.length; i++) {
                if (correctAnswers[i] === sortedAnswers[i]) {
                    a++;
                }
            }
            if (a === correctAnswers.length) {
                points = calculatePoints(quiz, time, pointType, answerTime);
            }
        }

        playerResult.score += points;
        playerResult.answers.push({
            questionIndex,
            // answered,
            answers,
            time,
            correctAnswers,
            points
        });
        const updatedPlayerResult = await playerResult.save();
        res.status(constants.OK).json(updatedPlayerResult);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const calculatePoints = (quiz, time, pointType, answerTime) => {
    let pointsPerQuestion = quiz.pointsPerQuestion;
    if (pointType === 'Double') {
        return pointsPerQuestion * 2;
    } else if (pointType === 'BasedOnTime') {
        return (pointsPerQuestion / answerTime) * (answerTime - time);
    } else {
        return pointsPerQuestion;
    }
};

const getAnswers = asyncHandler(async (req, res) => {
    const { playerResultId } = req.params;
    try {
        const playerResult = await PlayerResult.findById(playerResultId);
        if (playerResult == null) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Player Result not found' });
        }
        res.status(constants.OK).json(playerResult.answers);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getAnswer = asyncHandler(async (req, res) => {
    const { playerResultId, answerId } = req.params;
    try {
        const playerResult = await PlayerResult.findById(playerResultId);
        if (playerResult == null) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Player Result not found' });
        }
        const answer = playerResult.answers.id(answerId);
        res.status(constants.OK).json(answer);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const deleteAnswer = asyncHandler(async (req, res) => {
    const { playerResultId, answerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(playerResultId)) {
        return res
            .status(404)
            .send(`No Player Result with id: ${playerResultId}`);
    }
    if (!mongoose.Types.ObjectId.isValid(answerId)) {
        return res.status(404).send(`No answer with id: ${answerId}`);
    }
    const playerResult = await PlayerResult.findById(playerResultId);

    try {
        let answerIndex = playerResult.answers.findIndex(
            (obj) => obj._id == answerId
        );
        playerResult.answers.splice(answerIndex, 1);
        playerResult.score -= playerResult.answers[answerIndex].points;
        await PlayerResult.findByIdAndUpdate(playerResultId, playerResult, {
            new: true
        });
        res.status(constants.OK).json({
            message: 'Answer deleted successfully'
        });
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const updateAnswer = asyncHandler(async (req, res) => {
    const { playerResultId, answerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(playerResultId)) {
        return res.status(404).send(`No quiz with id: ${playerResultId}`);
    }
    if (!mongoose.Types.ObjectId.isValid(answerId)) {
        return res.status(404).send(`No question with id: ${answerId}`);
    }

    const { questionIndex, answered, answerIndex, time } = req.body;
    let playerResult;
    let quiz;
    let correctAnswerIndex;
    let points = 0;

    try {
        playerResult = await PlayerResult.findById(playerResultId);
        if (playerResult == null) {
            return res.status(404).json({ message: 'Player Result not found' });
        }
        let answerPosition = playerResult.answers.findIndex(
            (obj) => obj._id == answerId
        );
        playerResult.score -= playerResult.answers[answerPosition].points;
        quiz = await Quiz.findById(playerResult.quizId);
        correctAnswerIndex = quiz.questionList[questionIndex].correctAnswer;
        if (answered && answerIndex === correctAnswerIndex) {
            points = calculatePoints(quiz, time);
        }
        playerResult.score += points;
        playerResult.answers[answerPosition] = {
            _id: answerId,
            questionIndex,
            answered,
            answerIndex,
            time
        };
        const updatedPlayerResult = await PlayerResult.findByIdAndUpdate(
            playerResultId,
            playerResult,
            {
                new: true
            }
        );
        res.status(constants.OK).json(updatedPlayerResult);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const addPlayerResult = asyncHandler(async (req, res) => {
    const { playerId, gameId } = req.params;
    const { score, answers } = req.body;
    const newPlayerResult = new PlayerResult({
        playerId,
        gameId,
        score,
        answers
    });

    const user = await User.findById(playerId);
    user.point += score;
    user.save();

    try {
        await newPlayerResult.save();
        res.status(constants.OK).json({ newPlayerResult, user });
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

export {
    createPlayerResult,
    getPlayerResults,
    getPlayerResult,
    deletePlayerResult,
    updatePlayerResult,
    addAnswer,
    getAnswers,
    getAnswer,
    deleteAnswer,
    updateAnswer,
    addPlayerResult
};
