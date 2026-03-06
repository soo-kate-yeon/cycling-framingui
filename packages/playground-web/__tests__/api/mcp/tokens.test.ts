/**
 * MCP Tokens API 테스트
 * SPEC-MCP-007:E-005
 *
 * 테스트 대상:
 * - GET /api/mcp/tokens (레이아웃 토큰 목록)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getTokens } from '@/app/api/mcp/tokens/route';

// ─────────────────────────────────────────────────────────────────────────────
// vi.mock 호이스팅: factory 안에서 참조할 mock 함수를 vi.hoisted()로 선언
// ─────────────────────────────────────────────────────────────────────────────
const {
  mockAuthenticateMcpRequest,
  mockGetAllShellTokens,
  mockGetAllMobileShellTokens,
  mockGetAllPageLayoutTokens,
  mockGetAllSectionPatternTokens,
} = vi.hoisted(() => ({
  mockAuthenticateMcpRequest: vi.fn(),
  mockGetAllShellTokens: vi.fn(),
  mockGetAllMobileShellTokens: vi.fn(),
  mockGetAllPageLayoutTokens: vi.fn(),
  mockGetAllSectionPatternTokens: vi.fn(),
}));

vi.mock('@/lib/mcp/auth-helper', () => ({
  authenticateMcpRequest: mockAuthenticateMcpRequest,
}));

// @framingui/core 토큰 함수 목업
vi.mock('@framingui/core', () => ({
  getAllShellTokens: mockGetAllShellTokens,
  getAllMobileShellTokens: mockGetAllMobileShellTokens,
  getAllPageLayoutTokens: mockGetAllPageLayoutTokens,
  getAllSectionPatternTokens: mockGetAllSectionPatternTokens,
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

const sampleShellTokens = [
  { id: 'shell.web.dashboard', description: 'Dashboard shell', platform: 'web' },
  { id: 'shell.web.app', description: 'App shell', platform: 'web' },
];
const sampleMobileShellTokens = [
  { id: 'shell.mobile.app', description: 'Mobile app shell', platform: 'mobile' },
];
const samplePageTokens = [
  { id: 'page.dashboard', description: 'Dashboard page', purpose: 'analytics' },
];
const sampleSectionTokens = [
  { id: 'section.container', description: 'Container section', type: 'layout' },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockGetAllShellTokens.mockReturnValue(sampleShellTokens);
  mockGetAllMobileShellTokens.mockReturnValue(sampleMobileShellTokens);
  mockGetAllPageLayoutTokens.mockReturnValue(samplePageTokens);
  mockGetAllSectionPatternTokens.mockReturnValue(sampleSectionTokens);
});

// ─────────────────────────────────────────────────────────────────────────────
// 테스트
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/mcp/tokens', () => {
  describe('인증 실패', () => {
    it('Authorization 헤더 없으면 401을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(unauthorizedAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/tokens');
      const response = await getTokens(request);

      expect(response.status).toBe(401);
    });
  });

  describe('정상 응답 (type=all)', () => {
    it('유효한 인증으로 모든 토큰을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/tokens');
      const response = await getTokens(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.metadata).toBeDefined();
      expect(data.metadata.total).toBeGreaterThan(0);
    });

    it('type=all이면 shells, pages, sections 모두 포함된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/tokens?type=all');
      const response = await getTokens(request);
      const data = await response.json();

      expect(data.shells).toBeDefined();
      expect(data.pages).toBeDefined();
      expect(data.sections).toBeDefined();
    });

    it('shells 배열에 id, name, description, platform이 포함된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/tokens?type=all');
      const response = await getTokens(request);
      const data = await response.json();

      const shell = data.shells[0];
      expect(shell).toHaveProperty('id');
      expect(shell).toHaveProperty('name');
      expect(shell).toHaveProperty('description');
      expect(shell).toHaveProperty('platform');
    });
  });

  describe('쿼리 파라미터 - type 필터링', () => {
    it('type=shell이면 shells만 반환되고 pages, sections는 없다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/tokens?type=shell');
      const response = await getTokens(request);
      const data = await response.json();

      expect(data.shells).toBeDefined();
      expect(data.pages).toBeUndefined();
      expect(data.sections).toBeUndefined();
    });

    it('type=page이면 pages만 반환된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/tokens?type=page');
      const response = await getTokens(request);
      const data = await response.json();

      expect(data.pages).toBeDefined();
      expect(data.shells).toBeUndefined();
      expect(data.sections).toBeUndefined();
    });

    it('type=section이면 sections만 반환된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/tokens?type=section');
      const response = await getTokens(request);
      const data = await response.json();

      expect(data.sections).toBeDefined();
      expect(data.shells).toBeUndefined();
      expect(data.pages).toBeUndefined();
    });

    it('metadata.total은 반환된 토큰 전체 수와 일치한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/tokens?type=all');
      const response = await getTokens(request);
      const data = await response.json();

      // web(2) + mobile(1) + page(1) + section(1) = 5
      const expectedTotal =
        sampleShellTokens.length +
        sampleMobileShellTokens.length +
        samplePageTokens.length +
        sampleSectionTokens.length;
      expect(data.metadata.total).toBe(expectedTotal);
    });
  });
});
