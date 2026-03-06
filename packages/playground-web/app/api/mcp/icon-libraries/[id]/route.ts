/**
 * GET /api/mcp/icon-libraries/[id] — 아이콘 라이브러리 상세 API
 * MCP 서버가 로컬 파일 대신 이 API를 통해 전체 IconLibrary JSON을 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadIconLibrary } from '@framingui/core';
import { authenticateMcpRequest } from '@/lib/mcp/auth-helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateMcpRequest(request);
    if (!auth.valid) {
      return auth.response;
    }

    const { id: libraryId } = await params;

    const library = loadIconLibrary(libraryId);
    if (!library) {
      return NextResponse.json(
        { success: false, error: `Icon library "${libraryId}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, library },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600',
          ...auth.rateLimitHeaders,
        },
      }
    );
  } catch (error) {
    console.error('[MCP Icon Library Detail] Unexpected error:', error);
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
