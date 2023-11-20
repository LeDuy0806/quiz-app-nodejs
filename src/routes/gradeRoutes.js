import express from 'express';

const gradeRouter = express.Router();

import {
    createGrade,
    deleteGrade,
    getGradeById,
    getGradeByName,
    getGrades,
    updateGrade
} from '../controllers/gradeController.js';

import { verifyAccessToken } from '../middlewares/authMiddleware.js';

gradeRouter.use(verifyAccessToken);
gradeRouter.get('/', getGrades);
gradeRouter.get('/:id', getGradeById);
gradeRouter.get('/name/:name', getGradeByName);
gradeRouter.post('/', createGrade);
gradeRouter.put('/:id', updateGrade);
gradeRouter.delete('/:id', deleteGrade);

export default gradeRouter;
