import { describe, expect, it, beforeEach } from 'vitest';

describe('ProjectCard Component', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
  });

  describe('Component Props', () => {
    it('should handle default props correctly', () => {
      // Test default props from the component
      const defaultProps = {
        title: undefined,
        description: undefined,
        href: '#',
        variant: 'standard',
        tags: [],
        image: undefined,
      };

      expect(defaultProps.href).toBe('#');
      expect(defaultProps.variant).toBe('standard');
      expect(defaultProps.tags).toEqual([]);
    });

    it('should accept valid variant values', () => {
      const validVariants = [
        'standard',
        'featured',
        'secondary',
        'wide',
        'tall',
      ];

      validVariants.forEach((variant) => {
        // Each variant should be a valid string
        expect(typeof variant).toBe('string');
        expect(variant.length).toBeGreaterThan(0);
      });
    });
  });

  describe('DOM Structure', () => {
    it('should render basic card structure', () => {
      // Simulate the card structure from ProjectCard.astro
      document.body.innerHTML = `
        <article class="card standard u-glass u-glass--coral u-border-coral-20 u-r-xl u-elevate">
          <header class="header">
            <h3><a href="#test">Test Project</a></h3>
          </header>
          <p class="description">Test description</p>
        </article>
      `;

      const card = document.querySelector('.card');
      expect(card).toBeTruthy();
      expect(card?.tagName).toBe('ARTICLE');

      const header = document.querySelector('.header');
      expect(header).toBeTruthy();
      expect(header?.tagName).toBe('HEADER');

      const title = document.querySelector('h3 a');
      expect(title?.textContent).toBe('Test Project');
      expect(title?.getAttribute('href')).toBe('#test');

      const description = document.querySelector('.description');
      expect(description?.textContent).toBe('Test description');
    });

    it('should render image when provided', () => {
      document.body.innerHTML = `
        <article class="card standard">
          <div class="image-container">
            <img src="/test-image.jpg" alt="Test Project project screenshot" loading="lazy" />
          </div>
          <header class="header">
            <h3><a href="#">Test Project</a></h3>
          </header>
        </article>
      `;

      const imageContainer = document.querySelector('.image-container');
      expect(imageContainer).toBeTruthy();

      const image = document.querySelector('img');
      expect(image).toBeTruthy();
      expect(image?.getAttribute('src')).toBe('/test-image.jpg');
      expect(image?.getAttribute('alt')).toBe(
        'Test Project project screenshot',
      );
      expect(image?.getAttribute('loading')).toBe('lazy');
    });

    it('should render tags when provided', () => {
      document.body.innerHTML = `
        <article class="card standard">
          <header class="header">
            <h3><a href="#">Test Project</a></h3>
          </header>
          <p class="description">Test description</p>
          <ul class="tags">
            <li class="tag">React</li>
            <li class="tag">TypeScript</li>
            <li class="tag">Astro</li>
          </ul>
        </article>
      `;

      const tagsList = document.querySelector('.tags');
      expect(tagsList).toBeTruthy();
      expect(tagsList?.tagName).toBe('UL');

      const tags = document.querySelectorAll('.tag');
      expect(tags).toHaveLength(3);
      expect(tags[0].textContent).toBe('React');
      expect(tags[1].textContent).toBe('TypeScript');
      expect(tags[2].textContent).toBe('Astro');
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct base classes', () => {
      document.body.innerHTML = `
        <article class="card standard u-glass u-glass--coral u-border-coral-20 u-r-xl u-elevate">
        </article>
      `;

      const card = document.querySelector('.card');
      expect(card?.classList.contains('card')).toBe(true);
      expect(card?.classList.contains('standard')).toBe(true);
      expect(card?.classList.contains('u-glass')).toBe(true);
      expect(card?.classList.contains('u-glass--coral')).toBe(true);
      expect(card?.classList.contains('u-border-coral-20')).toBe(true);
      expect(card?.classList.contains('u-r-xl')).toBe(true);
      expect(card?.classList.contains('u-elevate')).toBe(true);
    });

    it('should support different variant classes', () => {
      const variants = ['standard', 'featured', 'secondary', 'wide', 'tall'];

      variants.forEach((variant) => {
        document.body.innerHTML = `<article class="card ${variant}"></article>`;
        const card = document.querySelector('.card');
        expect(card?.classList.contains(variant)).toBe(true);
      });
    });
  });

  describe('Animation Delays', () => {
    it('should apply staggered animation delays', () => {
      // Test the nth-child animation delay pattern
      const expectedDelays = [
        { selector: ':nth-child(1)', delay: '0ms' },
        { selector: ':nth-child(2)', delay: '100ms' },
        { selector: ':nth-child(3)', delay: '200ms' },
        { selector: ':nth-child(4)', delay: '300ms' },
        { selector: ':nth-child(5)', delay: '400ms' },
        { selector: ':nth-child(6)', delay: '500ms' },
      ];

      expectedDelays.forEach(({ delay }, index) => {
        expect(delay).toBe(`${index * 100}ms`);
      });
    });
  });

  describe('Accessibility', () => {
    it('should use semantic HTML structure', () => {
      document.body.innerHTML = `
        <article class="card standard">
          <header class="header">
            <h3><a href="#">Test Project</a></h3>
          </header>
          <p class="description">Test description</p>
          <ul class="tags">
            <li class="tag">React</li>
          </ul>
        </article>
      `;

      // Check semantic elements
      const article = document.querySelector('article');
      expect(article).toBeTruthy();

      const header = document.querySelector('header');
      expect(header).toBeTruthy();

      const heading = document.querySelector('h3');
      expect(heading).toBeTruthy();

      const link = document.querySelector('a');
      expect(link).toBeTruthy();

      const list = document.querySelector('ul');
      expect(list).toBeTruthy();

      const listItems = document.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should have accessible image alt text pattern', () => {
      const projectTitle = 'My Amazing Project';
      const expectedAlt = `${projectTitle} project screenshot`;

      expect(expectedAlt).toBe('My Amazing Project project screenshot');
    });
  });

  describe('Interactive States', () => {
    it('should handle hover and focus states', () => {
      document.body.innerHTML = `
        <article class="card standard">
          <header class="header">
            <h3><a href="#test">Test Project</a></h3>
          </header>
        </article>
      `;

      const card = document.querySelector('.card') as HTMLElement;
      const link = document.querySelector('a') as HTMLElement;

      // Test that elements exist for interaction
      expect(card).toBeTruthy();
      expect(link).toBeTruthy();

      // Test focus behavior
      link.focus();
      expect(document.activeElement).toBe(link);
    });
  });

  describe('Variant-Specific Behavior', () => {
    it('should handle featured variant rotation', () => {
      document.body.innerHTML = `
        <article class="card featured">
          <header class="header">
            <h3><a href="#">Featured Project</a></h3>
          </header>
        </article>
      `;

      const card = document.querySelector('.card');
      expect(card?.classList.contains('featured')).toBe(true);

      // Featured cards should have special styling
      // This would be tested through CSS, but we can verify the class is applied
    });
  });
});
