import { MongoClient } from 'mongodb';

describe('User Functionality', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect('mongodb://127.0.0.1:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = await connection.db('Quizzes_App');
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('INSERT', () => {
        it('should insert a user does not exists collection', async () => {
            const users = db.collection('users');
            const mockUser = { _id: 'some-user-id', name: 'John' };
            await users.insertOne(mockUser);
            const insertedUser = await users.findOne({ _id: 'some-user-id' });
            expect(insertedUser).toEqual(mockUser);
        });
    });
});
