import type { ThemePalette } from './types';

export function applyTheme(theme: ThemePalette, targetElement?: HTMLElement) {
  // ターゲットが指定されていなければ document.documentElement (:root) に適用
  const target = targetElement || document.documentElement;
  
  target.style.setProperty('--color-bg-main', theme.bgMain);
  target.style.setProperty('--color-bg-surface', theme.bgSurface);
  target.style.setProperty('--color-border', theme.border);
  target.style.setProperty('--color-text-primary', theme.textPrimary);
  target.style.setProperty('--color-text-secondary', theme.textSecondary);
  target.style.setProperty('--color-text-muted', theme.textMuted);
  target.style.setProperty('--color-text-ghost', theme.textGhost);
  target.style.setProperty('--color-accent', theme.accent);
  target.style.setProperty('--color-accent-hover', theme.accentHover);
  target.style.setProperty('--color-success', theme.success);
}