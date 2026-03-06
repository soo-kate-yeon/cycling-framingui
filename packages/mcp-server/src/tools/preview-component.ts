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
    // Set default values for optional parameters
    const includeExamples = input.includeExamples ?? true;
    const includeDependencies = input.includeDependencies ?? true;

    const componentResult = await fetchComponent(input.componentId);

    if (!componentResult.ok) {
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

    // Build component preview (API 응답에서 직접 필드 사용)
    const result = {
      id: component.id,
      name: component.name,
      category: component.category,
      description: component.description,
      tier: component.tier,
      props: component.props ?? [],
      variants: includeExamples ? component.variants : undefined,
      subComponents: component.subComponents,
      importStatement: component.importStatement,
      dependencies: includeDependencies ? component.dependencies : undefined,
      examples: includeExamples ? component.examples : undefined,
      accessibility: component.accessibility,
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
