/**
 * Export Screen Tool Tests
 * SPEC-MCP-002: AC-008 Screen Export
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { rmSync } from 'fs';
import { exportScreenTool } from '../../src/tools/export-screen.js';
import { generateBlueprintTool } from '../../src/tools/generate-blueprint.js';
import type { Blueprint } from '@framingui/core';

describe('exportScreenTool', () => {
  const testStorageDir = '.framingui-test/blueprints';

  beforeEach(() => {
    // Clean up test directories
    try {
      rmSync(testStorageDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore errors
    }
  });

  afterEach(() => {
    // Clean up after tests
    try {
      rmSync(testStorageDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore errors
    }
  });

  it('should export blueprint to JSX format', async () => {
    // First, generate a blueprint
    const genResult = await generateBlueprintTool({
      description: 'Test screen for export',
      layout: 'single-column',
      themeId: 'classic-magazine',
    });

    expect(genResult.success).toBe(true);
    const blueprint = genResult.blueprint!;

    // Export to JSX using blueprint object
    const result = await exportScreenTool({
      blueprint,
      format: 'jsx',
    });

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();
    expect(result.code).toContain('export default function');
    expect(result.code).toContain('return');
  }, 30000);

  it('should export blueprint to TSX format with TypeScript annotations', async () => {
    // Generate blueprint
    const genResult = await generateBlueprintTool({
      description: 'Test dashboard',
      layout: 'single-column',
      themeId: 'classic-magazine',
    });

    expect(genResult.success).toBe(true);

    // Export to TSX using blueprint object
    const result = await exportScreenTool({
      blueprint: genResult.blueprint!,
      format: 'tsx',
    });

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();
    expect(result.code).toContain('import React from');
    expect(result.code).toContain('React.ReactElement');
  }, 30000);

  it('should export blueprint to Vue format', async () => {
    // Generate blueprint
    const genResult = await generateBlueprintTool({
      description: 'Vue test screen',
      layout: 'single-column',
      themeId: 'classic-magazine',
    });

    expect(genResult.success).toBe(true);

    // Export to Vue using blueprint object
    const result = await exportScreenTool({
      blueprint: genResult.blueprint!,
      format: 'vue',
    });

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();
    expect(result.code).toContain('<template>');
    expect(result.code).toContain('<script setup lang="ts">');
    expect(result.code).toContain('</template>');
  });

  it('should return error for missing blueprint object', async () => {
    const result = await exportScreenTool({
      blueprint: null,
      format: 'jsx',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Blueprint object is required');
  });

  it('should return error for undefined blueprint', async () => {
    const result = await exportScreenTool({
      blueprint: undefined,
      format: 'jsx',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle all export formats', async () => {
    // Generate a blueprint once
    const genResult = await generateBlueprintTool({
      description: 'Multi-format test',
      layout: 'single-column',
      themeId: 'classic-magazine',
    });

    expect(genResult.success).toBe(true);
    const blueprint = genResult.blueprint!;

    // Test all formats
    const formats: Array<'jsx' | 'tsx' | 'vue'> = ['jsx', 'tsx', 'vue'];

    for (const format of formats) {
      const result = await exportScreenTool({
        blueprint,
        format,
      });

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
      expect(result.code!.length).toBeGreaterThan(0);
    }
  });

  it('should generate valid JSX code structure', async () => {
    const genResult = await generateBlueprintTool({
      description: 'JSX structure test',
      layout: 'single-column',
      themeId: 'classic-magazine',
    });

    const result = await exportScreenTool({
      blueprint: genResult.blueprint!,
      format: 'jsx',
    });

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();

    const code = result.code!;
    expect(code).toMatch(/export default function \w+\(\)/);
    expect(code).toContain('return');
    expect(code).toContain('(');
    expect(code).toContain(')');
  });

  it('should generate valid TSX code structure', async () => {
    const genResult = await generateBlueprintTool({
      description: 'TSX structure test',
      layout: 'single-column',
      themeId: 'classic-magazine',
    });

    const result = await exportScreenTool({
      blueprint: genResult.blueprint!,
      format: 'tsx',
    });

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();

    const code = result.code!;
    expect(code).toContain("import React from 'react'");
    expect(code).toMatch(/export default function \w+\(\): React\.ReactElement/);
  });

  it('should generate valid Vue code structure', async () => {
    const genResult = await generateBlueprintTool({
      description: 'Vue structure test',
      layout: 'single-column',
      themeId: 'classic-magazine',
    });

    const result = await exportScreenTool({
      blueprint: genResult.blueprint!,
      format: 'vue',
    });

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();

    const code = result.code!;
    expect(code).toContain('<template>');
    expect(code).toContain('</template>');
    expect(code).toContain('<script setup lang="ts">');
    expect(code).toContain('</script>');
    expect(code).toContain('<style scoped>');
    expect(code).toContain('</style>');
  });

  it('should accept blueprint with all required properties', async () => {
    // Create a mock blueprint object
    const mockBlueprint: Blueprint = {
      id: 'bp-test-123',
      name: 'Test Blueprint',
      themeId: 'classic-magazine',
      layout: 'single-column',
      components: [
        {
          type: 'Card',
          props: { title: 'Test Card' },
          children: [],
        },
      ],
    };

    const result = await exportScreenTool({
      blueprint: mockBlueprint,
      format: 'jsx',
    });

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();
  });

  it('should handle malformed blueprint gracefully', async () => {
    const malformedBlueprint = {
      id: 'test',
      // Missing required fields
    };

    const result = await exportScreenTool({
      blueprint: malformedBlueprint,
      format: 'jsx',
    });

    // Should handle error gracefully
    expect(result.success).toBeDefined();
    expect(typeof result.success).toBe('boolean');
  });

  it('should return code without filePath in MCP JSON-RPC format', async () => {
    const genResult = await generateBlueprintTool({
      description: 'MCP format test',
      layout: 'single-column',
      themeId: 'classic-magazine',
    });

    const result = await exportScreenTool({
      blueprint: genResult.blueprint!,
      format: 'jsx',
    });

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();

    // MCP JSON-RPC format should NOT include filePath
    expect(result).not.toHaveProperty('filePath');
  });

  it('should handle different component types in blueprint', async () => {
    const genResult = await generateBlueprintTool({
      description: 'Dashboard with cards, buttons, and text components',
      layout: 'dashboard',
      themeId: 'classic-magazine',
      componentHints: ['Card', 'Button', 'Text', 'Avatar'],
    });

    expect(genResult.success).toBe(true);

    const result = await exportScreenTool({
      blueprint: genResult.blueprint!,
      format: 'tsx',
    });

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();
    expect(result.code!.length).toBeGreaterThan(100);
  });

  it('should preserve blueprint data during export', async () => {
    const genResult = await generateBlueprintTool({
      description: 'Data preservation test',
      layout: 'single-column',
      themeId: 'classic-magazine',
    });

    const originalBlueprint = genResult.blueprint!;
    const originalId = originalBlueprint.id;
    const originalThemeId = originalBlueprint.themeId;

    const result = await exportScreenTool({
      blueprint: originalBlueprint,
      format: 'jsx',
    });

    expect(result.success).toBe(true);

    // Verify original blueprint wasn't mutated
    expect(originalBlueprint.id).toBe(originalId);
    expect(originalBlueprint.themeId).toBe(originalThemeId);
  });
});
