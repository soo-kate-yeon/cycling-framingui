/**
 * List Themes MCP Tool (v2.1)
 * API 기반으로 라이선스 보유 테마 목록 반환
 * (로컬 .moai/themes/generated/ 읽기 → framingui.com API fetch)
 */

import { fetchThemeList } from '../api/data-client.js';
import type { ListThemesOutput } from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';

/**
 * List available themes based on authentication status
 * API가 이미 라이선스 필터링을 수행하므로 추가 필터링 불필요
 */
export async function listThemesTool(): Promise<ListThemesOutput> {
  try {
    const themes = await fetchThemeList();

    return {
      success: true,
      themes: themes.map(theme => ({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        brandTone: theme.brandTone,
        schemaVersion: theme.schemaVersion,
      })),
      count: themes.length,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
