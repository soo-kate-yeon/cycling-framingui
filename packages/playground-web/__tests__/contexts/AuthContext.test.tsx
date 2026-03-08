/**
 * AuthContext Tests
 * SPEC-AUTH-001: Supabase 인증 통합
 *
 * WHY: AuthProvider 및 useAuth hook의 동작 검증
 * IMPACT: 인증 상태 관리의 품질 보장 및 UI 통합 검증
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import type { Session, User } from '@supabase/supabase-js';
import type { UserLicense } from '@/lib/db/types';

const { mockAuthHelperOnAuthStateChange, authCallbackRef } = vi.hoisted(() => ({
  mockAuthHelperOnAuthStateChange: vi.fn(),
  authCallbackRef: {
    current: null as ((event: string, session: Session | null) => void) | null,
  },
}));

// Mock Supabase client
const mockSignInWithOAuth = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockFrom = vi.fn();
const mockOnAuthStateChange = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
      signOut: mockSignOut,
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
    from: mockFrom,
  })),
}));

// Mock auth helper functions
vi.mock('@/lib/auth/supabase-auth', () => ({
  signInWithGoogle: vi.fn().mockResolvedValue({ url: 'https://google.com/oauth', error: null }),
  signInWithGitHub: vi.fn().mockResolvedValue({ url: 'https://github.com/oauth', error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  onAuthStateChange: vi.fn((callback) => {
    authCallbackRef.current = callback;
    mockAuthHelperOnAuthStateChange(callback);
    return vi.fn();
  }),
}));

const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  app_metadata: { provider: 'google' },
  user_metadata: {
    name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
  },
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z',
};

const mockSession: Session = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user: mockUser,
};

const mockLicenses: UserLicense[] = [
  {
    id: 'license-1',
    user_id: 'user-123',
    theme_id: 'premium-dashboard',
    tier: 'single',
    paddle_subscription_id: 'sub_123',
    purchased_at: '2024-01-01T00:00:00Z',
    expires_at: null,
    is_active: true,
  },
];

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    authCallbackRef.current = null;

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ licenses: [] }),
        text: async () => '',
      })
    );

    // Setup onAuthStateChange to return unsubscribe function
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children', () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    render(
      <AuthProvider>
        <div>Test Content</div>
      </AuthProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should provide initial loading state', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should load user session on mount', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ licenses: mockLicenses }),
        text: async () => '',
      })
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    expect(result.current.user?.id).toBe('user-123');
    expect(result.current.user?.email).toBe('test@example.com');
    expect(result.current.userData?.licenses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'license-1',
          templateId: 'premium-dashboard',
        }),
      ])
    );
  });

  it('should handle no session on mount', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.userData).toBeNull();
  });

  it('should handle session fetch error on mount', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: {
        message: 'Session fetch failed',
      },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });
});

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('should throw error when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within AuthProvider');
  });

  it('should provide auth context values', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ licenses: mockLicenses }),
        text: async () => '',
      })
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('userData');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('hasLicense');
    expect(result.current).toHaveProperty('toggleLike');
  });
});

describe('login function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('should call signInWithGoogle when provider is google', async () => {
    const { signInWithGoogle } = await import('@/lib/auth/supabase-auth');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login('google');
    });

    expect(signInWithGoogle).toHaveBeenCalled();
  });

  it('should call signInWithGitHub when provider is github', async () => {
    const { signInWithGitHub } = await import('@/lib/auth/supabase-auth');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login('github');
    });

    expect(signInWithGitHub).toHaveBeenCalled();
  });

  it('should handle login error', async () => {
    const { signInWithGoogle } = await import('@/lib/auth/supabase-auth');
    vi.mocked(signInWithGoogle).mockResolvedValueOnce({
      url: null,
      error: {
        message: 'OAuth failed',
        name: 'AuthError',
        status: 400,
        code: 'oauth_failed',
      } as any,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login('google');
    });

    await waitFor(() => {
      expect(result.current.error).toBe('OAuth failed');
    });
  });
});

describe('logout function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ licenses: mockLicenses }),
        text: async () => '',
      })
    );
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('should call signOut when logout is invoked', async () => {
    const { signOut } = await import('@/lib/auth/supabase-auth');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(signOut).toHaveBeenCalled();
  });

  it('should handle logout error', async () => {
    const { signOut } = await import('@/lib/auth/supabase-auth');
    vi.mocked(signOut).mockResolvedValueOnce({
      error: {
        message: 'Logout failed',
        name: 'AuthError',
        status: 500,
        code: 'logout_failed',
      } as any,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Logout failed');
    });
  });
});

describe('hasLicense function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ licenses: mockLicenses }),
        text: async () => '',
      })
    );
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('should return true for licensed template', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.userData).not.toBeNull();
    });

    const hasLicense = result.current.hasLicense('premium-dashboard');
    expect(hasLicense).toBe(true);
  });

  it('should return false for unlicensed template', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.userData).not.toBeNull();
    });

    const hasLicense = result.current.hasLicense('non-existent-template');
    expect(hasLicense).toBe(false);
  });

  it('should return false when userData is null', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const hasLicense = result.current.hasLicense('premium-dashboard');
    expect(hasLicense).toBe(false);
  });
});

describe('toggleLike function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ licenses: mockLicenses }),
        text: async () => '',
      })
    );
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('should add template to liked templates', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.userData).not.toBeNull();
    });

    act(() => {
      result.current.toggleLike('template-1');
    });

    expect(result.current.userData?.likedTemplates).toContain('template-1');
  });

  it('should remove template from liked templates when already liked', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.userData).not.toBeNull();
    });

    act(() => {
      result.current.toggleLike('template-1');
    });

    expect(result.current.userData?.likedTemplates).toContain('template-1');

    act(() => {
      result.current.toggleLike('template-1');
    });

    expect(result.current.userData?.likedTemplates).not.toContain('template-1');
  });
});

describe('onAuthStateChange listener', () => {
  let authCallback: (event: string, session: Session | null) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    authCallback = ((event: string, session: Session | null) =>
      authCallbackRef.current?.(event as any, session)) as (
      event: string,
      session: Session | null
    ) => void;
  });

  it('should update user state on SIGNED_IN event', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ licenses: mockLicenses }),
        text: async () => '',
      })
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await authCallback('SIGNED_IN', mockSession);
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.id).toBe('user-123');
    });
  });

  it('should clear user state on SIGNED_OUT event', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ licenses: mockLicenses }),
        text: async () => '',
      })
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    await act(async () => {
      await authCallback('SIGNED_OUT', null);
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.userData).toBeNull();
    });
  });

  it('should update user on TOKEN_REFRESHED event', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ licenses: mockLicenses }),
        text: async () => '',
      })
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    const updatedSession = {
      ...mockSession,
      access_token: 'new-token',
    };

    await act(async () => {
      await authCallback('TOKEN_REFRESHED', updatedSession);
    });

    // User should still be present after token refresh
    expect(result.current.user).not.toBeNull();
  });

  it('should update user on USER_UPDATED event', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ licenses: mockLicenses }),
        text: async () => '',
      })
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    const updatedUser = {
      ...mockUser,
      user_metadata: {
        ...mockUser.user_metadata,
        name: 'Updated Name',
      },
    };

    const updatedSession = {
      ...mockSession,
      user: updatedUser,
    };

    await act(async () => {
      await authCallback('USER_UPDATED', updatedSession);
    });

    await waitFor(() => {
      expect(result.current.user?.name).toBe('Updated Name');
    });
  });

  it('should handle auth state change errors', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('License fetch failed')));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await authCallback('SIGNED_IN', mockSession);
    });

    await waitFor(() => {
      expect(result.current.user?.id).toBe('user-123');
      expect(result.current.userData?.licenses).toEqual([]);
      expect(result.current.error).toBeNull();
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Unexpected error fetching licenses:',
      expect.any(Error)
    );
  });
});
