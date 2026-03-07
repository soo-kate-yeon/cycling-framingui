/**
 * @framingui/core - Tailwind CSS Generator
 * Generates Tailwind class names and configuration from ResolvedScreen
 * [SPEC-LAYOUT-002] [PHASE-3]
 */

import type { ResolvedScreen, ResolvedComponent } from '../resolver/index.js';
import type { GeneratorOptions, GeneratorResult } from './types.js';
import { cssVarToToken } from './utils.js';

// ============================================================================
// Token to Tailwind Class Mapping
// ============================================================================

/**
 * Tailwind property mapping
 * Maps CSS properties to Tailwind class prefixes
 */
const TAILWIND_PROPERTY_MAP: Record<string, string> = {
  // Layout
  width: 'w',
  height: 'h',
  padding: 'p',
  margin: 'm',
  gap: 'gap',

  // Flexbox & Grid
  display: '',
  flexDirection: 'flex',
  alignItems: 'items',
  justifyContent: 'justify',
  gridTemplateColumns: 'grid-cols',

  // Typography
  fontSize: 'text',
  fontWeight: 'font',
  lineHeight: 'leading',
  textAlign: 'text',
  color: 'text',

  // Backgrounds
  background: 'bg',
  backgroundColor: 'bg',

  // Borders
  borderRadius: 'rounded',
  borderWidth: 'border',
  borderColor: 'border',

  // Effects
  boxShadow: 'shadow',
  opacity: 'opacity',

  // Transforms
  transform: 'transform',
  scale: 'scale',
};

/**
 * Convert token binding to Tailwind class name
 *
 * Maps design token references to Tailwind utility classes.
 * Uses a lookup table for performance.
 *
 * @param tokenBinding - Token binding (CSS variable reference)
 * @param context - Resolution context with component props
 * @returns Tailwind class name
 *
 * @example
 * ```typescript
 * tokenToTailwindClass('var(--atomic-spacing-16)', { prop: 'padding' });
 * // → 'p-4'
 *
 * tokenToTailwindClass('var(--semantic-color-primary)', { prop: 'background' });
 * // → 'bg-primary-500'
 * ```
 */
export function tokenToTailwindClass(
  tokenBinding: string,
  context: { prop: string; responsive?: string }
): string {
  // Extract token reference from CSS variable
  const tokenRef = cssVarToToken(tokenBinding);
  const parts = tokenRef.split('.');

  if (parts.length < 2) {
    return '';
  }

  const [layer, category, ...rest] = parts;
  const prefix = TAILWIND_PROPERTY_MAP[context.prop] || '';

  // Responsive prefix
  const responsivePrefix = context.responsive ? `${context.responsive}:` : '';

  // Handle different token types
  if (category === 'spacing' || category === 'space') {
    const value = rest[0];
    const tailwindValue = mapSpacingToTailwind(value);
    return prefix ? `${responsivePrefix}${prefix}-${tailwindValue}` : '';
  }

  if (category === 'color' || category === 'colors') {
    const colorName = rest.join('-');
    return prefix ? `${responsivePrefix}${prefix}-${colorName}` : '';
  }

  if (category === 'font' || category === 'typography') {
    return '';
  }

  if (category === 'radius' || category === 'radii') {
    const value = rest[0];
    return `${responsivePrefix}rounded-${value}`;
  }

  if (category === 'shadow' || category === 'shadows') {
    const value = rest.join('-');
    return `${responsivePrefix}shadow-${value}`;
  }

  // Component-specific tokens
  if (layer === 'component') {
    return '';
  }

  return '';
}

/**
 * Map spacing token value to Tailwind spacing scale
 *
 * @param value - Spacing token value (e.g., '16', '32', '48')
 * @returns Tailwind spacing value (e.g., '4', '8', '12')
 */
function mapSpacingToTailwind(value: string): string {
  // Tekton uses 4px base unit, Tailwind uses 0.25rem (4px) base
  // Direct mapping: 16px → 4, 32px → 8, etc.
  const numValue = parseInt(value, 10);
  if (isNaN(numValue)) {
    return value;
  }

  return String(numValue / 4);
}

/**
 * Generate Tailwind classes for component
 *
 * @param component - Resolved component
 * @returns Array of Tailwind class names
 *
 * @example
 * ```typescript
 * const component = {
 *   type: 'Button',
 *   tokenBindings: {
 *     background: 'var(--semantic-color-primary)',
 *     padding: 'var(--atomic-spacing-16)'
 *   }
 * };
 *
 * generateTailwindClasses(component);
 * // → ['bg-primary-500', 'p-4']
 * ```
 */
export function generateComponentClasses(component: ResolvedComponent): string[] {
  const classes: string[] = [];

  for (const [prop, tokenBinding] of Object.entries(component.tokenBindings)) {
    const className = tokenToTailwindClass(tokenBinding, { prop });
    if (className) {
      classes.push(className);
    }
  }

  return classes;
}

// ============================================================================
// Tailwind Config Generation
// ============================================================================

/**
 * Generate Tailwind configuration extension
 *
 * Creates a tailwind.config.js extension that maps design tokens
 * to Tailwind theme values.
 *
 * @param cssVars - CSS variables from resolved screen
 * @returns Tailwind config extension code
 *
 * @example
 * ```typescript
 * const cssVars = {
 *   'var(--semantic-color-primary)': 'semantic.color.primary',
 *   'var(--atomic-spacing-16)': 'atomic.spacing.16'
 * };
 *
 * const config = generateTailwindConfig(cssVars);
 * // module.exports = {
 * //   theme: {
 * //     extend: {
 * //       colors: {
 * //         'primary': 'var(--semantic-color-primary)',
 * //       },
 * //       spacing: {
 * //         '4': 'var(--atomic-spacing-16)',
 * //       }
 * //     }
 * //   }
 * // }
 * ```
 */
