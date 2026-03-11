/**
 * GET /api/mcp/themes/[id]/css — 테마 CSS 변수 생성 API
 * [SPEC-MCP-007:E-006] fetchCSSVariables(themeId) 지원
 * @framingui/core의 loadTheme 결과를 @framingui/ui themeToCSS 계약으로 변환
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadTheme, type ThemeV2 } from '@framingui/core';
import { themeToCSS, type ThemeDefinition } from '@framingui/ui/theme-loader';
import { authenticateMcpRequest } from '@/lib/mcp/auth-helper';

const MASTER_EMAILS = ['soo.kate.yeon@gmail.com'];

/**
 * ThemeV2를 @framingui/ui의 ThemeDefinition으로 맞춘다.
 */
function themeV2ToDefinition(theme: ThemeV2): ThemeDefinition {
  const semantic = theme.tokens.semantic;
  const surfaceRaw = semantic.background?.surface;
  const brandRaw = semantic.background?.brand;
  const borderRaw = semantic.border;
  const textRaw = (
    semantic as ThemeV2['tokens']['semantic'] & {
      text?: {
        primary?: string;
        secondary?: string;
        muted?: string;
      };
    }
  ).text;

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
          surface: {
            subtle: surfaceRaw?.subtle ?? 'atomic.color.neutral.50',
            default: surfaceRaw?.default ?? 'atomic.color.neutral.white',
            emphasis: surfaceRaw?.emphasis ?? 'atomic.color.neutral.100',
          },
          brand: {
            subtle: brandRaw?.subtle ?? 'atomic.color.brand.100',
            default: brandRaw?.default ?? 'atomic.color.brand.500',
            emphasis: brandRaw?.emphasis ?? brandRaw?.default ?? 'atomic.color.brand.700',
          },
        },
        border: {
          default: {
            subtle: borderRaw?.default?.subtle ?? 'atomic.color.neutral.200',
            default: borderRaw?.default?.default ?? 'atomic.color.neutral.300',
            emphasis: borderRaw?.default?.emphasis ?? 'atomic.color.neutral.400',
          },
        },
        text: textRaw
          ? {
              primary: textRaw.primary ?? 'atomic.color.neutral.900',
              secondary: textRaw.secondary ?? 'atomic.color.neutral.500',
              muted: textRaw.muted ?? 'atomic.color.neutral.400',
            }
          : undefined,
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

function generateCSSFromTheme(theme: ThemeV2): string {
  return themeToCSS(themeV2ToDefinition(theme));
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateMcpRequest(request);
    if (!auth.valid) {
      return auth.response;
    }

    const { id: themeId } = await params;

    // 라이선스 확인
    const isMaster = MASTER_EMAILS.includes(auth.email.toLowerCase());
    if (!isMaster && !auth.licensedThemes.includes(themeId)) {
      return NextResponse.json(
        { success: false, error: `Theme "${themeId}" is not included in your license.` },
        { status: 403 }
      );
    }

    const theme = loadTheme(themeId);
    if (!theme) {
      return NextResponse.json(
        { success: false, error: `Theme "${themeId}" not found.` },
        { status: 404 }
      );
    }

    const css = generateCSSFromTheme(theme);

    return NextResponse.json(
      { success: true, css },
      {
        status: 200,
        headers: {
          // Authorization에 따라 접근 권한이 달라지므로 공유 캐시를 금지한다.
          'Cache-Control': 'private, no-store',
          Vary: 'Authorization',
          ...auth.rateLimitHeaders,
        },
      }
    );
  } catch (error) {
    console.error('[MCP Theme CSS] Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
