import type { Point } from './types';

// Calculate center point of an element
export function centerOf(element: Element): Point {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

// Get hero container rect for collision avoidance
export function getHeroRect(): DOMRect | null {
  const hero = document.querySelector('.hero-container');
  return hero ? hero.getBoundingClientRect() : null;
}

// Calculate vector magnitude
export function magnitude(vx: number, vy: number): number {
  return Math.sqrt(vx * vx + vy * vy) || 1;
}

// Compute control point for curved path, avoiding obstacles
export function computeControlPoint(
  pointA: Point,
  pointB: Point,
  avoidRect: DOMRect | null,
  bend = 80,
): Point {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const length = magnitude(dx, dy);

  // Calculate perpendicular vector
  const nx = -dy / length;
  const ny = dx / length;

  let sign = 1;

  // Avoid obstacles by choosing the better direction
  if (avoidRect) {
    const midPoint = {
      x: (pointA.x + pointB.x) / 2,
      y: (pointA.y + pointB.y) / 2,
    };

    const rectCx = avoidRect.left + avoidRect.width / 2;
    const rectCy = avoidRect.top + avoidRect.height / 2;

    const distancePlus = Math.hypot(
      midPoint.x + nx * bend - rectCx,
      midPoint.y + ny * bend - rectCy,
    );

    const distanceMinus = Math.hypot(
      midPoint.x - nx * bend - rectCx,
      midPoint.y - ny * bend - rectCy,
    );

    sign = distancePlus > distanceMinus ? 1 : -1;
  }

  return {
    x: (pointA.x + pointB.x) / 2 + nx * bend * sign,
    y: (pointA.y + pointB.y) / 2 + ny * bend * sign,
  };
}

// Generate SVG path data for quadratic curve
export function createPathData(
  pointA: Point,
  pointB: Point,
  controlPoint: Point,
): string {
  return `M ${pointA.x},${pointA.y} Q ${controlPoint.x},${controlPoint.y} ${pointB.x},${pointB.y}`;
}
