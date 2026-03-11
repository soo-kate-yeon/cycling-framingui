/**
 * @framingui/core - Pipeline Integration Tests
 * Tests the complete flow: Theme -> Blueprint -> Screen
 */

import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  // Theme
  loadTheme,
  listThemes,
  isBuiltinTheme,
  oklchToCSS,
  generateCSSVariables,
  BUILTIN_THEMES,
  // Blueprint
  createBlueprint,
  validateBlueprint,
  isValidComponent,
  getLayoutSlots,
  COMPONENT_CATALOG,
  // Render
  render,
  renderWithTheme,
  renderSingleComponent,
  renderComponents,
} from '../src/index.js';

// ============================================================================
// Theme Tests
// ============================================================================

describe('Theme Module', () => {
  describe('loadTheme', () => {
    it('should load built-in theme', () => {
      const theme = loadTheme('classic-magazine');
      expect(theme).not.toBeNull();
      expect(theme?.id).toBe('classic-magazine');
      // v2.1 schema uses tokens.color (flat structure, not atomic)
      expect(theme?.tokens?.color).toBeDefined();
    });

    it('should return null for non-existent theme', () => {
      const theme = loadTheme('non-existent-theme');
      expect(theme).toBeNull();
    });

    // Security: Path traversal attack prevention
    it('should reject path traversal attempts', () => {
      expect(loadTheme('../../../etc/passwd')).toBeNull();
      expect(loadTheme('../../package.json')).toBeNull();
      expect(loadTheme('../theme')).toBeNull();
    });

    it('should reject invalid theme IDs', () => {
      expect(loadTheme('')).toBeNull();
      expect(loadTheme('Theme With Spaces')).toBeNull();
      expect(loadTheme('theme/with/slashes')).toBeNull();
      expect(loadTheme('theme\\with\\backslashes')).toBeNull();
      expect(loadTheme('theme_with_underscores')).toBeNull();
      expect(loadTheme('UPPERCASE')).toBeNull();
    });

    it('should accept valid theme ID format', () => {
      // Valid: lowercase alphanumeric + hyphens
      const theme = loadTheme('classic-magazine');
      expect(theme).not.toBeNull();
    });

    it('should normalize legacy recipe CSS variable prefixes', () => {
      const theme = loadTheme('neutral-workspace');
      expect(theme).not.toBeNull();

      const recipes = (theme?.recipes ?? (theme?.tokens as any)?.recipes) as
        | Record<string, unknown>
        | undefined;
      const serializedRecipes = JSON.stringify(recipes);

      expect(serializedRecipes).toContain('--bg-surface');
      expect(serializedRecipes).not.toContain('--tekton-');
    });
  });

  describe('listThemes', () => {
    it('should return array of theme metadata', () => {
      const themes = listThemes();
      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBeGreaterThan(0);
      expect(themes[0]).toHaveProperty('id');
      expect(themes[0]).toHaveProperty('name');
    });

    it('should fall back when cwd has no .moai directory', () => {
      const originalCwd = process.cwd();
      const tempDir = mkdtempSync(join(tmpdir(), 'framingui-core-'));

      process.chdir(tempDir);

      try {
        const themes = listThemes();
        const theme = loadTheme('classic-magazine');

        expect(themes.length).toBeGreaterThan(0);
        expect(theme?.id).toBe('classic-magazine');
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('isBuiltinTheme', () => {
    // v2.1: All themes are loaded dynamically from external files
    // BUILTIN_THEMES is empty in v2.1 - themes are in .moai/themes/generated/
    it('should return false for all themes in v2.1 (dynamic loading)', () => {
      // v2.1 does not have built-in themes - all themes are external
      expect(isBuiltinTheme('classic-magazine')).toBe(false);
      expect(isBuiltinTheme('hims-v1')).toBe(false);
    });

    it('should return false for custom themes', () => {
      expect(isBuiltinTheme('my-custom-theme')).toBe(false);
    });
  });

  describe('oklchToCSS', () => {
    it('should convert OKLCH to CSS string', () => {
      const css = oklchToCSS({ l: 0.7, c: 0.1, h: 170 });
      expect(css).toBe('oklch(0.7 0.1 170)');
    });

    // Security: Color range validation
    it('should clamp lightness to 0-1 range', () => {
      expect(oklchToCSS({ l: -0.5, c: 0.1, h: 170 })).toBe('oklch(0 0.1 170)');
      expect(oklchToCSS({ l: 1.5, c: 0.1, h: 170 })).toBe('oklch(1 0.1 170)');
      expect(oklchToCSS({ l: 0, c: 0.1, h: 170 })).toBe('oklch(0 0.1 170)');
      expect(oklchToCSS({ l: 1, c: 0.1, h: 170 })).toBe('oklch(1 0.1 170)');
    });

    it('should clamp chroma to 0-0.5 range', () => {
      expect(oklchToCSS({ l: 0.7, c: -0.1, h: 170 })).toBe('oklch(0.7 0 170)');
      expect(oklchToCSS({ l: 0.7, c: 0.8, h: 170 })).toBe('oklch(0.7 0.5 170)');
      expect(oklchToCSS({ l: 0.7, c: 0, h: 170 })).toBe('oklch(0.7 0 170)');
      expect(oklchToCSS({ l: 0.7, c: 0.5, h: 170 })).toBe('oklch(0.7 0.5 170)');
    });

    it('should normalize hue to 0-360 range', () => {
      expect(oklchToCSS({ l: 0.7, c: 0.1, h: 370 })).toBe('oklch(0.7 0.1 10)');
      expect(oklchToCSS({ l: 0.7, c: 0.1, h: -10 })).toBe('oklch(0.7 0.1 350)');
      expect(oklchToCSS({ l: 0.7, c: 0.1, h: 0 })).toBe('oklch(0.7 0.1 0)');
      expect(oklchToCSS({ l: 0.7, c: 0.1, h: 360 })).toBe('oklch(0.7 0.1 0)');
      expect(oklchToCSS({ l: 0.7, c: 0.1, h: 720 })).toBe('oklch(0.7 0.1 0)');
    });

    it('should handle extreme values', () => {
      expect(oklchToCSS({ l: 999, c: 999, h: 999 })).toBe('oklch(1 0.5 279)');
      expect(oklchToCSS({ l: -999, c: -999, h: -999 })).toBe('oklch(0 0 81)');
    });
  });

  describe('generateCSSVariables', () => {
    // v2.1: generateCSSVariables() is deprecated and returns empty object
    // Use generateThemeCSS() from css-generator.ts for v2.1 themes
    it('should be deprecated in v2.1 and return empty object', () => {
      const theme = loadTheme('classic-magazine');
      expect(theme).not.toBeNull();

      const vars = generateCSSVariables(theme!);
      // v2.1 deprecated function returns empty object
      expect(vars).toEqual({});
    });

    it('should return empty object for any theme in v2.1', () => {
      const theme = loadTheme('classic-magazine');
      expect(theme).not.toBeNull();

      const vars = generateCSSVariables(theme!);
      // v2.1: Deprecated, always returns empty object
      expect(Object.keys(vars).length).toBe(0);
    });
  });

  describe('BUILTIN_THEMES', () => {
    // v2.1: Themes are loaded dynamically from .moai/themes/generated/
    // BUILTIN_THEMES array is empty - all themes are external files
    it('should be an empty array in v2.1 (dynamic theme loading)', () => {
      expect(BUILTIN_THEMES).toBeDefined();
      expect(Array.isArray(BUILTIN_THEMES)).toBe(true);
      expect(BUILTIN_THEMES.length).toBe(0);
    });
  });
});

// ============================================================================
// Blueprint Tests
// ============================================================================

describe('Blueprint Module', () => {
  describe('createBlueprint', () => {
    it('should create blueprint with unique id', () => {
      const bp = createBlueprint({
        name: 'Test Page',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [],
      });

      expect(bp.id).toMatch(/^bp-/);
      expect(bp.name).toBe('Test Page');
      expect(bp.themeId).toBe('classic-magazine');
    });
  });

  describe('validateBlueprint', () => {
    it('should validate correct blueprint', () => {
      const bp = createBlueprint({
        name: 'Test',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Button' }],
      });

      const result = validateBlueprint(bp);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject blueprint without required fields', () => {
      const result = validateBlueprint({
        id: '',
        name: '',
        themeId: '',
        layout: 'single-column',
        components: [],
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('isValidComponent', () => {
    it('should return true for catalog components', () => {
      expect(isValidComponent('Button')).toBe(true);
      expect(isValidComponent('Card')).toBe(true);
      expect(isValidComponent('Input')).toBe(true);
    });

    it('should return false for unknown components', () => {
      expect(isValidComponent('UnknownWidget')).toBe(false);
    });
  });

  describe('getLayoutSlots', () => {
    it('should return slots for layout', () => {
      const slots = getLayoutSlots('dashboard');
      expect(slots.length).toBeGreaterThan(0);
      expect(slots.find(s => s.name === 'sidebar')).toBeDefined();
      expect(slots.find(s => s.name === 'main')).toBeDefined();
    });

    it('should return empty array for invalid layout', () => {
      const slots = getLayoutSlots('invalid-layout' as any);
      expect(slots).toEqual([]);
    });
  });

  describe('validateBlueprint edge cases', () => {
    it('should detect invalid layout type', () => {
      const bp = createBlueprint({
        name: 'Test',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [],
      });

      // Manually set invalid layout
      const invalidBp = { ...bp, layout: 'invalid-layout' as any };
      const result = validateBlueprint(invalidBp);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid layout'))).toBe(true);
    });

    it('should validate components array is actually an array', () => {
      const result = validateBlueprint({
        id: 'test-id',
        name: 'Test',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: 'not-an-array' as any,
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Components must be an array'))).toBe(true);
    });

    it('should detect component without type', () => {
      const bp = createBlueprint({
        name: 'Test',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: '' } as any],
      });

      const result = validateBlueprint(bp);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Component missing type'))).toBe(true);
    });
  });

  describe('COMPONENT_CATALOG', () => {
    it('should export component catalog', () => {
      expect(COMPONENT_CATALOG).toBeDefined();
      expect(COMPONENT_CATALOG.length).toBeGreaterThan(0);
      expect(COMPONENT_CATALOG).toContain('Button');
    });
  });
});

// ============================================================================
// Render Tests
// ============================================================================

describe('Render Module', () => {
  describe('Quick Render API', () => {
    it('should render single component', () => {
      const result = renderSingleComponent({
        type: 'Button',
        props: { variant: 'primary' },
        children: ['Click Me'],
      });

      expect(result).toContain('<Button');
      expect(result).toContain('variant="primary"');
      expect(result).toContain('Click Me');
    });

    it('should render multiple components without layout', () => {
      const result = renderComponents(
        [
          { type: 'Heading', props: { level: 1 }, children: ['Title'] },
          { type: 'Text', children: ['Content'] },
        ],
        '  '
      );

      expect(result).toContain('<Heading');
      expect(result).toContain('<Text');
      expect(result).toContain('Title');
      expect(result).toContain('Content');
    });
  });

  describe('render', () => {
    it('should render simple blueprint to JSX', () => {
      const bp = createBlueprint({
        name: 'Hello Page',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [
          { type: 'Heading', props: { level: 1 }, children: ['Hello World'] },
          { type: 'Button', props: { variant: 'primary' }, children: ['Click Me'] },
        ],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('export default function HelloPage');
      expect(result.code).toContain('<Heading');
      expect(result.code).toContain('<Button');
      expect(result.code).toContain('Hello World');
    });

    it('should handle nested components', () => {
      const bp = createBlueprint({
        name: 'Card Demo',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [
          {
            type: 'Card',
            children: [
              { type: 'Heading', props: { level: 2 }, children: ['Card Title'] },
              { type: 'Text', children: ['Card content here'] },
            ],
          },
        ],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<Card>');
      expect(result.code).toContain('</Card>');
      expect(result.code).toContain('Card Title');
    });

    it('should generate correct imports', () => {
      const bp = createBlueprint({
        name: 'Multi Component',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Button' }, { type: 'Input' }, { type: 'Card' }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('import { Button, Card, Input }');
    });
  });

  describe('renderWithTheme', () => {
    it('should include theme header comment', () => {
      const bp = createBlueprint({
        name: 'Themed Page',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Button' }],
      });

      const result = renderWithTheme(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('/* Theme: Classic Magazine */');
      // Note: In v2.1, generateCSSVariables is deprecated and returns empty object
      // CSS variables are generated via generateThemeCSS() from css-generator.ts
      expect(result.code).toContain('/* CSS Variables:');
    });

    it('should fail for non-existent theme', () => {
      const bp = createBlueprint({
        name: 'Bad Theme',
        themeId: 'non-existent',
        layout: 'single-column',
        components: [],
      });

      const result = renderWithTheme(bp);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Theme not found');
    });
  });

  describe('layout rendering', () => {
    it('should render dashboard layout', () => {
      const bp = createBlueprint({
        name: 'Dashboard',
        themeId: 'classic-magazine',
        layout: 'dashboard',
        components: [{ type: 'Text', children: ['Content'] }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('flex h-screen');
      expect(result.code).toContain('aside');
      expect(result.code).toContain('header');
    });

    it('should render sidebar-left layout', () => {
      const bp = createBlueprint({
        name: 'Sidebar Page',
        themeId: 'classic-magazine',
        layout: 'sidebar-left',
        components: [],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<aside');
      expect(result.code).toContain('<main');
    });

    it('should render two-column layout', () => {
      const bp = createBlueprint({
        name: 'Two Column',
        themeId: 'classic-magazine',
        layout: 'two-column',
        components: [],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('grid grid-cols-2');
    });

    it('should render sidebar-right layout', () => {
      const bp = createBlueprint({
        name: 'Sidebar Right',
        themeId: 'classic-magazine',
        layout: 'sidebar-right',
        components: [],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<aside');
      expect(result.code).toContain('w-64');
    });

    it('should render landing layout', () => {
      const bp = createBlueprint({
        name: 'Landing',
        themeId: 'classic-magazine',
        layout: 'landing',
        components: [],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('hero');
    });
  });

  describe('component renderers', () => {
    it('should render Input component', () => {
      const bp = createBlueprint({
        name: 'Form Page',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Input', props: { type: 'email', placeholder: 'Enter email' } }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<Input');
      expect(result.code).toContain('type="email"');
      expect(result.code).toContain('placeholder="Enter email"');
    });

    it('should render Image component', () => {
      const bp = createBlueprint({
        name: 'Gallery',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Image', props: { src: '/photo.jpg', alt: 'Photo' } }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<Image');
      expect(result.code).toContain('src="/photo.jpg"');
      expect(result.code).toContain('alt="Photo"');
    });

    it('should render Link component', () => {
      const bp = createBlueprint({
        name: 'Nav Page',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Link', props: { href: '/about' }, children: ['About Us'] }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<Link');
      expect(result.code).toContain('href="/about"');
      expect(result.code).toContain('About Us');
    });

    it('should render List component', () => {
      const bp = createBlueprint({
        name: 'List Page',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'List', children: [{ type: 'Text', children: ['Item 1'] }] }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<List>');
      expect(result.code).toContain('</List>');
    });

    it('should render Form component', () => {
      const bp = createBlueprint({
        name: 'Form Page',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Form', children: [{ type: 'Input' }] }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<Form>');
      expect(result.code).toContain('</Form>');
    });

    it('should render Modal component', () => {
      const bp = createBlueprint({
        name: 'Modal Page',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Modal', props: { title: 'Confirm' }, children: ['Are you sure?'] }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<Modal');
      expect(result.code).toContain('title="Confirm"');
      expect(result.code).toContain('Are you sure?');
    });

    it('should handle component with number props', () => {
      const bp = createBlueprint({
        name: 'Number Props',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Heading', props: { level: 3 }, children: ['Title'] }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('level={3}');
    });

    it('should handle component with boolean props', () => {
      const bp = createBlueprint({
        name: 'Bool Props',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [
          {
            type: 'CustomComponent',
            props: { disabled: true, enabled: false },
            children: ['Test'],
          },
        ],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('disabled={true}');
      expect(result.code).toContain('enabled={false}');
    });

    it('should handle unknown component with Default renderer', () => {
      const bp = createBlueprint({
        name: 'Unknown Component',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'UnknownWidget', props: { custom: 'value' }, children: ['Content'] }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<UnknownWidget');
      expect(result.code).toContain('</UnknownWidget>');
    });

    it('should handle component with object props', () => {
      const bp = createBlueprint({
        name: 'Object Props',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'CustomComponent', props: { config: { foo: 'bar' } } }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('config=');
    });

    it('should handle component with null and undefined props', () => {
      const bp = createBlueprint({
        name: 'Null Props',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Button', props: { value: null, other: undefined } }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      // null and undefined props should be skipped
      expect(result.code).toContain('<Button');
    });

    it('should render component without children using self-closing tag', () => {
      const bp = createBlueprint({
        name: 'No Children',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Divider' }],
      });

      const result = render(bp);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<Divider />');
    });
  });

  describe('render options', () => {
    it('should respect typescript option', () => {
      const bp = createBlueprint({
        name: 'JS File',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Button' }],
      });

      const result = render(bp, { typescript: false });

      expect(result.success).toBe(true);
      expect(result.code).toContain('export default function');
    });

    it('should respect semicolons option', () => {
      const bp = createBlueprint({
        name: 'No Semicolons',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [],
      });

      const result = render(bp, { semicolons: false });

      expect(result.success).toBe(true);
      // Should not end with semicolon after return statement
      expect(result.code).toMatch(/\)\s*$/m);
    });

    it('should respect indent option', () => {
      const bp = createBlueprint({
        name: 'Custom Indent',
        themeId: 'classic-magazine',
        layout: 'single-column',
        components: [{ type: 'Button' }],
      });

      const result = render(bp, { indent: 4 });

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
    });
  });
});

// ============================================================================
// Full Pipeline Test
// ============================================================================

describe('Full Pipeline', () => {
  it('should complete Theme -> Blueprint -> Render flow', () => {
    // 1. Load theme
    const theme = loadTheme('classic-magazine');
    expect(theme).not.toBeNull();

    // 2. Create blueprint
    const blueprint = createBlueprint({
      name: 'Startup Landing',
      description: 'A landing page for tech startup',
      themeId: theme!.id,
      layout: 'landing',
      components: [
        {
          type: 'Heading',
          props: { level: 1 },
          children: ['Build the Future'],
        },
        {
          type: 'Text',
          children: ['Start your journey with us today.'],
        },
        {
          type: 'Button',
          props: { variant: 'primary' },
          children: ['Get Started'],
        },
      ],
    });

    // 3. Validate
    const validation = validateBlueprint(blueprint);
    expect(validation.valid).toBe(true);

    // 4. Render with theme
    const result = renderWithTheme(blueprint);
    expect(result.success).toBe(true);

    // 5. Verify output
    expect(result.code).toContain('Classic Magazine');
    expect(result.code).toContain('StartupLanding');
    expect(result.code).toContain('Build the Future');
    expect(result.code).toContain('Get Started');
  });
});
