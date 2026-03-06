/**
 * MCP Tool: list-icon-libraries
 * API 기반으로 아이콘 라이브러리 목록 반환
 * (로컬 .moai/icon-libraries/generated/ 읽기 → framingui.com API fetch)
 * [SPEC-ICON-001]
 */

import { fetchIconLibraryList } from '../api/data-client.js';
import { formatToolError } from '../api/api-result.js';
import type { ListIconLibrariesOutput } from '../schemas/mcp-schemas.js';
import { info, error as logError } from '../utils/logger.js';

/**
 * List all available icon libraries
 * @returns List of icon library metadata
 */
export async function listIconLibrariesTool(): Promise<ListIconLibrariesOutput> {
  info('list-icon-libraries: Fetching available icon libraries');

  try {
    const result = await fetchIconLibraryList();

    if (!result.ok) {
      return { success: false, error: formatToolError(result.error) };
    }

    const libraries = result.data;
    info(`list-icon-libraries: Found ${libraries.length} icon libraries`);

    return {
      success: true,
      libraries: libraries.map(lib => ({
        id: lib.id,
        name: lib.name,
        description: lib.description,
        version: lib.version,
        license: lib.license,
        totalIcons: lib.totalIcons,
        categories: lib.categories,
      })),
      count: libraries.length,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logError(`list-icon-libraries: Failed to list libraries: ${errorMessage}`);
    return {
      success: false,
      error: `Failed to list icon libraries: ${errorMessage}`,
    };
  }
}
