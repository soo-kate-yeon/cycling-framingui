/**
 * Preview Component Tool Tests
 * SPEC-MCP-003: AC-002 Preview Component
 * [TAG-MCP003-007] Preview component with detailed information
 * [TAG-MCP003-012] Component not found error handling
 */

import { describe, it, expect } from 'vitest';
import { previewComponentTool } from '../../src/tools/preview-component.js';

describe('previewComponentTool', () => {
  // ========================================
  // Positive Cases: Normal Operation
  // ========================================
  describe('Positive Cases', () => {
    it('should return valid component details for "button"', async () => {
      // Arrange
      const input = { componentId: 'button' };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component).toBeDefined();
      expect(result.component?.id).toBe('button');
      expect(result.component?.name).toBe('Button');
      expect(result.component?.category).toBe('core');
      expect(result.component?.tier).toBe(1);
    });

    it('should return component with props interface', async () => {
      // Arrange
      const input = { componentId: 'button', includeExamples: true };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component?.props).toBeDefined();
      expect(result.component?.props.length).toBeGreaterThan(0);

      // Verify prop structure
      result.component?.props.forEach(prop => {
        expect(prop.name).toBeDefined();
        expect(prop.type).toBeDefined();
        expect(typeof prop.required).toBe('boolean');
      });
    });

    it('should return variants array for components with variants', async () => {
      // Arrange
      const input = { componentId: 'button', includeExamples: true };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component?.variants).toBeDefined();
      expect(result.component?.variants?.length).toBeGreaterThan(0);

      // Verify variant structure
      result.component?.variants?.forEach(variant => {
        expect(variant.name).toBeDefined();
        expect(variant.value).toBeDefined();
      });
    });

    it('should return sub-components for composite components', async () => {
      // Arrange
      const input = { componentId: 'card' };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component?.subComponents).toBeDefined();
      expect(result.component?.subComponents?.length).toBeGreaterThan(0);
      expect(result.component?.subComponents).toContain('CardHeader');
      expect(result.component?.subComponents).toContain('CardContent');
      expect(result.component?.subComponents).toContain('CardFooter');
    }, 15000);

    it('should return import statement', async () => {
      // Arrange
      const input = { componentId: 'button' };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component?.importStatement).toBeDefined();
      expect(result.component?.importStatement).toContain('@framingui/ui');
      expect(result.component?.importStatement).toContain('Button');
    });

    it('should include examples when includeExamples=true', async () => {
      // Arrange
      const input = { componentId: 'button', includeExamples: true };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component?.examples).toBeDefined();
      expect(result.component?.examples?.length).toBeGreaterThan(0);

      // Verify example structure
      result.component?.examples?.forEach(example => {
        expect(example.title).toBeDefined();
        expect(example.code).toBeDefined();
      });
    });

    it('should include dependencies when includeDependencies=true', async () => {
      // Arrange
      const input = { componentId: 'button', includeDependencies: true };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component?.dependencies).toBeDefined();
      expect(result.component?.dependencies?.internal).toBeDefined();
      expect(result.component?.dependencies?.external).toBeDefined();
    });

    it('should return accessibility information', async () => {
      // Arrange
      const input = { componentId: 'button' };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component?.accessibility).toBeDefined();
      expect(typeof result.component?.accessibility).toBe('string');
    });
  });

  // ========================================
  // Negative Cases: Error Handling
  // ========================================
  describe('Negative Cases', () => {
    it('should return error for non-existent component', async () => {
      // Arrange
      const input = { componentId: 'xyz-nonexistent-component' };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('not found');
      expect(result.error).toContain('xyz-nonexistent-component');
    });

    it('should return error with available components list', async () => {
      // Arrange
      const input = { componentId: 'invalid-component' };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Available components:');
      expect(result.error).toContain('button');
    });
  });

  // ========================================
  // Edge Cases: Boundary Conditions
  // ========================================
  describe('Edge Cases', () => {
    it('should not include examples when includeExamples=false', async () => {
      // Arrange
      const input = { componentId: 'button', includeExamples: false };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component?.examples).toBeUndefined();
    });

    it('should not include dependencies when includeDependencies=false', async () => {
      // Arrange
      const input = { componentId: 'button', includeDependencies: false };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component?.dependencies).toBeUndefined();
    });

    it('should handle component with multiple sub-components', async () => {
      // Arrange
      const input = { componentId: 'dialog' };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component?.subComponents).toBeDefined();
      expect(result.component?.subComponents?.length).toBeGreaterThan(3);
      expect(result.component?.importStatement).toContain('DialogTrigger');
      expect(result.component?.importStatement).toContain('DialogContent');
    });

    it('should verify import statement includes all sub-components', async () => {
      // Arrange
      const input = { componentId: 'card' };

      // Act
      const result = await previewComponentTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.component?.importStatement).toContain('Card');
      result.component?.subComponents?.forEach(subComponent => {
        expect(result.component?.importStatement).toContain(subComponent);
      });
    });

    it('should return react-native runtime guidance when platform is react-native', async () => {
      const result = await previewComponentTool({
        componentId: 'text-field',
        platform: 'react-native',
        includeExamples: true,
      });

      expect(result.success).toBe(true);
      expect(result.component?.name).toBe('TextField');
      expect(result.component?.importStatement).toContain('@framingui/react-native');
      expect(result.component?.examples?.[0]?.code).toContain("from '@framingui/react-native'");
    });
  });
});
