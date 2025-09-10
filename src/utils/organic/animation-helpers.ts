import type { AnimationConfig } from './types';

// Timing utilities for animations
export function generateAnimationTiming(isMobile: boolean): AnimationConfig {
  const cycleSecNum = isMobile ? 10 + Math.random() * 6 : 8 + Math.random() * 6;

  const beginSec = +(Math.random() * cycleSecNum).toFixed(2);

  const flyDur = isMobile
    ? `${(0.8 + Math.random() * 0.3).toFixed(2)}s`
    : `${(0.6 + Math.random() * 0.3).toFixed(2)}s`;

  const cycleDur = `${cycleSecNum.toFixed(2)}s`;

  return { cycleSecNum, beginSec, flyDur, cycleDur };
}

// Debounce utility for resize events
export function debounce(func: () => void, wait = 150): () => void {
  let timeout: ReturnType<typeof setTimeout>;

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(), wait);
  };
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

// Detect mobile viewport
export function isMobileViewport(): boolean {
  return window.innerWidth < 900;
}

// Timer management for blob pings
export class TimerManager {
  private timers: ReturnType<typeof setTimeout>[] = [];

  addTimer(timer: ReturnType<typeof setTimeout>): void {
    this.timers.push(timer);
  }

  clearAll(): void {
    this.timers.forEach((timer) => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    this.timers = [];
  }

  scheduleBlobPing(element: Element, beginSec: number, cycleSec: number): void {
    if (!element || isNaN(beginSec) || isNaN(cycleSec)) return;

    const firstDelay = Math.max(0, (beginSec + cycleSec * 0.92) * 1000);

    const doPing = () => {
      element.classList.add('ping');
      const timer = setTimeout(() => element.classList.remove('ping'), 280);
      this.addTimer(timer);
    };

    const initialTimer = setTimeout(() => {
      doPing();
      const intervalTimer = setInterval(doPing, cycleSec * 1000);
      this.addTimer(intervalTimer);
    }, firstDelay);

    this.addTimer(initialTimer);
  }
}
