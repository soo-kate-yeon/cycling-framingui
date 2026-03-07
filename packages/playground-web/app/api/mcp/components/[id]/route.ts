/**
 * GET /api/mcp/components/[id] — screen component detail API
 * [SPEC-MCP-007:E-004] fetchComponent(id) support
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateMcpRequest } from '@/lib/mcp/auth-helper';
import { getMcpComponentById } from '@/lib/mcp/component-catalog';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateMcpRequest(request);
    if (!auth.valid) {
      return auth.response;
    }

    const { id: componentId } = await params;
    const component = getMcpComponentById(componentId);

    if (!component) {
      return NextResponse.json(
        { success: false, error: `Component "${componentId}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, component },
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
    console.error('[MCP Component Detail] Unexpected error:', error);
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
