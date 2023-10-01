import express from 'express';
const authRouter = express.Router();

import {
    registerUser,
    loginUser,
    requestRefreshToken,
    userLogout,
    resetPassword
} from '../controllers/authController.js';

import {
    checkEmailExist,
    checkUserName
} from '../middlewares/authMiddleware.js';

//register
authRouter.post('/checkEmail', checkEmailExist);
authRouter.post('/checkUserName', checkUserName);
authRouter.post('/register', registerUser);

authRouter.post('/login', loginUser); //login
authRouter.post('/refreshToken', requestRefreshToken); //refresh token
authRouter.post('/logout/:id', userLogout); //log out

export default authRouter;
