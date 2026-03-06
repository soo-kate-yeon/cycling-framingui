/**
 * GET /api/mcp/themes — 라이선스 보유 테마 목록 API
 * MCP 서버가 로컬 파일 대신 이 API를 통해 테마 목록을 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { listThemes } from '@framingui/core';
import { authenticateMcpRequest } from '@/lib/mcp/auth-helper';

const MASTER_EMAILS = ['soo.kate.yeon@gmail.com'];

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateMcpRequest(request);
    if (!auth.valid) {
      return auth.response;
    }

    // @framingui/core에서 전체 테마 로드 (서버 사이드에선 .moai/ 접근 가능)
    const allThemes = listThemes();

    // 마스터 계정: 모든 테마, 일반 사용자: 라이선스 보유 테마만
    const isMaster = MASTER_EMAILS.includes(auth.email.toLowerCase());
    const licensedSet = new Set(auth.licensedThemes);

    const filteredThemes = isMaster ? allThemes : allThemes.filter((t) => licensedSet.has(t.id));

    return NextResponse.json(
      {
        success: true,
        themes: filteredThemes.map((theme) => ({
          id: theme.id,
          name: theme.name,
          description: theme.description,
          brandTone: theme.brandTone,
          schemaVersion: theme.schemaVersion,
        })),
        count: filteredThemes.length,
      },
      {
        status: 200,
        headers: {
          // Authorization에 따라 응답이 달라지므로 공유 캐시를 금지한다.
          'Cache-Control': 'private, no-store',
          Vary: 'Authorization',
          ...auth.rateLimitHeaders,
        },
      }
    );
  } catch (error) {
    console.error('[MCP Themes] Unexpected error:', error);
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
