/**
 * List Screen Templates MCP Tool (SPEC-MCP-003)
 * [TAG-MCP003-008] List all available screen templates
 * [SPEC-MCP-007:E-001] API 기반 데이터 소스로 마이그레이션
 *
 * Lists all screen templates from framingui.com API
 * with category filtering and search capabilities
 */

import { fetchTemplateList } from '../api/data-client.js';
import { formatToolError } from '../api/api-result.js';
import type {
  ListScreenTemplatesInput,
  ListScreenTemplatesOutput,
  TemplateCategory,
} from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';

/**
 * List all available screen templates
 * @param input - Filter options (category, search)
 * @returns Template metadata list with category counts
 */
export async function listScreenTemplatesTool(
  input: ListScreenTemplatesInput
): Promise<ListScreenTemplatesOutput> {
  try {
    // API에서 템플릿 목록 조회
    const params: { category?: string; search?: string } = {};
    if (input.category && input.category !== 'all') {
      params.category = input.category;
    }
    if (input.search) {
      params.search = input.search;
    }

    const result = await fetchTemplateList(params);
    if (!result.ok) {
      return { success: false, error: formatToolError(result.error) };
    }
    const templates = result.data;

    // 전체 템플릿에서 카테고리 카운트 계산 (category 필터 없이 조회)
    const allResult = await fetchTemplateList();
    const allTemplates = allResult.ok ? allResult.data : templates;
    const categories = {
      auth: allTemplates.filter((t: any) => t.category === 'auth').length,
      dashboard: allTemplates.filter((t: any) => t.category === 'dashboard').length,
      form: allTemplates.filter((t: any) => t.category === 'form').length,
      marketing: allTemplates.filter((t: any) => t.category === 'marketing').length,
      feedback: allTemplates.filter((t: any) => t.category === 'feedback').length,
    };

    return {
      success: true,
      templates: templates.map((t: any) => ({
        id: t.id,
        name: t.name,
        category: t.category as TemplateCategory,
        description: t.description,
        requiredComponentsCount: t.requiredComponentsCount,
        layoutType: t.layoutType,
        version: t.version,
        tags: t.tags,
      })),
      count: templates.length,
      categories,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
