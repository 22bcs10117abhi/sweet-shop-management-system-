# Backend Tests

## Test Structure

All test files are located in `tests/__tests__/` directory.

## Test Files

- `category.test.js` - Category API tests
- `product.test.js` - Product API tests
- `order.test.js` - Order API tests (including approval)
- `customer.test.js` - Customer API tests
- `admin.test.js` - Admin authentication tests
- `inventory.test.js` - Inventory management tests
- `health.test.js` - Health check tests

## Running Tests

```bash
# Install dependencies first
npm install

# Run all tests
npm test

# Watch mode
npm run test:watch

# Verbose output
npm run test:verbose
```

## Test Database

Tests use a separate test database: `gourmet_marketplace_management_test`
- Database is automatically cleaned after each test
- Database is dropped after all tests complete

## Test Output

Test results are logged to `tests/test-output.log`
Coverage reports are in `coverage/` directory

