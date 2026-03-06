/**
 * MCP Screen Examples API 테스트
 * SPEC-MCP-007:E-007
 *
 * 테스트 대상:
 * - GET /api/mcp/examples/screens
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getScreenExamples } from '@/app/api/mcp/examples/screens/route';

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
// 테스트
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/mcp/examples/screens', () => {
  describe('인증 실패', () => {
    it('Authorization 헤더 없으면 401을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(unauthorizedAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/examples/screens');
      const response = await getScreenExamples(request);

      expect(response.status).toBe(401);
    });
  });

  describe('정상 응답', () => {
    it('유효한 인증으로 스크린 예제 목록을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/examples/screens');
      const response = await getScreenExamples(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.examples)).toBe(true);
      expect(data.count).toBeGreaterThan(0);
    });

    it('각 예제에 name, description, definition 필드가 포함된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/examples/screens');
      const response = await getScreenExamples(request);
      const data = await response.json();

      const example = data.examples[0];
      expect(example).toHaveProperty('name');
      expect(example).toHaveProperty('description');
      expect(example).toHaveProperty('definition');
    });

    it('definition에 shell, page 필드가 포함된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/examples/screens');
      const response = await getScreenExamples(request);
      const data = await response.json();

      // 'Team Grid' 예제 검색 (첫 번째 예제)
      const teamGridExample = data.examples.find((e: any) => e.name === 'Team Grid');
      expect(teamGridExample).toBeDefined();
      expect(teamGridExample.definition).toHaveProperty('shell');
      expect(teamGridExample.definition).toHaveProperty('page');
    });

    it('정적 데이터로 4개의 예제를 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/examples/screens');
      const response = await getScreenExamples(request);
      const data = await response.json();

      // 정적 SCREEN_EXAMPLES 배열: Team Grid, Data Table, Login Form, Dashboard Overview
      expect(data.count).toBe(4);
    });

    it('count와 examples 배열 길이가 일치한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/examples/screens');
      const response = await getScreenExamples(request);
      const data = await response.json();

      expect(data.count).toBe(data.examples.length);
    });
  });
});
