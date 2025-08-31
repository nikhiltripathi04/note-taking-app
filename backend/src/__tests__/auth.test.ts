import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server'; // Assuming your server file is named server.ts

const MONGODB_URI = process.env.MONGO_URI as string;

describe('Authentication Endpoints', () => {
    beforeAll(async () => {
        await mongoose.connect(MONGODB_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should sign up a new user and return a 201 status code', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Test User',
                dob: '1990-01-01',
                email: 'test@example.com'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('OTP sent for verification.');
    });

    it('should return 400 if a user with the same email already exists', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Test User',
                dob: '1990-01-01',
                email: 'test@example.com'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('User already exists.');
    });

    it('should fail to sign up with missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Incomplete User'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Please enter all fields.');
    });
});