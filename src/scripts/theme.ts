export type Theme = 'light' | 'dark';

export const STORAGE_KEY = 'portfolio-theme';
export const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

const isTheme = (value: unknown): value is Theme =>
  value === 'light' || value === 'dark';

export const getPreferredTheme = (): Theme => {
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

export interface ApplyThemeOptions {
  persist?: boolean;
}

export const applyTheme = (
  theme: Theme,
  { persist = true }: ApplyThemeOptions = {},
): void => {
  if (typeof document === 'undefined') {
    return;
  }

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
