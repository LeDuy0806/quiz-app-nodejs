import { MongoClient } from 'mongodb';

import {
    signInEmailValid,
    signInEmailNotStandard,
    signInEmailNotExist,
    EmailFormat,
    RequirePassword
} from '../../utilsTest/auth';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { authorizeInfoUserTest } from '../../controllers/authController';
dotenv.config();

describe('User SignIn', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect('mongodb://127.0.0.1:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = await connection.db('Quizzes_App');
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('given the valid mail and strong password (passWordValid) ', () => {
        test('should return the true and strong', async () => {
            let AccessTokenAndRefreshToken = null;
            const { mail, passwordValid } = signInEmailValid;

            const users = db.collection('users');
            const user = await users.findOne({
                mail
            });

            const checkPass = await bcrypt.compare(
                passwordValid + '',
                user.password
            );

            if (checkPass) {
                AccessTokenAndRefreshToken = await authorizeInfoUserTest(user);
            }

            expect([checkPass, RequirePassword(passwordValid)]).toEqual([
                true,
                'strong'
            ]);
            expect(AccessTokenAndRefreshToken).not.toEqual(null);
        });
    });

    describe('given the valid mail and medium password (passWordInValid)', () => {
        test('should return the false and medium', async () => {
            const { mail, passwordMedium } = signInEmailValid;

            const users = db.collection('users');
            const user = await users.findOne({
                mail
            });

            const checkPass = await bcrypt.compare(
                passwordMedium + '',
                user.password
            );
            expect([checkPass, RequirePassword(passwordMedium)]).toEqual([
                false,
                'medium'
            ]);
        });
    });

    describe('given the valid mail and weak password (passWordInValid)', () => {
        test('should return the false and weak', async () => {
            const { mail, passwordWeak } = signInEmailValid;

            const users = db.collection('users');
            const user = await users.findOne({
                mail
            });

            const checkPass = await bcrypt.compare(
                passwordWeak + '',
                user.password
            );
            expect([checkPass, RequirePassword(passwordWeak)]).toEqual([
                false,
                'weak'
            ]);
        });
    });

    describe('given the email does not exists and weak password', () => {
        test('should return a null and weak', async () => {
            const { mail, passwordWeak } = signInEmailNotExist;

            const users = db.collection('users');
            const user = await users.findOne({
                mail
            });
            expect([user, RequirePassword(passwordWeak)]).toEqual([
                null,
                'weak'
            ]);
        });
    });

    describe('given the email does not exists and medium password', () => {
        test('should return a null and medium', async () => {
            const { mail, passwordMedium } = signInEmailNotExist;

            const users = db.collection('users');
            const user = await users.findOne({
                mail
            });
            expect([user, RequirePassword(passwordMedium)]).toEqual([
                null,
                'medium'
            ]);
        });
    });

    describe('given the email does not exists and strong password', () => {
        test('should return a null and strong', async () => {
            const { mail, passwordStrong } = signInEmailNotExist;

            const users = db.collection('users');
            const user = await users.findOne({
                mail
            });
            expect([user, RequirePassword(passwordStrong)]).toEqual([
                null,
                'strong'
            ]);
        });
    });

    describe('given the email not standard and weak password', () => {
        test('should return a false and weak', async () => {
            const { mail, passwordWeak } = signInEmailNotStandard;

            expect([EmailFormat(mail), RequirePassword(passwordWeak)]).toEqual([
                false,
                'weak'
            ]);
        });
    });

    describe('given the email not standard and medium password', () => {
        test('should return a false and medium', async () => {
            const { mail, passwordMedium } = signInEmailNotStandard;

            expect([
                EmailFormat(mail),
                RequirePassword(passwordMedium)
            ]).toEqual([false, 'medium']);
        });
    });

    describe('given the email not standard and strong password', () => {
        test('should return a false and strong', async () => {
            const { mail, passwordStrong } = signInEmailNotStandard;

            expect([
                EmailFormat(mail),
                RequirePassword(passwordStrong)
            ]).toEqual([false, 'strong']);
        });
    });
});
