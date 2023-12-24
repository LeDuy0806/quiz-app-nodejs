import { MongoClient } from 'mongodb';
import {
    signUpValid,
    signUpEmailExist,
    signUpUserNameExist,
    signInValid,
    signInEmailNotExist,
    signInPassWordInvalid,
    EmailFormat,
    RequirePassword,
    RequireLong,
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

        describe('given the mail is format and the password is strong and userName is standard length', () => {
            test('should return the true and strong and strong', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail.com',
                    password: 'QuocAnh-1809',
                    userName: 'QuocAnh'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([true, 'strong', 'strong']);
            });
        });

        describe('given the mail is format and the password is strong and userName is not standard length', () => {
            test('should return the true and strong and weak', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail.com',
                    password: 'QuocAnh-1809',
                    userName: 'Quoc'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([true, 'strong', 'weak']);
            });
        });

        describe('given the mail is format and the password is medium and userName is standard length', () => {
            test('should return the true and medium and strong', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail.com',
                    password: 'Quoc1809',
                    userName: 'QuocAnh'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([true, 'medium', 'strong']);
            });
        });

        describe('given the mail is format and the password is medium and userName is not standard length', () => {
            test('should return the true and medium and weak and weak', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail.com',
                    password: 'Quoc1809',
                    userName: 'Quoc'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([true, 'medium', 'weak']);
            });
        });

        describe('given the mail is format and the password is weak and userName is standard length', () => {
            test('should return the true and weak and strong and strong', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail.com',
                    password: 'Quoc189',
                    userName: 'QuocAnh'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([true, 'weak', 'strong']);
            });
        });

        describe('given the mail is format and the password is weak and userName is not standard length', () => {
            test('should return the true and weak and strong and weak', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail.com and',
                    password: 'Quoc189',
                    userName: 'Quoc'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([true, 'weak', 'weak']);
            });
        });

        describe('given the mail is not format and the password is strong and userName is standard length', () => {
            test('should return the false and weak and strong', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail',
                    password: 'QuocAnh-1809',
                    userName: 'QuocAnh'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([false, 'strong', 'strong']);
            });
        });

        describe('given the mail is not format and the password is strong and userName is not standard length', () => {
            test('should return the false and weak and weak', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail',
                    password: 'QuocAnh-1809',
                    userName: 'Quoc'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([false, 'strong', 'weak']);
            });
        });

        describe('given the mail is not format and the password is medium and userName is standard length', () => {
            test('should return the false and medium and strong', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail',
                    password: 'Quoc1809',
                    userName: 'QuocAnh'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([false, 'medium', 'strong']);
            });
        });

        describe('given the mail is not format and the password is medium and userName is not standard length', () => {
            test('should return the false and medium and weak', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail',
                    password: 'Quoc1809',
                    userName: 'Quoc'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([false, 'medium', 'weak']);
            });
        });

        describe('given the mail is not format and the password is weak and userName is standard length', () => {
            test('should return the false and weak and strong', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail',
                    password: 'Quoc189',
                    userName: 'QuocAnh'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([false, 'weak', 'strong']);
            });
        });

        describe('given the mail is not format and the password is weak and userName is not standard length', () => {
            test('should return the false and weak and weak', async () => {
                const user = {
                    mail: 'anhquoc18092003@gmail',
                    password: 'Quoc189',
                    userName: 'Quoc'
                };
                expect([
                    EmailFormat(user.mail),
                    RequirePassword(user.password),
                    RequireLong(user.userName)
                ]).toEqual([false, 'weak', 'weak']);
            });
        });

        // describe('given the SignUp information are valid', () => {
        //     test('should return the user payload', async () => {
        //         const { mail, userName } = signUpValid;
        //         const users = db.collection('users');
        //         const emailExits = await users.findOne({
        //             mail
        //         });
        //         const userNameExist = await users.findOne({
        //             userName
        //         });
        //         expect([emailExits, userNameExist]).toEqual([null, null]);
        //     });
        // });

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
