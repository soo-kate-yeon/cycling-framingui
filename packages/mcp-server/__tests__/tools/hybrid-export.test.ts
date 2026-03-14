/**
 * Hybrid Export Tool Tests
 * SPEC-COMPONENT-001-D: Hybrid Export System
 */

import { describe, it, expect } from 'vitest';
import { hybridExportTool } from '../../src/tools/export-screen.js';
import { generateBlueprintTool } from '../../src/tools/generate-blueprint.js';
import {
  isTier1Component,
  getTier1Example,
  resolveFromTier1,
  validateGeneratedCode,
  extractCodeFromResponse,
  buildLLMContext,
  generateMockComponent,
  TIER1_COMPONENTS,
} from '../../src/generators/index.js';

describe('Hybrid Export System', () => {
  describe('Tier 1 - Core Resolver', () => {
    it('should identify Tier 1 components correctly', () => {
      expect(isTier1Component('Button')).toBe(true);
      expect(isTier1Component('Card')).toBe(true);
      expect(isTier1Component('Input')).toBe(true);
      expect(isTier1Component('CustomComponent')).toBe(false);
    });

    it('should return list of available Tier 1 components', () => {
      expect(TIER1_COMPONENTS).toContain('Button');
      expect(TIER1_COMPONENTS).toContain('Card');
      expect(TIER1_COMPONENTS).toContain('Input');
      expect(TIER1_COMPONENTS.length).toBeGreaterThan(10);
    });

    it('should get Tier 1 example for Button', () => {
      const result = getTier1Example('Button');
      expect(result.success).toBe(true);
      expect(result.code).toContain('Button');
      expect(result.code).toContain('@framingui/ui');
      expect(result.source).toBe('tier1-example');
    });

    it('should get Tier 1 example for Card', () => {
      const result = getTier1Example('Card');
      expect(result.success).toBe(true);
      expect(result.code).toContain('Card');
      expect(result.code).toContain('CardHeader');
      expect(result.code).toContain('CardContent');
    });

    it('should resolve from Tier 1 with example', () => {
      const result = resolveFromTier1('Modal');
      expect(result.success).toBe(true);
      expect(result.code).toContain('Modal');
      expect(result.source).toBe('tier1-example');
    });

    it('should fail for unknown component', () => {
      const result = getTier1Example('UnknownComponent');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Tier 2 - LLM Generator', () => {
    it('should build LLM context correctly', () => {
      const context = buildLLMContext('CustomButton', 'A custom button with icon support');
      expect(context).toContain('CustomButton');
      expect(context).toContain('A custom button with icon support');
      expect(context).toContain('Reference Examples');
      expect(context).toContain('@framingui/ui');
    });

    it('should extract code from markdown response', () => {
      const response = `Here's the component:
\`\`\`typescript
import React from 'react';
export function TestComponent() {
  return <div>Test</div>;
}
\`\`\`
`;
      const code = extractCodeFromResponse(response);
      expect(code).toContain('import React');
      expect(code).toContain('TestComponent');
      expect(code).not.toContain('```');
    });

    it('should validate generated code correctly', () => {
      const validCode = `import React from 'react';
export function TestComponent() {
  return <div>Test</div>;
}`;
      const result = validateGeneratedCode(validCode, 'TestComponent');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing imports', () => {
      const invalidCode = `export function TestComponent() {
  return <div>Test</div>;
}`;
      const result = validateGeneratedCode(invalidCode, 'TestComponent');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing import statements');
    });

    it('should detect missing export', () => {
      const invalidCode = `import React from 'react';
function TestComponent() {
  return <div>Test</div>;
}`;
      const result = validateGeneratedCode(invalidCode, 'TestComponent');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing export statement');
    });

    it('should detect missing component definition', () => {
      const invalidCode = `import React from 'react';
export function WrongName() {
  return <div>Test</div>;
}`;
      const result = validateGeneratedCode(invalidCode, 'TestComponent');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('definition not found'))).toBe(true);
    });

    it('should generate mock component when API key not set', () => {
      const result = generateMockComponent('CustomWidget', 'A custom widget');
      expect(result.success).toBe(true);
      expect(result.code).toContain('CustomWidget');
      expect(result.code).toContain('export const CustomWidget');
      expect(result.code).toContain('forwardRef');
    });
  });

  describe('hybridExportTool', () => {
    it('should export single Tier 1 component in JSX format', async () => {
      const result = await hybridExportTool({
        componentName: 'Button',
        format: 'jsx',
        tier: 'tier1',
      });

      expect(result.success).toBe(true);
      expect(result.code).toContain('Button');
      expect(result.tierUsed).toBe('tier1');
      expect(result.components).toHaveLength(1);
      expect(result.components![0]!.source).toBe('tier1-example');
    });

    it('should export single Tier 1 component in TSX format', async () => {
      const result = await hybridExportTool({
        componentName: 'Input',
        format: 'tsx',
        tier: 'tier1',
      });

      expect(result.success).toBe(true);
      expect(result.code).toContain('Input');
      expect(result.code).toContain("import React from 'react'");
    });

    it('should export single Tier 1 component in Vue format', async () => {
      const result = await hybridExportTool({
        componentName: 'Card',
        format: 'vue',
        tier: 'tier1',
      });

      expect(result.success).toBe(true);
      expect(result.code).toContain('<template>');
      expect(result.code).toContain('</template>');
      expect(result.code).toContain('<script setup lang="ts">');
    });

    it('should auto-select Tier 1 for known components', async () => {
      const result = await hybridExportTool({
        componentName: 'Badge',
        format: 'jsx',
        tier: 'auto',
      });

      expect(result.success).toBe(true);
      expect(result.tierUsed).toBe('tier1');
    });

    it('should fall back to Tier 2 mock for unknown components', async () => {
      const result = await hybridExportTool({
        componentName: 'CustomDashboard',
        componentDescription: 'A custom dashboard widget',
        format: 'jsx',
        tier: 'auto',
      });

      expect(result.success).toBe(true);
      expect(result.code).toContain('CustomDashboard');
      expect(result.tierUsed).toBe('tier2');
    });

    it('should fail when forcing Tier 1 for unknown component', async () => {
      const result = await hybridExportTool({
        componentName: 'UnknownWidget',
        format: 'jsx',
        tier: 'tier1',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not available in Tier 1');
    });

    it('should export blueprint with code', async () => {
      // Generate a blueprint first
      const genResult = await generateBlueprintTool({
        description: 'Test screen for hybrid export',
        layout: 'single-column',
        themeId: 'classic-magazine',
      });

      expect(genResult.success).toBe(true);

      const result = await hybridExportTool({
        blueprint: genResult.blueprint,
        format: 'jsx',
      });

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
      expect(result.code).toContain('export default function');
    }, 15000);

    it('should export blueprint in TSX format', async () => {
      const genResult = await generateBlueprintTool({
        description: 'TSX test blueprint',
        layout: 'dashboard',
        themeId: 'classic-magazine',
      });

      const result = await hybridExportTool({
        blueprint: genResult.blueprint,
        format: 'tsx',
      });

      expect(result.success).toBe(true);
      expect(result.code).toContain("import React from 'react'");
      expect(result.code).toContain('React.ReactElement');
    });

    it('should require either blueprint or componentName', async () => {
      const result = await hybridExportTool({
        format: 'jsx',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Either blueprint or componentName is required');
    });
  });

  describe('CSS Generation', () => {
    // CSS 생성은 ThemeWithTokens가 필요하므로 현재 테마 구조에서는 스킵
    it.skip('should include CSS when includeCSS is true', async () => {
      const result = await hybridExportTool({
        componentName: 'Button',
        format: 'jsx',
        includeCSS: true,
        themeId: 'classic-magazine',
      });

      expect(result.success).toBe(true);
      // CSS generation requires ThemeWithTokens
    });
  });

  describe('All Tier 1 Components', () => {
    it.each(TIER1_COMPONENTS)('should resolve %s from Tier 1', async componentName => {
      const result = await hybridExportTool({
        componentName,
        format: 'jsx',
        tier: 'tier1',
      });

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
      expect(result.code!.length).toBeGreaterThan(0);
    });
  });
});
