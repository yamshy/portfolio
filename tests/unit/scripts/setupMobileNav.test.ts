import { afterEach, describe, expect, it, vi } from 'vitest';

import { setupMobileNav } from '../../../src/scripts/setupMobileNav';

let cleanup: ReturnType<typeof setupMobileNav>;

const renderHeader = () => {
  document.body.innerHTML = `
    <header data-js="site-header">
      <button
        type="button"
        data-js="nav-toggle"
        aria-controls="primary-navigation"
        aria-expanded="false"
        aria-label="Open navigation menu"
        data-state="closed"
      >
        <span data-js="nav-toggle-label">Menu</span>
      </button>
      <nav data-js="primary-navigation">
        <a href="#one">One</a>
        <a href="#two">Two</a>
        <div data-js="mobile-theme-target"></div>
      </nav>
      <div data-js="desktop-theme-target">
        <div data-js="theme-toggle"></div>
      </div>
    </header>
  `;

  return document.querySelector('[data-js="site-header"]') as HTMLElement;
};

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
  document.body.className = '';
  document.body.innerHTML = '';
});

describe('setupMobileNav', () => {
  it('updates toggle state and aria attributes when opening and closing', () => {
    renderHeader();
    cleanup = setupMobileNav();
    expect(cleanup).toBeTypeOf('function');

    const nav = document.querySelector<HTMLElement>(
      '[data-js="primary-navigation"]',
    );
    const toggle = document.querySelector(
      '[data-js="nav-toggle"]',
    ) as HTMLButtonElement;
    const navLabel = document.querySelector('[data-js="nav-toggle-label"]');
    const firstLink = document.querySelector(
      '[data-js="primary-navigation"] a',
    );

    expect(nav).not.toBeNull();
    expect(nav?.dataset.state).toBe('closed');
    expect(toggle.dataset.state).toBe('closed');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(navLabel?.textContent).toBe('Menu');
    expect(document.body.classList.contains('has-mobile-nav-open')).toBe(false);
    expect(nav?.getAttribute('aria-hidden')).toBe('true');

    toggle.click();

    expect(nav?.dataset.state).toBe('open');
    expect(toggle.dataset.state).toBe('open');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(navLabel?.textContent).toBe('Close');
    expect(document.body.classList.contains('has-mobile-nav-open')).toBe(true);
    expect(nav?.getAttribute('aria-hidden')).toBe('false');

    firstLink?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(nav?.dataset.state).toBe('closed');
    expect(toggle.dataset.state).toBe('closed');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.classList.contains('has-mobile-nav-open')).toBe(false);
    expect(nav?.getAttribute('aria-hidden')).toBe('true');
  });

  it('closes the navigation when pointer events happen outside the menu', () => {
    renderHeader();
    cleanup = setupMobileNav();

    const nav = document.querySelector<HTMLElement>(
      '[data-js="primary-navigation"]',
    );
    const toggle = document.querySelector(
      '[data-js="nav-toggle"]',
    ) as HTMLButtonElement;

    toggle.click();
    expect(nav?.dataset.state).toBe('open');

    window.dispatchEvent(new Event('pointerdown'));

    expect(nav?.dataset.state).toBe('closed');
    expect(document.body.classList.contains('has-mobile-nav-open')).toBe(false);
  });

  it('cleans up listeners and restores the theme toggle on astro:before-swap', () => {
    const header = renderHeader();
    cleanup = setupMobileNav();

    const nav = document.querySelector<HTMLElement>(
      '[data-js="primary-navigation"]',
    );
    const toggle = document.querySelector(
      '[data-js="nav-toggle"]',
    ) as HTMLButtonElement;
    const desktopTarget = header.querySelector(
      '[data-js="desktop-theme-target"]',
    );
    const mobileTarget = header.querySelector(
      '[data-js="mobile-theme-target"]',
    );
    const themeToggle = header.querySelector('[data-js="theme-toggle"]');

    expect(mobileTarget?.contains(themeToggle)).toBe(true);

    toggle.click();
    expect(document.body.classList.contains('has-mobile-nav-open')).toBe(true);

    cleanup?.();

    expect(nav?.dataset.state).toBe('closed');
    expect(document.body.classList.contains('has-mobile-nav-open')).toBe(false);
    expect(desktopTarget?.contains(themeToggle)).toBe(true);
    expect(header.dataset.mobileNavReady).toBeUndefined();

    cleanup = setupMobileNav();

    expect(header.dataset.mobileNavReady).toBe('true');
    expect(mobileTarget?.contains(themeToggle)).toBe(true);
    expect(nav?.dataset.state).toBe('closed');
  });

  it('uses legacy media query listeners when addEventListener is unavailable', () => {
    type MutableWindow = typeof window & {
      matchMedia?: typeof window.matchMedia;
    };

    const mutableWindow = window as MutableWindow;
    const originalMatchMedia = mutableWindow.matchMedia;

    let registeredListener: Function | undefined;

    const removeListener = vi.fn((listener: Function) => {
      if (registeredListener === listener) {
        registeredListener = undefined;
      }
    });

    let currentMatches = false;

    const setMatches = (value: boolean) => {
      currentMatches = value;
    };

    const mediaQuery = {
      get matches() {
        return currentMatches;
      },
      media: '(min-width: 48rem)',
      onchange: null,
      addListener: vi.fn((listener: Function) => {
        registeredListener = listener;
      }),
      removeListener,
      dispatchEvent: vi.fn(),
      addEventListener: undefined,
      removeEventListener: undefined,
    } as unknown as MediaQueryList;

    mutableWindow.matchMedia = vi
      .fn<typeof window.matchMedia>()
      .mockReturnValue(mediaQuery);

    const getComputedStyleSpy = vi
      .spyOn(window, 'getComputedStyle')
      .mockImplementation(() => {
        const display = currentMatches ? 'none' : 'block';

        return {
          display,
        } as CSSStyleDeclaration;
      });

    try {
      renderHeader();
      cleanup = setupMobileNav();

      expect(mediaQuery.addListener).toHaveBeenCalledTimes(1);
      expect(registeredListener).toBeTypeOf('function');

      const nav = document.querySelector<HTMLElement>(
        '[data-js="primary-navigation"]',
      );
      const toggle = document.querySelector(
        '[data-js="nav-toggle"]',
      ) as HTMLButtonElement;

      toggle.click();
      expect(nav?.dataset.state).toBe('open');

      const listenerRef = registeredListener as Function;

      const triggerChange = (matches: boolean) => {
        setMatches(matches);
        listenerRef.call(mediaQuery, { matches } as MediaQueryListEvent);
      };

      triggerChange(true);

      expect(nav?.dataset.state).toBe('open');
      expect(toggle.dataset.state).toBe('closed');
      expect(toggle.getAttribute('aria-expanded')).toBe('false');

      triggerChange(false);

      expect(nav?.dataset.state).toBe('closed');
      expect(toggle.dataset.state).toBe('closed');
      expect(toggle.getAttribute('aria-expanded')).toBe('false');

      cleanup?.();
      cleanup = undefined;

      expect(removeListener).toHaveBeenCalledWith(listenerRef);
    } finally {
      getComputedStyleSpy.mockRestore();
      mutableWindow.matchMedia = originalMatchMedia;
    }
  });
});
