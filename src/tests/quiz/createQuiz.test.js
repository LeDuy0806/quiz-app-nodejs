import request from 'supertest';

import createServer from '../../utils/server';
import login from '../../utilsTest/login';
import { createQuizRequest } from '../../utilsTest/createQuiz';

const server = createServer();

describe('Create Quiz', () => {
    let loginRes;

    beforeAll(async () => (loginRes = await login(server)));

    test('Should create a quiz', async () => {
        const res = await request(server)
            .post('/api/quiz')
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send(createQuizRequest);
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe(createQuizRequest.name);
    });

    test('Should return 400 if name is missing', async () => {
        const res = await request(server)
            .post('/api/quiz')
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send({ ...createQuizRequest, name: '' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Name is required');
    });

    test('Should return 400 if points per question is missing', async () => {
        const res = await request(server)
            .post('/api/quiz')
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send({ ...createQuizRequest, pointsPerQuestion: '' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Points per question is required');
    });

    test('Should return 400 if question list is empty', async () => {
        const res = await request(server)
            .post('/api/quiz')
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send({ ...createQuizRequest, questionList: [] });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Question List must be not empty!');
    });

    test('Should return 404 if category not found', async () => {
        const res = await request(server)
            .post('/api/quiz')
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send({
                ...createQuizRequest,
                category: {
                    ...createQuizRequest.category,
                    name: 'abcxyz'
                }
            });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Category not found');
    });

    test('Should return 404 if grade not found', async () => {
        const res = await request(server)
            .post('/api/quiz')
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send({
                ...createQuizRequest,
                grade: {
                    ...createQuizRequest.grade,
                    name: 'abcxyz'
                }
            });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Grade not found');
    });
});
