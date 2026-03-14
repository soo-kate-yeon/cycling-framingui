/**
 * Preview Component MCP Tool (SPEC-MCP-003)
 * [TAG-MCP003-007] Preview component with detailed information
 * [SPEC-MCP-007:E-004] API 기반 데이터 소스로 마이그레이션
 *
 * Returns detailed component information including:
 * - Props and variants
 * - Sub-components
 * - Import statements
 * - Dependencies
 * - Usage examples
 */

import { fetchComponent, fetchComponentList } from '../api/data-client.js';
import { formatToolError } from '../api/api-result.js';
import {
  buildFallbackWebPreview,
  getFallbackWebComponent,
} from '../data/component-fallback-catalog.js';
import { buildReactNativePreview } from '../data/react-native-runtime-catalog.js';
import type { PreviewComponentInput, PreviewComponentOutput } from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';

/**
 * Preview a component with detailed information
 * [TAG-MCP003-012] Component not found error handling
 */
export async function previewComponentTool(
  input: PreviewComponentInput
): Promise<PreviewComponentOutput> {
  try {
    if (input.platform === 'react-native') {
      const preview = buildReactNativePreview(input.componentId);
      if (preview) {
        if (input.includeDependencies === false && preview.component) {
          preview.component.dependencies = undefined;
        }
        if (input.includeExamples === false && preview.component) {
          preview.component.examples = undefined;
          preview.component.variants = undefined;
        }
        return preview;
      }

      return {
        success: false,
        error: `Component not found: ${input.componentId}. Use list-components with platform="react-native" to inspect available runtime exports.`,
      };
    }

    // Set default values for optional parameters
    const includeExamples = input.includeExamples ?? true;
    const includeDependencies = input.includeDependencies ?? true;

    const componentResult = await fetchComponent(input.componentId);

    if (!componentResult.ok) {
      const fallbackPreview = buildFallbackWebPreview(input.componentId);
      if (fallbackPreview) {
        if (includeDependencies === false && fallbackPreview.component) {
          fallbackPreview.component.dependencies = undefined;
        }
        if (includeExamples === false && fallbackPreview.component) {
          fallbackPreview.component.examples = undefined;
          fallbackPreview.component.variants = undefined;
        }
        return fallbackPreview;
      }

      // NOT_FOUND인 경우 사용 가능한 컴포넌트 목록 제공
      if (componentResult.error.code === 'NOT_FOUND') {
        const listResult = await fetchComponentList();
        if (listResult.ok) {
          const availableComponents = listResult.data.map((c: any) => c.id);
          return {
            success: false,
            error: `Component not found: ${input.componentId}. Available components: ${availableComponents.join(', ')}`,
          };
        }
      }
      return { success: false, error: formatToolError(componentResult.error) };
    }

    const component = componentResult.data;
    const fallback = getFallbackWebComponent(input.componentId);

    // Build component preview (API 응답에서 직접 필드 사용)
    const result = {
      id: component.id,
      name: component.name,
      category: component.category,
      description: component.description,
      tier: component.tier,
      props: component.props ?? fallback?.props ?? [],
      variants: includeExamples ? (component.variants ?? fallback?.variants) : undefined,
      subComponents: component.subComponents ?? fallback?.subComponents,
      importStatement:
        component.importStatement ??
        fallback?.importStatement ??
        `import { ${component.name} } from '@framingui/ui';`,
      dependencies: includeDependencies
        ? (component.dependencies ?? fallback?.dependencies)
        : undefined,
      examples: includeExamples ? (component.examples ?? fallback?.examples) : undefined,
      accessibility: component.accessibility ?? fallback?.accessibility,
    };

    return {
      success: true,
      component: result as any,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
