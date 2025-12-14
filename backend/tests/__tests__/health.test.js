import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../src/app.js';

describe('Health Check API Tests', () => {
  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await supertest(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('healthy');
    });
  });
});

