/**
 * MCP Templates API 테스트
 * SPEC-MCP-007:E-001, E-002
 *
 * 테스트 대상:
 * - GET /api/mcp/templates (목록)
 * - GET /api/mcp/templates/[id] (상세)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getTemplates } from '@/app/api/mcp/templates/route';
import { GET as getTemplateById } from '@/app/api/mcp/templates/[id]/route';

// ─────────────────────────────────────────────────────────────────────────────
// vi.mock 호이스팅: factory 안에서 참조할 mock 함수를 vi.hoisted()로 선언
// ─────────────────────────────────────────────────────────────────────────────
const { mockAuthenticateMcpRequest, mockGetAll, mockGetByCategory, mockSearch, mockGetById } =
  vi.hoisted(() => ({
    mockAuthenticateMcpRequest: vi.fn(),
    mockGetAll: vi.fn(),
    mockGetByCategory: vi.fn(),
    mockSearch: vi.fn(),
    mockGetById: vi.fn(),
  }));

vi.mock('@/lib/mcp/auth-helper', () => ({
  authenticateMcpRequest: mockAuthenticateMcpRequest,
}));

vi.mock('@framingui/core', () => ({
  listTemplateDefinitions: mockGetAll,
  listTemplateDefinitionsByCategory: mockGetByCategory,
  searchTemplateDefinitions: mockSearch,
  loadTemplateDefinition: mockGetById,
}));

// ─────────────────────────────────────────────────────────────────────────────
// 헬퍼: 인증 성공 목업 반환값
// ─────────────────────────────────────────────────────────────────────────────
const validAuth = {
  valid: true as const,
  userId: 'user-123',
  email: 'test@example.com',
  plan: 'creator',
  licensedThemes: ['square-minimalism', 'dark-boldness'],
  rateLimitHeaders: { 'X-RateLimit-Remaining': '99' },
};

const unauthorizedAuth = {
  valid: false as const,
  response: new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 }),
};

// 샘플 템플릿 데이터
const sampleTemplates = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    category: 'web',
    description: 'Admin dashboard template',
    requiredComponents: ['Card', 'Table', 'Chart'],
    layout: { type: 'sidebar' },
    version: '1.0.0',
    tags: ['admin', 'analytics'],
  },
  {
    id: 'login',
    name: 'Login',
    category: 'auth',
    description: 'Login screen template',
    requiredComponents: ['Input', 'Button'],
    layout: { type: 'centered' },
    version: '1.0.0',
    tags: ['auth'],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockGetAll.mockReturnValue(sampleTemplates);
  mockGetByCategory.mockReturnValue([sampleTemplates[0]]);
  mockSearch.mockReturnValue(sampleTemplates);
  mockGetById.mockReturnValue(sampleTemplates[0]);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/mcp/templates — 목록
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/mcp/templates', () => {
  describe('인증 실패', () => {
    it('Authorization 헤더 없으면 401을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(unauthorizedAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/templates');
      const response = await getTemplates(request);

      expect(response.status).toBe(401);
    });
  });

  describe('정상 응답', () => {
    it('유효한 인증으로 템플릿 목록을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);
      mockGetAll.mockReturnValue(sampleTemplates);

      const request = new NextRequest('http://localhost:3001/api/mcp/templates');
      const response = await getTemplates(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.templates).toHaveLength(2);
      expect(data.count).toBe(2);
    });

    it('각 템플릿에 필수 필드(id, name, category, description)가 포함된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/templates');
      const response = await getTemplates(request);
      const data = await response.json();

      const template = data.templates[0];
      expect(template).toHaveProperty('id');
      expect(template).toHaveProperty('name');
      expect(template).toHaveProperty('category');
      expect(template).toHaveProperty('description');
      expect(template).toHaveProperty('requiredComponentsCount');
    });
  });

  describe('쿼리 파라미터 필터링', () => {
    it('category 파라미터로 카테고리 필터링이 적용된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);
      mockGetByCategory.mockReturnValue([sampleTemplates[0]]);

      const request = new NextRequest('http://localhost:3001/api/mcp/templates?category=web');
      const response = await getTemplates(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetByCategory).toHaveBeenCalledWith('web');
      expect(data.templates).toHaveLength(1);
    });

    it('search 파라미터로 검색 필터링이 적용된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);
      mockSearch.mockReturnValue([sampleTemplates[0]]);

      const request = new NextRequest('http://localhost:3001/api/mcp/templates?search=dashboard');
      const response = await getTemplates(request);
      expect(response.status).toBe(200);
      expect(mockSearch).toHaveBeenCalledWith('dashboard');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/mcp/templates/[id] — 상세
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/mcp/templates/[id]', () => {
  describe('인증 실패', () => {
    it('Authorization 헤더 없으면 401을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(unauthorizedAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/templates/dashboard');
      const response = await getTemplateById(request, {
        params: Promise.resolve({ id: 'dashboard' }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('정상 응답', () => {
    it('유효한 ID로 템플릿 상세를 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);
      mockGetById.mockReturnValue(sampleTemplates[0]);

      const request = new NextRequest('http://localhost:3001/api/mcp/templates/dashboard');
      const response = await getTemplateById(request, {
        params: Promise.resolve({ id: 'dashboard' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.template).toBeDefined();
      expect(data.template.id).toBe('dashboard');
    });
  });

  describe('404 처리', () => {
    it('존재하지 않는 ID는 404를 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);
      mockGetById.mockReturnValue(undefined);

      const request = new NextRequest('http://localhost:3001/api/mcp/templates/nonexistent');
      const response = await getTemplateById(request, {
        params: Promise.resolve({ id: 'nonexistent' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain('nonexistent');
    });
  });
});
