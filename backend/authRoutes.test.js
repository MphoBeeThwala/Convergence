const request = require('supertest');
const express = require('express');
const path = require('path');
const { User } = require(path.join(__dirname, 'models', 'User'));
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');
const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes'));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Setup a fresh test db for each test run
const dbFile = path.join(__dirname, 'test-db.json');
const adapter = new FileSync(dbFile);
const db = low(adapter);

beforeAll(async () => {
  // Ensure test db file exists and is empty
  fs.writeFileSync(dbFile, JSON.stringify({ users: [] }));
  db.set('users', []).write();
  app.locals.db = db;
});

beforeEach(async () => {
  // Reset users before each test
  db.set('users', []).write();
});

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        nationalID: 'ID123',
        password: 'Password123' // Strong password: min 8 chars, uppercase, number
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should not register with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User' });
    expect(res.statusCode).toEqual(400);
  });

  it('should not register with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'invalid-email',
        phone: '1234567890',
        nationalID: 'ID123',
        password: 'Password123'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toMatch(/invalid email/i);
  });

  it('should not register with weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test2@example.com',
        phone: '1234567890',
        nationalID: 'ID124',
        password: 'weakpass'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toMatch(/password must be at least 8 characters/i);
  });

  it('should not register duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'dupe@example.com',
        phone: '1234567890',
        nationalID: 'ID125',
        password: 'Password123'
      });
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User 2',
        email: 'dupe@example.com',
        phone: '0987654321',
        nationalID: 'ID126',
        password: 'Password123'
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toMatch(/already registered/i);
  });

  it('should login with correct credentials', async () => {
    // Register user with hashed password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    db.get('users').push(new User(1, 'Test User', 'test@example.com', '1234567890', 'ID123', hashedPassword)).write();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should not login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrongpass' });
    expect(res.statusCode).toEqual(401);
  });

  it('should update user account', async () => {
    // Register and login to get token
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Update User',
        email: 'update@example.com',
        phone: '1234567890',
        nationalID: 'ID127',
        password: 'Password123'
      });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'update@example.com', password: 'Password123' });
    const token = loginRes.body.token;
    const res = await request(app)
      .put('/api/auth/update')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', phone: '1112223333' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.name).toBe('Updated Name');
    expect(res.body.user.phone).toBe('1112223333');
  });

  it('should delete user account', async () => {
    // Register and login to get token
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Delete User',
        email: 'delete@example.com',
        phone: '1234567890',
        nationalID: 'ID128',
        password: 'Password123'
      });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'delete@example.com', password: 'Password123' });
    const token = loginRes.body.token;
    const res = await request(app)
      .delete('/api/auth/delete')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
