<script lang="ts">
  import { onMount } from 'svelte';
  import {
    applyTheme,
    getPreferredTheme,
    type ApplyThemeOptions,
    type Theme,
  } from '../../scripts/theme';

  const themeOptions: Array<{ id: Theme; label: string }> = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
  ];

  let theme: Theme = 'light';

  const setTheme = (next: Theme, options?: ApplyThemeOptions) => {
    applyTheme(next, options);
    theme = next;
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  onMount(() => {
    const preferred = getPreferredTheme();
    setTheme(preferred);
  });
</script>

<button
  class="theme-toggle"
  type="button"
  data-theme={theme}
  on:click={toggleTheme}
  aria-pressed={theme === 'dark'}
  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
>
  <span class="theme-toggle__track" aria-hidden="true">
    <span class="theme-toggle__indicator"></span>
    {#each themeOptions as option}
      <span class:active={option.id === theme} class="theme-toggle__option" data-theme={option.id}>
        <span class="theme-toggle__icon" aria-hidden="true">
          {#if option.id === 'light'}
            <svg viewBox="0 0 24 24" role="presentation">
              <circle cx="12" cy="12" r="4.25" fill="none" stroke="currentColor" stroke-width="1.5" />
              <path
                d="M12 3v2.5M12 18.5V21M4.5 12H7M17 12h2.5M6.4 6.4l1.8 1.8M15.8 15.8l1.8 1.8M6.4 17.6l1.8-1.8M15.8 8.2l1.8-1.8"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          {:else}
            <svg viewBox="0 0 24 24" role="presentation">
              <path
                d="M18.4 14.6a6.5 6.5 0 0 1-7-9.1 7 7 0 1 0 7 9.1Z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {/if}
        </span>
        <span class="theme-toggle__label">{option.label}</span>
      </span>
    {/each}
  </span>
</button>

<style>
  .theme-toggle {
    --toggle-padding: 0.35rem;
    --indicator-x: 0%;
    position: relative;
    display: inline-flex;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    font: inherit;
    color: inherit;
  }

  .theme-toggle[data-theme='dark'] {
    --indicator-x: 100%;
  }

  .theme-toggle:focus-visible {
    outline: 3px solid color-mix(in oklab, var(--color-primary) 30%, transparent 70%);
    outline-offset: 4px;
  }

  .theme-toggle__track {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
    border-radius: calc(var(--radius-lg) + 6px);
    padding: var(--toggle-padding);
    border: 1px solid color-mix(in oklab, var(--color-border) 72%, transparent 28%);
    background: linear-gradient(
      135deg,
      color-mix(in oklab, var(--color-surface) 85%, transparent 15%),
      color-mix(in oklab, var(--color-surface-strong) 45%, var(--color-surface) 55%)
    );
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    gap: 0;
    min-width: 11rem;
    transition: border-color var(--duration-base) var(--ease-smooth),
      box-shadow var(--duration-base) var(--ease-smooth),
      background var(--duration-base) var(--ease-smooth);
  }

  .theme-toggle:hover .theme-toggle__track,
  .theme-toggle:focus-visible .theme-toggle__track {
    border-color: color-mix(in oklab, var(--color-primary) 45%, var(--color-border) 55%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.16),
      0 12px 24px -18px var(--color-shadow);
  }

  .theme-toggle__indicator {
    position: absolute;
    z-index: 0;
    top: var(--toggle-padding);
    bottom: var(--toggle-padding);
    left: var(--toggle-padding);
    width: calc(50% - var(--toggle-padding));
    border-radius: calc(var(--radius-lg) - 4px);
    background: color-mix(in oklab, var(--color-primary-soft) 55%, var(--color-surface) 45%);
    box-shadow:
      0 16px 32px -26px var(--color-shadow),
      inset 0 1px 0 rgba(255, 255, 255, 0.22);
    transform: translateX(var(--indicator-x));
    transition: transform var(--duration-base) var(--ease-emphatic),
      background var(--duration-base) var(--ease-smooth),
      box-shadow var(--duration-base) var(--ease-smooth);
  }

  .theme-toggle[data-theme='dark'] .theme-toggle__indicator {
    background: color-mix(in oklab, var(--color-primary) 55%, var(--color-surface-strong) 45%);
    box-shadow:
      0 18px 36px -24px var(--color-shadow),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  .theme-toggle__option {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--radius-lg) - 2px);
    font-size: 0.78rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--color-text-subtle);
    transition: color var(--duration-base) var(--ease-smooth);
  }

  .theme-toggle__option.active {
    color: var(--color-text);
    font-weight: 600;
  }

  .theme-toggle__option[data-theme='dark'].active {
    color: var(--color-primary-strong);
  }

  .theme-toggle__icon {
    display: inline-flex;
    width: 1.4rem;
    height: 1.4rem;
    align-items: center;
    justify-content: center;
  }

  .theme-toggle__icon svg {
    width: 100%;
    height: 100%;
    stroke: currentColor;
  }

  .theme-toggle__option:not(.active) .theme-toggle__icon {
    color: var(--color-text-muted);
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-toggle__track,
    .theme-toggle__indicator,
    .theme-toggle__option {
      transition: none !important;
    }
  }
</style>
