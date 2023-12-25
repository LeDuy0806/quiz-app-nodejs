import request from 'supertest';

import createServer from '../../utils/server';

const server = createServer();

const login = async () => {
    const loginRes = await request(server).post('/api/auth/login').send({
        mail: 'test@gmail.com',
        password: '123'
    });

    return loginRes;
};

describe('Get Quiz', () => {
    let loginRes;
    const invalidId = '657d1a7d95wekfjowe9183cb875db';

    beforeAll(async () => (loginRes = await login()));

    describe('Get Quiz By Id', () => {
        const correctId = '657d1a7d95f6a9183cb875da';
        const incorrectId = '657d1a7d95f6a9183cb875db';

        test('Should return a quiz', async () => {
            const res = await request(server)
                .get(`/api/quiz/${correctId}`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body._id).toBe(correctId);
        });

        test('Should return 404 if quiz not found', async () => {
            const res = await request(server)
                .get(`/api/quiz/${incorrectId}`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe(
                `Quiz with id ${incorrectId} is not found`
            );
        });

        test('Should return 400 if id is invalid', async () => {
            const res = await request(server)
                .get(`/api/quiz/${invalidId}`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid id');
        });
    });

    describe('Get Quiz By Creator Id', () => {
        const correctCreatorId = '657bb88103adc5835c989d27';
        const incorrectCreatorId = '657bb88103adc5835c989d28';
        const noQuizzesCreatorId = '6589334183fee1e51c33b35b';

        test('Should return quizzes', async () => {
            const res = await request(server)
                .get(`/api/quiz/teacher/${correctCreatorId}`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        test('Should return 404 if creator not found', async () => {
            const res = await request(server)
                .get(`/api/quiz/teacher/${incorrectCreatorId}`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('User not found');
        });

        test('Should return 400 if id is invalid', async () => {
            const res = await request(server)
                .get(`/api/quiz/teacher/${invalidId}`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid id');
        });

        test('Should return no quizzes if creator has no quizzes', async () => {
            const res = await request(server)
                .get(`/api/quiz/teacher/${noQuizzesCreatorId}`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('No quizzes found');
        });
    });
});
