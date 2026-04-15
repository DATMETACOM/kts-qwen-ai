// Test setup file
import '@testing-library/jest-dom';

// Mock Qwen API calls in tests
global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      output: {
        text: 'Mock Qwen explanation for testing purposes.'
      }
    })
  })
) as any;

// Suppress console warnings during tests
global.console.warn = vi.fn();
