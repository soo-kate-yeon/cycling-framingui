/**
 * GET /api/mcp/templates — 스크린 템플릿 목록 API
 * [SPEC-MCP-007:E-001] fetchTemplateList() 지원
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  listTemplateDefinitions,
  listTemplateDefinitionsByCategory,
  searchTemplateDefinitions,
  type TemplateCategory,
} from '@framingui/core';
import { authenticateMcpRequest } from '@/lib/mcp/auth-helper';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateMcpRequest(request);
    if (!auth.valid) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // 카테고리 또는 전체 템플릿 조회
    let templates = category
      ? listTemplateDefinitionsByCategory(category as TemplateCategory)
      : listTemplateDefinitions();

    // 검색 필터 적용
    if (search) {
      templates = searchTemplateDefinitions(search).filter((t) =>
        category ? t.category === category : true
      );
    }

    const templateMetas = templates.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      description: t.description,
      requiredComponentsCount: t.requiredComponents?.length ?? 0,
      layoutType: t.layout?.type,
      version: t.version,
      tags: t.tags,
    }));

    return NextResponse.json(
      {
        success: true,
        templates: templateMetas,
        count: templateMetas.length,
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
    console.error('[MCP Templates] Unexpected error:', error);
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
