import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import RefreshToken from '../models/refreshTokenModel.js';
import constants from '../constants/httpStatus.js';
import crypto from 'crypto';

//generate token
const generateAccessToken = async (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.EXPIRE_TIME || '10m'
        });
        return token;
    } catch (error) {
        console.log(`Error in generate token + ${error}`);
        return null;
    }
};

const generateRefreshToken = async (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '2d'
        });
        return token;
    } catch (error) {
        console.log(`Error in generate token + ${error}`);
        return null;
    }
};

const authorizeInfoUser = async (user) => {
    const UserLogout = await RefreshToken.findOne({ user_id: user._id });
    const accessToken = await generateAccessToken({
        user: {
            userName: user.userName,
            userType: user.userType,
            mail: user.mail,
            id: user.id
        }
    });
    const refreshToken = await generateRefreshToken({
        user: {
            userName: user.userName,
            userType: user.userType,
            mail: user.mail,
            id: user.id
        }
    });

    //store refresh token to DB
    if (!UserLogout) {
        await new RefreshToken({
            user_id: user._id,
            token: refreshToken
        }).save();
    }

    return { accessToken, refreshToken };
};

const loginUser = asyncHandler(async (req, res) => {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail });

    if (!user) {
        res.status(constants.UNAUTHORIZED);
        throw new Error('Account not exist');
    }

    if (user && !user.password) {
        res.status(constants.UNAUTHORIZED);
        throw new Error('Email is auth account');
    }

    const checkPass = await bcrypt.compare(password + '', user.password);

    if (!checkPass) {
        res.status(constants.UNAUTHORIZED);
        throw new Error('Wrong password');
    }

    try {
        if (checkPass) {
            const { accessToken, refreshToken } = await authorizeInfoUser(user);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict'
            });

            const { password, ...userWithoutPassword } = user._doc;
            res.status(constants.OK).json({
                user: userWithoutPassword,
                accessToken,
                refreshToken
            });
        }
    } catch {
        res.status(constants.UNAUTHORIZED);
        throw new Error('Wrong password');
    }
});

const loginSocial = asyncHandler(async (req, res) => {
    const { email, image, name } = req.body;

    const userSocial = await User.findOne({ mail: email });

    if (userSocial) {
        const { accessToken, refreshToken } = await authorizeInfoUser(
            userSocial
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict'
        });

        return res.status(constants.OK).json({
            user: userSocial,
            accessToken,
            refreshToken
        });
    }

    try {
        const user = await User.create({
            avatar: image,
            mail: email,
            userName: name,
            userType: 'Student',
            firstName: 'NoF',
            lastName: 'NoL',
            emailToken: crypto.randomBytes(64).toString('hex'),
            isVerified: false,
            point: 0,
            follows: [],
            friends: []
        });

        if (user) {
            const { accessToken, refreshToken } = await authorizeInfoUser(user);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict'
            });

            return res.status(constants.OK).json({
                user,
                accessToken,
                refreshToken
            });
        }
    } catch (error) {
        res.status(constants.SERVER_ERROR);
        throw new Error(error);
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { avatar, firstName, lastName, userType, userName, mail, password } =
        req.body;

    const hashedPassword = await bcrypt.hash(password + '', 10);

    try {
        const user = await User.create({
            avatar,
            mail,
            userName,
            userType,
            firstName,
            lastName,
            emailToken: crypto.randomBytes(64).toString('hex'),
            isVerified: false,
            password: hashedPassword,
            point: 0,
            follows: [],
            friends: []
        });
        if (user) {
            const { accessToken, refreshToken } = await authorizeInfoUser(user);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict'
            });

            const { password, ...userWithoutPassword } = user._doc;
            res.status(constants.OK).json({
                user: userWithoutPassword,
                accessToken,
                refreshToken
            });
        } else {
            res.status(constants.BAD_REQUEST);
            throw new Error('User data is not valid');
        }
    } catch (error) {
        res.status(constants.SERVER_ERROR);
        throw new Error(error);
    }
});

const requestRefreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
        return res
            .status(constants.UNAUTHORIZED)
            .json({ message: "You're not authenticated" });

    try {
        const refreshTokenFromDB = await RefreshToken.findOne({
            token: refreshToken
        });

        if (!refreshTokenFromDB) {
            return res
                .status(constants.NOT_FOUND)
                .json({ message: 'Cannot find refresh token' });
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    res.status(constants.UNAUTHORIZED);
                    throw new Error(err);
                }
                console.log(refreshTokenFromDB.user_id.toString(), decoded);
                if (refreshTokenFromDB.user_id.toString() !== decoded.user.id) {
                    res.status(constants.NOT_FOUND);
                    throw new Error('User is not found');
                }
                const newAccessToken = generateAccessToken({
                    user: decoded.user
                });
                res.status(constants.OK).json({ accessToken: newAccessToken });
            }
        );
    } catch (error) {
        res.status(constants.SERVER_ERROR);
        throw new Error(error);
    }
});

const userLogout = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const result = await RefreshToken.deleteMany({
            user_id: id
        });
        if (!result) {
            return res.status(constants.BAD_REQUEST).json({
                message: `User with id ${id} has been logged out `
            });
        }
        res.status(constants.OK).json({
            message: `Logged out user id ${id}`
        });
    } catch (error) {
        res.status(constants.SERVER_ERROR);
        throw new Error(error);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { mail, password, confirm } = req.body;
    if (password !== confirm) {
        res.status(constants.BAD_REQUEST);
        throw new Error('Invalid confirm');
    } else {
        const user = await User.findOne({ mail });
        const newUpdate = { ...user.update, password: new Date() };
        if (user) {
            const hashNewpassword = await bcrypt.hash(password, 10);
            if (hashNewpassword) {
                const newUser = await User.findOneAndUpdate(
                    { mail: user.mail },
                    { password: hashNewpassword, update: newUpdate }
                );
                if (newUser) {
                    res.status(constants.OK).json(newUser);
                }
            } else {
                res.status(constants.SERVER_ERROR);
                throw new Error('Enable to hashed password');
            }
        } else {
            res.status(constants.NOT_FOUND);
            throw new Error('email not Found');
        }
    }
});

export {
    registerUser,
    loginSocial,
    loginUser,
    requestRefreshToken,
    userLogout,
    resetPassword
};
