import { setupMobileNav } from './setupMobileNav';

const runSetup = () => {
  const cleanup = setupMobileNav();

  if (!cleanup) {
    return false;
  }

  document.addEventListener('astro:before-swap', cleanup, { once: true });
  return true;
};

const scheduleSetup = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSetup, { once: true });
    return;
  }

  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => {
      runSetup();
    });
    return;
  }

  runSetup();
};

let hasRegisteredPageLoad = false;

const initMobileNav = () => {
  if (!runSetup()) {
    scheduleSetup();
  }

  if (!hasRegisteredPageLoad) {
    hasRegisteredPageLoad = true;
    document.addEventListener('astro:page-load', () => {
      if (!runSetup()) {
        scheduleSetup();
      }
    });
  }
};

export default initMobileNav;
