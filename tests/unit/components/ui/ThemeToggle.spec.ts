import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ThemeToggle from '../../../../src/components/ui/ThemeToggle.svelte';

const setMatchMedia = (matches: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
};

beforeEach(() => {
  localStorage.clear();
  document.documentElement.dataset.theme = '';
  document.documentElement.style.removeProperty('color-scheme');
  setMatchMedia(false);
});

describe('ThemeToggle', () => {
  it('applies persisted theme preferences on mount', async () => {
    localStorage.setItem('portfolio-theme', 'dark');
    render(ThemeToggle);

    await tick();

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(
      document.documentElement.style.getPropertyValue('color-scheme'),
    ).toBe('dark');
    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toBeInTheDocument();
    expect(localStorage.getItem('portfolio-theme')).toBe('dark');
  });

  it('toggles between light and dark themes and persists the choice', async () => {
    render(ThemeToggle);
    await tick();

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(
      document.documentElement.style.getPropertyValue('color-scheme'),
    ).toBe('light');

    const toggle = screen.getByRole('button', { name: /switch to dark mode/i });
    await fireEvent.click(toggle);
    await tick();

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(
      document.documentElement.style.getPropertyValue('color-scheme'),
    ).toBe('dark');
    expect(localStorage.getItem('portfolio-theme')).toBe('dark');
    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toBeInTheDocument();
  });

  it('prefers system dark mode when no stored preference exists', async () => {
    setMatchMedia(true);
    render(ThemeToggle);
    await tick();

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toBeInTheDocument();
  });

  it('falls back to the current document theme if storage access fails', async () => {
    document.documentElement.dataset.theme = 'dark';
    const getSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('denied');
      });
    const setSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('denied');
      });

    render(ThemeToggle);
    await tick();
    await tick();

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toBeInTheDocument();

    getSpy.mockRestore();
    setSpy.mockRestore();
  });
});
