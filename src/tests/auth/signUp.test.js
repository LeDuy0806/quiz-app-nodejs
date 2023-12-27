import request from 'supertest';
import {
    signUpValid,
    signUpEmailExist,
    signUpUserNameExist,
    EmailFormat,
    RequirePassword,
    RequireLong
} from '../../utilsTest/auth';
import createServer from '../../utils/server';
const server = createServer();

import dotenv from 'dotenv';
dotenv.config();

describe('user SignUp', () => {
    describe('given the mail is format(not exists) and the password is strong (valid) and userName is standard length', () => {
        test('should return the true and strong and strong', async () => {
            const { mail, userName, password } = signUpValid;
            const res1 = await request(server)
                .post('/api/auth/checkEmail')
                .send({ mail });

            const res2 = await request(server)
                .post('/api/auth/checkUserName')
                .send({ userName });

            const res3 = await request(server)
                .post('/api/auth/register')
                .send(signUpValid);

            expect(res1.statusCode).toBe(200);
            expect(res2.statusCode).toBe(200);
            expect(res3.statusCode).toBe(200);

            expect([
                EmailFormat(mail),
                RequirePassword(password),
                RequireLong(userName)
            ]).toEqual([true, 'strong', 'strong']);
        });
    });

    describe('given the mail is format(not exists) and the password is strong and userName is not standard length', () => {
        test('should return the status 200', async () => {
            const user = {
                mail: 'anhquoc19082003@gmail.com',
                password: 'QuocAnh-1809',
                userName: 'Quoc'
            };
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send(user);

            expect(res.statusCode).toBe(200);
            expect([
                EmailFormat(user.mail),
                RequirePassword(user.password),
                RequireLong(user.userName)
            ]).toEqual([true, 'strong', 'weak']);
        });
    });

    describe('given the mail is format(not exists) and the password is medium and userName is standard length', () => {
        test('should return the status 200', async () => {
            const user = {
                mail: 'anhquoc19082003@gmail.com',
                password: 'Quoc1809',
                userName: 'QuocAnh'
            };
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send(user);

            expect(res.statusCode).toBe(200);
            expect([
                EmailFormat(user.mail),
                RequirePassword(user.password),
                RequireLong(user.userName)
            ]).toEqual([true, 'medium', 'strong']);
        });
    });

    describe('given the mail is format(not exists) and the password is medium and userName is not standard length', () => {
        test('should return the status 200', async () => {
            const user = {
                mail: 'anhquoc19082003@gmail.com',
                password: 'Quoc1809',
                userName: 'Quoc'
            };
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send(user);

            expect(res.statusCode).toBe(200);
            expect([
                EmailFormat(user.mail),
                RequirePassword(user.password),
                RequireLong(user.userName)
            ]).toEqual([true, 'medium', 'weak']);
        });
    });

    describe('given the mail is format(not exists) and the password is weak and userName is standard length', () => {
        test('should return the status 200', async () => {
            const user = {
                mail: 'anhquoc19082003@gmail.com',
                password: 'Quoc189',
                userName: 'QuocAnh'
            };
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send(user);

            expect(res.statusCode).toBe(200);
            expect([
                EmailFormat(user.mail),
                RequirePassword(user.password),
                RequireLong(user.userName)
            ]).toEqual([true, 'weak', 'strong']);
        });
    });

    describe('given the mail is format(not exists) and the password is weak and userName is not standard length', () => {
        test('should return the status 200', async () => {
            const user = {
                mail: 'anhquoc19082003@gmail.com',
                password: 'Quoc189',
                userName: 'Quoc'
            };
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send(user);

            expect(res.statusCode).toBe(200);

            expect([
                EmailFormat(user.mail),
                RequirePassword(user.password),
                RequireLong(user.userName)
            ]).toEqual([true, 'weak', 'weak']);
        });
    });

    describe('given the mail is not format and the password is strong and userName is standard length', () => {
        test('should return the status 401', async () => {
            const user = {
                mail: 'anhquoc18092003@gmail',
                password: 'QuocAnh-1809',
                userName: 'QuocAnh'
            };
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send(user);

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({});
            expect([
                EmailFormat(user.mail),
                RequirePassword(user.password),
                RequireLong(user.userName)
            ]).toEqual([false, 'strong', 'strong']);
        });
    });

    describe('given the mail is not format and the password is strong and userName is not standard length', () => {
        test('should return the status 401', async () => {
            const user = {
                mail: 'anhquoc18092003@gmail',
                password: 'QuocAnh-1809',
                userName: 'Quoc'
            };
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send(user);

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({});
            expect([
                EmailFormat(user.mail),
                RequirePassword(user.password),
                RequireLong(user.userName)
            ]).toEqual([false, 'strong', 'weak']);
        });
    });

    describe('given the mail is not format and the password is medium and userName is standard length', () => {
        test('should return the status 401', async () => {
            const user = {
                mail: 'anhquoc18092003@gmail',
                password: 'Quoc1809',
                userName: 'QuocAnh'
            };
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send(user);

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({});
            expect([
                EmailFormat(user.mail),
                RequirePassword(user.password),
                RequireLong(user.userName)
            ]).toEqual([false, 'medium', 'strong']);
        });
    });

    describe('given the mail is not format and the password is medium and userName is not standard length', () => {
        test('should return the status 401', async () => {
            const user = {
                mail: 'anhquoc18092003@gmail',
                password: 'Quoc1809',
                userName: 'Quoc'
            };
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send(user);

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({});
            expect([
                EmailFormat(user.mail),
                RequirePassword(user.password),
                RequireLong(user.userName)
            ]).toEqual([false, 'medium', 'weak']);
        });
    });

    describe('given the mail is not format and the password is weak and userName is standard length', () => {
        test('should return the status 401', async () => {
            const user = {
                mail: 'anhquoc18092003@gmail',
                password: 'Quoc189',
                userName: 'QuocAnh'
            };
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send(user);

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({});
            expect([
                EmailFormat(user.mail),
                RequirePassword(user.password),
                RequireLong(user.userName)
            ]).toEqual([false, 'weak', 'strong']);
        });
    });

    describe('given the mail is not format and the password is weak and userName is not standard length', () => {
        test('should return the status 401', async () => {
            const user = {
                mail: 'anhquoc18092003@gmail',
                password: 'Quoc189',
                userName: 'Quoc'
            };
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send(user);

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({});
            expect([
                EmailFormat(user.mail),
                RequirePassword(user.password),
                RequireLong(user.userName)
            ]).toEqual([false, 'weak', 'weak']);
        });
    });

    describe('given the email already exist', () => {
        test('should return a 422', async () => {
            const { mail } = signUpEmailExist;
            const res = await request(server)
                .post('/api/auth/checkEmail')
                .send({ mail });

            expect(res.statusCode).toBe(422);
            expect(res.body).toEqual({});
        });
    });

    describe('given the userName exist', () => {
        test('should return a 422', async () => {
            const { userName } = signUpUserNameExist;
            const res = await request(server)
                .post('/api/auth/checkUserName')
                .send({ userName });

            expect(res.statusCode).toBe(422);
            expect(res.body).toEqual({});
        });
    });
});
