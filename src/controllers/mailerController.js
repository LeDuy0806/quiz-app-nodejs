import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import User from '../models/userModel.js';
import constants from '../constants/httpStatus.js';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL,
        pass: process.env.APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Quizes',
        link: 'https://mailgen.js/'
    }
});

const registerMail = asyncHandler(async (req, res) => {
    const { userName, userEmail, text, subject } = req.body;
    console.log(req.body);
    // var email = {
    //   body: {
    //     name: userName,
    //     intro:
    //       text ||
    //       "Welcome to Daily Tuition! We're very excited to have you on board.",
    //     outro:
    //       "Need help, or have questions? Just reply to this email, we'd love to help.",
    //   },
    // };

    // var emailBody = MailGenerator.generate(email);

    // let message = {
    //   from: ' "Verify your email" <quizeuitk16@gmail.com>',
    //   to: userEmail,
    //   subject: subject || "Signup Successful",
    //   html: emailBody,
    // };

    // transporter.sendMail(message, function (error, info) {
    //   if (error) {
    //     res.status(constants.NOT_FOUND);
    //     throw new Error("Send email failure");
    //   } else {
    //     res
    //       .status(constants.OK)
    //       .json("Verfication email is sent to your gmail account");
    //     next();
    //   }
    // });
});

const VerifyEmail = asyncHandler(async (req, res) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const results = path.join(__dirname, '../congratulation', 'index.html');
        const token = req.query.token;
        const user = await User.findOne({ emailToken: token });
        if (user) {
            user.emailToken = null;
            user.isVerified = true;
            await user.save();
            res.sendFile(results);
        } else {
            res.status(constants.NOT_FOUND);
            throw new Error('email is not verified');
        }
    } catch (err) {
        console.log(err);
    }
});

export { transporter, MailGenerator, VerifyEmail, registerMail };
