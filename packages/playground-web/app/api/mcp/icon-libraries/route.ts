/**
 * GET /api/mcp/icon-libraries — 아이콘 라이브러리 목록 API
 * MCP 서버가 로컬 파일 대신 이 API를 통해 아이콘 라이브러리 목록을 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { listIconLibraries } from '@framingui/core';
import { authenticateMcpRequest } from '@/lib/mcp/auth-helper';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateMcpRequest(request);
    if (!auth.valid) {
      return auth.response;
    }

    const libraries = listIconLibraries();

    return NextResponse.json(
      {
        success: true,
        libraries: libraries.map((lib) => ({
          id: lib.id,
          name: lib.name,
          description: lib.description,
          version: lib.version,
          license: lib.license,
          totalIcons: lib.totalIcons,
          categories: lib.categories,
        })),
        count: libraries.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600',
          ...auth.rateLimitHeaders,
        },
      }
    );
  } catch (error) {
    console.error('[MCP Icon Libraries] Unexpected error:', error);
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
