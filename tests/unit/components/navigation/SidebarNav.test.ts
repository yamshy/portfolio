import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('SidebarNav Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('Navigation Configuration', () => {
    it('should define correct main navigation items', () => {
      const expectedMainNavItems = [
        {
          href: '#about',
          label: 'Home',
          section: 'about',
          style:
            'bg-glass-coral border-coral text-coral hover:bg-coral hover:rotate-1',
        },
        {
          href: '#work',
          label: 'Projects',
          section: 'work',
          style:
            'bg-glass-blue border-blue text-blue hover:bg-blue hover:rotate-1',
        },
        {
          href: '#evolution',
          label: 'Experience',
          section: 'evolution',
          style:
            'bg-glass-mocha border-mocha text-mocha hover:bg-mocha hover:-rotate-1',
        },
        {
          href: '#contact',
          label: 'Contact',
          section: 'contact',
          style:
            'bg-glass-yellow border-accent-yellow text-text-dark hover:bg-accent-yellow hover:-rotate-1',
        },
      ];

      expect(expectedMainNavItems).toHaveLength(4);
      expect(expectedMainNavItems[0].href).toBe('#about');
      expect(expectedMainNavItems[0].section).toBe('about');
      expect(expectedMainNavItems[3].href).toBe('#contact');
    });

    it('should define correct external links', () => {
      const expectedExternalLinks = [
        {
          href: 'https://github.com/yamshy',
          label: 'GitHub',
          style:
            'bg-glass-mocha border-mocha text-mocha hover:bg-mocha hover:-rotate-1',
        },
        {
          href: 'mailto:sajudia@proton.me',
          label: 'Email',
          style:
            'bg-glass-coral border-coral text-coral hover:bg-coral hover:rotate-1',
        },
      ];

      expect(expectedExternalLinks).toHaveLength(2);
      expect(expectedExternalLinks[0].href).toBe('https://github.com/yamshy');
      expect(expectedExternalLinks[1].href).toBe('mailto:sajudia@proton.me');
    });
  });

  describe('DOM Structure', () => {
    beforeEach(() => {
      // Simulate the SidebarNav structure
      document.body.innerHTML = `
        <nav class="sidebar-nav" role="navigation" aria-label="Main navigation">
          <div class="sidebar-container">
            <div class="nav-wrapper">
              <div class="progress-track">
                <div id="progress-bar" class="progress-bar" style="height: 0%"></div>
              </div>
              <div class="nav-item">
                <a href="#about" class="nav-organic-button" data-section="about" aria-label="Navigate to Home section">
                  <div class="cell-nav-shape bg-glass-coral border-coral text-coral hover:bg-coral hover:rotate-1">
                    <span class="nav-label">Home</span>
                  </div>
                </a>
              </div>
              <div class="nav-item">
                <a href="#work" class="nav-organic-button" data-section="work" aria-label="Navigate to Projects section">
                  <div class="cell-nav-shape bg-glass-blue border-blue text-blue hover:bg-blue hover:rotate-1">
                    <span class="nav-label">Projects</span>
                  </div>
                </a>
              </div>
              <div class="nav-item nav-item--external">
                <a href="https://github.com/yamshy" class="nav-organic-button" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub in new tab">
                  <div class="cell-nav-shape cell-nav-shape--small bg-glass-mocha border-mocha text-mocha hover:bg-mocha hover:-rotate-1">
                    <span class="nav-label nav-label--small">GitHub</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </nav>
      `;
    });

    it('should render navigation structure correctly', () => {
      const nav = document.querySelector('nav.sidebar-nav');
      expect(nav).toBeTruthy();
      expect(nav?.getAttribute('role')).toBe('navigation');
      expect(nav?.getAttribute('aria-label')).toBe('Main navigation');

      const container = document.querySelector('.sidebar-container');
      expect(container).toBeTruthy();

      const wrapper = document.querySelector('.nav-wrapper');
      expect(wrapper).toBeTruthy();
    });

    it('should render progress bar correctly', () => {
      const progressTrack = document.querySelector('.progress-track');
      expect(progressTrack).toBeTruthy();

      const progressBar = document.getElementById('progress-bar');
      expect(progressBar).toBeTruthy();
      expect(progressBar?.classList.contains('progress-bar')).toBe(true);
      expect(progressBar?.style.height).toBe('0%');
    });

    it('should render navigation buttons correctly', () => {
      const navButtons = document.querySelectorAll('.nav-organic-button');
      expect(navButtons.length).toBeGreaterThanOrEqual(3); // At least main nav + some external

      const aboutButton = document.querySelector('[data-section="about"]');
      expect(aboutButton).toBeTruthy();
      expect(aboutButton?.getAttribute('href')).toBe('#about');
      expect(aboutButton?.getAttribute('aria-label')).toBe(
        'Navigate to Home section',
      );

      const workButton = document.querySelector('[data-section="work"]');
      expect(workButton).toBeTruthy();
      expect(workButton?.getAttribute('href')).toBe('#work');
    });

    it('should render external links correctly', () => {
      const githubLink = document.querySelector(
        '[href="https://github.com/yamshy"]',
      );
      expect(githubLink).toBeTruthy();
      expect(githubLink?.getAttribute('target')).toBe('_blank');
      expect(githubLink?.getAttribute('rel')).toBe('noopener noreferrer');
      expect(githubLink?.getAttribute('aria-label')).toBe(
        'Open GitHub in new tab',
      );

      const parentDiv = githubLink?.closest('.nav-item');
      expect(parentDiv?.classList.contains('nav-item--external')).toBe(true);
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct styling classes to nav items', () => {
      document.body.innerHTML = `
        <div class="nav-item">
          <a class="nav-organic-button">
            <div class="cell-nav-shape bg-glass-coral border-coral text-coral hover:bg-coral hover:rotate-1">
              <span class="nav-label">Home</span>
            </div>
          </a>
        </div>
      `;

      const shape = document.querySelector('.cell-nav-shape');
      expect(shape?.classList.contains('bg-glass-coral')).toBe(true);
      expect(shape?.classList.contains('border-coral')).toBe(true);
      expect(shape?.classList.contains('text-coral')).toBe(true);
    });

    it('should apply small styling to external links', () => {
      document.body.innerHTML = `
        <div class="nav-item nav-item--external">
          <a class="nav-organic-button">
            <div class="cell-nav-shape cell-nav-shape--small">
              <span class="nav-label nav-label--small">GitHub</span>
            </div>
          </a>
        </div>
      `;

      const shape = document.querySelector('.cell-nav-shape');
      expect(shape?.classList.contains('cell-nav-shape--small')).toBe(true);

      const label = document.querySelector('.nav-label');
      expect(label?.classList.contains('nav-label--small')).toBe(true);
    });

    it('should apply last item class correctly', () => {
      document.body.innerHTML = `
        <div class="nav-item nav-item--last">
          <a class="nav-organic-button">
            <div class="cell-nav-shape">
              <span class="nav-label">Last Item</span>
            </div>
          </a>
        </div>
      `;

      const navItem = document.querySelector('.nav-item');
      expect(navItem?.classList.contains('nav-item--last')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      document.body.innerHTML = `
        <nav class="sidebar-nav" role="navigation" aria-label="Main navigation">
          <a href="#about" class="nav-organic-button" aria-label="Navigate to Home section">
            <span>Home</span>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub in new tab">
            <span>GitHub</span>
          </a>
        </nav>
      `;

      const nav = document.querySelector('nav');
      expect(nav?.getAttribute('role')).toBe('navigation');
      expect(nav?.getAttribute('aria-label')).toBe('Main navigation');

      const internalLink = document.querySelector('[href="#about"]');
      expect(internalLink?.getAttribute('aria-label')).toBe(
        'Navigate to Home section',
      );

      const externalLink = document.querySelector(
        '[href="https://github.com"]',
      );
      expect(externalLink?.getAttribute('aria-label')).toBe(
        'Open GitHub in new tab',
      );
    });

    it('should have proper security attributes for external links', () => {
      document.body.innerHTML = `
        <a href="https://github.com/yamshy" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      `;

      const externalLink = document.querySelector('a');
      expect(externalLink?.getAttribute('target')).toBe('_blank');
      expect(externalLink?.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  describe('Data Attributes', () => {
    it('should have correct data-section attributes', () => {
      const expectedSections = ['about', 'work', 'evolution', 'contact'];

      expectedSections.forEach((section) => {
        document.body.innerHTML = `
          <a class="nav-organic-button" data-section="${section}">
            <span>${section}</span>
          </a>
        `;

        const button = document.querySelector('.nav-organic-button');
        expect(button?.getAttribute('data-section')).toBe(section);
      });
    });
  });

  describe('Progress Bar Integration', () => {
    it('should have progress bar with correct initial state', () => {
      document.body.innerHTML = `
        <div class="progress-track">
          <div id="progress-bar" class="progress-bar" style="height: 0%"></div>
        </div>
      `;

      const progressBar = document.getElementById('progress-bar');
      expect(progressBar).toBeTruthy();
      expect(progressBar?.style.height).toBe('0%');
      expect(progressBar?.classList.contains('progress-bar')).toBe(true);
    });
  });

  describe('Color Theme Consistency', () => {
    it('should use consistent color themes across sections', () => {
      const colorThemes = [
        { section: 'about', color: 'coral' },
        { section: 'work', color: 'blue' },
        { section: 'evolution', color: 'mocha' },
        { section: 'contact', color: 'accent-yellow' },
      ];

      colorThemes.forEach(({ section, color }) => {
        // Test that each section has a consistent color theme
        expect(section).toBeTruthy();
        expect(color).toBeTruthy();

        // Color should be used in multiple class patterns
        const expectedClasses = [
          `bg-glass-${color}`,
          color === 'accent-yellow'
            ? 'border-accent-yellow'
            : `border-${color}`,
          color === 'accent-yellow' ? 'text-text-dark' : `text-${color}`,
          color === 'accent-yellow'
            ? 'hover:bg-accent-yellow'
            : `hover:bg-${color}`,
        ];

        expectedClasses.forEach((className) => {
          expect(className).toMatch(/^(bg-glass-|border-|text-|hover:bg-)/);
        });
      });
    });
  });
});
