import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { initReveal } from '../../../src/scripts/initReveal';

const windowAny = window as any;
const originalRAF = windowAny.requestAnimationFrame;
const originalIntersectionObserver = windowAny.IntersectionObserver;
const originalMatchMedia = windowAny.matchMedia;

class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe = (element: Element) => {
    this.callback(
      [
        {
          isIntersecting: true,
          target: element,
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  };
  unobserve = () => {};
  disconnect = () => {};
  takeRecords = () => [] as IntersectionObserverEntry[];
}

describe('initReveal', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <section data-reveal></section>
        <section data-reveal></section>
      </main>
    `;
    document.documentElement.removeAttribute('data-reveal-state');

    windowAny.requestAnimationFrame = undefined;
    windowAny.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
    windowAny.matchMedia = () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent() {
        return false;
      },
      onchange: null,
      media: '',
    });
  });

  afterEach(() => {
    windowAny.requestAnimationFrame = originalRAF;

    if (originalIntersectionObserver) {
      windowAny.IntersectionObserver = originalIntersectionObserver;
    } else {
      delete windowAny.IntersectionObserver;
    }

    if (originalMatchMedia) {
      windowAny.matchMedia = originalMatchMedia;
    } else {
      delete windowAny.matchMedia;
    }

    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-reveal-state');
  });

  it('marks reveal nodes as active without requestAnimationFrame', () => {
    expect(() => initReveal()).not.toThrow();

    window.dispatchEvent(new Event('scroll'));

    expect(document.documentElement.dataset.revealState).toBe('active');

    const revealNodes = Array.from(document.querySelectorAll('[data-reveal]'));
    expect(revealNodes).toHaveLength(2);

    revealNodes.forEach((node) => {
      expect(node.classList.contains('is-revealed')).toBe(true);
    });
  });
});
