import request from 'supertest';

import createServer from '../../utils/server';
import {
    signInEmailValid,
    signInEmailNotStandard,
    signInEmailNotExist,
    EmailFormat
} from '../../utilsTest/auth';

const server = createServer();

describe('Create Session', () => {
    describe('given the valid mail and strong password (passWordValid)', () => {
        test('should return the status 200', async () => {
            const { mail, passwordValid } = signInEmailValid;
            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordValid });

            expect(res.body.accessToken).not.toBeNull();
            expect(res.body.refreshToken).not.toBeNull();
            expect(res.statusCode).toBe(200);
        });
    });

    describe('given the valid mail and medium password (passWordInValid)', () => {
        test('should return the status 401', async () => {
            const { mail, passwordMedium } = signInEmailValid;
            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordMedium });

            expect(res.body.accessToken).toBeUndefined();
            expect(res.body.refreshToken).toBeUndefined();
            expect(res.statusCode).toBe(401);
        });
    });

    describe('given the valid mail and weak password (passWordInValid)', () => {
        test('should return the status 401', async () => {
            const { mail, passwordWeak } = signInEmailValid;
            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordWeak });

            expect(res.body.accessToken).toBeUndefined();
            expect(res.body.refreshToken).toBeUndefined();
            expect(res.statusCode).toBe(401);
        });
    });

    describe('given the email does not exists and weak password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordWeak } = signInEmailNotExist;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordWeak });

            expect(res.body.accessToken).toBeUndefined();
            expect(res.body.refreshToken).toBeUndefined();
            expect(res.statusCode).toBe(401);
        });
    });

    describe('given the email does not exists and medium password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordMedium } = signInEmailNotExist;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordMedium });

            expect(res.body.accessToken).toBeUndefined();
            expect(res.body.refreshToken).toBeUndefined();
            expect(res.statusCode).toBe(401);
        });
    });

    describe('given the email does not exists and strong password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordStrong } = signInEmailNotExist;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordStrong });

            expect(res.body.accessToken).toBeUndefined();
            expect(res.body.refreshToken).toBeUndefined();
            expect(res.statusCode).toBe(401);
        });
    });

    describe('given the email not standard and weak password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordStrong } = signInEmailNotStandard;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordStrong });

            expect(res.body.accessToken).toBeUndefined();
            expect(res.body.refreshToken).toBeUndefined();
            expect(EmailFormat(mail)).toEqual(false);
            expect(res.statusCode).toBe(401);
        });
    });

    describe('given the email not standard and medium password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordMedium } = signInEmailNotStandard;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordMedium });

            expect(res.body.accessToken).toBeUndefined();
            expect(res.body.refreshToken).toBeUndefined();
            expect(EmailFormat(mail)).toEqual(false);
            expect(res.statusCode).toBe(401);
        });
    });

    describe('given the email not standard and strong password', () => {
        test('should return the status 401', async () => {
            const { mail, passwordStrong } = signInEmailNotStandard;

            const res = await request(server)
                .post('/api/auth/login')
                .send({ mail: mail, password: passwordStrong });

            expect(res.body.accessToken).toBeUndefined();
            expect(res.body.refreshToken).toBeUndefined();
            expect(EmailFormat(mail)).toEqual(false);
            expect(res.statusCode).toBe(401);
        });
    });
});
