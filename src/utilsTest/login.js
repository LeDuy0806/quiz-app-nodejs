import request from 'supertest';

const login = async (server) => {
    const loginRes = await request(server).post('/api/auth/login').send({
        mail: 'test@gmail.com',
        password: '123'
    });

    return loginRes;
};

export default login;
