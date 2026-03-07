/**
 * GET /api/mcp/templates/[id] — 스크린 템플릿 상세 API
 * [SPEC-MCP-007:E-002] fetchTemplate(id) 지원
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadTemplateDefinition } from '@framingui/core';
import { authenticateMcpRequest } from '@/lib/mcp/auth-helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateMcpRequest(request);
    if (!auth.valid) {
      return auth.response;
    }

    const { id: templateId } = await params;

    const template = loadTemplateDefinition(templateId);
    if (!template) {
      return NextResponse.json(
        { success: false, error: `Template "${templateId}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, template },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, no-store',
          Vary: 'Authorization',
          ...auth.rateLimitHeaders,
        },
      }
    );
  } catch (error) {
    console.error('[MCP Template Detail] Unexpected error:', error);
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
