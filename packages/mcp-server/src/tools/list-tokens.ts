/**
 * List Tokens MCP Tool
 * SPEC-LAYOUT-002 Phase 4: List available layout tokens from SPEC-LAYOUT-001
 * [SPEC-MCP-007:E-005] API 기반 데이터 소스로 마이그레이션
 */

import { fetchTokenList } from '../api/data-client.js';
import { formatToolError } from '../api/api-result.js';
import type { ListTokensInput, ListTokensOutput, TokenMetadata } from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';

/**
 * Apply pattern filter to tokens
 *
 * @param tokens - Array of token metadata
 * @param filter - Optional pattern filter (case-insensitive substring match)
 * @returns Filtered tokens
 */
function applyFilter(tokens: TokenMetadata[], filter?: string): TokenMetadata[] {
  if (!filter) {
    return tokens;
  }

  const lowerFilter = filter.toLowerCase();
  return tokens.filter(
    token =>
      token.id.toLowerCase().includes(lowerFilter) ||
      token.name?.toLowerCase().includes(lowerFilter) ||
      token.description?.toLowerCase().includes(lowerFilter)
  );
}

/**
 * List available layout tokens from framingui.com API
 *
 * @param input - Token type filter and optional pattern filter
 * @returns Categorized list of available tokens
 */
export async function listTokensTool(input: ListTokensInput): Promise<ListTokensOutput> {
  try {
    const { tokenType = 'all', filter } = input;

    // API를 통해 토큰 조회 [SPEC-MCP-007:E-005]
    const result = await fetchTokenList(tokenType as 'shell' | 'page' | 'section' | 'all');
    if (!result.ok) {
      return { success: false, error: formatToolError(result.error) };
    }
    const tokenData = result.data;

    let shells: TokenMetadata[] = tokenData.shells ?? [];
    let pages: TokenMetadata[] = tokenData.pages ?? [];
    let sections: TokenMetadata[] = tokenData.sections ?? [];

    // Apply filter if provided
    if (filter) {
      shells = applyFilter(shells, filter);
      pages = applyFilter(pages, filter);
      sections = applyFilter(sections, filter);
    }

    const total = shells.length + pages.length + sections.length;

    return {
      success: true,
      shells: shells.length > 0 ? shells : undefined,
      pages: pages.length > 0 ? pages : undefined,
      sections: sections.length > 0 ? sections : undefined,
      metadata: {
        total,
        filtered: filter ? total : undefined,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
