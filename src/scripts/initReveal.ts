const automationPattern =
  /Headless|Playwright|Puppeteer|Chrome-Lighthouse|Speed\sInsights|Page Speed|Checkly|Screener|HeadlessShell/i;

type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
};

const computeRootMargin = (margin?: string) => {
  const value = (margin ?? '-8%').trim();
  return value.includes(' ') ? value : `0px 0px ${value} 0px`;
};

export const initReveal = ({
  threshold = 0,
  rootMargin,
}: RevealOptions = {}) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const revealNodes = Array.from(document.querySelectorAll('[data-reveal]'));

  if (revealNodes.length === 0) {
    return;
  }

  const rootElement = document.documentElement;
  rootElement.removeAttribute('data-reveal-state');

  const reduceMotionQuery =
    'matchMedia' in window
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  const userAgent =
    typeof navigator !== 'undefined' ? (navigator.userAgent ?? '') : '';
  const isAutomationContext =
    (typeof navigator !== 'undefined' && navigator.webdriver) ||
    automationPattern.test(userAgent);

  if (
    reduceMotionQuery?.matches ||
    !('IntersectionObserver' in window) ||
    isAutomationContext
  ) {
    revealNodes.forEach((node) => {
      node.classList.add('is-revealed', 'is-reveal-instant');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold,
      rootMargin: computeRootMargin(rootMargin),
    },
  );

  const revealIfVisible = (node: Element) => {
    const rect = node.getBoundingClientRect();
    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
      node.classList.add('is-revealed');
      observer.unobserve(node);
    }
  };

  revealNodes.forEach((node) => observer.observe(node));

  const activateReveals = () => {
    if (rootElement.dataset.revealState === 'active') {
      return;
    }

    revealNodes.forEach(revealIfVisible);

    const setActiveState = () => {
      rootElement.dataset.revealState = 'active';
    };

    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(setActiveState);
    } else {
      setActiveState();
    }
  };

  if (window.scrollY > 0) {
    activateReveals();
  } else {
    window.addEventListener('scroll', activateReveals, {
      once: true,
      passive: true,
    });
  }
};
