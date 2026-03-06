/**
 * MCP Tool: preview-icon-library
 * API 기반으로 아이콘 라이브러리 상세 데이터 조회
 * (로컬 .moai/icon-libraries/generated/ 읽기 → framingui.com API fetch)
 * [SPEC-ICON-001]
 */

import { fetchIconLibrary } from '../api/data-client.js';
import type { PreviewIconLibraryInput, PreviewIconLibraryOutput } from '../schemas/mcp-schemas.js';
import { info, error as logError } from '../utils/logger.js';

/**
 * Preview an icon library and retrieve its full data
 * @param input - Library ID to preview
 * @returns Full icon library data
 */
export async function previewIconLibraryTool(
  input: PreviewIconLibraryInput
): Promise<PreviewIconLibraryOutput> {
  const { libraryId } = input;

  info(`preview-icon-library: Previewing library "${libraryId}"`);

  try {
    const library = await fetchIconLibrary(libraryId);

    if (!library) {
      logError(`preview-icon-library: Library "${libraryId}" not found`);
      return {
        success: false,
        error: `Icon library "${libraryId}" not found. Use list-icon-libraries to see available libraries.`,
      };
    }

    // Get first 20 icons as sample
    const iconNames = Object.keys(library.icons || {});
    const iconSample = iconNames.slice(0, 20);

    info(`preview-icon-library: Successfully loaded library "${libraryId}"`);

    return {
      success: true,
      library: {
        id: library.id,
        name: library.name,
        description: library.description,
        version: library.version,
        license: library.license,
        website: library.website,
        totalIcons: library.totalIcons,
        categories: library.categories,
        sizeMapping: library.sizeMapping,
        frameworks: library.frameworks,
        defaultVariant: library.defaultVariant,
        iconSample,
      },
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logError(`preview-icon-library: Failed to preview library: ${errorMessage}`);
    return {
      success: false,
      error: `Failed to preview icon library: ${errorMessage}`,
    };
  }
}
