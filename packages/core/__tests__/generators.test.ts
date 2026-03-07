/**
 * @framingui/core - Generator Tests
 * Test suite for code generators (CSS-in-JS, Tailwind, React)
 * [SPEC-LAYOUT-002] [PHASE-3]
 */

import { describe, it, expect } from 'vitest';
import type { ResolvedScreen, ResolvedComponent } from '../src/screen-generation/resolver/index.js';
import {
  // CSS-in-JS
  convertCSSVarsToTheme,
  generateComponentStyles,
  generateStyledComponents,
  // Tailwind
  tokenToTailwindClass,
  generateComponentClasses,
  generateTailwindConfig,
  generateTailwindClasses,
  // React
  generateComponentInterface,
  generateComponentJSX,
  generateReactComponent,
  // Utilities
  camelCase,
  pascalCase,
  kebabCase,
  escapeJSX,
  propValueToJSX,
  generateImports,
  cssVarToToken,
  sanitizeIdentifier,
} from '../src/screen-generation/index.js';

// ============================================================================
// Test Fixtures
// ============================================================================

/**
 * Mock resolved component for testing
 */
const mockResolvedComponent: ResolvedComponent = {
  type: 'Button',
  schema: {
    type: 'Button',
    category: 'primitive',
    props: [
      {
        name: 'variant',
        type: 'string',
        required: false,
        description: 'Button variant',
        defaultValue: 'primary',
        options: ['primary', 'secondary', 'outline'],
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        required: true,
        description: 'Button content',
      },
    ],
    tokenBindings: {
      background: 'component.button.{variant}.background',
      color: 'component.button.{variant}.foreground',
      padding: 'atomic.spacing.{size}',
    },
    a11y: {
      role: 'button',
      wcag: 'AA',
      keyboard: ['Enter', 'Space'],
    },
  },
  props: {
    variant: 'primary',
    children: 'Click me',
  },
  resolvedProps: {
    variant: 'primary',
    children: 'Click me',
  },
  tokenBindings: {
    background: 'var(--component-button-primary-background)',
    color: 'var(--component-button-primary-foreground)',
    padding: 'var(--atomic-spacing-16)',
  },
  children: ['Click me'],
};

/**
 * Mock resolved screen for testing
 */
const mockResolvedScreen: ResolvedScreen = {
  id: 'test-screen',
  name: 'Test Screen',
  description: 'A test screen',
  shell: {
    shell: {
      id: 'shell.web.dashboard',
      description: 'Standard dashboard shell',
      platform: 'web',
      regions: [],
      responsive: { default: {} },
      tokenBindings: {},
    },
    sections: [],
    responsive: { default: {} },
    cssVariables: {},
  },
  page: {
    page: {
      id: 'page.dashboard',
      description: 'Dashboard page layout',
      purpose: 'dashboard',
      sections: [],
      responsive: { default: {} },
      tokenBindings: {},
    },
    sections: [],
    responsive: { default: {} },
    cssVariables: {},
  },
  sections: [
    {
      id: 'hero',
      layout: {
        sections: [
          {
            id: 'section.hero',
            type: 'flex',
            description: 'Hero section layout',
            css: { display: 'flex' },
            responsive: { default: { display: 'flex' } },
            tokenBindings: {},
          },
        ],
        responsive: { default: {} },
        cssVariables: {},
      },
      components: [mockResolvedComponent],
      cssVariables: {},
    },
  ],
  cssVariables: {
    'var(--component-button-primary-background)': 'component.button.primary.background',
    'var(--component-button-primary-foreground)': 'component.button.primary.foreground',
    'var(--atomic-spacing-16)': 'atomic.spacing.16',
    'var(--semantic-color-primary)': 'semantic.color.primary',
  },
  componentTree: {
    sections: [
      {
        sectionId: 'hero',
        components: [
          {
            type: 'Button',
          },
        ],
      },
    ],
  },
  themeId: 'default',
};

// ============================================================================
// Utility Tests
// ============================================================================

