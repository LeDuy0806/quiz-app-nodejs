import otpGenerator from 'otp-generator';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import constants from '../constants/httpStatus.js';

const generateOTP = asyncHandler(async (req, res) => {
    const mail = req.query.mail;
    const user = await User.findOne({ mail });
    req.app.locals.OTP = await otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    // res.status(201).send({ code: req.app.locals.OTP, userName: user.userName });
    res.status(constants.CREATE).json({
        code: req.app.locals.OTP,
        userName: user.userName
    });
});

const generateOTPMail = asyncHandler(async (req, res) => {
    const { mail, userName } = req.body;
    const user = await User.findOne({ mail });

    if (user) {
        return res.status(422).json('Email have exist');
    }

    req.app.locals.OTP = await otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    // res.status(201).send({ code: req.app.locals.OTP, userName: user.userName });
    res.status(constants.CREATE).json({
        code: req.app.locals.OTP,
        userName
    });
});

const verifyOTP = asyncHandler(async (req, res) => {
    const { code } = req.query;

    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        res.status(constants.OK).json('Verify Successsfully!');
    } else {
        res.status(constants.BAD_REQUEST);
        throw new Error('Invalid OTP');
    }
});

const verifyOTPMail = asyncHandler(async (req, res, next) => {
    const { code } = req.body;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        // res.status(constants.OK).json('Verify Successsfully!');
        next();
    } else {
        res.status(constants.BAD_REQUEST);
        throw new Error('Invalid OTP');
    }
});

// const createResetSession = (req, res) => {
//     if (req.app.locals.resetSession) {
//         return res.status(201).send({ flag: req.app.locals.resetSession });
//     }
//     return res.status(440).send({ error: 'Session expired!' });
// };

const createResetSession = asyncHandler(async (req, res) => {
    if (req.app.locals.resetSession) {
        res.status(constants.CREATE).json({
            flag: req.app.locals.resetSession
        });
    }
    res.status(constants.NOT_FOUND);
    throw new Error('Session expired!');
});

export {
    generateOTP,
    generateOTPMail,
    verifyOTP,
    createResetSession,
    verifyOTPMail
};
