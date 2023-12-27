import request from 'supertest';

import createServer from '../../utils/server';
import {
    signInEmailValid,
    signInEmailNotStandard,
    signInEmailNotExist,
    EmailFormat
} from '../../utilsTest/auth';

const server = createServer();

describe('Sign In', () => {
    describe('given the valid mail and strong password (passWordValid)', () => {
        test('should return the status 200', async () => {
            const { mail, passwordValid } = signInEmailValid;
            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordValid });

            expect(res.statusCode).toBe(200);
        });
    });

    describe('given the valid mail and medium password (passwordInValid)', () => {
        test('should return the status 401', async () => {
            const { mail, passwordMedium } = signInEmailValid;
            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordMedium });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Wrong password');
        });
    });

    describe('given the valid mail and weak password (passWordInValid)', () => {
        test('should return the status 401', async () => {
            const { mail, passwordWeak } = signInEmailValid;
            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordWeak });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Wrong password');
        });
    });

    describe('given the email does not exists and weak password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordWeak } = signInEmailNotExist;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordWeak });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Account not exist');
        });
    });

    describe('given the email does not exists and medium password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordMedium } = signInEmailNotExist;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordMedium });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Account not exist');
        });
    });

    describe('given the email does not exists and strong password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordStrong } = signInEmailNotExist;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordStrong });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Account not exist');
        });
    });

    describe('given the email not standard and weak password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordStrong } = signInEmailNotStandard;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordStrong });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Email does not format');
        });
    });

    describe('given the email not standard and medium password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordMedium } = signInEmailNotStandard;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordMedium });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Email does not format');
        });
    });

    describe('given the email not standard and strong password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordStrong } = signInEmailNotStandard;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordStrong });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Email does not format');
        });
    });
});
