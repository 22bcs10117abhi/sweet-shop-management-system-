import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../src/app.js';
import { Customer } from '../../src/models/customer.model.js';
import { generateToken } from '../../src/utils/tokenGenerator.js';

describe('Customer API Tests', () => {
  let authToken;

  beforeEach(async () => {
    authToken = generateToken({
      address: 'test@example.com',
      contractAddress: 'test-contract'
    });
  });

  describe('POST /api/v1/customers', () => {
    it('should create a new customer', async () => {
      const customerData = {
        name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com'
      };

      const response = await supertest(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.phone).toBe('1234567890');
    });

    it('should fail without name and phone', async () => {
      const response = await supertest(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'test@example.com' })
        .expect(400);
    });

    it('should not allow duplicate phone numbers', async () => {
      await Customer.create({ name: 'Existing', phone: '1234567890' });

      const response = await supertest(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'New', phone: '1234567890' })
        .expect(400);
    });
  });

  describe('GET /api/v1/customers', () => {
    it('should get all customers', async () => {
      await Customer.create({ name: 'Test', phone: '1111111111' });

      const response = await supertest(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.customers).toBeInstanceOf(Array);
    });
  });
});

