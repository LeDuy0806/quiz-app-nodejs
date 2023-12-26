import request from 'supertest';

import createServer from '../../utils/server';
import {
    leaderBoardInValidGame,
    leaderBoardInValidPin,
    leaderBoardInValidQuiz,
    leaderBoardValid
} from '../../utilsTest/leaderboard';

const server = createServer();

const login = async () => {
    const loginRes = await request(server).post('/api/auth/login').send({
        mail: 'test@gmail.com',
        password: '123'
    });

    return loginRes;
};

describe('Create Leaderboard', () => {
    let loginRes;

    beforeAll(async () => (loginRes = await login()));

    describe('given the valid game, quiz, pin', () => {
        const { game, quiz, pin, playerResultList, currentLeaderBoard } =
            leaderBoardValid;
        test('should return the newLeaderBoard', async () => {
            const res = await request(server)
                .post(`/api/leaderboard`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
                .send({
                    game,
                    quiz,
                    pin,
                    playerResultList,
                    currentLeaderBoard
                });

            expect(res.statusCode).toBe(201);
        });
    });

    describe('given the invalid game, and valid quiz, pin', () => {
        const { game, quiz, pin, playerResultList, currentLeaderBoard } =
            leaderBoardInValidGame;
        test('should return the newLeaderBoard', async () => {
            const res = await request(server)
                .post(`/api/leaderboard`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
                .send({
                    game,
                    quiz,
                    pin,
                    playerResultList,
                    currentLeaderBoard
                });
            expect(res.statusCode).toBe(404);
        });
    });

    describe('given the invalid quiz, and valid game, pin', () => {
        const { game, quiz, pin, playerResultList, currentLeaderBoard } =
            leaderBoardInValidQuiz;
        test('should return the newLeaderBoard', async () => {
            const res = await request(server)
                .post(`/api/leaderboard`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
                .send({
                    game,
                    quiz,
                    pin,
                    playerResultList,
                    currentLeaderBoard
                });
            expect(res.statusCode).toBe(404);
        });
    });
});
