// Type definitions for organic shapes system

export interface Point {
  x: number;
  y: number;
}

export interface BlobConfig {
  selector: string;
  colorVar: string;
  width: number;
  height: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  opacity: number;
  animationDelay?: string;
  borderRadius: string;
  animation: string;
}

export interface ConnectionPair {
  from: string;
  to: string;
}

export interface AnimationConfig {
  cycleSecNum: number;
  beginSec: number;
  flyDur: string;
  cycleDur: string;
}

export interface PathConfig {
  id: string;
  bend?: number;
  strokeWidth?: number;
  strokePaint?: string;
  baseOpacity?: number;
}

export interface PulseConfig {
  pathId: string;
  radius: number;
  begin: string;
  duration: string;
  fill?: string;
}

export interface HotSegmentConfig {
  path: string | null;
  paint: string;
  width: number;
  length: number;
  segmentLength: number;
  begin: string;
  flyDuration: string;
  cycleDuration: string;
  onVisible?: () => void;
}
