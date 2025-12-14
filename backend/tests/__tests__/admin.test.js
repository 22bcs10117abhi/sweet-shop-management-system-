import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../src/app.js';
import { Admin } from '../../src/models/admin.model.js';

describe('Admin Authentication Tests', () => {
  beforeEach(async () => {
    // Create test admin
    await Admin.create({
      username: 'testadmin',
      password: 'test123',
      email: 'admin@test.com',
      role: 'admin',
      isActive: true
    });
  });

  describe('POST /api/v1/users/admin/login', () => {
    it('should login with valid credentials', async () => {
      const response = await supertest(app)
        .post('/api/v1/users/admin/login')
        .send({
          username: 'testadmin',
          password: 'test123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.username).toBe('testadmin');
    });

    it('should fail with invalid credentials', async () => {
      const response = await supertest(app)
        .post('/api/v1/users/admin/login')
        .send({
          username: 'testadmin',
          password: 'wrongpassword'
        })
        .expect(401);
    });

    it('should fail with non-existent username', async () => {
      const response = await supertest(app)
        .post('/api/v1/users/admin/login')
        .send({
          username: 'nonexistent',
          password: 'test123'
        })
        .expect(401);
    });
  });
});

