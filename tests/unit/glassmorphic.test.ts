import { describe, expect, it } from 'vitest';
import { getGlassmorphicClasses } from '../../src/utils/glassmorphic';

describe('getGlassmorphicClasses', () => {
  it('builds classes with defaults', () => {
    expect(getGlassmorphicClasses()).toBe(
      'glassmorphic-container glassmorphic-container--neutral glassmorphic-container--medium'
    );
  });

  it('includes custom class and variants', () => {
    expect(getGlassmorphicClasses('primary', 'large', 'custom')).toBe(
      'glassmorphic-container glassmorphic-container--primary glassmorphic-container--large custom'
    );
  });
});
