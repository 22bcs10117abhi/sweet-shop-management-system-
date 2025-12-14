import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../src/app.js';
import { Inventory } from '../../src/models/inventory.model.js';
import { Product } from '../../src/models/product.model.js';
import { Category } from '../../src/models/category.model.js';
import { generateToken } from '../../src/utils/tokenGenerator.js';

describe('Inventory API Tests', () => {
  let authToken;
  let productId;
  let categoryId;
  let inventoryId;

  beforeEach(async () => {
    authToken = generateToken({
      address: 'test@example.com',
      contractAddress: 'test-contract'
    });

    const category = await Category.create({ name: 'test-category', description: 'test' });
    categoryId = category._id;

    const product = await Product.create({
      name: 'Test Product',
      category: categoryId,
      price: 100,
      costPrice: 50,
      unit: 'kg',
      stock: 50
    });
    productId = product._id;

    const inventory = await Inventory.create({
      product: productId,
      quantity: 50,
      minStockLevel: 10
    });
    inventoryId = inventory._id;
  });

  describe('GET /api/v1/inventory', () => {
    it('should get all inventory', async () => {
      const response = await supertest(app)
        .get('/api/v1/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inventory).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/v1/inventory/low-stock', () => {
    it('should get low stock items', async () => {
      await Inventory.create({
        product: productId,
        quantity: 5,
        minStockLevel: 10
      });

      const response = await supertest(app)
        .get('/api/v1/inventory/low-stock')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/inventory/product/:productId/restock', () => {
    it('should restock inventory', async () => {
      const response = await supertest(app)
        .post(`/api/v1/inventory/product/${productId}/restock`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 20 })
        .expect(200);

      expect(response.body.data.quantity).toBe(70); // 50 + 20
    });
  });
});

