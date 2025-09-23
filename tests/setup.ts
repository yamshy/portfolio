// Vitest setup file
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/svelte';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

if (typeof window !== 'undefined' && !('matchMedia' in window)) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

if (typeof Element !== 'undefined' && !Element.prototype.animate) {
  Element.prototype.animate = ((
    keyframes?: Keyframe[] | PropertyIndexedKeyframes,
    options?: number | KeyframeAnimationOptions,
  ) => {
    void keyframes;
    void options;

    const animation: Partial<Animation> = {
      cancel: () => {},
      commitStyles: () => {},
      finished: Promise.resolve() as unknown as Promise<Animation>,
      onfinish: null,
      pause: () => {},
      play: () => {},
      reverse: () => {},
      updatePlaybackRate: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };

    return animation as Animation;
  }) as typeof Element.prototype.animate;
}
