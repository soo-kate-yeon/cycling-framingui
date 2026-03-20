/**
 * Preview Theme Tool Tests
 * SPEC-MCP-002: AC-007 Theme Preview
 */

import { beforeEach, describe, it, expect, afterEach, vi } from 'vitest';
import { previewThemeTool } from '../../src/tools/preview-theme.ts';
import { setAuthData, clearAuthData } from '../../src/auth/state.js';
import { fetchTheme } from '../../src/api/data-client.js';

vi.mock('../../src/api/data-client.js', () => ({
  fetchTheme: vi.fn(),
}));

const mockFetchTheme = vi.mocked(fetchTheme);

const classicMagazineTheme = {
  id: 'classic-magazine',
  name: 'Classic Magazine',
  description: 'Editorial theme',
  brandTone: 'editorial',
  schemaVersion: '2.1.0',
  designDNA: {
    moodKeywords: ['classic', 'editorial'],
    targetEmotion: 'confidence',
    visualAtmosphere: 'structured',
  },
  tokens: {
    atomic: {
      color: {
        neutral: {
          50: '#f8fafc',
          white: '#ffffff',
        },
      },
    },
    semantic: {
      background: {},
      text: {},
      border: {},
    },
    component: {},
  },
  stateLayer: {},
  motion: {},
  elevation: {},
  typography: {},
};

// 테스트 전: 인증 상태 설정 (모든 테마 라이선스 보유 가정)
function setupAuth(licensedThemes: string[] = []) {
  setAuthData({
    valid: true,
    user: { id: 'test-user', email: 'test@example.com', plan: 'pro' },
    themes: { licensed: licensedThemes },
  });
}

describe('previewThemeTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // 캐시 포함 완전 초기화
    clearAuthData();
  });

  it('should generate preview for valid theme', async () => {
    setupAuth(['classic-magazine']);
    mockFetchTheme.mockResolvedValueOnce({ ok: true, data: classicMagazineTheme });
    const result = await previewThemeTool({
      themeId: 'classic-magazine',
    });

    expect(result.success).toBe(true);
    expect(result.theme).toBeDefined();
    expect(result.theme?.id).toBe('classic-magazine');
    expect(result.theme?.name).toBeDefined();
    // Note: description is optional in v2.1 theme schema
    // v2.1 schema uses tokens instead of cssVariables
    expect(result.theme?.tokens).toBeDefined();
  }, 15000);

  it('should include non-empty token payload', async () => {
    setupAuth(['classic-magazine']);
    mockFetchTheme.mockResolvedValueOnce({ ok: true, data: classicMagazineTheme });
    const result = await previewThemeTool({
      themeId: 'classic-magazine',
    });

    expect(result.success).toBe(true);
    expect(result.theme?.tokens).toBeDefined();
    expect(Object.keys(result.theme?.tokens ?? {})).not.toHaveLength(0);
  }, 15000);

  it('should return error for invalid theme ID', async () => {
    setupAuth(['non-existent-theme']);
    const result = await previewThemeTool({
      themeId: 'non-existent-theme',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Theme not found');
    expect(result.error).toContain('Available themes:');
  });

  it('should return theme without custom base URL', async () => {
    setupAuth(['classic-magazine']);
    mockFetchTheme.mockResolvedValueOnce({ ok: true, data: classicMagazineTheme });
    const result = await previewThemeTool({ themeId: 'classic-magazine' });

    expect(result.success).toBe(true);
    expect(result.theme).toBeDefined();
  });

  it('should require authentication', async () => {
    // 인증 없이 호출
    setAuthData(null);
    const result = await previewThemeTool({ themeId: 'classic-magazine' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Authentication required');
  });

  it('should require license for theme', async () => {
    // 다른 테마 라이선스만 보유
    setupAuth(['other-theme']);
    const result = await previewThemeTool({ themeId: 'classic-magazine' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('not included in your license');
  });
});
