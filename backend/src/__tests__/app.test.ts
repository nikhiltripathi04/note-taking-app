import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import User from '../models/user';
import Note from '../models/note';

const MONGODB_URI = process.env.MONGO_URI as string;
let authToken: string;
let userId: string;
let noteId: string;

describe('Full-Stack Application API Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(MONGODB_URI);
        await User.deleteMany({});
        await Note.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    // --- Authentication Tests ---

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
        userId = res.body.user.id;
    });

    it('should return 400 if a user with the same email already exists', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Another User',
                dob: '1991-01-01',
                email: 'test@example.com'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('User already exists.');
    });

    it('should verify OTP and return a JWT token', async () => {
        const res = await request(app)
            .post('/api/auth/verify-otp')
            .send({
                email: 'test@example.com',
                otp: 'some-otp' // Assuming successful verification
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        authToken = res.body.token;
    });

    // --- Note Management Tests ---

    it('should create a new note for the authenticated user', async () => {
        const res = await request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                content: 'This is my first test note.'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.content).toEqual('This is my first test note.');
        noteId = res.body._id;
    });

    it('should get all notes for the authenticated user', async () => {
        const res = await request(app)
            .get('/api/notes')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('user', userId);
    });

    it('should fail to create a note without authentication', async () => {
        const res = await request(app)
            .post('/api/notes')
            .send({ content: 'Unauthorized note' });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Not authorized, no token');
    });

    it('should delete a note for the authenticated user', async () => {
        const res = await request(app)
            .delete(`/api/notes/${noteId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Note removed');
    });

    it('should return 404 for a non-existent note', async () => {
        const res = await request(app)
            .delete('/api/notes/nonexistentid')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Note not found');
    });
});