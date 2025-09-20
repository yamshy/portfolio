<script lang="ts">
  import { onMount } from 'svelte';

  const themes = [
    { id: 'light', label: 'Light Mode', icon: '☀️' },
    { id: 'dark', label: 'Dark Mode', icon: '🌙' },
  ];

  let theme: 'light' | 'dark' = 'light';

  const applyTheme = (next: 'light' | 'dark') => {
    const root = document.documentElement;
    root.dataset.theme = next;
    root.style.setProperty('color-scheme', next === 'dark' ? 'dark' : 'light');
    try {
      localStorage.setItem('portfolio-theme', next);
    } catch (error) {
      /* localStorage may be disabled; ignore */
    }
    theme = next;
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
  };

  onMount(() => {
    try {
      const stored = localStorage.getItem('portfolio-theme');
      if (stored === 'light' || stored === 'dark') {
        theme = stored;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
      }
    } catch (error) {
      theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    }
    applyTheme(theme);
  });
</script>

<button
  class="toggle"
  type="button"
  on:click={toggleTheme}
  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
>
  {#each themes as option}
    <span class:active={option.id === theme} aria-hidden={option.id === theme ? 'false' : 'true'}>
      {option.icon}
    </span>
  {/each}
  <span class="toggle__label">{theme === 'light' ? 'Light' : 'Dark'}</span>
</button>

<style>
  .toggle {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    border-radius: 999px;
    padding: 0.4rem 0.85rem;
    background: color-mix(in oklab, var(--color-surface-strong) 50%, var(--color-surface) 50%);
    color: var(--color-text);
    font-family: var(--font-sans);
    font-size: 0.9rem;
    cursor: pointer;
    transition: transform var(--duration-base) var(--ease-smooth),
      box-shadow var(--duration-base) var(--ease-smooth);
  }

  .toggle:hover,
  .toggle:focus-visible {
    transform: translateY(-1px);
    box-shadow: 0 12px 20px -18px rgba(0, 0, 0, 0.6);
  }

  .toggle span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    opacity: 0.45;
    transition: opacity var(--duration-base) var(--ease-smooth),
      transform var(--duration-base) var(--ease-smooth);
  }

  .toggle span.active {
    opacity: 1;
    transform: scale(1.1);
  }

  .toggle__label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--color-text-subtle);
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle,
    .toggle span {
      transition: none !important;
      transform: none !important;
    }
  }
</style>
