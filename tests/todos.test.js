import request from 'supertest';
import express from 'express';
import todosRouter from '../routes/todos.js';
import sectionsRouter from '../routes/sections.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/todos', todosRouter);
app.use('/sections', sectionsRouter);

const testUserId = process.env.TEST_USER;
const token = jwt.sign({ userId: testUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Todos API', () => {

    test('POST /todos should create a todo', async () => {
        const sectionRes = await request(app)
            .post('/sections')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'TodoSection', color: '#112233' });

        console.log('Section create response:', sectionRes.body);
        const section_id = sectionRes.body?.id;
        console.log('Section created with ID:', section_id);

        expect(section_id).toBeDefined();

        const newTodo = {
            title: 'New Task',
            done: false,
            section_id
        };

        const res = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);

        console.log('POST /todos response:', res.body);

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe(newTodo.title);
        expect(res.body.section_id).toBe(section_id);
    });

    test('GET /todos should return an array', async () => {
        const res = await request(app)
            .get('/todos')
            .set('Authorization', `Bearer ${token}`);

        console.log('GET /todos response:', res.body);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('PUT /todos/:id should update a todo', async () => {
        const sectionRes = await request(app)
            .post('/sections')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'UpdateSection', color: '#445566' });

        const section_id = sectionRes.body?.id;
        expect(section_id).toBeDefined();

        const createRes = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'To be updated', done: false, section_id });

        const todo_id = createRes.body.id;

        const updateData = {
            title: 'Updated Task',
            done: true
        };

        const res = await request(app)
            .put(`/todos/${todo_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);

        console.log('PUT /todos/:id response:', res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe(updateData.title);
        expect(res.body.done).toBe(true);
    });

    test('DELETE /todos/:id should delete a todo', async () => {
        const sectionRes = await request(app)
            .post('/sections')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'DeleteSection', color: '#778899' });

        const section_id = sectionRes.body?.id;
        expect(section_id).toBeDefined();

        const createRes = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'To be deleted', done: false, section_id });

        const todo_id = createRes.body.id;

        const res = await request(app)
            .delete(`/todos/${todo_id}`)
            .set('Authorization', `Bearer ${token}`);

        console.log('DELETE /todos/:id response status:', res.statusCode);

        expect(res.statusCode).toBe(204);
    });

    test('GET /todos without token should return 401', async () => {
        const res = await request(app).get('/todos');

        console.log('GET /todos without token response:', res.body);

        expect(res.statusCode).toBe(401);
    });
});
