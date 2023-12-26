import request from 'supertest';
import createServer from '../../utils/server';
import login from '../../utilsTest/login';

const server = createServer();

describe('Update User', () => {
    let loginRes;
    beforeAll(async () => (loginRes = await login(server)));
    describe('give the only userId invalid', () => {
        test('should return a status 403', async () => {
            const mockUser = {
                _id: '1159216140',
                userName: 'QuocAnh',
                firstName: 'Quoc',
                lastName: 'Anh',
                bio: 'Beautiful',
                avatar: 'anhquoc.png'
            };
            const res = await request(server)
                .patch(`/api/user/${mockUser._id}`)
                .send(mockUser)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(403);
        });
    });

    describe('give the userId valid and full information valid', () => {
        test('should return a status 200', async () => {
            const mockUser = {
                _id: '657bb88103adc5835c989d27',
                userName: 'Long Tran',
                firstName: 'Long',
                lastName: 'Tran',
                bio: 'Beautiful',
                avatar: 'longtran.png'
            };
            const res = await request(server)
                .patch(`/api/user/${mockUser._id}`)
                .send(mockUser)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(200);
        });
    });

    describe('give the only userId valid and userName Invalid', () => {
        test('should insert a status 404', async () => {
            const mockUser = {
                _id: '657bb88103adc5835c989d27',
                userName: 'Long',
                firstName: 'Long',
                lastName: 'Tran',
                bio: 'Beautiful',
                avatar: 'longtran.png'
            };
            const res = await request(server)
                .patch(`/api/user/${mockUser._id}`)
                .send(mockUser)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('give the only userId valid and firstName Invalid', () => {
        test('should insert a status 404', async () => {
            const mockUser = {
                _id: '657bb88103adc5835c989d27',
                userName: 'Long Tran',
                firstName: 'LongTran',
                lastName: 'Tran',
                bio: 'Beautiful',
                avatar: 'longtran.png'
            };
            const res = await request(server)
                .patch(`/api/user/${mockUser._id}`)
                .send(mockUser)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('give the only userId valid and lastName Invalid', () => {
        test('should insert a status 404', async () => {
            const mockUser = {
                _id: '657bb88103adc5835c989d27',
                userName: 'Long Tran',
                firstName: 'Long',
                lastName: 'LongTran',
                bio: 'Beautiful',
                avatar: 'longtran.png'
            };
            const res = await request(server)
                .patch(`/api/user/${mockUser._id}`)
                .send(mockUser)
                .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

            expect(res.statusCode).toBe(404);
        });
    });
});
