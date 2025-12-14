import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn((key) => {
    if (key === 'token') return 'test-token'
    if (key === 'customerInfo') return JSON.stringify({ name: 'Test', phone: '1234567890' })
    return null
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({ data: {} }),
    status: 200,
  })
)

// Mock window.location
delete window.location
window.location = { href: '', replace: vi.fn() }