export function generateTailwindConfig(cssVars: Record<string, string>): string {
  const config: {
    colors: Record<string, string>;
    spacing: Record<string, string>;
    fontSizes: Record<string, string>;
    borderRadius: Record<string, string>;
    boxShadow: Record<string, string>;
  } = {
    colors: {},
    spacing: {},
    fontSizes: {},
    borderRadius: {},
    boxShadow: {},
  };

  // Process CSS variables
  for (const [cssVar, tokenRef] of Object.entries(cssVars)) {
    const parts = tokenRef.split('.');
    if (parts.length < 2) {
      continue;
    }

    const [layer, category, ...rest] = parts;

    if (layer === 'semantic' || layer === 'atomic') {
      if (category === 'color' || category === 'colors') {
        const key = rest.join('-');
        config.colors[key] = cssVar;
      } else if (category === 'spacing' || category === 'space') {
        const value = rest[0];
        const tailwindKey = mapSpacingToTailwind(value);
        config.spacing[tailwindKey] = cssVar;
      } else if (category === 'font' || category === 'typography') {
        const key = rest.join('-');
        config.fontSizes[key] = cssVar;
      } else if (category === 'radius' || category === 'radii') {
        const key = rest[0] || 'default';
        config.borderRadius[key] = cssVar;
      } else if (category === 'shadow' || category === 'shadows') {
        const key = rest.join('-') || 'default';
        config.boxShadow[key] = cssVar;
      }
    }
  }

  // Generate config code
  const lines: string[] = [];
  lines.push('/** @type {import("tailwindcss").Config} */');
  lines.push('module.exports = {');
  lines.push('  theme: {');
  lines.push('    extend: {');

  // Colors
  if (Object.keys(config.colors).length > 0) {
    lines.push('      colors: {');
    for (const [key, value] of Object.entries(config.colors)) {
      lines.push(`        '${key}': '${value}',`);
    }
    lines.push('      },');
  }

  // Spacing
  if (Object.keys(config.spacing).length > 0) {
    lines.push('      spacing: {');
    for (const [key, value] of Object.entries(config.spacing)) {
      lines.push(`        '${key}': '${value}',`);
    }
    lines.push('      },');
  }

  // Font sizes
  if (Object.keys(config.fontSizes).length > 0) {
    lines.push('      fontSize: {');
    for (const [key, value] of Object.entries(config.fontSizes)) {
      lines.push(`        '${key}': '${value}',`);
    }
    lines.push('      },');
  }

  // Border radius
  if (Object.keys(config.borderRadius).length > 0) {
    lines.push('      borderRadius: {');
    for (const [key, value] of Object.entries(config.borderRadius)) {
      lines.push(`        '${key}': '${value}',`);
    }
    lines.push('      },');
  }

  // Box shadow
  if (Object.keys(config.boxShadow).length > 0) {
    lines.push('      boxShadow: {');
    for (const [key, value] of Object.entries(config.boxShadow)) {
      lines.push(`        '${key}': '${value}',`);
    }
    lines.push('      },');
  }

  lines.push('    },');
  lines.push('  },');
  lines.push('};');

  return lines.join('\n');
}

// ============================================================================
// Main Generation Function
// ============================================================================

/**
 * Generate Tailwind classes and configuration from resolved screen
 *
 * Creates:
 * - Component class mappings
 * - Tailwind configuration extension
 *
 * @param screen - Resolved screen
 * @param options - Generator options
 * @returns Generator result with code and config
 *
 * @example
 * ```typescript
 * const screen = resolveScreen(screenDefinition);
 * const result = generateTailwindClasses(screen);
 *
 * console.log(result.code); // Component class mappings
 * console.log(result.files[0].content); // tailwind.config.js
 * ```
 */
export function generateTailwindClasses(
  screen: ResolvedScreen,
  _options: GeneratorOptions = {}
): GeneratorResult {
  const startTime = performance.now();

  const componentClasses: Record<string, string[]> = {};
  const warnings: string[] = [];

  // Generate classes for each component
  for (const section of screen.sections) {
    for (const component of section.components) {
      const classes = generateComponentClasses(component);

      if (classes.length === 0) {
        warnings.push(
          `No Tailwind classes generated for ${component.type} (may need manual styling)`
        );
      }

      const key = `${section.id}-${component.type}`;
      componentClasses[key] = classes;
    }
  }

  // Generate Tailwind config
  const config = generateTailwindConfig(screen.cssVariables);

  // Generate class mapping code
  const classMapCode = generateClassMapCode(componentClasses);

  const endTime = performance.now();

  return {
    code: classMapCode,
    files: [
      {
        path: 'tailwind.config.js',
        content: config,
        type: 'config',
      },
    ],
    warnings,
    meta: {
      duration: endTime - startTime,
      componentCount: Object.keys(componentClasses).length,
      lineCount: classMapCode.split('\n').length + config.split('\n').length,
    },
  };
}

/**
 * Generate class mapping code
 *
 * @param componentClasses - Component class mappings
 * @returns TypeScript code for class mappings
 */
function generateClassMapCode(componentClasses: Record<string, string[]>): string {
  const lines: string[] = [];

  lines.push('/**');
  lines.push(' * Tailwind class mappings for components');
  lines.push(' * Generated from design tokens');
  lines.push(' */');
  lines.push('export const componentClasses = {');

  for (const [key, classes] of Object.entries(componentClasses)) {
    const classString = classes.join(' ');
    lines.push(`  '${key}': '${classString}',`);
  }

  lines.push('};');

  return lines.join('\n');
}
