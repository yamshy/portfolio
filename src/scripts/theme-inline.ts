import { DARK_MEDIA_QUERY, STORAGE_KEY } from './theme';

export const inlineThemeScript = `(() => {
  const STORAGE_KEY = ${JSON.stringify(STORAGE_KEY)};
  const DARK_MEDIA_QUERY = ${JSON.stringify(DARK_MEDIA_QUERY)};

  const isTheme = (value) => value === 'light' || value === 'dark';

  const getPreferredTheme = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return 'light';
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isTheme(stored)) {
        return stored;
      }
    } catch {
      // localStorage may be unavailable; ignore and fall back
    }

    if (typeof window.matchMedia === 'function') {
      try {
        if (window.matchMedia(DARK_MEDIA_QUERY).matches) {
          return 'dark';
        }
      } catch {
        // matchMedia might throw in unsupported environments
      }
    }

    const datasetTheme = document.documentElement.dataset.theme;
    if (isTheme(datasetTheme)) {
      return datasetTheme;
    }

    return 'light';
  };

  const applyTheme = (theme, options = {}) => {
    if (typeof document === 'undefined') {
      return;
    }

    const { persist = true } = options;
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.setProperty('color-scheme', theme === 'dark' ? 'dark' : 'light');

    if (!persist) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage may be unavailable; ignore persistence failures
    }
  };

  const theme = getPreferredTheme();
  applyTheme(theme, { persist: false });
})();`;
