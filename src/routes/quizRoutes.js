import express from 'express';
const quizRouter = express.Router();

import {
    getQuiz,
    getQuizzes,
    getQuizzesPublics,
    getTeacherQuizzes,
    getQuizzesBySearch,
    createQuiz,
    importQuiz,
    updateQuiz,
    deleteQuiz,
    likeQuiz,
    commentQuiz,
    getQuizzesDiscoverPage,
    createDraftQuiz,
    getDraftQuizById
} from '../controllers/quizController.js';

import {
    addQuestion,
    getQuestions,
    getQuestion,
    updateQuestion,
    deleteQuestion
} from '../controllers/questionController.js';

import { verifyAccessToken } from '../middlewares/authMiddleware.js';

import {
    verifyPrivateQuiz,
    verifyQuizOwner
} from '../middlewares/quizMiddleware.js';

quizRouter.use(verifyAccessToken);

quizRouter.get('/', getQuizzes);
quizRouter.get('/public', getQuizzesPublics);
quizRouter.get('/search', getQuizzesBySearch);
quizRouter.get('/discover', getQuizzesDiscoverPage);
quizRouter.get('/:id', verifyPrivateQuiz, getQuiz);
quizRouter.get('/draft/:id', getDraftQuizById);
quizRouter.get('/teacher/:teacherId', getTeacherQuizzes);

quizRouter.post('/', createQuiz);
quizRouter.post('/draft', createDraftQuiz);
quizRouter.post('/import', importQuiz);
quizRouter.post('/:id/commentQuiz', commentQuiz);

quizRouter.put('/:id', updateQuiz);
quizRouter.put('/:id/likeQuiz', likeQuiz);

quizRouter.delete('/:id', verifyQuizOwner, deleteQuiz);

quizRouter.get('/:quizId/questions/:questionId', getQuestion);
quizRouter.get('/:quizId/questions', getQuestions);
quizRouter.post('/:quizId/questions', addQuestion);
quizRouter.put('/:quizId/questions/:questionId', updateQuestion);
quizRouter.delete('/:quizId/questions/:questionId', deleteQuestion);

export default quizRouter;
