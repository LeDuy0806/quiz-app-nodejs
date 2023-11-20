import asyncHandler from 'express-async-handler';
import constants from '../constants/httpStatus.js';
import Category from '../models/categoryModel.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.status(constants.OK).json(categories);
});

// @desc    Get category by id
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        res.status(constants.OK).json(category);
    } else {
        res.status(constants.NOT_FOUND).json({ message: 'Category not found' });
    }
});

// @desc    Get a category by name
// @route   get /api/categories/name/:name
// @access  Public
export const getCategoryByName = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ name: req.params.name });
    if (category) {
        res.status(constants.OK).json(category);
    } else {
        res.status(constants.NOT_FOUND).json({ message: 'Category not found' });
    }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
    const category = new Category({
        name: req.body.name
    });

    const createdCategory = await category.save();
    res.status(constants.CREATE).json(createdCategory);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = name;

        const updatedCategory = await category.save();
        res.status(constants.OK).json(updatedCategory);
    } else {
        res.status(constants.NOT_FOUND).json({ message: 'Category not found' });
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await category.remove();
        res.status(constants.OK).json({ message: 'Category removed' });
    } else {
        res.status(constants.NOT_FOUND).json({ message: 'Category not found' });
    }
});
