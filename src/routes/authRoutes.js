import express from 'express';
const authRouter = express.Router();

import {
    registerUser,
    loginUser,
    requestRefreshToken,
    userLogout,
    resetPassword
} from '../controllers/authController.js';

authRouter.post('/register', registerUser); //register
authRouter.post('/login', loginUser); //login
authRouter.post('/refreshToken', requestRefreshToken); //refresh token
authRouter.post('/logout/:id', userLogout); //log out

export default authRouter;
