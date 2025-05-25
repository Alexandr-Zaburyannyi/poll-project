/** @format */
const request = require('supertest');
const express = require('express');

jest.mock('../../src/controllers/pollController', () => ({
  create: jest.fn((req, res) => res.status(201).json({ id: 1 })),
  getAll: jest.fn((req, res) => res.json([{ id: 1, title: 'Test Poll' }])),
  getById: jest.fn((req, res) => res.json({ id: 1, title: 'Test Poll' })),
  update: jest.fn((req, res) => res.json({ updated: true })),
  delete: jest.fn((req, res) => res.json({ deleted: true })),
  getResults: jest.fn((req, res) =>
    res.json({
      poll: { id: 1, title: 'Test Poll' },
      options: [
        { id: 1, text: 'Option 1', votes: 7, percentage: 70 },
        { id: 2, text: 'Option 2', votes: 3, percentage: 30 },
      ],
      totalVotes: 10,
    })
  ),
}));

jest.mock('../../src/controllers/optionController', () => ({
  create: jest.fn((req, res) => res.status(201).json({ id: 1 })),
  getAll: jest.fn((req, res) =>
    res.json([{ id: 1, poll_id: 1, text: 'Option 1' }])
  ),
  getById: jest.fn((req, res) =>
    res.json({ id: 1, poll_id: 1, text: 'Option 1' })
  ),
  update: jest.fn((req, res) => res.json({ updated: true })),
  delete: jest.fn((req, res) => res.json({ deleted: true })),
}));

jest.mock('../../src/controllers/voteController', () => ({
  create: jest.fn((req, res) => res.status(201).json({ id: 1 })),
  getAll: jest.fn((req, res) =>
    res.json([{ id: 1, option_id: 1, voter_id: 'user1' }])
  ),
  getById: jest.fn((req, res) =>
    res.json({ id: 1, option_id: 1, voter_id: 'user1' })
  ),
  update: jest.fn((req, res) => res.json({ updated: true })),
  delete: jest.fn((req, res) => res.json({ deleted: true })),
}));

const routes = require('../../src/routes/index');

const app = express();
app.use(express.json());
app.use('/', routes);

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Poll Routes', () => {
    it('POST /polls should create a new poll', async () => {
      const response = await request(app)
        .post('/polls')
        .send({ title: 'New Poll', description: 'Description' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ id: 1 });
    });

    it('GET /polls should return all polls', async () => {
      const response = await request(app).get('/polls');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([{ id: 1, title: 'Test Poll' }]);
    });

    it('GET /polls/:id should return a poll by id', async () => {
      const response = await request(app).get('/polls/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ id: 1, title: 'Test Poll' });
    });

    it('GET /polls/:id/results should return poll results', async () => {
      const response = await request(app).get('/polls/1/results');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        poll: { id: 1, title: 'Test Poll' },
        options: [
          { id: 1, text: 'Option 1', votes: 7, percentage: 70 },
          { id: 2, text: 'Option 2', votes: 3, percentage: 30 },
        ],
        totalVotes: 10,
      });
    });

    it('PUT /polls/:id should update a poll', async () => {
      const response = await request(app).put('/polls/1').send({
        title: 'Updated Poll',
        description: 'Updated Description',
        is_active: 0,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ updated: true });
    });

    it('DELETE /polls/:id should delete a poll', async () => {
      const response = await request(app).delete('/polls/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ deleted: true });
    });
  });

  describe('Option Routes', () => {
    it('POST /options should create a new option', async () => {
      const response = await request(app)
        .post('/options')
        .send({ poll_id: 1, text: 'New Option' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ id: 1 });
    });

    it('GET /options should return all options', async () => {
      const response = await request(app).get('/options');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([{ id: 1, poll_id: 1, text: 'Option 1' }]);
    });

    it('GET /options/:id should return an option by id', async () => {
      const response = await request(app).get('/options/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ id: 1, poll_id: 1, text: 'Option 1' });
    });

    it('PUT /options/:id should update an option', async () => {
      const response = await request(app)
        .put('/options/1')
        .send({ poll_id: 1, text: 'Updated Option' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ updated: true });
    });

    it('DELETE /options/:id should delete an option', async () => {
      const response = await request(app).delete('/options/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ deleted: true });
    });
  });

  describe('Vote Routes', () => {
    it('POST /votes should create a new vote', async () => {
      const response = await request(app)
        .post('/votes')
        .send({ option_id: 1, voter_id: 'user1' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ id: 1 });
    });

    it('GET /votes should return all votes', async () => {
      const response = await request(app).get('/votes');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { id: 1, option_id: 1, voter_id: 'user1' },
      ]);
    });

    it('GET /votes/:id should return a vote by id', async () => {
      const response = await request(app).get('/votes/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ id: 1, option_id: 1, voter_id: 'user1' });
    });

    it('PUT /votes/:id should update a vote', async () => {
      const response = await request(app)
        .put('/votes/1')
        .send({ option_id: 2, voter_id: 'user1' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ updated: true });
    });

    it('DELETE /votes/:id should delete a vote', async () => {
      const response = await request(app).delete('/votes/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ deleted: true });
    });
  });
});
