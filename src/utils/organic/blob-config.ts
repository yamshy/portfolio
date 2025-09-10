import type { ConnectionPair } from './types';

// Blob color mapping
export const blobColorMap = new Map([
  ['.b0', '--mocha'],
  ['.b1', '--coral'],
  ['.b2', '--mocha'],
  ['.b3', '--accent-yellow'],
  ['.b4', '--blue'],
  ['.b5', '--mocha'],
  ['.b6', '--coral'],
  ['.b7', '--blue'],
  ['.b8', '--coral'],
  ['.b9', '--coral'],
  ['.b10', '--accent-yellow'],
  ['.b11', '--blue'],
  ['.b12', '--accent-yellow'],
]);

// Blob selectors
export const blobSelectors = [
  '.b0',
  '.b1',
  '.b2',
  '.b3',
  '.b4',
  '.b5',
  '.b6',
  '.b7',
  '.b8',
  '.b9',
  '.b10',
  '.b11',
  '.b12',
];

// Connection pairs for different viewport sizes
export function buildConnectionPairs(isMobile: boolean): ConnectionPair[] {
  const P = (from: string, to: string): ConnectionPair => ({ from, to });

  const desktopPairs = [
    P('.b1', '.b3'),
    P('.b3', '.b9'),
    P('.b1', '.b5'),
    P('.b2', '.b4'),
    P('.b4', '.b7'),
    P('.b2', '.b8'),
    P('.b5', '.b6'),
    P('.b6', '.b7'),
    P('.b0', '.b7'),
  ];

  const mobilePairs = [P('.b1', '.b3'), P('.b2', '.b4'), P('.b5', '.b6')];

  return isMobile ? mobilePairs : desktopPairs;
}

// Get CSS custom property value
export function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}
