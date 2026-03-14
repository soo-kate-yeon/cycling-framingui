'use client';

/**
 * @framingui/ui - FramingUI Provider
 * [TAG-Q-001] Theme bootstrap entrypoint annotations
 * [TAG-Q-004] Runtime theming contract stays explicit and verifiable
 */

import { useEffect, type ReactNode } from 'react';

import {
  getCurrentThemeId,
  injectThemeCSS,
  setThemeId,
  type ThemeDefinition,
} from './lib/theme-loader';

export interface FramingUIProviderProps {
  children: ReactNode;
  theme?: ThemeDefinition | null;
  themeId?: string;
}

/**
 * Applies FramingUI theme CSS variables and keeps the active theme id in sync.
 *
 * This narrows the consumer setup down to one runtime entrypoint:
 * the app imports `@framingui/ui/styles` once and mounts this provider near the root.
 */
export function FramingUIProvider({ children, theme, themeId }: FramingUIProviderProps) {
  const resolvedThemeId = theme?.id ?? themeId ?? null;

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && theme && themeId && theme.id !== themeId) {
      console.warn(
        `[FramingUIProvider] theme.id "${theme.id}" does not match themeId "${themeId}". ` +
          `Using "${theme.id}" because the theme object is authoritative.`
      );
    }

    if (theme) {
      injectThemeCSS(theme);
    }

    if (resolvedThemeId && getCurrentThemeId() !== resolvedThemeId) {
      setThemeId(resolvedThemeId);
    }
  }, [resolvedThemeId, theme, themeId]);

  return <>{children}</>;
}
