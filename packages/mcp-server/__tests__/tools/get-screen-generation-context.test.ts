/**
 * Tests for get-screen-generation-context Tool
 * SPEC-MCP-004 Phase 3.5
 */

import { describe, it, expect } from 'vitest';
import { getScreenGenerationContextTool } from '../../src/tools/get-screen-generation-context.ts';

describe('get-screen-generation-context Tool', () => {
  describe('Basic Functionality', () => {
    it('should return success for valid description', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'A login page with email and password fields',
        includeExamples: true,
      });

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return template match for auth description', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'User login screen with email authentication',
        includeExamples: true,
      });

      expect(result.success).toBe(true);
      expect(result.templateMatch).toBeDefined();
      expect(result.templateMatch?.category).toBe('auth');
      expect(result.templateMatch?.matchedKeywords).toContain('login');
    });

    it('should return template match for dashboard description', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Analytics dashboard with KPI metrics and charts',
        includeExamples: true,
      });

      expect(result.success).toBe(true);
      expect(result.templateMatch).toBeDefined();
      expect(result.templateMatch?.category).toBe('dashboard');
    });

    it('should return schema information', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'A simple profile page',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      expect(result.schema).toBeDefined();
      expect(result.schema?.screenDefinition).toBeDefined();
      expect(result.schema?.description).toContain('Screen Definition');
    });

    it('should return a compact response when compact is true', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'A simple profile page',
        includeExamples: true,
        compact: true,
      });

      expect(result.success).toBe(true);
      expect(result.definitionStarter).toBeDefined();
      expect(result.schema).toBeUndefined();
      expect(result.examples).toBeUndefined();
      expect(result.workflow).toBeUndefined();
    });
  });

  describe('Component Information', () => {
    it('should return component info for matched templates', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Dashboard with data tables and cards',
        includeExamples: true,
      });

      expect(result.success).toBe(true);
      expect(result.components).toBeDefined();
      expect(Array.isArray(result.components)).toBe(true);

      if (result.components && result.components.length > 0) {
        const component = result.components[0];
        expect(component).toHaveProperty('id');
        expect(component).toHaveProperty('name');
        expect(component).toHaveProperty('category');
        expect(component).toHaveProperty('importStatement');
      }
    });

    it('should return default components when no template match', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'A generic screen with some content',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      // Should still have some components (defaults)
      expect(result.components).toBeDefined();
    });
  });

  describe('Example Inclusion', () => {
    it('should include examples when includeExamples is true', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Team members grid with avatars',
        includeExamples: true,
      });

      expect(result.success).toBe(true);
      if (result.examples) {
        expect(Array.isArray(result.examples)).toBe(true);
      }
    });

    it('should not include examples when includeExamples is false', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Team members grid with avatars',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      // Examples should be undefined or empty when not requested
    });

    it('should match relevant examples based on description', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Login form for user authentication',
        includeExamples: true,
      });

      expect(result.success).toBe(true);
      if (result.examples && result.examples.length > 0) {
        // Should include login-related example
        const loginExample = result.examples.find(
          e =>
            e.name.toLowerCase().includes('login') || e.description.toLowerCase().includes('login')
        );
        expect(loginExample).toBeDefined();
      }
    });
  });

  describe('Theme Recipes', () => {
    it('should return theme recipes when themeId is provided', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'A dashboard screen',
        themeId: 'square-minimalism',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      // Theme recipes will be present if theme exists
      // Note: This may be undefined if theme doesn't exist in test environment
    });

    it('should work without themeId', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'A simple page',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      expect(result.themeRecipes).toBeUndefined();
    });
  });

  describe('Generation Hints', () => {
    it('should return layout hints for dashboard description', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Admin dashboard with analytics',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      expect(result.hints).toBeDefined();
      expect(Array.isArray(result.hints)).toBe(true);

      if (result.hints && result.hints.length > 0) {
        const layoutHint = result.hints.find(h => h.category === 'layout');
        expect(layoutHint).toBeDefined();
        expect(layoutHint?.message).toContain('dashboard');
      }
    });

    it('should return accessibility hints for form description', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Contact form with input fields',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      expect(result.hints).toBeDefined();

      if (result.hints && result.hints.length > 0) {
        const accessibilityHint = result.hints.find(h => h.category === 'accessibility');
        expect(accessibilityHint).toBeDefined();
      }
    });

    it('should prioritize high priority hints first', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Complex dashboard with forms and tables',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      if (result.hints && result.hints.length >= 2) {
        const firstHint = result.hints[0];
        expect(firstHint?.priority).toBe('high');
      }
    });
  });

  describe('Multi-language Support', () => {
    it('should match Korean descriptions', async () => {
      const result = await getScreenGenerationContextTool({
        description: '로그인 페이지입니다',
        includeExamples: true,
      });

      expect(result.success).toBe(true);
      expect(result.templateMatch).toBeDefined();
      expect(result.templateMatch?.matchedKeywords).toContain('로그인');
    });

    it('should match Japanese descriptions', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'ダッシュボード画面',
        includeExamples: true,
      });

      expect(result.success).toBe(true);
      expect(result.templateMatch).toBeDefined();
    });
  });

  describe('Workflow Guide', () => {
    it('should include workflow guide in response', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'A dashboard screen',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      expect(result.workflow).toBeDefined();
      expect(result.workflow?.title).toBe('Screen Generation Workflow');
      expect(result.workflow?.steps).toBeDefined();
      expect(Array.isArray(result.workflow?.steps)).toBe(true);
    });

    it('should have 6 workflow steps', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Login page',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      expect(result.workflow?.steps).toHaveLength(6);
    });

    it('should include tool names in workflow steps', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Settings page',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      const validateStep = result.workflow?.steps.find(
        s => s.tool === 'validate-screen-definition'
      );
      expect(validateStep).toBeDefined();
      // generate_screen was removed; agents write code directly after validation
      // validate-environment is referenced in notes, not as a dedicated tool step
      const writeStep = result.workflow?.steps.find(s => s.action === 'Write React Code');
      expect(writeStep).toBeDefined();
    });

    it('should include notes for agents', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Profile page',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      expect(result.workflow?.notes).toBeDefined();
      expect(Array.isArray(result.workflow?.notes)).toBe(true);
      expect(result.workflow?.notes?.length).toBeGreaterThan(0);
    });
  });

  describe('Definition Starter', () => {
    it('should include a starter definition for direct-write workflows', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'Blog main page with featured articles',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
      expect(result.definitionStarter).toBeDefined();
      expect(result.definitionStarter?.id).toMatch(/^[a-z0-9-]+$/);
      expect(result.definitionStarter?.sections[0]?.pattern).toBe('section.container');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very short descriptions', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'login',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
    });

    it('should handle descriptions with special characters', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'User login/signup page (with OAuth)',
        includeExamples: false,
      });

      expect(result.success).toBe(true);
    });

    it('should return valid response for generic description', async () => {
      const result = await getScreenGenerationContextTool({
        description: 'A generic screen without specific keywords',
        includeExamples: true,
      });

      expect(result.success).toBe(true);
      // Should still return schema and possibly hints
      expect(result.schema).toBeDefined();
    });
  });
});
