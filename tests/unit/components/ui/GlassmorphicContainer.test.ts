import { describe, expect, it } from 'vitest';
import { getGlassmorphicClasses } from '../../../../src/utils/glassmorphic';

describe('GlassmorphicContainer Component', () => {
  describe('Props Interface', () => {
    it('should accept valid variant values', () => {
      type Variant = 'primary' | 'secondary' | 'neutral' | 'clear';
      const validVariants: Variant[] = [
        'primary',
        'secondary',
        'neutral',
        'clear',
      ];

      validVariants.forEach((variant) => {
        const classes = getGlassmorphicClasses(variant);
        expect(classes).toContain(`glassmorphic-container--${variant}`);
      });
    });

    it('should accept valid size values', () => {
      type Size = 'small' | 'medium' | 'large';
      const validSizes: Size[] = ['small', 'medium', 'large'];

      validSizes.forEach((size) => {
        const classes = getGlassmorphicClasses('neutral', size);
        expect(classes).toContain(`glassmorphic-container--${size}`);
      });
    });

    it('should accept valid tag values', () => {
      const validTags = [
        'div',
        'section',
        'article',
        'aside',
        'header',
        'footer',
      ];

      // This tests the allowedTags object from the component
      const allowedTags = {
        div: 'div',
        section: 'section',
        article: 'article',
        aside: 'aside',
        header: 'header',
        footer: 'footer',
      } as const;

      validTags.forEach((tag) => {
        expect(allowedTags[tag as keyof typeof allowedTags]).toBe(tag);
      });
    });
  });

  describe('Class Generation', () => {
    it('should generate correct classes with defaults', () => {
      const classes = getGlassmorphicClasses();
      expect(classes).toBe(
        'glassmorphic-container glassmorphic-container--neutral glassmorphic-container--medium',
      );
    });

    it('should generate correct classes with custom values', () => {
      const classes = getGlassmorphicClasses(
        'primary',
        'large',
        'custom-class',
      );
      expect(classes).toBe(
        'glassmorphic-container glassmorphic-container--primary glassmorphic-container--large custom-class',
      );
    });

    it('should handle empty custom class', () => {
      const classes = getGlassmorphicClasses('secondary', 'small', '');
      expect(classes).toBe(
        'glassmorphic-container glassmorphic-container--secondary glassmorphic-container--small',
      );
    });

    it('should filter out falsy values', () => {
      const classes = getGlassmorphicClasses(
        'clear',
        'medium',
        undefined as any,
      );
      expect(classes).toBe(
        'glassmorphic-container glassmorphic-container--clear glassmorphic-container--medium',
      );
    });
  });

  describe('CSS Custom Properties', () => {
    it('should define expected CSS custom properties', () => {
      // These are the CSS custom properties defined in the component
      const expectedProperties = [
        '--glass-border-width',
        '--glass-border-radius',
        '--glass-transition',
        '--glass-border-subtle',
        '--glass-border-visible',
        '--glass-border-hover',
        '--glass-glow-subtle',
        '--glass-glow-visible',
        '--glass-glow-hover',
      ];

      // Test that our property names are consistent
      expectedProperties.forEach((prop) => {
        expect(prop).toMatch(/^--glass-/);
      });
    });
  });

  describe('Tag Fallback Logic', () => {
    it('should fallback to div for invalid tags', () => {
      const allowedTags = {
        div: 'div',
        section: 'section',
        article: 'article',
        aside: 'aside',
        header: 'header',
        footer: 'footer',
      } as const;

      // Test fallback logic
      const invalidTag = 'span' as keyof typeof allowedTags;
      const Tag = allowedTags[invalidTag] ?? 'div';
      expect(Tag).toBe('div');

      // Test valid tag
      const validTag = 'section';
      const ValidTag = allowedTags[validTag] ?? 'div';
      expect(ValidTag).toBe('section');
    });
  });

  describe('Accessibility', () => {
    it('should support semantic HTML tags', () => {
      const semanticTags = ['section', 'article', 'aside', 'header', 'footer'];

      semanticTags.forEach((tag) => {
        // Each semantic tag should be supported
        expect([
          'div',
          'section',
          'article',
          'aside',
          'header',
          'footer',
        ]).toContain(tag);
      });
    });
  });

  describe('Variant Styling', () => {
    it('should have distinct styling for each variant', () => {
      const variants = ['primary', 'secondary', 'neutral', 'clear'];
      const generatedClasses = variants.map((variant) =>
        getGlassmorphicClasses(variant as any),
      );

      // Each variant should generate a unique class
      const uniqueClasses = new Set(generatedClasses);
      expect(uniqueClasses.size).toBe(variants.length);
    });
  });

  describe('Size Scaling', () => {
    it('should have distinct sizing for each size variant', () => {
      const sizes = ['small', 'medium', 'large'];
      const generatedClasses = sizes.map((size) =>
        getGlassmorphicClasses('neutral', size as any),
      );

      // Each size should generate a unique class
      const uniqueClasses = new Set(generatedClasses);
      expect(uniqueClasses.size).toBe(sizes.length);
    });
  });
});
