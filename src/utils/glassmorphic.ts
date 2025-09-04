export type Variant = 'primary' | 'secondary' | 'neutral';
export type Size = 'small' | 'medium' | 'large';

export function getGlassmorphicClasses(
  variant: Variant = 'neutral',
  size: Size = 'medium',
  className = '',
): string {
  return [
    'glassmorphic-container',
    `glassmorphic-container--${variant}`,
    `glassmorphic-container--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
