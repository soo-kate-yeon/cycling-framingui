/**
 * @framingui/styled - Token Accessor
 * [SPEC-STYLED-001] [TAG-003]
 * Proxy-based token accessor that returns CSS variable references
 * REQ-STY-010: Return CSS variable references for token access
 */

import type { TektonTokens } from '@framingui/tokens';

/**
 * Token accessor that returns CSS variable references
 *
 * @example
 * tokens.bg.surface.default -> 'var(--bg-surface-default)'
 * tokens.spacing[4] -> 'var(--spacing-4)'
 */
export const tokens: TektonTokens = new Proxy({} as TektonTokens, {
  get(_target, category: string) {
    return createCategoryProxy(category);
  },
});

/**
 * Creates a proxy for a token category that handles nested access
 * @param category - The category path (e.g., 'bg', 'bg-surface')
 */
function createCategoryProxy(category: string): any {
  // Use an object instead of a function for better typeof behavior
  const target = {};

  return new Proxy(target, {
    get(_target, key: string | symbol) {
      // Handle special property access for string coercion
      if (key === 'toString' || key === 'valueOf') {
        return () => `var(--${category})`;
      }

      // Handle Symbol.toPrimitive for template literals
      if (key === Symbol.toPrimitive) {
        return (hint: string) => {
          if (hint === 'string' || hint === 'default') {
            return `var(--${category})`;
          }
          return null;
        };
      }

      // Handle Symbol properties
      if (typeof key === 'symbol') {
        return undefined;
      }

      // Continue building the path for nested access
      const path = `${category}-${String(key)}`;
      return createCategoryProxy(path);
    },
  });
}
