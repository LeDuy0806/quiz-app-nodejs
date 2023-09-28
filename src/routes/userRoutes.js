import express from 'express';
const userRouter = express.Router();

import {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    addFriend,
    unFriend
} from '../controllers/userController.js';

import {
    verifyAccessToken,
    verifyUserAuthorization,
    verifyAdmin
} from '../middlewares/authMiddleware.js';

userRouter.use(verifyAccessToken);
userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.patch('/:id', verifyUserAuthorization, updateUser);
userRouter.put('/:myId/addFriend/:friendId', addFriend);
userRouter.put('/:myId/unfriend/:friendId', unFriend);

userRouter.post('/', verifyAdmin, createUser);
userRouter.delete('/:id', verifyAdmin, deleteUser);

export default userRouter;
