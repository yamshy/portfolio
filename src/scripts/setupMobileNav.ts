const DESKTOP_BREAKPOINT = '(min-width: 48rem)';

type Cleanup = () => void;

const isNode = (value: unknown): value is Node =>
  typeof Node !== 'undefined' && value instanceof Node;

export const setupMobileNav = (): Cleanup | undefined => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return undefined;
  }

  const header = document.querySelector<HTMLElement>('[data-js="site-header"]');

  if (!header || header.dataset.mobileNavReady === 'true') {
    return undefined;
  }

  const nav = header.querySelector<HTMLElement>(
    '[data-js="primary-navigation"]',
  );
  const toggle = header.querySelector<HTMLButtonElement>(
    '[data-js="nav-toggle"]',
  );
  const navLabel = header.querySelector<HTMLElement>(
    '[data-js="nav-toggle-label"]',
  );

  if (!nav || !toggle) {
    return undefined;
  }

  header.dataset.mobileNavReady = 'true';

  const linkElements = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'));
  const desktopThemeTarget = header.querySelector<HTMLElement>(
    '[data-js="desktop-theme-target"]',
  );
  const mobileThemeTarget = header.querySelector<HTMLElement>(
    '[data-js="mobile-theme-target"]',
  );
  const themeToggle = header.querySelector<HTMLElement>(
    '[data-js="theme-toggle"]',
  );
  const desktopQuery = window.matchMedia?.(DESKTOP_BREAKPOINT);

  let isOpen = false;

  const updateThemeTogglePlacement = () => {
    if (!themeToggle || !desktopThemeTarget || !mobileThemeTarget) {
      return;
    }

    if (desktopQuery?.matches) {
      desktopThemeTarget.appendChild(themeToggle);
    } else {
      mobileThemeTarget.appendChild(themeToggle);
    }
  };

  const updateNavState = (open: boolean) => {
    const isDesktop = Boolean(desktopQuery?.matches);

    updateThemeTogglePlacement();

    if (isDesktop) {
      nav.dataset.state = 'open';
      toggle.dataset.state = 'closed';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      if (navLabel) {
        navLabel.textContent = 'Menu';
      }
      nav.removeAttribute('aria-hidden');
      document.body.classList.remove('has-mobile-nav-open');
      return;
    }

    nav.dataset.state = open ? 'open' : 'closed';
    toggle.dataset.state = open ? 'open' : 'closed';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute(
      'aria-label',
      open ? 'Close navigation menu' : 'Open navigation menu',
    );

    if (navLabel) {
      navLabel.textContent = open ? 'Close' : 'Menu';
    }

    if (open) {
      nav.setAttribute('aria-hidden', 'false');
      document.body.classList.add('has-mobile-nav-open');
    } else {
      nav.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('has-mobile-nav-open');
    }
  };

  const openNav = () => {
    isOpen = true;
    updateNavState(isOpen);
  };

  const closeNav = () => {
    isOpen = false;
    updateNavState(isOpen);
  };

  const onToggle = () => {
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeNav();
    }
  };

  const isEventInsideNav = (event: Event) => {
    const path =
      typeof event.composedPath === 'function'
        ? (event.composedPath() as EventTarget[])
        : undefined;

    if (path) {
      return path.includes(nav) || path.includes(toggle);
    }

    const target = event.target;
    return (
      (isNode(target) && nav.contains(target)) ||
      (isNode(target) && toggle.contains(target))
    );
  };

  const onPointerDown = (event: Event) => {
    if (!isOpen || desktopQuery?.matches) {
      return;
    }

    if (isEventInsideNav(event)) {
      return;
    }

    closeNav();
  };

  const handleDesktopChange = (event: MediaQueryListEvent) => {
    if (event.matches) {
      isOpen = false;
      updateNavState(isOpen);
    } else {
      updateNavState(isOpen);
    }
  };

  toggle.addEventListener('click', onToggle);
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('pointerdown', onPointerDown);
  linkElements.forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  if (desktopQuery && typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', handleDesktopChange);
  }

  updateNavState(isOpen);

  const cleanup: Cleanup = () => {
    closeNav();
    toggle.removeEventListener('click', onToggle);
    window.removeEventListener('keydown', onKeydown);
    window.removeEventListener('pointerdown', onPointerDown);
    linkElements.forEach((link) => {
      link.removeEventListener('click', closeNav);
    });
    if (
      desktopQuery &&
      typeof desktopQuery.removeEventListener === 'function'
    ) {
      desktopQuery.removeEventListener('change', handleDesktopChange);
    }
    if (themeToggle && desktopThemeTarget) {
      desktopThemeTarget.appendChild(themeToggle);
    }
    document.body.classList.remove('has-mobile-nav-open');
    delete header.dataset.mobileNavReady;
  };

  return cleanup;
};

export default setupMobileNav;