describe('Generator Utilities', () => {
  describe('String case conversion', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('user-profile-card')).toBe('userProfileCard');
      expect(camelCase('UserProfileCard')).toBe('userProfileCard');
      expect(camelCase('user_profile_card')).toBe('userProfileCard');
    });

    it('should convert to PascalCase', () => {
      expect(pascalCase('user-profile-card')).toBe('UserProfileCard');
      expect(pascalCase('userProfileCard')).toBe('UserProfileCard');
      expect(pascalCase('user_profile_card')).toBe('UserProfileCard');
    });

    it('should convert to kebab-case', () => {
      expect(kebabCase('UserProfileCard')).toBe('user-profile-card');
      expect(kebabCase('userProfileCard')).toBe('user-profile-card');
      expect(kebabCase('user_profile_card')).toBe('user-profile-card');
    });
  });

  describe('JSX utilities', () => {
    it('should escape JSX special characters', () => {
      expect(escapeJSX('Hello <world> & "friends"')).toBe(
        'Hello &lt;world&gt; &amp; &quot;friends&quot;'
      );
    });

    it('should convert prop values to JSX', () => {
      expect(propValueToJSX('hello')).toBe('"hello"');
      expect(propValueToJSX(42)).toBe('{42}');
      expect(propValueToJSX(true)).toBe('{true}');
      expect(propValueToJSX({ a: 1 })).toBe('{{"a":1}}');
    });
  });

  describe('Import generation', () => {
    it('should generate import statements', () => {
      const deps = {
        react: ['useState', 'useEffect'],
        'styled-components': ['default as styled'],
      };

      const imports = generateImports(deps, 'typescript');
      expect(imports).toContain("import { useState, useEffect } from 'react'");
      expect(imports).toContain("import styled from 'styled-components'");
    });
  });

  describe('CSS utilities', () => {
    it('should convert CSS variable to token reference', () => {
      expect(cssVarToToken('var(--atomic-spacing-16)')).toBe('atomic.spacing.16');
      expect(cssVarToToken('var(--semantic-color-primary)')).toBe('semantic.color.primary');
    });
  });

  describe('Identifier validation', () => {
    it('should sanitize invalid identifiers', () => {
      expect(sanitizeIdentifier('my-component')).toBe('myComponent');
      expect(sanitizeIdentifier('123-component')).toBe('_123Component');
      expect(sanitizeIdentifier('valid_name')).toBe('validName');
    });
  });
});

// ============================================================================
// CSS-in-JS Generator Tests
// ============================================================================

describe('CSS-in-JS Generator', () => {
  describe('convertCSSVarsToTheme', () => {
    it('should convert CSS variables to theme object', () => {
      const cssVars = {
        'var(--atomic-spacing-16)': 'atomic.spacing.16',
        'var(--semantic-color-primary)': 'semantic.color.primary',
        'var(--component-button-primary-background)': 'component.button.primary.background',
      };

      const theme = convertCSSVarsToTheme(cssVars);

      expect(theme.spacing['16']).toBe('var(--atomic-spacing-16)');
      expect(theme.colors['primary']).toBe('var(--semantic-color-primary)');
      expect(theme.custom?.button).toBeDefined();
    });

    it('should handle empty CSS variables', () => {
      const theme = convertCSSVarsToTheme({});

      expect(theme.colors).toEqual({});
      expect(theme.spacing).toEqual({});
    });
  });

  describe('generateComponentStyles', () => {
    it('should generate styled-components code', () => {
      const code = generateComponentStyles(mockResolvedComponent, 'styled-components');

      expect(code).toContain('export const StyledButton');
      expect(code).toContain('styled.button');
      expect(code).toContain('background:');
      expect(code).toContain('color:');
    });
  });

  describe('generateStyledComponents', () => {
    it('should generate complete styled-components code', () => {
      const result = generateStyledComponents(mockResolvedScreen, 'styled-components');

      expect(result.code).toContain('export const theme');
      expect(result.code).toContain('export const StyledButton');
      expect(result.meta?.componentCount).toBe(1);
    });

    it('should generate Emotion code', () => {
      const result = generateStyledComponents(mockResolvedScreen, 'emotion');

      expect(result.code).toContain("import styled from '@emotion/styled'");
      expect(result.code).toContain('export const theme');
    });
  });
});

