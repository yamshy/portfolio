import { setupMobileNav } from './setupMobileNav';

const initMobileNav = () => {
  const cleanup = setupMobileNav();

  if (cleanup) {
    document.addEventListener('astro:before-swap', cleanup, { once: true });
  }
};

initMobileNav();
document.addEventListener('astro:page-load', initMobileNav);
