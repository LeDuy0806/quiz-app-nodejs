import request from 'supertest';

import createServer from '../../utils/server';
import {
    gameHostInValid,
    gamePinInValid,
    gameQuizInValid,
    gameValid
} from '../../utilsTest/game';

const server = createServer();

const login = async () => {
    const loginRes = await request(server).post('/api/auth/login').send({
        mail: 'test@gmail.com',
        password: '123'
    });

    return loginRes;
};

describe('Create Game', () => {
    let loginRes;

    beforeAll(async () => (loginRes = await login()));

    describe('given the valid host, quiz, pin', () => {
        const { host, quiz, pin, playList, playerResultList } = gameValid;
        test('should return the game', async () => {
            const res = await request(server)
                .post(`/api/game`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
                .send({
                    host,
                    quiz,
                    pin,
                    playList,
                    playerResultList
                });

            expect(res.statusCode).toBe(201);
        });
    });

    describe('given the invalid host, valid quiz, pin', () => {
        const { host, quiz, pin, playList, playerResultList } = gameHostInValid;
        test('should return the 404 bad request', async () => {
            const res = await request(server)
                .post(`/api/game`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
                .send({
                    host,
                    quiz,
                    pin,
                    playList,
                    playerResultList
                });

            expect(res.statusCode).toBe(404);
        });
    });

    describe('given the invalid quiz, valid host, pin', () => {
        const { host, quiz, pin, playList, playerResultList } = gameQuizInValid;
        test('should return the 404 bad request', async () => {
            const res = await request(server)
                .post(`/api/game`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
                .send({
                    host,
                    quiz,
                    pin,
                    playList,
                    playerResultList
                });

            expect(res.statusCode).toBe(404);
        });
    });

    describe('given the invalid pin, valid host, quiz', () => {
        const { host, quiz, pin, playList, playerResultList } = gamePinInValid;
        test('should return the 404 bad request', async () => {
            const res = await request(server)
                .post(`/api/game`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
                .send({
                    host,
                    quiz,
                    pin,
                    playList,
                    playerResultList
                });

            expect(res.statusCode).toBe(404);
        });
    });
});
