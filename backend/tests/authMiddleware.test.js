const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../src/middleware/authMiddleware');

process.env.JWT_SECRET = 'testsecret';

const app = express();
app.use(express.json());

// Test route protected by authMiddleware
app.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

describe('Auth Middleware', () => {
  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized: No token provided');
  });

  it('should return 401 if token is invalid', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized: Invalid token');
  });

  it('should grant access if token is valid', async () => {
    const token = jwt.sign({ id: 1, name: 'Test User' }, process.env.JWT_SECRET);
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Access granted');
    expect(response.body.user).toMatchObject({ id: 1, name: 'Test User' });
  });
});
