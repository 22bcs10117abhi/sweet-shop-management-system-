import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../src/app.js';
import { Product } from '../../src/models/product.model.js';
import { Category } from '../../src/models/category.model.js';
import { generateToken } from '../../src/utils/tokenGenerator.js';

describe('Product API Tests', () => {
  let authToken;
  let categoryId;

  beforeEach(async () => {
    authToken = generateToken({
      address: 'test@example.com',
      contractAddress: 'test-contract'
    });

    const category = await Category.create({ name: 'test-category', description: 'test' });
    categoryId = category._id;
  });

  describe('GET /api/v1/products', () => {
    it('should get all products', async () => {
      await Product.create({
        name: 'Test Product',
        category: categoryId,
        price: 100,
        costPrice: 50,
        unit: 'kg',
        stock: 10
      });

      const response = await supertest(app)
        .get('/api/v1/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toBeInstanceOf(Array);
    });

    it('should filter products by category', async () => {
      const response = await supertest(app)
        .get(`/api/v1/products?category=${categoryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Gulab Jamun',
        category: categoryId,
        price: 200,
        costPrice: 100,
        unit: 'kg',
        stock: 50,
        minStockLevel: 10
      };

      const response = await supertest(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Gulab Jamun');
      expect(response.body.data.price).toBe(200);
    });

    it('should fail without required fields', async () => {
      const response = await supertest(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test' })
        .expect(400);
    });
  });

  describe('GET /api/v1/products/low-stock', () => {
    it('should get low stock products', async () => {
      await Product.create({
        name: 'Low Stock Product',
        category: categoryId,
        price: 100,
        costPrice: 50,
        unit: 'kg',
        stock: 5,
        minStockLevel: 10
      });

      const response = await supertest(app)
        .get('/api/v1/products/low-stock')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});

