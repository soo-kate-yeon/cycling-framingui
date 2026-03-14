/**
 * Preview Theme MCP Tool (v2.1)
 * API 기반으로 테마 상세 데이터 조회
 * framingui.com API 기반 테마 상세 조회
 */

import type { ThemeV2 } from '@framingui/core';
import { themeToCSS, type ThemeDefinition } from '@framingui/ui';
import type { PreviewThemeInput, PreviewThemeOutput } from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';
import { getAuthData, isAuthStateExplicitlySet } from '../auth/state.js';
import { PREMIUM_THEMES } from '../auth/theme-access.js';
import { fetchTheme } from '../api/data-client.js';
import { formatToolError } from '../api/api-result.js';
import {
  formatThemeAuthorityInconsistencyError,
  getLicensedThemeIds,
  shouldRewriteThemePreviewError,
} from './theme-authority.js';

/**
 * ThemeV2 (core) -> ThemeDefinition (ui) 어댑터
 *
 * ThemeV2의 semantic 토큰 구조는 ThemeDefinition과 다를 수 있으므로
 * 필수 필드를 폴백 값과 함께 안전하게 매핑합니다.
 *
 * 주요 차이점:
 * - ThemeV2.semantic.background.brand: Record<string, string> (default, subtle 등)
 * - ThemeDefinition.semantic.background.brand: { subtle, default, emphasis }
 * - ThemeV2.semantic.border: { default, input, ... } (flat)
 * - ThemeDefinition.semantic.border.default: { subtle, default, emphasis }
 */
function themeV2ToDefinition(theme: ThemeV2): ThemeDefinition {
  const semantic = theme.tokens.semantic;

  // background.surface 매핑 (폴백 포함)
  const surfaceRaw = semantic.background?.surface;
  const surface = {
    subtle: (surfaceRaw as any)?.subtle ?? 'atomic.color.neutral.50',
    default: (surfaceRaw as any)?.default ?? 'atomic.color.neutral.white',
    emphasis:
      (surfaceRaw as any)?.emphasis ?? (surfaceRaw as any)?.popover ?? 'atomic.color.neutral.100',
  };

  // background.brand 매핑 (폴백 포함)
  const brandRaw = semantic.background?.brand;
  const brand = {
    subtle: (brandRaw as any)?.subtle ?? 'atomic.color.brand.100',
    default: (brandRaw as any)?.default ?? 'atomic.color.brand.500',
    emphasis: (brandRaw as any)?.emphasis ?? 'atomic.color.brand.700',
  };

  // border 매핑 - ThemeV2는 flat 구조, ThemeDefinition은 nested
  const borderRaw = semantic.border;
  const borderDefault = {
    subtle:
      (borderRaw?.default as any)?.subtle ??
      (borderRaw as any)?.input ??
      'atomic.color.neutral.200',
    default:
      (borderRaw?.default as any)?.default ??
      (borderRaw as any)?.default ??
      'atomic.color.neutral.200',
    emphasis:
      (borderRaw?.default as any)?.emphasis ??
      (borderRaw as any)?.emphasis ??
      'atomic.color.neutral.300',
  };

  // text 매핑 (optional)
  const textRaw = (semantic as any).text;
  const text = textRaw
    ? {
        primary: textRaw.primary ?? 'atomic.color.neutral.900',
        secondary: textRaw.secondary ?? 'atomic.color.neutral.500',
        muted: textRaw.muted ?? 'atomic.color.neutral.400',
      }
    : undefined;

  return {
    id: theme.id,
    name: theme.name,
    schemaVersion: theme.schemaVersion,
    tokens: {
      atomic: {
        color: theme.tokens.atomic.color as ThemeDefinition['tokens']['atomic']['color'],
        spacing: theme.tokens.atomic.spacing,
        radius: theme.tokens.atomic.radius,
      },
      semantic: {
        background: {
          canvas: semantic.background?.canvas ?? 'atomic.color.neutral.white',
          surface,
          brand,
        },
        border: {
          default: borderDefault,
        },
        ...(text ? { text } : {}),
      },
    },
    stateLayer: theme.stateLayer
      ? {
          hover: theme.stateLayer.hover
            ? { opacity: theme.stateLayer.hover.opacity ?? 0.08 }
            : undefined,
          disabled: theme.stateLayer.disabled
            ? {
                opacity: theme.stateLayer.disabled.opacity ?? 0.38,
                contentOpacity: theme.stateLayer.disabled.contentOpacity ?? 0.38,
              }
            : undefined,
        }
      : undefined,
    typography: theme.typography
      ? {
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.fontWeight,
        }
      : undefined,
  };
}

/**
 * Preview theme MCP tool implementation
 * 인증된 사용자의 라이선스 보유 테마만 미리보기 가능
 *
 * @param input - Theme ID to preview, optional includeCSS flag
 * @returns Full v2.1 theme data (MCP JSON-RPC format), optionally with CSS variables
 */
export async function previewThemeTool(input: PreviewThemeInput): Promise<PreviewThemeOutput> {
  try {
    const authData = getAuthData();
    const themeId = input.themeId;
    const licensedThemeIds = getLicensedThemeIds();

    // 인증 + 라이선스 확인
    if (!authData || !authData.valid) {
      return {
        success: false,
        error: `🔐 Authentication required to preview themes.\n\n🎁 Start your FREE 3-day trial (no credit card):\n   → https://framingui.com/auth/signup?utm_source=mcp&utm_medium=cli&utm_campaign=theme_preview\n\nAlready have an account? Run \`framingui-mcp login\``,
      };
    }

    // Explicit auth state includes resolved entitlements, so honor them before any API/cache lookup.
    // Credential-file fallback does not know the user's licensed themes yet, so it must continue to API.
    if (isAuthStateExplicitlySet()) {
      if (!PREMIUM_THEMES.includes(themeId)) {
        return {
          success: false,
          error: `Theme not found: ${themeId}. Available themes: ${PREMIUM_THEMES.join(', ')}`,
        };
      }

      if (!licensedThemeIds.includes(themeId)) {
        return {
          success: false,
          error: `Theme "${themeId}" is not included in your license.`,
        };
      }
    }

    // API를 통해 테마 로드 (라이선스 확인은 API가 수행)
    const themeResult = await fetchTheme(themeId);

    if (!themeResult.ok) {
      if (shouldRewriteThemePreviewError(themeId, themeResult.error)) {
        return {
          success: false,
          error: formatThemeAuthorityInconsistencyError({
            licensedThemeIds,
            requestedThemeId: themeId,
          }),
        };
      }

      return {
        success: false,
        error: formatToolError(themeResult.error, `Theme "${themeId}"`),
      };
    }

    const theme = themeResult.data;

    // includeCSS가 true인 경우 CSS 변수 생성
    let css: string | undefined;
    if (input.includeCSS) {
      const themeDefinition = themeV2ToDefinition(theme);
      css = themeToCSS(themeDefinition);
    }

    // v2.1 테마 데이터 반환
    return {
      success: true,
      theme: {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        brandTone: theme.brandTone,
        schemaVersion: theme.schemaVersion,
        designDNA: theme.designDNA,
        tokens: {
          atomic: theme.tokens.atomic,
          semantic: theme.tokens.semantic,
          component: theme.tokens.component,
          recipes: (theme.tokens as any).recipes,
        },
        stateLayer: theme.stateLayer,
        motion: theme.motion,
        elevation: theme.elevation,
        typography: theme.typography,
      },
      ...(css ? { css } : {}),
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
