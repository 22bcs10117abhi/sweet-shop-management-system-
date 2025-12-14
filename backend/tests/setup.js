import mongoose from 'mongoose';
import { DB_NAME } from '../src/constants.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// Test database connection
const TEST_DB_NAME = `${DB_NAME}_test`;

beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  try {
    await mongoose.connect(`${mongoUri}/${TEST_DB_NAME}`);
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ Test database connection failed:', error);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('✅ Test database cleaned and closed');
  } catch (error) {
    console.error('❌ Error cleaning test database:', error);
  }
});

// Clean up after each test
afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error('Error cleaning collections:', error);
  }
});

