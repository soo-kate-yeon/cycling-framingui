/**
 * GET /api/mcp/themes/[id] — 테마 상세 API
 * MCP 서버가 로컬 파일 대신 이 API를 통해 전체 ThemeV2 JSON을 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadTheme } from '@framingui/core';
import { authenticateMcpRequest } from '@/lib/mcp/auth-helper';

const MASTER_EMAILS = ['soo.kate.yeon@gmail.com'];

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateMcpRequest(request);
    if (!auth.valid) {
      return auth.response;
    }

    const { id: themeId } = await params;

    // 라이선스 확인 (마스터 계정은 모든 테마 접근 가능)
    const isMaster = MASTER_EMAILS.includes(auth.email.toLowerCase());
    if (!isMaster && !auth.licensedThemes.includes(themeId)) {
      return NextResponse.json(
        { success: false, error: `Theme "${themeId}" is not included in your license.` },
        { status: 403 }
      );
    }

    // @framingui/core에서 테마 로드
    const theme = loadTheme(themeId);
    if (!theme) {
      return NextResponse.json(
        { success: false, error: `Theme "${themeId}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, theme },
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
    console.error('[MCP Theme Detail] Unexpected error:', error);
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
