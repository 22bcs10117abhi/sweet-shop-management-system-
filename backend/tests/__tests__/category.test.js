import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../src/app.js';
import { Category } from '../../src/models/category.model.js';
import { generateToken } from '../../src/utils/tokenGenerator.js';

describe('Category API Tests', () => {
  let authToken;

  beforeEach(async () => {
    // Generate test token
    authToken = generateToken({
      address: 'test@example.com',
      contractAddress: 'test-contract'
    });
  });

  describe('GET /api/v1/categories', () => {
    it('should get all categories', async () => {
      await Category.create({ name: 'Sweets', description: 'Traditional sweets' });
      
      const response = await supertest(app)
        .get('/api/v1/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return empty array when no categories exist', async () => {
      const response = await supertest(app)
        .get('/api/v1/categories')
        .expect(200);

      expect(response.body.data).toEqual([]);
    });
  });

  describe('POST /api/v1/categories', () => {
    it('should create a new category with valid data', async () => {
      const categoryData = {
        name: 'Chocolates',
        description: 'Various chocolates'
      };

      const response = await supertest(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(categoryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('chocolates');
      expect(response.body.data.description).toBe('Various chocolates');
    });

    it('should fail without authentication', async () => {
      const response = await supertest(app)
        .post('/api/v1/categories')
        .send({ name: 'Test' })
        .expect(401);
    });

    it('should fail without category name', async () => {
      const response = await supertest(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Test' })
        .expect(400);
    });

    it('should not allow duplicate category names', async () => {
      await Category.create({ name: 'existing', description: 'Test' });

      const response = await supertest(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'existing', description: 'Test' })
        .expect(400);
    });
  });

  describe('GET /api/v1/categories/:id', () => {
    it('should get category by id', async () => {
      const category = await Category.create({ name: 'test', description: 'test' });

      const response = await supertest(app)
        .get(`/api/v1/categories/${category._id}`)
        .expect(200);

      expect(response.body.data._id.toString()).toBe(category._id.toString());
    });

    it('should return 404 for non-existent category', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await supertest(app)
        .get(`/api/v1/categories/${fakeId}`)
        .expect(404);
    });
  });

  describe('PUT /api/v1/categories/:id', () => {
    it('should update category', async () => {
      const category = await Category.create({ name: 'old', description: 'old desc' });

      const response = await supertest(app)
        .put(`/api/v1/categories/${category._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'new', description: 'new desc' })
        .expect(200);

      expect(response.body.data.name).toBe('new');
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    it('should delete category', async () => {
      const category = await Category.create({ name: 'delete', description: 'test' });

      await request(app)
        .delete(`/api/v1/categories/${category._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deleted = await Category.findById(category._id);
      expect(deleted).toBeNull();
    });
  });
});

