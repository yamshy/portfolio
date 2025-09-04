import { vi } from 'vitest';

// Mock CSS custom properties for testing
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: (prop: string) => {
      // Mock Open Props values
      const mockProps: Record<string, string> = {
        '--size-1': '0.25rem',
        '--size-2': '0.5rem', 
        '--size-3': '0.75rem',
        '--size-4': '1rem',
        '--radius-2': '0.25rem',
        '--radius-3': '0.5rem',
        '--shadow-2': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        '--shadow-3': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        '--surface-1': '#fefcf8',
        '--gray-4': '#a8a29e',
        '--gray-9': '#1c1917',
        '--blue-6': '#2563eb',
      };
      return mockProps[prop] || '';
    }
  })
});

// Mock backdrop-filter support
Object.defineProperty(CSS, 'supports', {
  value: (property: string, value: string) => {
    if (property === 'backdrop-filter' && value.includes('blur')) {
      return true; // Mock as supported for most tests
    }
    return false;
  }
});

// Mock IntersectionObserver for scroll-based tests
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
})) as any;
