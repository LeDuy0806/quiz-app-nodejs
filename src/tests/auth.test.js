import { MongoClient } from 'mongodb';
import {
    signUpValid,
    signUpEmailExist,
    signUpUserNameExist,
    signInValid,
    signInEmailNotExist,
    signInPassWordInvalid
} from '../utilsTest/auth';
import bcrypt from 'bcrypt';
import { authorizeInfoUserTest } from '../controllers/authController';
import dotenv from 'dotenv';
dotenv.config();

describe('Auth Functionality', () => {
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

    describe('user SignUp', () => {
        describe('given the SignUp information are valid', () => {
            test('should return the user payload', async () => {
                const { mail, userName } = signUpValid;
                const users = db.collection('users');
                const emailExits = await users.findOne({
                    mail
                });
                const userNameExist = await users.findOne({
                    userName
                });
                expect([emailExits, userNameExist]).toEqual([null, null]);
            });
        });

        describe('given the email already exist', () => {
            test('should return a 422', async () => {
                const { mail } = signUpEmailExist;
                const users = db.collection('users');
                const emailExits = await users.findOne({
                    mail
                });
                expect(emailExits).not.toBeNull();
            });
        });

        describe('given the userName exist', () => {
            test('should return a 422', async () => {
                const { userName } = signUpUserNameExist;
                const users = db.collection('users');
                const userNameExits = await users.findOne({
                    userName
                });
                expect(userNameExits).not.toBeNull();
            });
        });
    });

    describe('User SignIn', () => {
        describe('given the signIn information are valid', () => {
            test('should return the user payload', async () => {
                const { mail, password } = signInValid;

                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });

                const checkPass = await bcrypt.compare(
                    password + '',
                    user.password
                );
                expect(checkPass).toBe(true);
            });
        });

        describe('given the email does not exists', () => {
            test('should return a null', async () => {
                const { mail } = signInEmailNotExist;

                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });
                expect(user).toBeNull();
            });
        });

        describe('Given the email exists and password invalid', () => {
            test('should return a null', async () => {
                const { mail, password } = signInPassWordInvalid;

                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });

                const checkPass = await bcrypt.compare(
                    password + '',
                    user.password
                );
                expect(checkPass).toBe(false);
            });
        });
    });

    describe('create user session', () => {
        describe('given the username and password are valid', () => {
            test('should return a signed accessToken & refresh token', async () => {
                const { mail } = signInValid;
                const users = db.collection('users');
                const user = await users.findOne({
                    mail
                });
                console.log(user._id);
                const { accessToken, refreshToken } =
                    await authorizeInfoUserTest(user);
                console.log([accessToken, refreshToken]);
                expect([accessToken, refreshToken]).not.toEqual([null, null]);
            });
        });
    });
});
