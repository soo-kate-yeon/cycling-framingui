/**
 * Export Screen MCP Tool
 * SPEC-MCP-002: E-003 Screen Export Request
 * SPEC-COMPONENT-001-D: Hybrid Export System
 * SPEC-MCP-004 Phase 4: Theme Recipes Auto-Application
 */

import { render, loadTheme } from '@framingui/core';
import type { Blueprint } from '@framingui/core';
import type {
  ExportScreenInput,
  ExportScreenOutput,
  HybridExportInput,
  HybridExportOutput,
  ExportTier,
} from '../schemas/mcp-schemas.js';
import { createErrorResponse, extractErrorMessage } from '../utils/error-handler.js';
import {
  isTier1Component,
  resolveFromTier1,
  resolveFromTier2,
  generateCSS,
  TIER1_COMPONENTS,
} from '../generators/index.js';
import { applyRecipesToBlueprint } from '../data/recipe-resolver.js';

/**
 * Convert JSX code to TSX format with TypeScript annotations
 * SPEC: S-004 Export Format Compatibility - TSX format
 */
function convertToTSX(jsxCode: string): string {
  // Add React import and type annotation to function signature
  const lines = jsxCode.split('\n');
  const result: string[] = [];

  // Add React import at the beginning
  result.push("import React from 'react';");

  for (const line of lines) {
    // Convert function signature to include React.ReactElement return type
    if (line.match(/^export default function \w+\(\)/)) {
      result.push(line.replace('()', '(): React.ReactElement'));
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Convert JSX code to Vue 3 SFC format
 * SPEC: S-004 Export Format Compatibility - Vue format
 */
function convertToVue(jsxCode: string, componentName: string): string {
  // Extract the JSX content from the return statement
  const returnMatch = jsxCode.match(/return \(([\s\S]*?)\);/);
  if (!returnMatch || !returnMatch[1]) {
    return jsxCode; // Fallback to original if pattern doesn't match
  }

  const jsxContent = returnMatch[1].trim();

  // Convert React-style JSX to Vue template syntax
  const vueTemplate = jsxContent.replace(/className=/g, 'class=').replace(/{([^}]+)}/g, '{{ $1 }}'); // Convert interpolation

  return `<template>
${vueTemplate
  .split('\n')
  .map(line => '  ' + line)
  .join('\n')}
</template>

<script setup lang="ts">
// ${componentName} component
</script>

<style scoped>
/* Component styles */
</style>
`;
}

/**
 * Extract component name from blueprint name or use default
 */
function extractComponentName(blueprintName: string): string {
  // Convert to PascalCase and remove special characters
  const cleaned = blueprintName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  return cleaned || 'GeneratedComponent';
}

/**
 * Export screen MCP tool implementation
 * SPEC: E-003 Screen Export Request
 * SPEC-MCP-004 Phase 4: Apply theme recipes before rendering
 *
 * @param input - Blueprint object and export format
 * @returns Generated code (MCP JSON-RPC format - no file write, no filePath)
 */
export async function exportScreenTool(input: ExportScreenInput): Promise<ExportScreenOutput> {
  try {
    // MCP JSON-RPC format: Accept blueprint object directly (no storage lookup)
    let blueprint = input.blueprint as Blueprint;

    if (!blueprint) {
      return createErrorResponse('Blueprint object is required');
    }

    // SPEC-MCP-004 Phase 4: Apply theme recipes if themeId exists
    if (blueprint.themeId && blueprint.components) {
      const componentsWithRecipes = await applyRecipesToBlueprint(
        blueprint.components,
        blueprint.themeId
      );
      blueprint = {
        ...blueprint,
        components: componentsWithRecipes,
      };
    }

    // SPEC: U-003 @framingui/core Integration - Use render from @framingui/core
    // Note: render() returns complete JSX component code with imports and function wrapper
    const renderResult = render(blueprint);

    if (!renderResult.success) {
      return createErrorResponse(`Render failed: ${renderResult.error || 'Unknown error'}`);
    }

    const jsxCode = renderResult.code || '';

    // SPEC: S-004 Export Format Compatibility - Convert JSX to requested format
    let finalCode: string;

    switch (input.format) {
      case 'jsx':
        // render() already returns JSX format
        finalCode = jsxCode;
        break;
      case 'tsx':
        // Convert JSX imports to TypeScript format
        finalCode = jsxCode ? convertToTSX(jsxCode) : '';
        break;
      case 'vue':
        // Convert JSX to Vue SFC format
        finalCode = convertToVue(jsxCode, extractComponentName(blueprint.name || 'Component'));
        break;
      default:
        return createErrorResponse(`Unsupported format: ${input.format}`);
    }

    // MCP JSON-RPC format: Return code only (no file write, no filePath)
    return {
      success: true,
      code: finalCode,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}

// ============================================================================
// Hybrid Export System (SPEC-COMPONENT-001-D)
// ============================================================================

/**
 * 컴포넌트 해결 - Tier 1 또는 Tier 2 자동 선택
 *
 * @param componentName - 컴포넌트 이름
 * @param tier - 선호하는 tier (auto, tier1, tier2)
 * @param description - 컴포넌트 설명 (tier2용)
 * @returns 해결 결과
 */
async function resolveComponent(
  componentName: string,
  tier: ExportTier = 'auto',
  description?: string
): Promise<{
  success: boolean;
  code?: string;
  source?: 'tier1-ui' | 'tier1-example' | 'tier2-llm' | 'tier2-mock';
  error?: string;
}> {
  // Tier 1 강제
  if (tier === 'tier1') {
    if (!isTier1Component(componentName)) {
      return {
        success: false,
        error: `Component "${componentName}" is not available in Tier 1. Available: ${TIER1_COMPONENTS.join(', ')}`,
      };
    }
    const result = resolveFromTier1(componentName);
    return {
      success: result.success,
      code: result.code,
      source: result.source,
      error: result.error,
    };
  }

  // Tier 2 강제
  if (tier === 'tier2') {
    const result = await resolveFromTier2(componentName, description);
    return {
      success: result.success,
      code: result.code,
      source: result.success
        ? process.env.ANTHROPIC_API_KEY
          ? 'tier2-llm'
          : 'tier2-mock'
        : undefined,
      error: result.error,
    };
  }

  // Auto: Tier 1 먼저 시도, 없으면 Tier 2
  if (isTier1Component(componentName)) {
    const result = resolveFromTier1(componentName);
    if (result.success) {
      return {
        success: true,
        code: result.code,
        source: result.source,
      };
    }
  }

  // Fallback to Tier 2
  const tier2Result = await resolveFromTier2(componentName, description);
  return {
    success: tier2Result.success,
    code: tier2Result.code,
    source: tier2Result.success
      ? process.env.ANTHROPIC_API_KEY
        ? 'tier2-llm'
        : 'tier2-mock'
      : undefined,
    error: tier2Result.error,
  };
}

/**
 * Blueprint에서 사용된 컴포넌트 타입 추출
 */
function extractComponentTypes(blueprint: Blueprint): string[] {
  const types = new Set<string>();

  function traverse(node: Blueprint['components'][number]) {
    if (node.type) {
      types.add(node.type);
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        if (typeof child === 'object' && child !== null) {
          traverse(child as Blueprint['components'][number]);
        }
      }
    }
  }

  for (const component of blueprint.components || []) {
    traverse(component);
  }

  return Array.from(types);
}

/**
 * Hybrid Export MCP Tool
 * SPEC-COMPONENT-001-D: Hybrid Export System
 *
 * 기능:
 * - Tier 1/2 자동 라우팅
 * - CSS Variables 생성
 * - 컴포넌트 코드 + CSS 통합 출력
 *
 * @param input - Hybrid export 입력
 * @returns Hybrid export 결과
 */
export async function hybridExportTool(input: HybridExportInput): Promise<HybridExportOutput> {
  try {
    const {
      blueprint,
      componentName,
      componentDescription,
      format,
      includeCSS = false,
      tier = 'auto',
      themeId,
    } = input;

    // 결과 객체
    const result: HybridExportOutput = {
      success: true,
      components: [],
    };

    // CSS 생성 (요청된 경우)
    if (includeCSS && themeId) {
      try {
        const theme = loadTheme(themeId);
        if (theme) {
          const cssResult = generateCSS(theme);
          if (cssResult.success && cssResult.css) {
            result.css = cssResult.css;
          }
        }
      } catch (cssError) {
        // CSS 생성 실패는 경고만 (전체 실패 아님)
        console.warn(`[Hybrid Export] CSS generation failed for theme ${themeId}:`, cssError);
      }
    }

    // 단일 컴포넌트 요청
    if (componentName && !blueprint) {
      const resolution = await resolveComponent(componentName, tier, componentDescription);

      if (!resolution.success) {
        return {
          success: false,
          error: resolution.error || `Failed to resolve component: ${componentName}`,
        };
      }

      let finalCode = resolution.code || '';

      // 포맷 변환
      if (format === 'tsx' && finalCode) {
        finalCode = convertToTSX(finalCode);
      } else if (format === 'vue' && finalCode) {
        finalCode = convertToVue(finalCode, componentName);
      }

      result.code = finalCode;
      result.tierUsed = isTier1Component(componentName) && tier !== 'tier2' ? 'tier1' : 'tier2';
      result.components = [
        {
          componentName,
          code: resolution.code || '',
          source: resolution.source || 'tier1-example',
        },
      ];

      return result;
    }

    // Blueprint 기반 export
    if (blueprint) {
      let bp = blueprint as Blueprint;

      // SPEC-MCP-004 Phase 4: Apply theme recipes if themeId exists
      if ((bp.themeId || themeId) && bp.components) {
        const targetThemeId = bp.themeId || themeId;
        const componentsWithRecipes = await applyRecipesToBlueprint(bp.components, targetThemeId!);
        bp = {
          ...bp,
          components: componentsWithRecipes,
        };
      }

      // 기존 exportScreenTool 로직 사용
      const renderResult = render(bp);

      if (!renderResult.success) {
        return {
          success: false,
          error: `Render failed: ${renderResult.error || 'Unknown error'}`,
        };
      }

      let finalCode = renderResult.code || '';

      // 포맷 변환
      if (format === 'tsx' && finalCode) {
        finalCode = convertToTSX(finalCode);
      } else if (format === 'vue' && finalCode) {
        finalCode = convertToVue(finalCode, extractComponentName(bp.name || 'Component'));
      }

      result.code = finalCode;
      result.tierUsed = 'tier1'; // Blueprint render는 Tier 1

      // Blueprint에서 사용된 컴포넌트 정보 추가
      const componentTypes = extractComponentTypes(bp);
      result.components = componentTypes.map(type => ({
        componentName: type,
        code: '', // Blueprint render는 통합된 코드 반환
        source: 'tier1-example' as const,
      }));

      return result;
    }

    // 입력 없음
    return {
      success: false,
      error: 'Either blueprint or componentName is required',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}

/**
 * 사용 가능한 Tier 1 컴포넌트 목록 조회
 */
export function getAvailableTier1Components(): string[] {
  return TIER1_COMPONENTS;
}
