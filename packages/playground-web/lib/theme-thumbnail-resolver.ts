/**
 * Theme Thumbnail Resolver
 *
 * Uses themeToCSS() from @framingui/ui to generate the authoritative
 * CSS variable map for each theme. This ensures ThemeRecipeCard renders
 * components with the exact same tokens as the live demo pages.
 */

import { themeToCSS, type ThemeDefinition } from '@framingui/ui';

// Static JSON imports
import pebble from './themes/pebble.json';
import darkBoldness from './themes/dark-boldness.json';
import editorialTech from './themes/editorial-tech.json';
import neutralWorkspace from './themes/neutral-workspace.json';
import minimalWorkspace from './themes/minimal-workspace.json';
import squareMinimalism from './themes/square-minimalism.json';
import classicMagazine from './themes/classic-magazine.json';
import boldLine from './themes/bold-line.json';

export interface ThumbnailVars {
  [key: string]: string;
}

/**
 * Parse a themeToCSS() output string into a flat CSS variable map.
 * e.g. "--bg-canvas: oklch(1 0 0);" → { '--bg-canvas': 'oklch(1 0 0)' }
 */
function parseCSSVars(css: string): ThumbnailVars {
  const vars: ThumbnailVars = {};
  const regex = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const key = match[1]!.trim();
    const value = match[2]!.trim();
    // Skip "undefined" values (some themes lack certain tokens)
    if (value !== 'undefined') {
      vars[key] = value;
    }
  }
  return vars;
}

/**
 * Ensure the theme JSON has all nested paths themeToCSS() expects,
 * filling in missing ones with safe fallback references to avoid
 * "Cannot read properties of undefined" errors.
 */
function ensureSemanticPaths(themeJson: any): any {
  const t = JSON.parse(JSON.stringify(themeJson));
  const sem = t.tokens?.semantic;
  if (!sem) {
    return t;
  }

  // background.surface
  if (!sem.background.surface) {
    sem.background.surface = { default: sem.background.canvas, subtle: sem.background.canvas };
  }
  sem.background.surface.emphasis ??=
    sem.background.surface.subtle ?? sem.background.surface.default;
  sem.background.surface.subtle ??= sem.background.surface.default;
  sem.background.surface.popover ??= sem.background.surface.default;

  // background.brand
  if (!sem.background.brand) {
    sem.background.brand = { default: sem.text?.primary ?? 'atomic.color.neutral.900' };
  }
  sem.background.brand.subtle ??= sem.background.brand.default;
  sem.background.brand.emphasis ??= sem.background.brand.default;

  // border
  if (!sem.border) {
    sem.border = { default: {} };
  }
  if (typeof sem.border.default === 'string') {
    const val = sem.border.default;
    sem.border.default = { default: val, subtle: val, emphasis: val };
  }
  if (!sem.border.default) {
    sem.border.default = {};
  }
  sem.border.default.default ??=
    sem.border.subtle ?? sem.border.default.subtle ?? sem.background.surface.emphasis;
  sem.border.default.subtle ??= sem.border.default.default;
  sem.border.default.emphasis ??= sem.border.default.default;

  // text
  if (!sem.text) {
    sem.text = { primary: 'atomic.color.neutral.900', secondary: 'atomic.color.neutral.500' };
  }
  sem.text.muted ??= sem.text.secondary;
  sem.text.inverted ??= sem.background.canvas;

  return t;
}

/**
 * For themes where brand.default is a bright accent color (not meant as
 * primary button bg), fix --bg-primary to use the action/foreground color
 * so @framingui/ui components render correctly.
 *
 * Detection: if --bg-primary has high lightness (>0.8) AND high chroma (>0.1),
 * it's a bright accent — override to --bg-foreground (the text/action color).
 */
function fixAccentBrandTheme(vars: ThumbnailVars): ThumbnailVars {
  const primary = vars['--bg-primary'];
  if (!primary) {
    return vars;
  }

  const match = primary.match(/oklch\(([\d.]+)\s+([\d.]+)/);
  if (!match) {
    return vars;
  }

  const l = parseFloat(match[1]!);
  const c = parseFloat(match[2]!);

  // Bright accent (e.g. bold-line green: l=0.94, c=0.22)
  if (l > 0.8 && c > 0.1) {
    const fg = vars['--bg-foreground'];
    if (fg) {
      return {
        ...vars,
        '--bg-primary': fg,
        '--bg-primary-foreground': vars['--bg-background'] ?? 'oklch(1 0 0)',
        // Also fix border-input to match the theme's strong border style
        '--border-input': vars['--border-default'] ?? fg,
      };
    }
  }

  return vars;
}

/**
 * Generate the full CSS variable map for a theme JSON using the
 * authoritative themeToCSS() from @framingui/ui.
 */
function resolveTheme(themeJson: unknown): ThumbnailVars {
  const normalized = ensureSemanticPaths(themeJson);
  const css = themeToCSS(normalized as ThemeDefinition);
  const vars = parseCSSVars(css);
  return fixAccentBrandTheme(vars);
}

// ============================================================================
// Theme Registry (pre-resolved at import time)
// ============================================================================

const THEME_REGISTRY: Record<string, ThumbnailVars> = {
  'square-minimalism': resolveTheme(squareMinimalism),
  'classic-magazine': resolveTheme(classicMagazine),
  pebble: resolveTheme(pebble),
  'dark-boldness': resolveTheme(darkBoldness),
  'editorial-tech': resolveTheme(editorialTech),
  'neutral-workspace': resolveTheme(neutralWorkspace),
  'minimal-workspace': resolveTheme(minimalWorkspace),
  'bold-line': resolveTheme(boldLine),
};

/**
 * Get pre-resolved CSS variables for a given theme ID.
 * Returns undefined if theme is not found.
 */
export function getThemeThumbnailVars(themeId: string): ThumbnailVars | undefined {
  return THEME_REGISTRY[themeId];
}
