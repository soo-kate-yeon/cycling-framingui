/**
 * MCP Components API 테스트
 * SPEC-MCP-007:E-003, E-004
 *
 * 테스트 대상:
 * - GET /api/mcp/components (목록)
 * - GET /api/mcp/components/[id] (상세)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getComponents } from '@/app/api/mcp/components/route';
import { GET as getComponentById } from '@/app/api/mcp/components/[id]/route';

// ─────────────────────────────────────────────────────────────────────────────
// vi.mock 호이스팅: factory 안에서 참조할 mock 함수를 vi.hoisted()로 선언
// ─────────────────────────────────────────────────────────────────────────────
const { mockAuthenticateMcpRequest } = vi.hoisted(() => ({
  mockAuthenticateMcpRequest: vi.fn(),
}));

vi.mock('@/lib/mcp/auth-helper', () => ({
  authenticateMcpRequest: mockAuthenticateMcpRequest,
}));

// ─────────────────────────────────────────────────────────────────────────────
// 헬퍼
// ─────────────────────────────────────────────────────────────────────────────
const validAuth = {
  valid: true as const,
  userId: 'user-123',
  email: 'test@example.com',
  plan: 'creator',
  licensedThemes: ['square-minimalism'],
  rateLimitHeaders: {},
};

const unauthorizedAuth = {
  valid: false as const,
  response: new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 }),
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/mcp/components — 목록
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/mcp/components', () => {
  describe('인증 실패', () => {
    it('Authorization 헤더 없으면 401을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(unauthorizedAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/components');
      const response = await getComponents(request);

      expect(response.status).toBe(401);
    });
  });

  describe('정상 응답', () => {
    it('유효한 인증으로 컴포넌트 목록을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/components');
      const response = await getComponents(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.components)).toBe(true);
      expect(data.count).toBeGreaterThan(0);
    });

    it('각 컴포넌트에 필수 필드가 포함된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/components');
      const response = await getComponents(request);
      const data = await response.json();

      const component = data.components[0];
      expect(component).toHaveProperty('id');
      expect(component).toHaveProperty('name');
      expect(component).toHaveProperty('category');
      expect(component).toHaveProperty('tier');
      expect(component).toHaveProperty('description');
      expect(component).toHaveProperty('variantsCount');
      expect(component).toHaveProperty('hasSubComponents');
    });

    it('컴포넌트 목록에 shared screen contract 20개가 포함된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/components');
      const response = await getComponents(request);
      const data = await response.json();

      expect(data.count).toBe(20);
    });

    it('screen contract에 포함된 Heading과 Text를 노출하고 compound subcomponent는 숨긴다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/components');
      const response = await getComponents(request);
      const data = await response.json();
      const ids = data.components.map((component: { id: string }) => component.id);

      expect(ids).toContain('heading');
      expect(ids).toContain('text');
      expect(ids).not.toContain('card-header');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/mcp/components/[id] — 상세
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/mcp/components/[id]', () => {
  describe('인증 실패', () => {
    it('Authorization 헤더 없으면 401을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(unauthorizedAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/components/button');
      const response = await getComponentById(request, {
        params: Promise.resolve({ id: 'button' }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('정상 응답', () => {
    it('button 컴포넌트 상세를 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/components/button');
      const response = await getComponentById(request, {
        params: Promise.resolve({ id: 'button' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.component.id).toBe('button');
      expect(data.component.name).toBe('Button');
    });

    it('컴포넌트 상세에 props, importStatement가 포함된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/components/button');
      const response = await getComponentById(request, {
        params: Promise.resolve({ id: 'button' }),
      });
      const data = await response.json();

      expect(data.component).toHaveProperty('props');
      expect(data.component).toHaveProperty('importStatement');
      expect(data.component.importStatement).toContain('@framingui/ui');
    });

    it('서브컴포넌트가 있는 card는 importStatement에 서브컴포넌트도 포함된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/components/card');
      const response = await getComponentById(request, { params: Promise.resolve({ id: 'card' }) });
      const data = await response.json();

      expect(data.component.subComponents).toBeDefined();
      expect(data.component.importStatement).toContain('CardHeader');
    });
  });

  describe('404 처리', () => {
    it('존재하지 않는 ID는 404를 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/components/nonexistent');
      const response = await getComponentById(request, {
        params: Promise.resolve({ id: 'nonexistent' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain('nonexistent');
    });
  });
});
