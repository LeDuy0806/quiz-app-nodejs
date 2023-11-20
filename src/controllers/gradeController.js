import asyncHandler from 'express-async-handler';
import constants from '../constants/httpStatus.js';
import Grade from '../models/gradeModel.js';

// @desc    Get all grades
// @route   GET /api/grades
// @access  Public
export const getGrades = asyncHandler(async (req, res) => {
    const grades = await Grade.find({});
    res.status(constants.OK).json(grades);
});

// @desc    Get grade by id
// @route   GET /api/grades/:id
// @access  Public
export const getGradeById = asyncHandler(async (req, res) => {
    const grade = await Grade.findById(req.params.id);
    if (grade) {
        res.status(constants.OK).json(grade);
    } else {
        res.status(constants.NOT_FOUND).json({ message: 'Grade not found' });
    }
});

// @desc    Get a grade by name
// @route   get /api/grades/name/:name
// @access  Public
export const getGradeByName = asyncHandler(async (req, res) => {
    const grade = await Grade.findOne({ name: req.params.name });
    if (grade) {
        res.status(constants.OK).json(grade);
    } else {
        res.status(constants.NOT_FOUND).json({ message: 'Grade not found' });
    }
});

// @desc    Create a grade
// @route   POST /api/grades
// @access  Private/Admin
export const createGrade = asyncHandler(async (req, res) => {
    const grade = new Grade({
        name: req.body.name
    });

    const createdGrade = await grade.save();
    res.status(constants.CREATE).json(createdGrade);
});

// @desc    Update a grade
// @route   PUT /api/grades/:id
// @access  Private/Admin
export const updateGrade = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const grade = await Grade.findById(req.params.id);

    if (grade) {
        grade.name = name;

        const updatedGrade = await grade.save();
        res.status(constants.OK).json(updatedGrade);
    } else {
        res.status(constants.NOT_FOUND);
        throw new Error('Grade not found');
    }
});

// @desc    Delete a grade
// @route   DELETE /api/grades/:id
// @access  Private/Admin
export const deleteGrade = asyncHandler(async (req, res) => {
    const grade = await Grade.findById(req.params.id);

    if (grade) {
        await grade.remove();
        res.status(constants.OK).json({ message: 'Grade removed' });
    } else {
        res.status(constants.NOT_FOUND);
        throw new Error('Grade not found');
    }
});
