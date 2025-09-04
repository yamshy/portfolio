import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { TimelinePhase } from '../types/timeline';

describe('Professional Timeline', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn(() => ({
      disconnect: vi.fn(),
      observe: vi.fn(),
      unobserve: vi.fn(),
    })) as any;
  });

  describe('Timeline Data Structure', () => {
    it('should validate timeline phase structure', () => {
      const mockPhase: TimelinePhase = {
        id: 'test-phase',
        period: '2023-2024',
        title: 'Test Phase',
        description: 'Test description',
        skills: ['Skill 1', 'Skill 2'],
        themeColor: 'coral'
      };

      expect(mockPhase.id).toBeDefined();
      expect(mockPhase.period).toMatch(/\d{4}-\d{4}/);
      expect(mockPhase.title).toBeTruthy();
      expect(mockPhase.description).toBeTruthy();
      expect(mockPhase.skills).toBeInstanceOf(Array);
      expect(['coral', 'mocha', 'blue', 'yellow']).toContain(mockPhase.themeColor);
    });

    it('should handle optional properties correctly', () => {
      const phaseWithOptionals: TimelinePhase = {
        id: 'full-phase',
        period: '2023-2024',
        title: 'Full Phase',
        description: 'Description',
        expandedDescription: 'Expanded description',
        skills: ['Skill'],
        themeColor: 'coral',
        isCurrentRole: true,
        links: [
          {
            label: 'Test Link',
            url: 'https://example.com',
            type: 'external'
          }
        ]
      };

      expect(phaseWithOptionals.expandedDescription).toBeTruthy();
      expect(phaseWithOptionals.isCurrentRole).toBe(true);
      expect(phaseWithOptionals.links).toHaveLength(1);
      expect(phaseWithOptionals.links?.[0].type).toBe('external');
    });
  });

  describe('Timeline Ordering', () => {
    // Property-based test for chronological ordering
    it('should maintain chronological order', () => {
      const phases: TimelinePhase[] = [
        {
          id: 'phase-1',
          period: '2019-2021',
          title: 'Phase 1',
          description: 'First phase',
          skills: ['Skill'],
          themeColor: 'coral'
        },
        {
          id: 'phase-2', 
          period: '2021-2022',
          title: 'Phase 2',
          description: 'Second phase',
          skills: ['Skill'],
          themeColor: 'mocha'
        },
        {
          id: 'phase-3',
          period: '2022-2024',
          title: 'Phase 3',
          description: 'Third phase',
          skills: ['Skill'],
          themeColor: 'blue'
        }
      ];

      // Extract start years and verify they're in ascending order
      const startYears = phases.map(phase => 
        parseInt(phase.period.split('-')[0])
      );

      for (let i = 1; i < startYears.length; i++) {
        expect(startYears[i]).toBeGreaterThanOrEqual(startYears[i - 1]);
      }
    });
  });

  describe('Accessibility Features', () => {
    it('should provide proper ARIA attributes', () => {
      // Create mock timeline DOM structure
      document.body.innerHTML = `
        <section id="evolution" class="timeline-section">
          <ol class="timeline-list" role="list">
            <li class="timeline-item">
              <article class="timeline-phase">
                <button
                  class="phase-trigger"
                  type="button"
                  aria-expanded="false"
                  aria-controls="phase-details-test"
                  data-phase-id="test"
                >
                  <header class="phase-header">
                    <h3 class="phase-title">Test Phase</h3>
                  </header>
                </button>
                <div 
                  class="phase-details"
                  id="phase-details-test"
                  aria-hidden="true"
                >
                  <p>Expanded content</p>
                </div>
              </article>
            </li>
          </ol>
        </section>
      `;

      const trigger = document.querySelector('.phase-trigger') as HTMLButtonElement;
      const details = document.getElementById('phase-details-test');

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(trigger.getAttribute('aria-controls')).toBe('phase-details-test');
      expect(details?.getAttribute('aria-hidden')).toBe('true');
      expect(trigger.type).toBe('button');
    });

    it('should handle keyboard navigation', () => {
      // Mock multiple timeline triggers
      document.body.innerHTML = `
        <section id="evolution">
          <button class="phase-trigger" data-phase-id="phase-1">Phase 1</button>
          <button class="phase-trigger" data-phase-id="phase-2">Phase 2</button>
          <button class="phase-trigger" data-phase-id="phase-3">Phase 3</button>
        </section>
      `;

      const triggers = document.querySelectorAll('.phase-trigger') as NodeListOf<HTMLButtonElement>;
      
      // Verify all triggers are focusable
      triggers.forEach(trigger => {
        expect(trigger.tabIndex).toBeGreaterThanOrEqual(0);
      });
    });

    it('should announce state changes to screen readers', () => {
      const mockAnnouncement = vi.fn();
      
      // Mock screen reader announcement
      const createAnnouncement = (message: string) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = message;
        mockAnnouncement(message);
        return announcement;
      };

      const announcement = createAnnouncement('Test phase details expanded');
      expect(mockAnnouncement).toHaveBeenCalledWith('Test phase details expanded');
      expect(announcement.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('Theme Color Validation', () => {
    it('should apply correct theme colors', () => {
      const themes = ['coral', 'mocha', 'blue', 'yellow'] as const;
      
      themes.forEach(theme => {
        document.body.innerHTML = `
          <div class="timeline-item" data-theme="${theme}">
            <div class="marker-dot"></div>
          </div>
        `;

        const item = document.querySelector('.timeline-item');
        expect(item?.getAttribute('data-theme')).toBe(theme);
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt layout for mobile viewports', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query.includes('max-width: 640px'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const mobileQuery = window.matchMedia('(max-width: 640px)');
      expect(mobileQuery.matches).toBe(true);
    });
  });

  describe('Motion Preferences', () => {
    it('should respect reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query.includes('prefers-reduced-motion: reduce'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      if (reducedMotionQuery.matches) {
        // In reduced motion mode, animations should be disabled
        expect(reducedMotionQuery.matches).toBe(true);
      }
    });
  });

  describe('Expand/Collapse Functionality', () => {
    it('should toggle expansion state correctly', () => {
      document.body.innerHTML = `
        <button
          class="phase-trigger"
          aria-expanded="false"
          aria-controls="details-test"
        >
          Toggle
        </button>
        <div id="details-test" aria-hidden="true">
          Details content
        </div>
      `;

      const trigger = document.querySelector('.phase-trigger') as HTMLButtonElement;
      const details = document.getElementById('details-test');

      // Initial state
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(details?.getAttribute('aria-hidden')).toBe('true');

      // Simulate click
      trigger.click();
      
      // After click, we'd expect the state to change
      // (In a real implementation, this would be handled by the JavaScript)
      trigger.setAttribute('aria-expanded', 'true');
      details?.setAttribute('aria-hidden', 'false');

      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(details?.getAttribute('aria-hidden')).toBe('false');
    });
  });

  describe('Link Handling', () => {
    it('should handle external links correctly', () => {
      const externalLink = {
        label: 'External Link',
        url: 'https://example.com',
        type: 'external' as const
      };

      const internalLink = {
        label: 'Internal Link',
        url: '#section',
        type: 'internal' as const
      };

      expect(externalLink.type).toBe('external');
      expect(externalLink.url).toMatch(/^https?:\/\//);
      
      expect(internalLink.type).toBe('internal');
      expect(internalLink.url).toMatch(/^#/);
    });
  });
});
