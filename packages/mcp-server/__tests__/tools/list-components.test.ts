/**
 * List Components Tool Tests
 * SPEC-MCP-003: AC-001 List Components
 * [TAG-MCP003-006] List all available UI components
 */

import { describe, it, expect } from 'vitest';
import { listComponentsTool } from '../../src/tools/list-components.js';

describe('listComponentsTool', () => {
  // ========================================
  // Positive Cases: Normal Operation
  // ========================================
  describe('Positive Cases', () => {
    it('should return all available components when category is "all"', async () => {
      // Arrange
      const input = { category: 'all' as const };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();
      expect(result.components?.length).toBeGreaterThanOrEqual(20);
      expect(result.count).toBe(result.components?.length);
    }, 15000);

    it('should filter components by category "core"', async () => {
      // Arrange
      const input = { category: 'core' as const };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();
      expect(result.components?.every(c => c.category === 'core')).toBe(true);
      expect(result.count).toBeGreaterThanOrEqual(15);
    });

    it('should filter components by category "complex"', async () => {
      // Arrange
      const input = { category: 'complex' as const };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();
      expect(result.components?.every(c => c.category === 'complex')).toBe(true);
      expect(result.count).toBeGreaterThanOrEqual(10);
    });

    it('should filter components by category "advanced"', async () => {
      // Arrange
      const input = { category: 'advanced' as const };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();
      expect(result.components?.every(c => c.category === 'advanced')).toBe(true);
      expect(result.count).toBeGreaterThanOrEqual(5);
    });

    it('should return category breakdown counts', async () => {
      // Arrange
      const input = { category: 'all' as const };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.categories).toBeDefined();
      expect(result.categories?.core).toBeGreaterThanOrEqual(15);
      expect(result.categories?.complex).toBeGreaterThanOrEqual(10);
      expect(result.categories?.advanced).toBeGreaterThanOrEqual(5);
    });

    it('should search components by keyword "button"', async () => {
      // Arrange
      const input = { category: 'all' as const, search: 'button' };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();
      expect(result.components?.some(c => c.id === 'button')).toBe(true);
      expect(result.count).toBeGreaterThan(0);
    });
  });

  // ========================================
  // Negative Cases: Error Handling
  // ========================================
  describe('Negative Cases', () => {
    it('should return empty results for non-matching search', async () => {
      // Arrange
      const input = { category: 'all' as const, search: 'xyz-nonexistent-component-9999' };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();
      expect(result.count).toBe(0);
      expect(result.components?.length).toBe(0);
    });
  });

  // ========================================
  // Edge Cases: Boundary Conditions
  // ========================================
  describe('Edge Cases', () => {
    it('should handle category filter combined with search', async () => {
      // Arrange
      const input = { category: 'core' as const, search: 'button' };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();
      expect(result.components?.every(c => c.category === 'core')).toBe(true);
      expect(result.components?.some(c => c.id === 'button')).toBe(true);
    });

    it('should handle empty search string', async () => {
      // Arrange
      const input = { category: 'all' as const, search: '' };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();
      expect(result.components?.length).toBeGreaterThanOrEqual(20);
    });

    it('should handle case-insensitive search', async () => {
      // Arrange
      const input = { category: 'all' as const, search: 'BUTTON' };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();
      expect(result.components?.some(c => c.id === 'button')).toBe(true);
    });

    it('should handle search by component description', async () => {
      // Arrange
      const input = { category: 'all' as const, search: 'modal' };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();
      // Should find 'dialog' which has 'modal' in description
      expect(result.components?.some(c => c.id === 'dialog')).toBe(true);
    });

    it('should ensure all components have required fields', async () => {
      // Arrange
      const input = { category: 'all' as const };

      // Act
      const result = await listComponentsTool(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();

      result.components?.forEach(component => {
        expect(component.id).toBeDefined();
        expect(component.name).toBeDefined();
        expect(component.category).toBeDefined();
        expect(component.tier).toBeDefined();
        expect(component.description).toBeDefined();
        expect(component.variantsCount).toBeDefined();
        expect(typeof component.hasSubComponents).toBe('boolean');
      });
    });

    it('should return the local react-native runtime catalog when platform is react-native', async () => {
      const result = await listComponentsTool({
        category: 'all',
        platform: 'react-native',
      });

      expect(result.success).toBe(true);
      expect(result.components?.some(c => c.id === 'screen')).toBe(true);
      expect(result.components?.some(c => c.id === 'text-field')).toBe(true);
      expect(result.components?.some(c => c.id === 'segmented-control')).toBe(true);
    });
  });
});
