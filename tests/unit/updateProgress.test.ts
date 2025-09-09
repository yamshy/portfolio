import { describe, it, expect } from 'vitest';
import { updateProgress } from '../../src/utils/updateProgress';

describe('updateProgress', () => {
  it('updates progress bar height and active state', () => {
    document.body.innerHTML = `
      <div class="nav-wrapper">
        <div id="progress-bar" class="progress-bar" style="height:0%"></div>
        <a class="nav-organic-button" data-section="about"><div class="cell-nav-shape"></div></a>
        <a class="nav-organic-button" data-section="work"><div class="cell-nav-shape"></div></a>
        <a class="nav-organic-button" data-section="evolution"><div class="cell-nav-shape"></div></a>
        <a class="nav-organic-button" data-section="contact"><div class="cell-nav-shape"></div></a>
      </div>
      <section id="about"></section>
      <section id="work"></section>
      <section id="evolution"></section>
      <section id="contact"></section>
    `;

    const offsets: Record<string, number> = {
      about: 0,
      work: 1000,
      evolution: 2000,
      contact: 3000,
    };
    for (const [id, top] of Object.entries(offsets)) {
      const el = document.getElementById(id)!;
      Object.defineProperty(el, 'offsetTop', { value: top });
    }
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 4000,
      writable: true,
    });

    Object.defineProperty(window, 'innerHeight', {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });

    const navWrapper = document.querySelector('.nav-wrapper') as HTMLElement;
    Object.defineProperty(navWrapper, 'getBoundingClientRect', {
      value: () => ({ top: 0, height: 100 }),
    });
    const firstShape = document.querySelector(
      '.nav-organic-button[data-section="about"] .cell-nav-shape',
    ) as HTMLElement;
    Object.defineProperty(firstShape, 'getBoundingClientRect', {
      value: () => ({ top: 0, height: 100 }),
    });

    updateProgress();

    const progressBar = document.getElementById('progress-bar')!;
    expect(progressBar.style.height).toBe('50%');

    const firstButton = document.querySelector(
      '.nav-organic-button[data-section="about"]',
    )!;
    expect(firstButton.classList.contains('active')).toBe(true);
    document
      .querySelectorAll('.nav-organic-button:not([data-section="about"])')
      .forEach((btn) => {
        expect(btn.classList.contains('active')).toBe(false);
      });
  });

  it('returns early without errors when required elements are missing', () => {
    document.body.innerHTML = '';

    expect(() => updateProgress()).not.toThrow();
  });
});
