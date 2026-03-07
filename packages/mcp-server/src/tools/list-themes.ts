/**
 * List Themes MCP Tool (v2.1)
 * API 기반으로 라이선스 보유 테마 목록 반환
 * framingui.com API 기반 테마 목록 조회
 */

import { fetchThemeList } from '../api/data-client.js';
import { formatToolError } from '../api/api-result.js';
import type { ListThemesOutput } from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';
import {
  formatThemeAuthorityInconsistencyError,
  getLicensedThemeIds,
  shouldFailThemeListForAuthorityMismatch,
} from './theme-authority.js';

/**
 * List available themes based on authentication status
 * API가 이미 라이선스 필터링을 수행하므로 추가 필터링 불필요
 */
export async function listThemesTool(): Promise<ListThemesOutput> {
  try {
    const result = await fetchThemeList();

    if (!result.ok) {
      const licensedThemeIds = getLicensedThemeIds();
      if (licensedThemeIds.length > 0) {
        return {
          success: false,
          error: formatThemeAuthorityInconsistencyError({ licensedThemeIds }),
        };
      }

      return { success: false, error: formatToolError(result.error) };
    }

    const themes = result.data;
    if (shouldFailThemeListForAuthorityMismatch(themes.length)) {
      return {
        success: false,
        error: formatThemeAuthorityInconsistencyError({ licensedThemeIds: getLicensedThemeIds() }),
      };
    }

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
