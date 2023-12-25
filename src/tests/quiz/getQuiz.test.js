import request from 'supertest';

import createServer from '../../utils/server';

const server = createServer();

describe('Get Quiz by ID at Quiz Controller', () => {
    test('Should return a quiz', async () => {
        const loginRes = await request(server).post('/api/auth/login').send({
            mail: 'long@gmail.com',
            password: '@@Long99Tran2k3'
        });

        const res = await request(server)
            .get('/api/quiz/657d1a7d95f6a9183cb875da')
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe('657d1a7d95f6a9183cb875da');
    });
});