// ============================================================================
// Tailwind Generator Tests
// ============================================================================

describe('Tailwind Generator', () => {
  describe('tokenToTailwindClass', () => {
    it('should convert spacing tokens to Tailwind classes', () => {
      const className = tokenToTailwindClass('var(--atomic-spacing-16)', { prop: 'padding' });
      expect(className).toBe('p-4');
    });

    it('should convert color tokens to Tailwind classes', () => {
      const className = tokenToTailwindClass('var(--semantic-color-primary)', {
        prop: 'background',
      });
      expect(className).toBe('bg-primary');
    });

    it('should handle responsive variants', () => {
      const className = tokenToTailwindClass('var(--atomic-spacing-16)', {
        prop: 'padding',
        responsive: 'md',
      });
      expect(className).toBe('md:p-4');
    });

    it('should return empty string for unsupported tokens', () => {
      const className = tokenToTailwindClass('var(--unknown-token)', { prop: 'unknown' });
      expect(className).toBe('');
    });
  });

  describe('generateComponentClasses', () => {
    it('should generate Tailwind classes for component', () => {
      const classes = generateComponentClasses(mockResolvedComponent);

      expect(classes).toBeInstanceOf(Array);
      expect(classes.length).toBeGreaterThan(0);
    });
  });

  describe('generateTailwindConfig', () => {
    it('should generate Tailwind configuration', () => {
      const config = generateTailwindConfig(mockResolvedScreen.cssVariables);

      expect(config).toContain('module.exports');
      expect(config).toContain('theme:');
      expect(config).toContain('extend:');
      expect(config).toContain('colors:');
    });

    it('should map spacing tokens correctly', () => {
      const config = generateTailwindConfig({
        'var(--atomic-spacing-16)': 'atomic.spacing.16',
      });

      expect(config).toContain("'4':");
      expect(config).toContain('var(--atomic-spacing-16)');
    });
  });

  describe('generateTailwindClasses', () => {
    it('should generate complete Tailwind output', () => {
      const result = generateTailwindClasses(mockResolvedScreen);

      expect(result.code).toBeDefined();
      expect(result.files).toBeDefined();
      expect(result.files?.[0].path).toBe('tailwind.config.js');
    });

    it('should warn about components without classes', () => {
      const screenWithEmptyBindings: ResolvedScreen = {
        ...mockResolvedScreen,
        sections: [
          {
            ...mockResolvedScreen.sections[0],
            components: [
              {
                ...mockResolvedComponent,
                tokenBindings: {},
              },
            ],
          },
        ],
      };

      const result = generateTailwindClasses(screenWithEmptyBindings);

      expect(result.warnings).toBeDefined();
      expect(result.warnings!.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// React Generator Tests
// ============================================================================

describe('React Generator', () => {
  describe('generateComponentInterface', () => {
    it('should generate TypeScript interface', () => {
      const code = generateComponentInterface(mockResolvedComponent);

      expect(code).toContain('interface ButtonProps');
      expect(code).toContain('variant?: string');
      expect(code).toContain('children: React.ReactNode');
    });

    it('should include JSDoc comments', () => {
      const code = generateComponentInterface(mockResolvedComponent);

      expect(code).toContain('/** Button variant */');
      expect(code).toContain('/** Button content */');
    });
  });

  describe('generateComponentJSX', () => {
    it('should generate JSX with Tailwind classes', () => {
      const context = {
        depth: 0,
        imports: new Set<string>(),
        cssFramework: 'tailwind' as const,
        format: 'typescript' as const,
      };

      const jsx = generateComponentJSX(mockResolvedComponent, context);

      expect(jsx).toContain('<button');
      expect(jsx).toContain('className=');
      expect(jsx).toContain('role="button"');
    });

    it('should generate self-closing tags for components without children', () => {
      const componentWithoutChildren = {
        ...mockResolvedComponent,
        children: undefined,
        props: {
          variant: 'primary',
        },
      };

      const context = {
        depth: 0,
        imports: new Set<string>(),
        cssFramework: 'tailwind' as const,
        format: 'typescript' as const,
      };

      const jsx = generateComponentJSX(componentWithoutChildren, context);

      expect(jsx).toContain('/>');
      expect(jsx).not.toContain('</button>');
    });

    it('should render props.children text when resolved children are absent', () => {
      const componentWithPropChildren = {
        ...mockResolvedComponent,
        children: undefined,
        props: {
          variant: 'primary',
          children: 'Prop children text',
        },
      };

      const context = {
        depth: 0,
        imports: new Set<string>(),
        cssFramework: 'tailwind' as const,
        format: 'typescript' as const,
      };

      const jsx = generateComponentJSX(componentWithPropChildren, context);

      expect(jsx).toContain('Prop children text');
      expect(jsx).toContain('</button>');
      expect(jsx).not.toContain('/>');
    });

    it('should merge generated classes with props.className into one className attribute', () => {
      const componentWithRecipeClass = {
        ...mockResolvedComponent,
        props: {
          variant: 'primary',
          children: 'Click me',
          className: 'bg-white rounded-xl',
        },
      };

      const context = {
        depth: 0,
        imports: new Set<string>(),
        cssFramework: 'tailwind' as const,
        format: 'typescript' as const,
      };

      const jsx = generateComponentJSX(componentWithRecipeClass, context);

      expect(jsx.match(/className=/g)?.length).toBe(1);
      expect(jsx).toContain('bg-white');
      expect(jsx).toContain('rounded-xl');
    });
  });

  describe('generateReactComponent', () => {
    it('should generate TypeScript React component', () => {
      const result = generateReactComponent(mockResolvedScreen, {
        format: 'typescript',
        cssFramework: 'tailwind',
        includeTypes: true,
      });

      expect(result.code).toContain("import React from 'react'");
      expect(result.code).toContain('interface TestScreenProps');
      expect(result.code).toContain('export const TestScreen: React.FC');
      expect(result.code).toContain('data-screen-id="test-screen"');
    });

    it('should generate JavaScript React component', () => {
      const result = generateReactComponent(mockResolvedScreen, {
        format: 'javascript',
        cssFramework: 'tailwind',
        includeTypes: false,
      });

      expect(result.code).toContain("import React from 'react'");
      expect(result.code).not.toContain('interface');
      expect(result.code).toContain('export const TestScreen =');
    });

    it('should generate type definitions file', () => {
      const result = generateReactComponent(mockResolvedScreen, {
        format: 'typescript',
        includeTypes: true,
      });

      expect(result.files).toBeDefined();
      const typesFile = result.files?.find(f => f.path === 'types.ts');
      expect(typesFile).toBeDefined();
      expect(typesFile?.content).toContain('interface ButtonProps');
    });

    it('should include CSS module imports', () => {
      const result = generateReactComponent(mockResolvedScreen, {
        cssFramework: 'css-modules',
      });

      expect(result.code).toContain("import styles from './styles.module.css'");
    });

    it('should include performance metadata', () => {
      const result = generateReactComponent(mockResolvedScreen);

      expect(result.meta).toBeDefined();
      expect(result.meta?.duration).toBeGreaterThanOrEqual(0);
      expect(result.meta?.componentCount).toBe(1);
      expect(result.meta?.lineCount).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Generator Integration', () => {
  it('should generate all output formats for a screen', () => {
    // Generate styled-components
    const styledResult = generateStyledComponents(mockResolvedScreen, 'styled-components');
    expect(styledResult.code).toBeDefined();
    expect(styledResult.code.length).toBeGreaterThan(0);

    // Generate Tailwind
    const tailwindResult = generateTailwindClasses(mockResolvedScreen);
    expect(tailwindResult.code).toBeDefined();
    expect(tailwindResult.files).toBeDefined();

    // Generate React component
    const reactResult = generateReactComponent(mockResolvedScreen);
    expect(reactResult.code).toBeDefined();
    expect(reactResult.files).toBeDefined();
  });

  it('should maintain consistency across generators', () => {
    const reactResult = generateReactComponent(mockResolvedScreen);
    const tailwindResult = generateTailwindClasses(mockResolvedScreen);

    // Both should process the same number of components
    expect(reactResult.meta?.componentCount).toBe(1);
    expect(Object.keys(tailwindResult.code).length).toBeGreaterThan(0);
  });
});

// ============================================================================
// Error Handling Tests
// ============================================================================

describe('Generator Error Handling', () => {
  it('should handle invalid token references gracefully', () => {
    const invalidComponent: ResolvedComponent = {
      ...mockResolvedComponent,
      tokenBindings: {
        invalid: 'var(--invalid-token)',
      },
    };

    expect(() => {
      generateComponentClasses(invalidComponent);
    }).not.toThrow();
  });

  it('should handle empty screens', () => {
    const emptyScreen: ResolvedScreen = {
      ...mockResolvedScreen,
      sections: [],
    };

    expect(() => {
      generateReactComponent(emptyScreen);
    }).not.toThrow();

    expect(() => {
      generateTailwindClasses(emptyScreen);
    }).not.toThrow();

    expect(() => {
      generateStyledComponents(emptyScreen);
    }).not.toThrow();
  });
});

// ============================================================================
// Edge Case Tests
// ============================================================================

describe('Generator Edge Cases', () => {
  describe('CSS-in-JS with various token types', () => {
    it('should handle typography tokens', () => {
      const cssVars = {
        'var(--atomic-font-size-large)': 'atomic.font.size.large',
        'var(--semantic-typography-heading)': 'semantic.typography.heading',
      };

      const theme = convertCSSVarsToTheme(cssVars);
      expect(theme.typography).toBeDefined();
      expect(Object.keys(theme.typography).length).toBeGreaterThan(0);
    });

    it('should handle border radius tokens', () => {
      const cssVars = {
        'var(--atomic-radius-md)': 'atomic.radius.md',
      };

      const theme = convertCSSVarsToTheme(cssVars);
      expect(theme.radii).toBeDefined();
    });

    it('should handle shadow tokens', () => {
      const cssVars = {
        'var(--semantic-shadow-elevated)': 'semantic.shadow.elevated',
      };

      const theme = convertCSSVarsToTheme(cssVars);
      expect(theme.shadows).toBeDefined();
    });

    it('should handle component-specific tokens', () => {
      const cssVars = {
        'var(--component-card-background)': 'component.card.background',
      };

      const theme = convertCSSVarsToTheme(cssVars);
      expect(theme.custom?.card).toBeDefined();
    });
  });

  describe('Tailwind with various properties', () => {
    it('should handle font size tokens', () => {
      const className = tokenToTailwindClass('var(--atomic-font-size-large)', {
        prop: 'fontSize',
      });
      expect(className).toBe('');
    });

    it('should handle border radius tokens', () => {
      const className = tokenToTailwindClass('var(--atomic-radius-md)', { prop: 'borderRadius' });
      expect(className).toBe('rounded-md');
    });

    it('should handle shadow tokens', () => {
      const className = tokenToTailwindClass('var(--semantic-shadow-elevated)', {
        prop: 'boxShadow',
      });
      expect(className).toBe('shadow-elevated');
    });

    it('should map various spacing values', () => {
      const className32 = tokenToTailwindClass('var(--atomic-spacing-32)', { prop: 'padding' });
      expect(className32).toBe('p-8');

      const className48 = tokenToTailwindClass('var(--atomic-spacing-48)', { prop: 'margin' });
      expect(className48).toBe('m-12');
    });
  });

  describe('React with nested components', () => {
    it('should generate nested component structure', () => {
      const nestedComponent: ResolvedComponent = {
        ...mockResolvedComponent,
        children: [
          {
            ...mockResolvedComponent,
            type: 'Text',
            children: ['Nested text'],
          },
        ],
      };

      const context = {
        depth: 0,
        imports: new Set<string>(),
        cssFramework: 'tailwind' as const,
        format: 'typescript' as const,
      };

      const jsx = generateComponentJSX(nestedComponent, context);
      expect(jsx).toContain('<button');
      expect(jsx).toContain('<span');
      expect(jsx).toContain('</span>');
      expect(jsx).toContain('</button>');
    });

    it('should generate component with multiple children', () => {
      const multiChildComponent: ResolvedComponent = {
        ...mockResolvedComponent,
        children: ['Text 1', 'Text 2', 'Text 3'],
      };

      const context = {
        depth: 0,
        imports: new Set<string>(),
        cssFramework: 'tailwind' as const,
        format: 'typescript' as const,
      };

      const jsx = generateComponentJSX(multiChildComponent, context);
      expect(jsx).toContain('Text 1');
      expect(jsx).toContain('Text 2');
      expect(jsx).toContain('Text 3');
    });
  });

  describe('Generator with different options', () => {
    it('should generate with CSS modules', () => {
      const result = generateReactComponent(mockResolvedScreen, {
        cssFramework: 'css-modules',
        prettier: false,
      });

      expect(result.code).toContain('className={styles.');
    });

    it('should generate without prettier', () => {
      const result = generateReactComponent(mockResolvedScreen, {
        prettier: false,
      });

      expect(result.code).toBeDefined();
      expect(result.meta?.lineCount).toBeGreaterThan(0);
    });

    it('should generate with single component styles', () => {
      const componentWithVariousBindings: ResolvedComponent = {
        ...mockResolvedComponent,
        tokenBindings: {
          background: 'var(--semantic-color-primary)',
          color: 'var(--semantic-color-background)',
          padding: 'var(--atomic-spacing-16)',
          borderRadius: 'var(--atomic-radius-md)',
          boxShadow: 'var(--semantic-shadow-elevated)',
        },
      };

      const code = generateComponentStyles(componentWithVariousBindings, 'emotion');
      expect(code).toContain('styled.');
      expect(code).toContain('background:');
      expect(code).toContain('color:');
      expect(code).toContain('padding:');
    });
  });

  describe('Import generation edge cases', () => {
    it('should handle side-effect imports', () => {
      const deps = {
        './styles.css': [],
      };

      const imports = generateImports(deps, 'typescript');
      expect(imports).toContain("import './styles.css'");
    });

    it('should handle default and named imports together', () => {
      const deps = {
        react: ['default as React', 'useState', 'useEffect'],
      };

      const imports = generateImports(deps, 'typescript');
      expect(imports).toContain('import React, { useState, useEffect }');
    });
  });

  describe('CSS variable conversion edge cases', () => {
    it('should handle malformed CSS variables', () => {
      const result = cssVarToToken('invalid-var');
      expect(result).toBe('invalid.var');
    });

    it('should handle CSS variables with multiple hyphens', () => {
      const result = cssVarToToken('var(--component-button-primary-hover-background)');
      expect(result).toBe('component.button.primary.hover.background');
    });
  });

  describe('Tailwind config with all token types', () => {
    it('should include all supported categories', () => {
      const cssVars = {
        'var(--semantic-color-primary)': 'semantic.color.primary',
        'var(--atomic-spacing-16)': 'atomic.spacing.16',
        'var(--atomic-font-size-large)': 'atomic.font.size.large',
        'var(--atomic-radius-md)': 'atomic.radius.md',
        'var(--semantic-shadow-elevated)': 'semantic.shadow.elevated',
      };

      const config = generateTailwindConfig(cssVars);

      expect(config).toContain('colors:');
      expect(config).toContain('spacing:');
      expect(config).toContain('fontSize:');
      expect(config).toContain('borderRadius:');
      expect(config).toContain('boxShadow:');
    });
  });
});
