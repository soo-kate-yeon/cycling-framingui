/**
 * MCP Theme CSS API 테스트
 * SPEC-MCP-007:E-006
 *
 * 테스트 대상:
 * - GET /api/mcp/themes/[id]/css
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getThemeCSS } from '@/app/api/mcp/themes/[id]/css/route';

// ─────────────────────────────────────────────────────────────────────────────
// vi.mock 호이스팅: factory 안에서 참조할 mock 함수를 vi.hoisted()로 선언
// ─────────────────────────────────────────────────────────────────────────────
const { mockAuthenticateMcpRequest, mockLoadTheme, mockThemeToCSS } = vi.hoisted(() => ({
  mockAuthenticateMcpRequest: vi.fn(),
  mockLoadTheme: vi.fn(),
  mockThemeToCSS: vi.fn(),
}));

vi.mock('@/lib/mcp/auth-helper', () => ({
  authenticateMcpRequest: mockAuthenticateMcpRequest,
}));

vi.mock('@framingui/core', () => ({
  loadTheme: mockLoadTheme,
}));

vi.mock('@framingui/ui/theme-loader', () => ({
  themeToCSS: mockThemeToCSS,
}));

// ─────────────────────────────────────────────────────────────────────────────
// 헬퍼
// ─────────────────────────────────────────────────────────────────────────────
const validAuth = {
  valid: true as const,
  userId: 'user-123',
  email: 'test@example.com',
  plan: 'creator',
  licensedThemes: ['square-minimalism', 'dark-boldness'],
  rateLimitHeaders: {},
};

const masterAuth = {
  valid: true as const,
  userId: 'master-user',
  email: 'soo.kate.yeon@gmail.com', // MASTER_EMAILS에 있는 이메일
  plan: 'creator',
  licensedThemes: [],
  rateLimitHeaders: {},
};

const unauthorizedAuth = {
  valid: false as const,
  response: new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 }),
};

// 최소한의 테마 목업 (generateCSSFromTheme에서 사용하는 구조)
const sampleTheme = {
  id: 'square-minimalism',
  schemaVersion: '2.1',
  tokens: {
    atomic: {
      color: { brand: {}, neutral: {}, accent: {} },
      spacing: {},
      radius: {},
    },
    semantic: {
      background: {
        canvas: 'atomic.color.neutral.50',
        surface: {
          subtle: 'atomic.color.neutral.100',
          default: 'atomic.color.neutral.white',
          emphasis: 'atomic.color.neutral.200',
        },
        brand: {
          subtle: 'atomic.color.brand.100',
          default: 'atomic.color.brand.500',
          emphasis: 'atomic.color.brand.700',
        },
      },
      text: {
        primary: 'atomic.color.neutral.900',
        secondary: 'atomic.color.neutral.600',
        muted: 'atomic.color.neutral.400',
      },
      border: {
        default: {
          subtle: 'atomic.color.neutral.100',
          default: 'atomic.color.neutral.200',
          emphasis: 'atomic.color.neutral.300',
        },
      },
    },
  },
  typography: {
    fontFamily: { sans: 'Inter, sans-serif' },
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
  },
  border: { width: {}, radius: {} },
  elevation: { level: {} },
  motion: { duration: {}, easing: {} },
  stateLayer: {
    hover: { opacity: 0.08 },
    pressed: { opacity: 0.12 },
    focus: { opacity: 0.12 },
    disabled: { opacity: 0.38 },
  },
  darkMode: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  mockLoadTheme.mockReturnValue(sampleTheme);
  mockThemeToCSS.mockReturnValue(`:root, [data-theme="square-minimalism"] {
  --bg-brand-default: oklch(0.5 0.2 240);
  --text-primary: oklch(0.2 0.04 265);
}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// 테스트
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/mcp/themes/[id]/css', () => {
  describe('인증 실패', () => {
    it('Authorization 헤더 없으면 401을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(unauthorizedAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/themes/square-minimalism/css');
      const response = await getThemeCSS(request, {
        params: Promise.resolve({ id: 'square-minimalism' }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('라이선스 확인', () => {
    it('라이선스 없는 테마에 접근하면 403을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/themes/pebble/css');
      // 'pebble'은 validAuth.licensedThemes에 없음
      const response = await getThemeCSS(request, { params: Promise.resolve({ id: 'pebble' }) });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toContain('pebble');
    });

    it('마스터 계정은 라이선스 없이도 모든 테마에 접근 가능하다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(masterAuth);
      mockLoadTheme.mockReturnValue(sampleTheme);

      const request = new NextRequest('http://localhost:3001/api/mcp/themes/pebble/css');
      const response = await getThemeCSS(request, { params: Promise.resolve({ id: 'pebble' }) });
      // 마스터 계정이라 403이 아닌 200 또는 404(테마 로드 실패)를 받아야 함
      expect(response.status).not.toBe(403);
    });
  });

  describe('정상 응답', () => {
    it('유효한 인증 + 라이선스로 CSS 문자열을 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);
      mockLoadTheme.mockReturnValue(sampleTheme);

      const request = new NextRequest('http://localhost:3001/api/mcp/themes/square-minimalism/css');
      const response = await getThemeCSS(request, {
        params: Promise.resolve({ id: 'square-minimalism' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(typeof data.css).toBe('string');
      expect(data.css).toContain(':root');
    });

    it('CSS에 테마 selector가 포함된다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/themes/square-minimalism/css');
      const response = await getThemeCSS(request, {
        params: Promise.resolve({ id: 'square-minimalism' }),
      });
      const data = await response.json();

      expect(data.css).toContain('[data-theme="square-minimalism"]');
    });

    it('legacy tekton 변수를 포함하지 않고 실제 페이지 변수를 생성한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);

      const request = new NextRequest('http://localhost:3001/api/mcp/themes/square-minimalism/css');
      const response = await getThemeCSS(request, {
        params: Promise.resolve({ id: 'square-minimalism' }),
      });
      const data = await response.json();

      expect(data.css).toContain('--bg-brand-default');
      expect(data.css).toContain('--text-primary');
      expect(data.css).not.toContain('--tekton-');
    });
  });

  describe('404 처리', () => {
    it('테마를 로드하지 못하면 404를 반환한다', async () => {
      mockAuthenticateMcpRequest.mockResolvedValueOnce(validAuth);
      mockLoadTheme.mockReturnValue(null);

      const request = new NextRequest('http://localhost:3001/api/mcp/themes/square-minimalism/css');
      const response = await getThemeCSS(request, {
        params: Promise.resolve({ id: 'square-minimalism' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });
});
