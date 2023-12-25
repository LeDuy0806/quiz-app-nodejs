import request from 'supertest';

import createServer from '../../utils/server';
import login from '../../utilsTest/login';

const server = createServer();

describe('Get Quiz', () => {
    let loginRes;
    const invalidId = '123';

    beforeAll(async () => (loginRes = await login(server)));

    describe('Get Quiz By Id', () => {
        const existedQuizId = '657d1a7d95f6a9183cb875da';
        const notExistedQuizId = '657d1a7d95f6a9183cb875db';

        test('Should return a quiz', async () => {
            const res = await request(server)
                .get(`/api/quiz/${existedQuizId}`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body._id).toBe(existedQuizId);
        });

        test('Should return 404 if quiz not found', async () => {
            const res = await request(server)
                .get(`/api/quiz/${notExistedQuizId}`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe(
                `Quiz with id ${notExistedQuizId} is not found`
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

        test('Should return no quizzes message if creator has no quizzes', async () => {
            const res = await request(server)
                .get(`/api/quiz/teacher/${noQuizzesCreatorId}`)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('No quizzes found');
        });
    });

    describe('Get Quiz By Search', () => {
        test('Should return quizzes when search by quiz name', async () => {
            const res = await request(server)
                .get('/api/quiz/search?searchName=i')
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(200);
            const isCorrectName = res.body.every((quiz) =>
                quiz.name.toLowerCase().includes('i')
            );
            expect(isCorrectName).toBe(true);
        });

        test('Should return quizzes when search by quiz tags', async () => {
            const res = await request(server)
                .get('/api/quiz/search?tags=t')
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(200);
            const isCorrectTag = res.body.every((quiz) => {
                const searchTags = quiz.tags.filter((tag) =>
                    tag.toLowerCase().includes('t')
                );
                return searchTags.length > 0;
            });
            expect(isCorrectTag).toBe(true);
        });

        test('Should return quizzes when search by quiz name and tags', async () => {
            const res = await request(server)
                .get('/api/quiz/search?searchName=i&tags=t')
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body[0].name.toLowerCase()).toContain('i');
            const searchTags = res.body[0].tags.filter((tag) =>
                tag.toLowerCase().includes('t')
            );
            expect(searchTags[0].toLowerCase()).toContain('t');
        });

        test('Should return empty array if no quizzes found', async () => {
            const res = await request(server)
                .get('/api/quiz/search?searchName=wabcxyzw&tags=abcxyz')
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(0);
        });
    });
});
