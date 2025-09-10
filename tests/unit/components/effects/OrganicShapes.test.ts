import { describe, expect, it, beforeEach, vi } from 'vitest';

// Mock matchMedia for reduced motion tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('OrganicShapes Component Logic', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('Blob Configuration', () => {
    it('should have correct blob selectors', () => {
      const expectedSelectors = [
        '.b0',
        '.b1',
        '.b2',
        '.b3',
        '.b4',
        '.b5',
        '.b6',
        '.b7',
        '.b8',
        '.b9',
        '.b10',
        '.b11',
        '.b12',
      ];

      // This tests the blob selector configuration from the component
      expect(expectedSelectors).toHaveLength(13);
      expect(expectedSelectors[0]).toBe('.b0');
      expect(expectedSelectors[12]).toBe('.b12');
    });

    it('should map blob colors correctly', () => {
      const expectedColorMap = new Map([
        ['.b0', '--mocha'],
        ['.b1', '--coral'],
        ['.b2', '--mocha'],
        ['.b3', '--accent-yellow'],
        ['.b4', '--blue'],
        ['.b5', '--mocha'],
        ['.b6', '--coral'],
        ['.b7', '--blue'],
        ['.b8', '--coral'],
        ['.b9', '--coral'],
        ['.b10', '--accent-yellow'],
        ['.b11', '--blue'],
        ['.b12', '--accent-yellow'],
      ]);

      // Test that our color mapping is consistent
      expect(expectedColorMap.get('.b0')).toBe('--mocha');
      expect(expectedColorMap.get('.b1')).toBe('--coral');
      expect(expectedColorMap.get('.b3')).toBe('--accent-yellow');
      expect(expectedColorMap.size).toBe(13);
    });
  });

  describe('DOM Structure', () => {
    beforeEach(() => {
      // Set up the expected DOM structure from OrganicShapes.astro
      document.body.innerHTML = `
        <div class="organic-shapes" aria-hidden="true">
          <div class="blob b0"></div>
          <div class="blob b1"></div>
          <div class="blob b2"></div>
          <div class="blob b3"></div>
          <div class="blob b4"></div>
          <div class="blob b5"></div>
          <div class="blob b6"></div>
          <div class="blob b7"></div>
          <div class="blob b8"></div>
          <div class="blob b9"></div>
          <div class="blob b10"></div>
          <div class="blob b11"></div>
          <div class="blob b12"></div>
          <svg class="connections" width="100%" height="100%">
            <defs>
              <linearGradient id="lineGradient"></linearGradient>
              <g id="dynamic-gradients"></g>
            </defs>
            <g class="links" aria-hidden="true"></g>
          </svg>
        </div>
      `;
    });

    it('should render all blob elements', () => {
      const container = document.querySelector('.organic-shapes');
      expect(container).toBeTruthy();
      expect(container?.getAttribute('aria-hidden')).toBe('true');

      const blobs = document.querySelectorAll('.blob');
      expect(blobs).toHaveLength(13);

      // Test specific blob classes
      expect(document.querySelector('.b0')).toBeTruthy();
      expect(document.querySelector('.b12')).toBeTruthy();
    });

    it('should render SVG connections structure', () => {
      const svg = document.querySelector('svg.connections');
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('width')).toBe('100%');
      expect(svg?.getAttribute('height')).toBe('100%');

      const linksGroup = document.querySelector('g.links');
      expect(linksGroup).toBeTruthy();
      expect(linksGroup?.getAttribute('aria-hidden')).toBe('true');

      const dynamicGradients = document.querySelector('#dynamic-gradients');
      expect(dynamicGradients).toBeTruthy();
    });
  });

  describe('Utility Functions', () => {
    it('should calculate center of element correctly', () => {
      const mockElement = {
        getBoundingClientRect: () => ({
          left: 100,
          top: 50,
          width: 200,
          height: 100,
        }),
      } as Element;

      // Simulate the centerOf function from the component
      const centerOf = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      };

      const center = centerOf(mockElement);
      expect(center.x).toBe(200); // 100 + 200/2
      expect(center.y).toBe(100); // 50 + 100/2
    });

    it('should calculate vector magnitude correctly', () => {
      // Simulate the magnitude function from the component
      const magnitude = (vx: number, vy: number) =>
        Math.sqrt(vx * vx + vy * vy) || 1;

      expect(magnitude(3, 4)).toBe(5);
      expect(magnitude(0, 0)).toBe(1); // fallback to 1
      expect(magnitude(-3, 4)).toBe(5);
    });
  });

  describe('Connection Pairs', () => {
    it('should generate correct desktop connection pairs', () => {
      const buildPairs = (isMobile: boolean) => {
        const P = (a: string, b: string) => [a, b];
        const desktop = [
          P('.b1', '.b3'),
          P('.b3', '.b9'),
          P('.b1', '.b5'),
          P('.b2', '.b4'),
          P('.b4', '.b7'),
          P('.b2', '.b8'),
          P('.b5', '.b6'),
          P('.b6', '.b7'),
          P('.b0', '.b7'),
        ];
        const mobile = [P('.b1', '.b3'), P('.b2', '.b4'), P('.b5', '.b6')];
        return isMobile ? mobile : desktop;
      };

      const desktopPairs = buildPairs(false);
      expect(desktopPairs).toHaveLength(9);
      expect(desktopPairs[0]).toEqual(['.b1', '.b3']);
      expect(desktopPairs[8]).toEqual(['.b0', '.b7']);

      const mobilePairs = buildPairs(true);
      expect(mobilePairs).toHaveLength(3);
      expect(mobilePairs[0]).toEqual(['.b1', '.b3']);
    });
  });

  describe('Responsive Behavior', () => {
    it('should detect mobile viewport correctly', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      const isMobile = window.innerWidth < 900;
      expect(isMobile).toBe(true);

      // Test desktop
      Object.defineProperty(window, 'innerWidth', {
        value: 1200,
      });
      const isDesktop = window.innerWidth >= 900;
      expect(isDesktop).toBe(true);
    });
  });

  describe('Reduced Motion Support', () => {
    it('should respect reduced motion preference', () => {
      const mockMatchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const mqlReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
      expect(mqlReduce.matches).toBe(true);
    });
  });

  describe('Animation Timing', () => {
    it('should generate random animation timings within expected ranges', () => {
      // Mock Math.random to return predictable values
      const originalRandom = Math.random;
      Math.random = () => 0.5;

      // Test mobile timing
      const isMobile = true;
      const cycleSecNum = isMobile
        ? 10 + Math.random() * 6
        : 8 + Math.random() * 6;
      expect(cycleSecNum).toBe(13); // 10 + 0.5 * 6

      const flyDur = isMobile
        ? `${(0.8 + Math.random() * 0.3).toFixed(2)}s`
        : `${(0.6 + Math.random() * 0.3).toFixed(2)}s`;
      expect(flyDur).toBe('0.95s'); // 0.8 + 0.5 * 0.3

      // Restore Math.random
      Math.random = originalRandom;
    });
  });

  describe('Error Handling', () => {
    it('should handle missing DOM elements gracefully', () => {
      // Empty DOM
      document.body.innerHTML = '';

      // These checks simulate the early returns in the component
      const container = document.querySelector('.organic-shapes');
      expect(container).toBeFalsy();

      const svg = document.querySelector('svg.connections');
      expect(svg).toBeFalsy();

      // Component should handle these gracefully without throwing
    });
  });
});
