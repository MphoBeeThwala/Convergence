const request = require('supertest');
const app = require('../src/index');
const db = require('../src/models');
const shoppingListRoutes = require('../src/routes/shoppingListRoutes');
const { sequelize, User, ShoppingList, ShoppingListItem } = db;
const fs = require('fs');
const path = require('path');

process.env.JWT_SECRET = 'testsecret';

// Helper to register and login a user, returning the JWT
async function registerAndLogin() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'TestPassword123!';
  await request(app)
    .post('/api/users/register')
    .send({ email, password });
  const loginRes = await request(app)
    .post('/api/users/login')
    .send({ email, password });
  return loginRes.body.token;
}

describe('Shopping List Routes', () => {
  let token;
  let productId;

  beforeAll(async () => {
    // Remove the SQLite database file to ensure a clean state
    const dbPath = path.resolve(__dirname, '../database.sqlite');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    await sequelize.sync({ force: true });
    token = await registerAndLogin();
    // Create a product for use in item tests
    const productRes = await db.Product.create({
      name: 'Test Product',
      description: 'A product for testing',
      price: 1.99,
      retailerId: '00000000-0000-0000-0000-000000000000', // Use a dummy UUID or create a retailer if needed
    });
    productId = productRes.id;
  });

  // Helper to set auth header
  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  it('should create a shopping list', async () => {
    const response = await request(app)
      .post('/api/shopping-lists')
      .set(authHeader())
      .send({ name: 'Groceries' });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Groceries');
  });

  it('should fetch shopping lists', async () => {
    await request(app)
      .post('/api/shopping-lists')
      .set(authHeader())
      .send({ name: 'Fetch Test' });
    const response = await request(app)
      .get('/api/shopping-lists')
      .set(authHeader());
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should delete a shopping list', async () => {
    const createRes = await request(app)
      .post('/api/shopping-lists')
      .set(authHeader())
      .send({ name: 'To Delete' });
    const shoppingListId = createRes.body.id;
    const response = await request(app)
      .delete(`/api/shopping-lists/${shoppingListId}`)
      .set(authHeader());
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Shopping list deleted successfully.');
  });

  it('should add an item to a shopping list', async () => {
    const createRes = await request(app)
      .post('/api/shopping-lists')
      .set(authHeader())
      .send({ name: 'With Items' });
    const shoppingListId = createRes.body.id;
    const response = await request(app)
      .post(`/api/shopping-lists/${shoppingListId}/items`)
      .set(authHeader())
      .send({ name: 'Milk', quantity: 2, productId });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Milk');
  });

  it('should fetch items from a shopping list', async () => {
    const createRes = await request(app)
      .post('/api/shopping-lists')
      .set(authHeader())
      .send({ name: 'Fetch Items' });
    const shoppingListId = createRes.body.id;
    await request(app)
      .post(`/api/shopping-lists/${shoppingListId}/items`)
      .set(authHeader())
      .send({ name: 'Eggs', quantity: 12, productId });
    const response = await request(app)
      .get(`/api/shopping-lists/${shoppingListId}/items`)
      .set(authHeader());
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should delete an item from a shopping list', async () => {
    const createRes = await request(app)
      .post('/api/shopping-lists')
      .set(authHeader())
      .send({ name: 'Delete Item' });
    const shoppingListId = createRes.body.id;
    const addItemRes = await request(app)
      .post(`/api/shopping-lists/${shoppingListId}/items`)
      .set(authHeader())
      .send({ name: 'Butter', quantity: 1, productId });
    const itemId = addItemRes.body.id;
    const response = await request(app)
      .delete(`/api/shopping-lists/${shoppingListId}/items/${itemId}`)
      .set(authHeader());
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item deleted successfully.');
  });
});
