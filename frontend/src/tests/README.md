# Frontend Tests

## Test Structure

All test files are located in `src/tests/__tests__/` directory.

## Test Files

- `Login.test.jsx` - Admin login component tests
- `CustomerDashboard.test.jsx` - Customer dashboard tests
- `Home.test.jsx` - Home page tests
- `api.test.js` - API service tests

## Running Tests

```bash
# Install dependencies first
npm install

# Run all tests
npm test

# Watch mode
npm run test:watch

# UI mode (interactive)
npm run test:ui

# Coverage report
npm run test:coverage
```

## Test Environment

- Uses jsdom for DOM simulation
- React Testing Library for component testing
- Mocked localStorage and fetch
- Auto-cleanup after each test

## Test Output

Test results are logged to `src/tests/test-output.log`
Coverage reports are in `coverage/` directory

