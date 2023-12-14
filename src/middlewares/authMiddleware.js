// const asyncHandler = require('express-async-handler');
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import constants from '../constants/httpStatus.js';
import User from '../models/userModel.js';
const { TokenExpiredError } = jwt;

const checkEmailExist = asyncHandler(async (req, res) => {
    const { mail } = req.body;

    const user = await User.findOne({ mail });
    if (user) {
        res.status(constants.UNPROCESSABLE_ENTITY);
        throw new Error('Email already exists');
    }

    try {
        res.status(constants.OK).json({
            message: 'Email right!'
        });
    } catch (error) {
        res.status(constants.SERVER_ERROR);
        throw new Error(error);
    }
});

const checkUserName = asyncHandler(async (req, res) => {
    const { userName } = req.body;

    const user = await User.findOne({ userName });

    if (user) {
        res.status(constants.UNPROCESSABLE_ENTITY);
        throw new Error('userName already exists');
    }

    try {
        res.status(constants.OK).json({
            message: 'userName right!'
        });
    } catch (error) {
        res.status(constants.SERVER_ERROR);
        throw new Error(error);
    }
});

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    // console.log(authHeader);

    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        if (!token || token === 'null' || token === 'undefined') {
            res.status(constants.UNAUTHORIZED);
            throw new Error('User is not authorized or token is missing');
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                if (err instanceof TokenExpiredError) {
                    res.status(constants.UNAUTHORIZED);
                    throw new Error('Token expired');
                }
                res.status(constants.UNAUTHORIZED);
                throw new Error('User is not authorized');
            } else {
                req.user = decoded.user;
                next();
            }
        });
    }
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                if (err instanceof TokenExpiredError) {
                    res.status(constants.UNAUTHORIZED);
                    throw new Error('Token expired');
                }
                res.status(401);
                throw new Error('User is not authorized');
            }

            const user = decoded.user;
            //check admin role
            if (user.userType === 'Admin') {
                next();
            } else {
                res.status(403);
                throw new Error('You do not have permission to do that.');
            }
        });

        if (!token) {
            res.status(401);
            throw new Error('User is not authorized or token is missing');
        }
    }
});

const verifyUserAuthorization = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                if (err instanceof TokenExpiredError) {
                    res.status(constants.UNAUTHORIZED);
                    throw new Error('Token expired');
                }
                res.status(constants.UNAUTHORIZED);
                throw new Error('User is not authorized');
            }

            const user = decoded.user;
            //check admin role
            if (user.id === req.params.id || user.userType === 'Admin') {
                // req.user.checkMySelf = true;
                next();
            } else {
                res.status(403);
                throw new Error('You do not have permission to do that.');
            }
        });

        if (!token) {
            res.status(401);
            throw new Error('User is not authorized or token is missing');
        }
    }
});

const verifyUser = asyncHandler(async (req, res, next) => {
    const { mail } = req.method === 'GET' ? req.query : req.body;
    console.log(mail);
    if (!mail) {
        res.status(constants.BAD_REQUEST);
        throw new Error('email Empty');
    }
    const existEmail = await User.findOne({ mail });
    if (!existEmail) {
        res.status(constants.NOT_FOUND);
        throw new Error('Email does not exists');
    }
    next();
});

const localVariables = (req, res, next) => {
    req.app.locals = {
        OTP: null,
        resetSession: false
    };
    next();
};

export {
    checkEmailExist,
    checkUserName,
    verifyAccessToken,
    verifyAdmin,
    verifyUserAuthorization,
    localVariables,
    verifyUser
};
