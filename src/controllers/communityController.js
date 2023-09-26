import mongoose from 'mongoose';
import Community from '../models/communityModel.js';
import User from '../models/userModel.js';
import Quiz from '../models/quizModel.js';
import constants from '../constants/httpStatus.js';
import asyncHandler from 'express-async-handler';

const getCommunities = asyncHandler(async (req, res) => {
    const communities = await Community.find();
    const quizzes = await Quiz.find({ isPublic: true });
    const users = await User.find();

    try {
        const communitiesWithQuiz = communities.map((item) => {
            let quizList = [];
            let arrayList = [...users];
            const user = arrayList.filter(
                (user) => String(user._id) === String(item.creator._id)
            );
            quizzes.map(async (quiz) => {
                if (item.quizzes.includes(quiz._id)) {
                    quizList.push(quiz);
                }
            });
            return { ...item._doc, quizList, infoCreator: user[0] };
        });
        res.status(constants.OK).json(communitiesWithQuiz);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getCommunity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(constants.NOT_FOUND)
            .send(`No community with id: ${id}`);
    }

    try {
        const community = await Community.findById(id);
        res.status(constants.OK).json(community);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const createCommunity = asyncHandler(async (req, res) => {
    const { name, creatorId, backgroundImage, users, quizzes, field, chatBox } =
        req.body;

    const community = new Community({
        name,
        creator: creatorId,
        backgroundImage,
        quizzes,
        users,
        field,
        chatBox
    });

    try {
        await community.save();
        res.status(constants.OK).json(community);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const updateCommunity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(constants.NOT_FOUND)
            .send(`No community with id: ${id}`);
    }

    const { name, creatorId, backgroundImage, quizzes, users, field, chatBox } =
        req.body;

    const community = new Community({
        _id: id,
        name,
        creator: creatorId,
        backgroundImage,
        quizzes,
        users,
        field,
        chatBox
    });

    try {
        const updatedCommunity = await Community.findByIdAndUpdate(
            id,
            community,
            {
                new: true
            }
        );
        res.status(constants.OK).json(updatedCommunity);
    } catch (error) {
        res.status(constants.BAD_REQUEST).json({ message: error.message });
    }
});

const deletedCommunity = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(constants.NOT_FOUND)
            .send(`No community with id: ${id}`);
    }

    try {
        await Community.findByIdAndRemove(id);
        res.status(constants.OK).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const addQuizCommunity = asyncHandler(async (req, res) => {
    const { id, quizId } = req.params;

    const community = await Community.findById(id);
    const quiz = await Quiz.findById(quizId);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(con).json(`No community with id: ${id}`);
    }

    try {
        if (!community.quizzes.includes(quiz._id)) {
            community.quizzes.push(quiz._id);
        }

        await community.save();
        res.status(constants.OK).json(quiz);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const deleteQuizCommunity = asyncHandler(async (req, res) => {
    const { id, quizId } = req.params;

    const community = await Community.findById(id);
    const quiz = await Quiz.findById(quizId);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(constants.NOT_FOUND)
            .send(`No community with id: ${id}`);
    }

    try {
        community.quizzes = community.quizzes.filter((item) => {
            return String(item) !== String(quizId);
        });
        await community.save();
        res.status(constants.OK).json(quiz);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const addMessageChatBox = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    const community = await Community.findById(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(constants.NOT_FOUND)
            .send(`No community with id: ${id}`);
    }

    try {
        community.chatBox.push(message);
        await community.save();
        res.status(constants.OK).json('Successfully');
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

export {
    getCommunity,
    getCommunities,
    createCommunity,
    updateCommunity,
    deletedCommunity,
    addQuizCommunity,
    deleteQuizCommunity,
    addMessageChatBox
};
