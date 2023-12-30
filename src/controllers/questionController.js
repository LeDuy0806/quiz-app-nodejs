import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import constants from '../constants/httpStatus.js';
import Quiz from '../models/quizModel.js';
import Question from '../models/questionModel.js';
import User from '../models/userModel.js';

const addQuestion = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    const {
        backgroundImage,
        optionQuestion,
        questionType,
        content,
        pointType,
        answerTime,
        answerList,
        questionIndex,
        maxCorrectAnswer,
        correctAnswerCount,
        answerCorrect
    } = req.body;

    const newQuestion = new Question({
        creator: req.user.id,
        optionQuestion,
        quiz: quizId,
        questionIndex,
        tags: '',
        isPublic: true,
        questionType,
        pointType,
        answerTime,
        backgroundImage,
        content,
        answerList,
        maxCorrectAnswer,
        correctAnswerCount,
        answerCorrect
    });

    try {
        const Question = await newQuestion.save();
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Quiz not found' });
        }
        quiz.questionList.push(Question);
        quiz.numberOfQuestions += 1;
        await quiz.save();

        return res.status(constants.CREATE).json({ Question, quiz });
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getQuestions = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Quiz not found' });
        }
        res.status(constants.OK).json(quiz.questionList);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getAllQuestion = asyncHandler(async (req, res) => {
    try {
        const questions = await Question.find().populate('creator');
        if (!questions) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Question not found' });
        }
        res.status(constants.OK).json(questions);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getQuestion = asyncHandler(async (req, res) => {
    const { quizId, questionId } = req.params;
    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Quiz not found' });
        }
        const question = quiz.questionList.id(questionId);
        res.status(constants.OK).json(question);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const deleteQuestion = asyncHandler(async (req, res) => {
    const { quizId, questionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return res
            .status(constants.NOT_FOUND)
            .send(`No quiz with id: ${quizId}`);
    }
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res
            .status(constants.NOT_FOUND)
            .send(`No question with id: ${questionId}`);
    }

    const question = await Question.findById(questionId);
    const Index = question.questionIndex;
    const quiz = await Quiz.findById(quizId);
    quiz.numberOfQuestions -= 1;

    quiz.questionList = quiz.questionList.filter(
        (item) => String(item._id) !== questionId
    );

    quiz.questionList.map((item) => {
        if (item.questionIndex > Index) {
            item.questionIndex--;
            const handleSetIndex = async () => {
                const question = await Question.findById(item._id);
                question.questionIndex -= 1;
                question.save();
            };
            handleSetIndex();
        }
    });

    await quiz.save();

    try {
        await Question.findByIdAndRemove(questionId);
        res.status(constants.OK).json(quiz);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const createQuestion = asyncHandler(async (req, res) => {
    const {
        backgroundImage,
        optionQuestion,
        questionType,
        content,
        pointType,
        answerTime,
        answerList,
        questionIndex,
        maxCorrectAnswer,
        correctAnswerCount,
        answerCorrect
    } = req.body;

    const newQuestion = new Question({
        backgroundImage,
        optionQuestion,
        questionType,
        content,
        pointType,
        answerTime,
        answerList,
        questionIndex,
        maxCorrectAnswer,
        correctAnswerCount,
        answerCorrect
    });
    try {
        const question = await newQuestion.save();
        res.status(constants.CREATE).json(question);
    } catch {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const updateQuestion = asyncHandler(async (req, res) => {
    const { quizId, questionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return res
            .status(constants.NOT_FOUND)
            .send(`No quiz with id: ${quizId}`);
    }
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res
            .status(constants.NOT_FOUND)
            .send(`No question with id: ${questionId}`);
    }

    const {
        questionType,
        isPublic,
        optionQuestion,
        backgroundImage,
        content,
        pointType,
        answerTime,
        answerList,
        tags,
        questionIndex,
        maxCorrectAnswer,
        correctAnswerCount,
        answerCorrect
    } = req.body;

    const newQuestion = new Question({
        _id: questionId,
        creatorId: req.user.id,
        optionQuestion,
        quizId,
        questionIndex,
        tags,
        isPublic,
        questionType,
        pointType,
        answerTime,
        backgroundImage,
        content,
        answerList,
        maxCorrectAnswer,
        correctAnswerCount,
        answerCorrect
    });

    const quiz = await Quiz.findById(quizId);

    try {
        if (!quiz) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Quiz not found' });
        }
        await Question.findByIdAndUpdate(questionId, newQuestion, {
            new: true
        });

        let questionIndex = quiz.questionList.findIndex(
            (obj) => obj._id == questionId
        );
        quiz.questionList[questionIndex] = {
            _id: questionId,
            creatorId: req.user.id,
            optionQuestion,
            quizId,
            questionIndex: questionIndex + 1,
            tags,
            isPublic,
            questionType,
            pointType,
            answerTime,
            backgroundImage,
            content,
            answerList,
            maxCorrectAnswer,
            correctAnswerCount,
            answerCorrect
        };
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, quiz, {
            new: true
        });
        res.status(constants.OK).json(updatedQuiz);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

export {
    addQuestion,
    createQuestion,
    getQuestions,
    getAllQuestion,
    getQuestion,
    updateQuestion,
    deleteQuestion
};
