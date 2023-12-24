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

    describe('create user session', () => {
        describe('given the valid mail and valid password', () => {
            test('should return a signed accessToken & refresh token', async () => {
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
                    AccessTokenAndRefreshToken = await authorizeInfoUserTest(
                        user
                    );
                }
                expect(AccessTokenAndRefreshToken).not.toEqual(null);
            });
        });

        describe('given the valid mail and medium password', () => {
            test('should return a signed accessToken & refresh token is null & null', async () => {
                let AccessTokenAndRefreshToken = null;

                const { mail, passwordMedium } = signInEmailValid;
                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });

                const checkPass = await bcrypt.compare(
                    passwordMedium + '',
                    user.password
                );

                if (checkPass) {
                    AccessTokenAndRefreshToken = await authorizeInfoUserTest(
                        user
                    );
                }
                expect(AccessTokenAndRefreshToken).toBe(null);
            });
        });

        describe('given the valid mail and weak password', () => {
            test('should return a signed accessToken & refresh token is null & null', async () => {
                let AccessTokenAndRefreshToken = null;

                const { mail, passwordWeak } = signInEmailValid;
                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });

                const checkPass = await bcrypt.compare(
                    passwordWeak + '',
                    user.password
                );

                if (checkPass) {
                    AccessTokenAndRefreshToken = await authorizeInfoUserTest(
                        user
                    );
                }
                expect(AccessTokenAndRefreshToken).toBe(null);
            });
        });

        describe('given the mail does not exists and weak password', () => {
            test('should return a signed accessToken & refresh token is null & null', async () => {
                let AccessTokenAndRefreshToken = null;

                const { mail, passwordWeak } = signInEmailNotExist;
                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });

                if (user) {
                    AccessTokenAndRefreshToken = await authorizeInfoUserTest(
                        user
                    );
                }
                expect([
                    AccessTokenAndRefreshToken,
                    RequirePassword(passwordWeak)
                ]).toEqual([null, 'weak']);
            });
        });

        describe('given the mail does not exists and medium password', () => {
            test('should return a signed accessToken & refresh token is null & null', async () => {
                let AccessTokenAndRefreshToken = null;

                const { mail, passwordMedium } = signInEmailNotExist;
                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });

                if (user) {
                    AccessTokenAndRefreshToken = await authorizeInfoUserTest(
                        user
                    );
                }
                expect([
                    AccessTokenAndRefreshToken,
                    RequirePassword(passwordMedium)
                ]).toEqual([null, 'medium']);
            });
        });

        describe('given the mail does not exists and strong password', () => {
            test('should return a signed accessToken & refresh token is null & null', async () => {
                let AccessTokenAndRefreshToken = null;

                const { mail, passwordStrong } = signInEmailNotExist;
                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });

                if (user) {
                    AccessTokenAndRefreshToken = await authorizeInfoUserTest(
                        user
                    );
                }
                expect([
                    AccessTokenAndRefreshToken,
                    RequirePassword(passwordStrong)
                ]).toEqual([null, 'strong']);
            });
        });

        describe('given the mail not format and strong password', () => {
            test('should return a signed accessToken & refresh token is null & null', async () => {
                let AccessTokenAndRefreshToken = null;

                const { mail, passwordStrong } = signInEmailNotStandard;
                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });

                if (user) {
                    AccessTokenAndRefreshToken = await authorizeInfoUserTest(
                        user
                    );
                }
                expect([
                    EmailFormat(mail),
                    AccessTokenAndRefreshToken,
                    RequirePassword(passwordStrong)
                ]).toEqual([false, null, 'strong']);
            });
        });

        describe('given the mail not format and medium password', () => {
            test('should return a signed accessToken & refresh token is null & null', async () => {
                let AccessTokenAndRefreshToken = null;

                const { mail, passwordMedium } = signInEmailNotStandard;
                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });

                if (user) {
                    AccessTokenAndRefreshToken = await authorizeInfoUserTest(
                        user
                    );
                }
                expect([
                    EmailFormat(mail),
                    AccessTokenAndRefreshToken,
                    RequirePassword(passwordMedium)
                ]).toEqual([false, null, 'medium']);
            });
        });

        describe('given the mail not format and weak password', () => {
            test('should return a signed accessToken & refresh token is null & null', async () => {
                let AccessTokenAndRefreshToken = null;

                const { mail, passwordWeak } = signInEmailNotStandard;
                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });

                if (user) {
                    AccessTokenAndRefreshToken = await authorizeInfoUserTest(
                        user
                    );
                }
                expect([
                    EmailFormat(mail),
                    AccessTokenAndRefreshToken,
                    RequirePassword(passwordWeak)
                ]).toEqual([false, null, 'weak']);
            });
        });
    });
});
