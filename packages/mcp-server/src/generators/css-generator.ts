/**
 * CSS Generator for MCP Server (v2.1)
 * SPEC-COMPONENT-001-D: Hybrid Export System
 * [SPEC-MCP-007:E-006] API 기반 CSS 생성으로 마이그레이션
 *
 * CSS Variables를 framingui.com API를 통해 가져옴
 */

import { fetchCSSVariables } from '../api/data-client.js';

/**
 * CSS 생성 결과 타입
 */
export interface CSSGenerationResult {
  success: boolean;
  css?: string;
  error?: string;
}

/**
 * 테마 ID로 CSS 생성 (API 기반)
 * [SPEC-MCP-007:E-006] fetchCSSVariables 사용
 *
 * @param themeId - 테마 ID
 * @returns CSS 생성 결과
 */
export async function generateCSSFromThemeId(themeId: string): Promise<CSSGenerationResult> {
  const result = await fetchCSSVariables(themeId);
  if (!result.ok) {
    return {
      success: false,
      error: `Failed to fetch CSS variables for theme "${themeId}": ${result.error.message}`,
    };
  }
  return {
    success: true,
    css: result.data,
  };
}

/**
 * CSS Variables만 추출 (전체 CSS 문자열에서 파싱)
 *
 * @param cssString - CSS 문자열
 * @returns CSS Variables 객체 (key-value 쌍)
 */
export function extractCSSVariables(cssString: string): Record<string, string> {
  const variables: Record<string, string> = {};
  const variableRegex = /--([\w-]+):\s*([^;]+);/g;
  let match;

  while ((match = variableRegex.exec(cssString)) !== null) {
    if (match[1] && match[2]) {
      variables[`--${match[1]}`] = match[2].trim();
    }
  }

  return variables;
}
