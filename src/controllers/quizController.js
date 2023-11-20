import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import constants from '../constants/httpStatus.js';
import Quiz from '../models/quizModel.js';
import Question from '../models/questionModel.js';
import User from '../models/userModel.js';
import { findQuizByCreator } from '../services/quiz.services.js';

//desc   Get quiz with id
//route  GET /api/quiz/:id
//access Authenticated user
const getQuiz = asyncHandler(async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (quiz === null) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Quiz not found' });
        }
        res.status(constants.OK).json(quiz);
    } catch (error) {
        res.status(constants.SERVER_ERROR);
        throw new Error(error);
    }
});

//desc   Get all quizzes
//route  GET /api/quiz
//access Authenticated user
const getQuizzes = asyncHandler(async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(constants.OK).json(quizzes);
    } catch (error) {
        res.status(constants.SERVER_ERROR);
        throw new Error(error);
    }
});

//desc   Get all quizzes of a teacher
//route  GET /api/quiz/teacher/:teacherId
//access Authenticated user
const getTeacherQuizzes = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;
    try {
        const user = await User.findById(teacherId);
        if (!user) {
            res.status(constants.NOT_FOUND);
            throw new Error('User not found');
        }
        const quizzes = await findQuizByCreator(teacherId);

        res.status(constants.OK).json(quizzes);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

//desc   Get all public quizzes
//route  GET /api/quiz/public
//access Authenticated user
const getQuizzesPublics = asyncHandler(async (req, res) => {
    try {
        const quizzes = await Quiz.find({ isPublic: true });
        res.status(constants.OK).json(quizzes);
    } catch (error) {
        res.status(constants.SERVER_ERROR);
        throw new Error(error);
    }
});

// const getPublicQuizzes = async (req, res) => {
//   const { page } = req.query;
//   try {
//     const LIMIT = 6;
//     const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

//     const total = await Quiz.find({ isPublic: true }).countDocuments({});
//     const quizes = await Quiz.find({ isPublic: true })
//       .sort({ _id: -1 }) // sort from the newest
//       .limit(LIMIT)
//       .skip(startIndex); // skip first <startIndex> quizes
//     // const quizes = await Quiz.find({ isPublic: true })
//     res.status(200).send({
//       data: quizes,
//       currentPage: Number(page),
//       numberOfPages: Math.ceil(total / LIMIT),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//desc   Get all quizzes by search
//route  GET /api/quiz/search?searchQuery=...&tags=...
//access Authenticated user
const getQuizzesBySearch = asyncHandler(async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        //i -> ignore case, like ii, Ii, II
        const name = new RegExp(searchQuery, 'i');

        const quizzes = await Quiz.find({
            isPublic: true,
            $or: [{ name }, { tags: { $in: tags.split(',') } }]
        });

        res.status(constants.OK).json(quizzes);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

//desc   Create a quiz
//route  POST /api/quiz
//access Authenticated user
const createQuiz = asyncHandler(async (req, res) => {
    const {
        name,
        creator,
        description,
        backgroundImage,
        isPublic,
        field,
        pointsPerQuestion,
        likesCount,
        comments,
        questionList
    } = req.body;

    const existQuizName = await Quiz.findOne({ name, creator: creator._id });
    if (existQuizName) {
        res.status(constants.UNPROCESSABLE_ENTITY);
        throw new Error('Quiz already exists');
    }

    if (!name || !description || !pointsPerQuestion || !tags) {
        res.status(constants.NOT_FOUND);
        throw new Error('All fields are mandatory!');
    }

    const quiz = new Quiz({
        name,
        creator: req.user._id,
        likesCount,
        description,
        backgroundImage,
        isPublic,
        field,
        pointsPerQuestion,
        likesCount,
        comments,
        questionList,
        dateCreated: new Date().toISOString()
    });

    try {
        const newQuiz = await quiz.save();
        // if (newQuiz.questionList.length) {
        //   newQuiz.questionList.map((item) => {
        //     const handleAddQuestion = async () => {
        //       const newQuestion = new Question({
        //         _id: item._id,
        //         creatorId: req.user.id,
        //         optionQuestion: item.optionQuestion,
        //         quizId: newQuiz._id,
        //         questionIndex: item.questionIndex,
        //         tags: item.tags,
        //         isPublic: true,
        //         questionType: item.questionType,
        //         pointType: item.pointType,
        //         answerTime: item.answerTime,
        //         backgroundImage: item.backgroundImage,
        //         question: item.question,
        //         answerList: item.answerList,
        //         maxCorrectAnswer: item.maxCorrectAnswer,
        //         correctAnswerCount: item.correctAnswerCount,
        //         answerCorrect: item.answerCorrect,
        //       });
        //       await newQuestion.save();
        //     };
        //     handleAddQuestion();
        //   });
        // }
        res.status(constants.CREATE).json(newQuiz);
    } catch (error) {
        res.status(constants.BAD_REQUEST).json({ message: error.message });
    }
});

//desc   Import a quiz
//route  POST /api/quiz/import
//access Authenticated user
const importQuiz = asyncHandler(async (req, res) => {
    const { quizData, userId } = req.body;

    const {
        name,
        backgroundImage,
        description,
        creatorName,
        pointsPerQuestion,
        numberOfQuestions,
        isPublic,
        tags,
        likesCount,
        questionList,
        creatorId
    } = quizData;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(constants.NOT_FOUND).send(`No user with id: ${id}`);
    }

    const user = await User.findById(userId);

    const existQuizName = await Quiz.findOne({ name, creatorId: userId });
    if (existQuizName) {
        return res
            .status(constants.UNPROCESSABLE_ENTITY)
            .json('Quiz already exists');
    }

    const quiz = new Quiz({
        name,
        backgroundImage,
        description,
        creatorId: userId,
        creatorName: user.userName,
        sourceCreator: creatorName,
        pointsPerQuestion,
        numberOfQuestions,
        isPublic,
        tags,
        importFrom: creatorId,
        likesCount,
        questionList,
        dateCreated: new Date().toISOString()
    });

    try {
        const newQuiz = await quiz.save();
        res.status(constants.CREATE).json(newQuiz);
    } catch (error) {
        res.status(constants.BAD_REQUEST).json({ message: error.message });
    }
});

//desc   Update a quiz
//route  PATCH /api/quiz/:id
//access Authenticated user
const updateQuiz = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No quiz with id: ${id}`);
    }

    const {
        name,
        creator,
        description,
        backgroundImage,
        isPublic,
        field,
        pointsPerQuestion,
        likesCount,
        comments,
        questionList
    } = req.body;

    const quiz = new Quiz({
        _id: id,
        name,
        creator: creator._id,
        backgroundImage,
        description,
        pointsPerQuestion,
        isPublic,
        field,
        likesCount,
        comments,
        questionList,
        dateCreated: new Date().toISOString()
    });

    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, quiz, {
            new: true
        });
        res.json(updatedQuiz);
    } catch (error) {
        res.status(constants.BAD_REQUEST).json({ message: error.message });
    }
});

//desc   Delete a quiz
//route  DELETE /api/quiz/:id
//access Authenticated user
const deleteQuiz = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(constants.NOT_FOUND).json(`No quiz with id: ${id}`);
    }

    try {
        const quiz = await Quiz.findById(id);
        if (!quiz.sourceCreator) {
            const handleRemoveQuestion = async () => {
                quiz.questionList.map((item) => {
                    const handleDelete = async () => {
                        await Question.findByIdAndRemove(item._id);
                    };
                    handleDelete();
                });
            };
            handleRemoveQuestion();
        }

        await Quiz.findByIdAndRemove(id);
        res.status(constants.NOT_FOUND).json({
            message: 'Quiz deleted succesfully'
        });
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const likeQuiz = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(constants.NOT_FOUND).send(`No quiz with id: ${id}`);
    }

    try {
        const quiz = await Quiz.findById(id);
        const index = quiz.likesCount.findIndex(
            (id) => id === String(req.user.id)
        );
        if (index === -1) {
            quiz.likesCount.push(req.user.id);
        } else {
            quiz.likesCount = quiz.likesCount.filter(
                (id) => id !== String(req.user.id)
            );
        }
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, quiz, {
            new: true
        });
        res.json(updatedQuiz);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const commentQuiz = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    try {
        const quiz = await Quiz.findById(id);
        quiz.comments.push(comment);
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, quiz, {
            new: true
        });
        res.status(constants.OK).json(updatedQuiz);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

export {
    getQuiz,
    getQuizzes,
    getTeacherQuizzes,
    getQuizzesPublics,
    getQuizzesBySearch,
    createQuiz,
    importQuiz,
    updateQuiz,
    deleteQuiz,
    likeQuiz,
    commentQuiz
};
