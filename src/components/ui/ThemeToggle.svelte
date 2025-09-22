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
    gap: 0.75rem;
    border: 1px solid color-mix(in oklab, var(--color-border) 75%, var(--color-primary-soft) 25%);
    border-radius: 999px;
    padding: 0.55rem 1.15rem;
    background: color-mix(in oklab, var(--color-surface-strong) 60%, var(--color-surface) 40%);
    color: var(--color-text);
    font-family: var(--font-sans);
    font-size: 0.9rem;
    cursor: pointer;
    transition: transform var(--duration-base) var(--ease-smooth),
      box-shadow var(--duration-base) var(--ease-smooth),
      border-color var(--duration-base) var(--ease-smooth);
  }

  .toggle:hover,
  .toggle:focus-visible {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px -18px rgba(0, 0, 0, 0.5);
    border-color: color-mix(in oklab, var(--color-primary) 55%, transparent 45%);
  }

  .toggle:focus-visible {
    outline: 3px solid color-mix(in oklab, var(--color-primary) 25%, transparent 75%);
    outline-offset: 2px;
  }

  .toggle span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 999px;
    opacity: 0.55;
    background: color-mix(in oklab, var(--color-surface-muted) 40%, transparent 60%);
    transition: opacity var(--duration-base) var(--ease-smooth),
      transform var(--duration-base) var(--ease-smooth),
      background var(--duration-base) var(--ease-smooth),
      color var(--duration-base) var(--ease-smooth);
  }

  .toggle span.active {
    opacity: 1;
    transform: translateY(-1px);
    background: color-mix(in oklab, var(--color-primary) 25%, transparent 75%);
    color: var(--color-primary-strong);
    box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--color-primary-strong) 30%, transparent 70%);
  }

  .toggle__label {
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--color-text-muted);
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle,
    .toggle span {
      transition: none !important;
      transform: none !important;
    }
  }
</style>
