/**
 * GET /api/mcp/components — screen component catalog list API
 * [SPEC-MCP-007:E-003] fetchComponentList() support
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateMcpRequest } from '@/lib/mcp/auth-helper';
import { getMcpComponentCatalog, getMcpComponentCategories } from '@/lib/mcp/component-catalog';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateMcpRequest(request);
    if (!auth.valid) {
      return auth.response;
    }

    const components = getMcpComponentCatalog();

    return NextResponse.json(
      {
        success: true,
        components,
        count: components.length,
        categories: getMcpComponentCategories(),
      },
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
    console.error('[MCP Components] Unexpected error:', error);
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
