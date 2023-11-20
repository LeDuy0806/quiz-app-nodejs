import express from 'express';

const categoryRouter = express.Router();

import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    getCategoryByName,
    updateCategory
} from '../controllers/categoryController.js';

import { verifyAccessToken } from '../middlewares/authMiddleware.js';

categoryRouter.use(verifyAccessToken);
categoryRouter.get('/', getCategories);
categoryRouter.get('/:id', getCategoryById);
categoryRouter.get('/name/:name', getCategoryByName);
categoryRouter.post('/', createCategory);
categoryRouter.put('/:id', updateCategory);
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;
