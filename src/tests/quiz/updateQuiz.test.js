import request from 'supertest';

import createServer from '../../utils/server';
import login from '../../utilsTest/login';
import { updateQuizRequest } from '../../utilsTest/quizRequest';

const server = createServer();

describe('Update Quiz', () => {
    let loginRes;
    const invalidId = '123';
    const existedQuizId = '65895a6e2e690847f671e036';
    const notExistedQuizId = '65895a6e2e690847f671e037';

    beforeAll(async () => (loginRes = await login(server)));

    test('Should update a quiz', async () => {
        const res = await request(server)
            .put(`/api/quiz/${existedQuizId}`)
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send(updateQuizRequest);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(existedQuizId);
        expect(res.body.name).toBe(updateQuizRequest.name);
    });

    test('Should return 404 if quiz not found', async () => {
        const res = await request(server)
            .put(`/api/quiz/${notExistedQuizId}`)
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send(updateQuizRequest);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`No quiz with id: ${notExistedQuizId}`);
    });

    test('Should return 400 if id is invalid', async () => {
        const res = await request(server)
            .put(`/api/quiz/${invalidId}`)
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send(updateQuizRequest);

        expect(res.statusCode).toBe(400);
        console.log(res.body);
        expect(res.body.message).toBe(`Invalid id: ${invalidId}`);
    });

    test('Should return 400 if name is missing', async () => {
        const res = await request(server)
            .put(`/api/quiz/${existedQuizId}`)
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send({ ...updateQuizRequest, name: '' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Name is required');
    });

    test('Should return 400 if points per question is missing', async () => {
        const res = await request(server)
            .put(`/api/quiz/${existedQuizId}`)
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send({ ...updateQuizRequest, pointsPerQuestion: '' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Points per question is required');
    });

    test('Should return 400 if question list is empty', async () => {
        const res = await request(server)
            .put(`/api/quiz/${existedQuizId}`)
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send({ ...updateQuizRequest, questionList: [] });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Question List must be not empty!');
    });

    test('Should return 404 if category not found', async () => {
        const res = await request(server)
            .put(`/api/quiz/${existedQuizId}`)
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send({
                ...updateQuizRequest,
                category: {
                    ...updateQuizRequest.category,
                    name: 'abcxyz'
                }
            });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Category not found');
    });

    test('Should return 404 if grade not found', async () => {
        const res = await request(server)
            .put(`/api/quiz/${existedQuizId}`)
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
            .send({
                ...updateQuizRequest,
                grade: {
                    ...updateQuizRequest.grade,
                    name: 'abcxyz'
                }
            });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Grade not found');
    });
});