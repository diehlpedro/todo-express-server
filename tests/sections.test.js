import request from 'supertest';
import express from 'express';
import sectionsRouter from '../routes/sections.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/sections', sectionsRouter);

const testUserId = process.env.TEST_USER;
const token = jwt.sign({ userId: testUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Sections API', () => {

    test('POST /sections should create a section', async () => {
        const newSection = { name: 'New Section', color: '#aabbcc' };
        const res = await request(app)
            .post('/sections')
            .set('Authorization', `Bearer ${token}`)
            .send(newSection);

        console.log('POST /sections response:', res.body);

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe(newSection.name);
        expect(res.body.color).toBe(newSection.color);
    });

    test('GET /sections should return an array', async () => {
        const res = await request(app)
            .get('/sections')
            .set('Authorization', `Bearer ${token}`);

        console.log('GET /sections response:', res.body);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('PUT /sections/:id should update a section', async () => {
        const createRes = await request(app)
            .post('/sections')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Section To Update', color: '#123456' });

        const section_id = createRes.body.id;
        expect(section_id).toBeDefined();

        const updateData = { name: 'Updated Section', color: '#654321' };
        const res = await request(app)
            .put(`/sections/${section_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);

        console.log('PUT /sections/:id response:', res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(updateData.name);
        expect(res.body.color).toBe(updateData.color);
    });

    test('DELETE /sections/:id should delete a section', async () => {
        const createRes = await request(app)
            .post('/sections')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Section To Delete', color: '#abcdef' });

        const section_id = createRes.body.id;
        expect(section_id).toBeDefined();

        const res = await request(app)
            .delete(`/sections/${section_id}`)
            .set('Authorization', `Bearer ${token}`);

        console.log('DELETE /sections/:id response status:', res.statusCode);

        expect(res.statusCode).toBe(204);
    });

    test('GET /sections without token should return 401', async () => {
        const res = await request(app).get('/sections');

        console.log('GET /sections without token response:', res.body);

        expect(res.statusCode).toBe(401);
    });

});
