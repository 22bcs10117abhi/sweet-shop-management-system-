import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../src/app.js';
import { Order } from '../../src/models/order.model.js';
import { Customer } from '../../src/models/customer.model.js';
import { Product } from '../../src/models/product.model.js';
import { Category } from '../../src/models/category.model.js';
import { Inventory } from '../../src/models/inventory.model.js';
import { generateToken } from '../../src/utils/tokenGenerator.js';

describe('Order API Tests', () => {
  let authToken;
  let customerId;
  let productId;
  let categoryId;

  beforeEach(async () => {
    authToken = generateToken({
      address: 'test@example.com',
      contractAddress: 'test-contract'
    });

    const category = await Category.create({ name: 'test-category', description: 'test' });
    categoryId = category._id;

    const customer = await Customer.create({
      name: 'Test Customer',
      phone: '1234567890',
      email: 'test@example.com'
    });
    customerId = customer._id;

    const product = await Product.create({
      name: 'Test Product',
      category: categoryId,
      price: 100,
      costPrice: 50,
      unit: 'kg',
      stock: 100
    });
    productId = product._id;

    await Inventory.create({
      product: productId,
      quantity: 100,
      minStockLevel: 10
    });
  });

  describe('POST /api/v1/orders/customer', () => {
    it('should create customer order', async () => {
      const orderData = {
        customerName: 'New Customer',
        customerPhone: '9876543210',
        items: [
          { product: productId, quantity: 2 }
        ],
        discount: 0,
        tax: 0,
        paymentMethod: 'cash'
      };

      const response = await supertest(app)
        .post('/api/v1/orders/customer')
        .send(orderData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orderNumber).toBeDefined();
      expect(response.body.data.total).toBe(200);
    });

    it('should fail without items', async () => {
      const response = await supertest(app)
        .post('/api/v1/orders/customer')
        .send({
          customerName: 'Test',
          customerPhone: '1234567890',
          items: []
        })
        .expect(400);
    });

    it('should fail with insufficient stock', async () => {
      const response = await supertest(app)
        .post('/api/v1/orders/customer')
        .send({
          customerName: 'Test',
          customerPhone: '1234567890',
          items: [{ product: productId, quantity: 1000 }]
        })
        .expect(400);
    });
  });

  describe('POST /api/v1/orders/:id/approve', () => {
    it('should approve pending order', async () => {
      const order = await Order.create({
        orderNumber: `ORD-${Date.now()}-0001`,
        customer: customerId,
        items: [{
          product: productId,
          productName: 'Test Product',
          quantity: 1,
          unit: 'kg',
          price: 100,
          subtotal: 100
        }],
        subtotal: 100,
        total: 100,
        orderStatus: 'pending'
      });

      const response = await supertest(app)
        .post(`/api/v1/orders/${order._id}/approve`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.orderStatus).toBe('confirmed');
    });

    it('should fail to approve non-pending order', async () => {
      const order = await Order.create({
        orderNumber: `ORD-${Date.now()}-0002`,
        customer: customerId,
        items: [{
          product: productId,
          productName: 'Test Product',
          quantity: 1,
          unit: 'kg',
          price: 100,
          subtotal: 100
        }],
        subtotal: 100,
        total: 100,
        orderStatus: 'completed'
      });

      const response = await supertest(app)
        .post(`/api/v1/orders/${order._id}/approve`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });

  describe('POST /api/v1/orders/:id/reject', () => {
    it('should reject pending order', async () => {
      const order = await Order.create({
        orderNumber: `ORD-${Date.now()}-0003`,
        customer: customerId,
        items: [{
          product: productId,
          productName: 'Test Product',
          quantity: 1,
          unit: 'kg',
          price: 100,
          subtotal: 100
        }],
        subtotal: 100,
        total: 100,
        orderStatus: 'pending'
      });

      const response = await supertest(app)
        .post(`/api/v1/orders/${order._id}/reject`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ reason: 'Out of stock' })
        .expect(200);

      expect(response.body.data.orderStatus).toBe('cancelled');
    });
  });

  describe('GET /api/v1/orders/customer', () => {
    it('should get customer orders by phone', async () => {
      await Order.create({
        orderNumber: `ORD-${Date.now()}-0004`,
        customer: customerId,
        items: [{
          product: productId,
          productName: 'Test Product',
          quantity: 1,
          unit: 'kg',
          price: 100,
          subtotal: 100
        }],
        subtotal: 100,
        total: 100
      });

      const response = await supertest(app)
        .get('/api/v1/orders/customer?phone=1234567890')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders.length).toBeGreaterThan(0);
    });
  });
});

