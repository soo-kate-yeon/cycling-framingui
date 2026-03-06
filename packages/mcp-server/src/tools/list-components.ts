/**
 * List Components MCP Tool (SPEC-MCP-003)
 * [TAG-MCP003-006] List all available UI components
 * [SPEC-MCP-007:E-003] API 기반 데이터 소스로 마이그레이션
 *
 * Lists all UI components from framingui.com API with metadata
 * including category, tier, and variant information
 */

import { fetchComponentList } from '../api/data-client.js';
import { formatToolError } from '../api/api-result.js';
import type { ListComponentsInput, ListComponentsOutput } from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';

/**
 * List all available UI components
 * @param input - Filter options (category, search)
 * @returns Component metadata list with category counts
 */
export async function listComponentsTool(
  input: ListComponentsInput
): Promise<ListComponentsOutput> {
  try {
    // API에서 전체 컴포넌트 목록 조회
    const result = await fetchComponentList();
    if (!result.ok) {
      return { success: false, error: formatToolError(result.error) };
    }
    const allComponents = result.data;

    // 카테고리 필터 적용
    let components = allComponents;
    if (input.category && input.category !== 'all') {
      components = allComponents.filter((c: any) => c.category === input.category);
    }

    // 검색 필터 적용
    if (input.search) {
      const lowerSearch = input.search.toLowerCase();
      components = components.filter(
        (c: any) =>
          c.id.includes(lowerSearch) ||
          c.name.toLowerCase().includes(lowerSearch) ||
          c.description.toLowerCase().includes(lowerSearch)
      );
    }

    // 카테고리 카운트 계산
    const categories = {
      core: allComponents.filter((c: any) => c.category === 'core').length,
      complex: allComponents.filter((c: any) => c.category === 'complex').length,
      advanced: allComponents.filter((c: any) => c.category === 'advanced').length,
    };

    return {
      success: true,
      components: components as any,
      count: components.length,
      categories,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
