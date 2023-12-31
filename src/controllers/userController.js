import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import constants from '../constants/httpStatus.js';

const getUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user === null) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'User not found' });
        }
        delete user._doc.password;
        res.status(constants.OK).json(user);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        let newUsers = users.map((user) => {
            delete user._doc.password;
            return user;
        });
        res.status(constants.OK).json(newUsers);
    } catch (error) {
        res.status(constants.BAD_REQUEST).json({ message: error.message });
    }
});

const createUser = asyncHandler(async (req, res) => {
    const {
        avatar,
        bio,
        emailToken,
        userType,
        userName,
        firstName,
        lastName,
        mail,
        password,
        point,
        follows,
        friends,
        workspace
    } = req.body;

    const existsEmail = await User.findOne({ mail });
    if (existsEmail) {
        res.status(constants.UNPROCESSABLE_ENTITY);
        throw new Error('Email already exists');
    }

    const existsUser = await User.findOne({ mail });
    if (existsUser) {
        res.status(constants.UNPROCESSABLE_ENTITY);
        throw new Error('UserName already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password ? password : '1', salt);
    const user = new User({
        avatar,
        bio,
        emailToken,
        userType,
        userName,
        firstName,
        lastName,
        mail,
        password: hashedPassword,
        point,
        follows,
        friends,
        workspace
    });

    try {
        const newUser = await user.save();
        res.status(constants.CREATE).json(newUser);
    } catch (error) {
        res.status(constants.BAD_REQUEST).json({ message: error.message });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, userName, avatar, mail, userType, workspace } =
        req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(constants.NOT_FOUND).json(`No user with id: ${id}`);
    }

    // const existsEmail = await User.findOne({ mail });
    // if (existsEmail) {
    //     res.status(constants.UNPROCESSABLE_ENTITY);
    //     throw new Error('Email already exists');
    // }

    // const existsUser = await User.findOne({ mail });
    // if (existsUser) {
    //     res.status(constants.UNPROCESSABLE_ENTITY);
    //     throw new Error('UserName already exists');
    // }

    if (userName.length < 5 || userName.length > 15) {
        return res.status(constants.NOT_FOUND).json('User Name is not format');
    }

    if (firstName.length > 4) {
        return res.status(constants.NOT_FOUND).json('First Name is not format');
    }

    if (lastName.length > 4) {
        return res.status(constants.NOT_FOUND).json('Last Name is not format');
    }

    const findUserId = await User.findById(id);
    const newUpdate = { ...findUserId.update, profile: new Date() };

    const user = new User({
        _id: id,
        firstName,
        lastName,
        userName,
        avatar,
        mail,
        workspace,
        userType,
        update: newUpdate
    });

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, {
            new: true
        });

        return res.status(constants.OK).json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(constants.BAD_REQUEST).json({ message: error.message });
    }
});

export const changePassword = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
        return res.status(constants.BAD_REQUEST).json({
            message: 'Old password is not correct'
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword + '', 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });

    return res.json({
        message: 'Change password successfully'
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !User.findById(id)) {
        res.status(constants.NOT_FOUND);
        throw new Error(`No user with id: ${id}`);
    }
    try {
        await User.findByIdAndRemove(id);
        res.status(constants.OK).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const unFriend = asyncHandler(async (req, res) => {
    const { myId, friendId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(myId) || !User.findById(myId)) {
        res.status(constants.NOT_FOUND).json({
            message: `No user with id: ${id}`
        });
        throw new Error(`No user with id: ${id}`);
    }

    if (
        !mongoose.Types.ObjectId.isValid(friendId) ||
        !User.findById(friendId)
    ) {
        res.status(constants.NOT_FOUND).json({
            message: `No user with id: ${id}`
        });
    }
    try {
        const user = await User.findById(myId);
        const friend = await User.findById(friendId);

        user.follows = user.follows.filter((item) => item !== friend.userName);
        await user.save();
        res.status(constants.OK).json(user);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

const addFriend = asyncHandler(async (req, res) => {
    const { myId, friendId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(myId) || !User.findById(myId)) {
        res.status(constants.NOT_FOUND).json({
            message: `No user with id: ${id}`
        });
        throw new Error(`No user with id: ${id}`);
    }

    if (
        !mongoose.Types.ObjectId.isValid(friendId) ||
        !User.findById(friendId)
    ) {
        res.status(constants.NOT_FOUND).json({
            message: `No user with id: ${id}`
        });
    }
    try {
        const user = await User.findById(myId);
        const friend = await User.findById(friendId);
        user.follows.push(friend.userName);
        await user.save();

        res.status(constants.OK).json(user);
    } catch (error) {
        res.status(constants.SERVER_ERROR).json({ message: error.message });
    }
});

export {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    addFriend,
    unFriend
};
