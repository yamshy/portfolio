import { setupMobileNav } from './setupMobileNav';

type Registrations = {
  domContentLoaded: EventListener | null;
  pageLoad: EventListener | null;
  rafId: number | null;
};

const runSetup = () => {
  const cleanup = setupMobileNav();

  if (!cleanup) {
    return null;
  }

  let setupCleaned = false;

  const performCleanup = () => {
    if (setupCleaned) {
      return;
    }

    setupCleaned = true;
    cleanup();
  };

  const handleBeforeSwap = () => {
    performCleanup();
  };

  document.addEventListener('astro:before-swap', handleBeforeSwap, {
    once: true,
  });

  return () => {
    document.removeEventListener('astro:before-swap', handleBeforeSwap);
    performCleanup();
  };
};

const clearScheduledWork = (registrations: Registrations) => {
  if (registrations.domContentLoaded) {
    document.removeEventListener(
      'DOMContentLoaded',
      registrations.domContentLoaded,
    );
    registrations.domContentLoaded = null;
  }

  if (
    registrations.rafId !== null &&
    typeof window.cancelAnimationFrame === 'function'
  ) {
    window.cancelAnimationFrame(registrations.rafId);
    registrations.rafId = null;
  }
};

const scheduleSetup = (
  registrations: Registrations,
  attemptSetup: () => void,
) => {
  clearScheduledWork(registrations);

  if (document.readyState === 'loading') {
    const handleDomContentLoaded = () => {
      registrations.domContentLoaded = null;
      attemptSetup();
    };

    registrations.domContentLoaded = handleDomContentLoaded;
    document.addEventListener('DOMContentLoaded', handleDomContentLoaded, {
      once: true,
    });
    return;
  }

  if (typeof window.requestAnimationFrame === 'function') {
    registrations.rafId = window.requestAnimationFrame(() => {
      registrations.rafId = null;
      attemptSetup();
    });
    return;
  }

  attemptSetup();
};

let activeCleanup: (() => void) | null = null;

const initMobileNav = () => {
  activeCleanup?.();

  const registrations: Registrations = {
    domContentLoaded: null,
    pageLoad: null,
    rafId: null,
  };

  let cleaned = false;
  let setupCleanup: (() => void) | null = null;

  const attemptSetup = () => {
    if (cleaned) {
      return;
    }

    const runCleanup = runSetup();

    if (!runCleanup) {
      scheduleSetup(registrations, attemptSetup);
      return;
    }

    setupCleanup = runCleanup;
  };

  attemptSetup();

  const handlePageLoad = () => {
    attemptSetup();
  };

  document.addEventListener('astro:page-load', handlePageLoad);
  registrations.pageLoad = handlePageLoad;

  const cleanup = () => {
    if (cleaned) {
      return;
    }

    cleaned = true;

    if (registrations.pageLoad) {
      document.removeEventListener('astro:page-load', registrations.pageLoad);
      registrations.pageLoad = null;
    }

    clearScheduledWork(registrations);

    setupCleanup?.();
    setupCleanup = null;

    if (activeCleanup === cleanup) {
      activeCleanup = null;
    }
  };

  activeCleanup = cleanup;

  return cleanup;
};

export default initMobileNav;
