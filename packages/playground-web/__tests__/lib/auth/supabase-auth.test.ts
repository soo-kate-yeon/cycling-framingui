/**
 * Supabase Authentication Tests
 * SPEC-AUTH-001: Supabase 인증 통합
 *
 * WHY: Auth helper 함수들의 동작 검증 및 에러 처리 테스트
 * IMPACT: 인증 플로우의 품질 보장 및 회귀 방지
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  signInWithGoogle,
  signInWithGitHub,
  signOut,
  getSession,
  getUser,
  refreshSession,
  onAuthStateChange,
} from '@/lib/auth/supabase-auth';
import type { Session, User, AuthError } from '@supabase/supabase-js';

// Mock Supabase client
const mockSignInWithOAuth = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockGetUser = vi.fn();
const mockRefreshSession = vi.fn();
const mockOnAuthStateChange = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
      signOut: mockSignOut,
      getSession: mockGetSession,
      getUser: mockGetUser,
      refreshSession: mockRefreshSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  })),
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
    search: '',
    assign: vi.fn(),
  },
  writable: true,
});

describe('signInWithGoogle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully initiate Google OAuth', async () => {
    const mockUrl = 'https://accounts.google.com/o/oauth2/auth?state=xyz';
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: mockUrl },
      error: null,
    });

    const result = await signInWithGoogle();

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        skipBrowserRedirect: true,
      },
    });
    expect(result.url).toContain('https://accounts.google.com/o/oauth2/auth');
    expect(result.url).toContain(
      `redirect_to=${encodeURIComponent('http://localhost:3000/auth/callback')}`
    );
    expect(window.location.assign).toHaveBeenCalledWith(result.url);
    expect(result.error).toBeNull();
  });

  it('should return error when OAuth fails', async () => {
    const mockError = {
      message: 'OAuth configuration error',
      name: 'AuthError',
      status: 500,
    } as AuthError;

    mockSignInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: mockError,
    });

    const result = await signInWithGoogle();

    expect(result.url).toBeNull();
    expect(result.error).toEqual(mockError);
  });

  it('should handle unexpected exceptions', async () => {
    const unexpectedError = new Error('Network error');
    mockSignInWithOAuth.mockRejectedValue(unexpectedError);

    const result = await signInWithGoogle();

    expect(result.url).toBeNull();
    expect(result.error).toEqual(unexpectedError);
  });
});

describe('signInWithGitHub', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully initiate GitHub OAuth', async () => {
    const mockUrl = 'https://github.com/login/oauth/authorize?state=abc';
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: mockUrl },
      error: null,
    });

    const result = await signInWithGitHub();

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
        queryParams: undefined,
        skipBrowserRedirect: true,
      },
    });
    expect(result.url).toContain('https://github.com/login/oauth/authorize');
    expect(result.url).toContain(
      `redirect_to=${encodeURIComponent('http://localhost:3000/auth/callback')}`
    );
    expect(window.location.assign).toHaveBeenCalledWith(result.url);
    expect(result.error).toBeNull();
  });

  it('should return error when GitHub OAuth fails', async () => {
    const mockError = {
      message: 'GitHub OAuth error',
      name: 'AuthError',
      status: 400,
    } as AuthError;

    mockSignInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: mockError,
    });

    const result = await signInWithGitHub();

    expect(result.url).toBeNull();
    expect(result.error).toEqual(mockError);
  });
});

describe('signOut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully sign out user', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const result = await signOut();

    expect(mockSignOut).toHaveBeenCalled();
    expect(result.error).toBeNull();
  });

  it('should return error when sign out fails', async () => {
    const mockError = {
      message: 'Failed to sign out',
      name: 'AuthError',
      status: 500,
    } as AuthError;

    mockSignOut.mockResolvedValue({ error: mockError });

    const result = await signOut();

    expect(result.error).toEqual(mockError);
  });

  it('should handle unexpected exceptions during sign out', async () => {
    const unexpectedError = new Error('Network timeout');
    mockSignOut.mockRejectedValue(unexpectedError);

    const result = await signOut();

    expect(result.error).toEqual(unexpectedError);
  });
});

describe('getSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return session when available', async () => {
    const mockSession: Session = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User,
    };

    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const result = await getSession();

    expect(mockGetSession).toHaveBeenCalled();
    expect(result).toEqual(mockSession);
  });

  it('should return null when no session exists', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const result = await getSession();

    expect(result).toBeNull();
  });

  it('should return null and log error when session fetch fails', async () => {
    const mockError = {
      message: 'Session expired',
      name: 'AuthError',
      status: 401,
    } as AuthError;

    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: mockError,
    });

    const result = await getSession();

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Failed to get session:', 'Session expired');
  });

  it('should handle unexpected exceptions', async () => {
    mockGetSession.mockRejectedValue(new Error('Unexpected error'));

    const result = await getSession();

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });
});

describe('getUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return user when authenticated', async () => {
    const mockUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const result = await getUser();

    expect(mockGetUser).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should return null when no user is authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await getUser();

    expect(result).toBeNull();
  });

  it('should return null and log error when user fetch fails', async () => {
    const mockError = {
      message: 'Invalid token',
      name: 'AuthError',
      status: 401,
    } as AuthError;

    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: mockError,
    });

    const result = await getUser();

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Failed to get user:', 'Invalid token');
  });
});

describe('refreshSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully refresh session', async () => {
    const mockSession: Session = {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User,
    };

    mockRefreshSession.mockResolvedValue({
      data: { session: mockSession, user: mockSession.user },
      error: null,
    });

    const result = await refreshSession();

    expect(mockRefreshSession).toHaveBeenCalled();
    expect(result.session).toEqual(mockSession);
    expect(result.error).toBeNull();
  });

  it('should return error when refresh fails', async () => {
    const mockError = {
      message: 'Refresh token expired',
      name: 'AuthError',
      status: 401,
    } as AuthError;

    mockRefreshSession.mockResolvedValue({
      data: { session: null, user: null },
      error: mockError,
    });

    const result = await refreshSession();

    expect(result.session).toBeNull();
    expect(result.error).toEqual(mockError);
  });

  it('should handle unexpected exceptions during refresh', async () => {
    const unexpectedError = new Error('Network error');
    mockRefreshSession.mockRejectedValue(unexpectedError);

    const result = await refreshSession();

    expect(result.session).toBeNull();
    expect(result.error).toEqual(unexpectedError);
  });
});

describe('onAuthStateChange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register auth state change listener', () => {
    const mockUnsubscribe = vi.fn();
    const mockSubscription = { unsubscribe: mockUnsubscribe };

    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: mockSubscription },
    });

    const callback = vi.fn();
    const unsubscribe = onAuthStateChange(callback);

    expect(mockOnAuthStateChange).toHaveBeenCalled();
    expect(typeof unsubscribe).toBe('function');

    // Test unsubscribe
    unsubscribe();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should call callback on SIGNED_IN event', () => {
    const mockSession: Session = {
      access_token: 'token',
      refresh_token: 'refresh',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User,
    };

    let authCallback: (event: string, session: Session | null) => void = () => {};

    mockOnAuthStateChange.mockImplementation((cb) => {
      authCallback = cb;
      return {
        data: {
          subscription: { unsubscribe: vi.fn() },
        },
      };
    });

    const callback = vi.fn();
    onAuthStateChange(callback);

    // Trigger SIGNED_IN event
    authCallback('SIGNED_IN', mockSession);

    expect(callback).toHaveBeenCalledWith('SIGNED_IN', mockSession);
  });

  it('should call callback on SIGNED_OUT event', () => {
    let authCallback: (event: string, session: Session | null) => void = () => {};

    mockOnAuthStateChange.mockImplementation((cb) => {
      authCallback = cb;
      return {
        data: {
          subscription: { unsubscribe: vi.fn() },
        },
      };
    });

    const callback = vi.fn();
    onAuthStateChange(callback);

    // Trigger SIGNED_OUT event
    authCallback('SIGNED_OUT', null);

    expect(callback).toHaveBeenCalledWith('SIGNED_OUT', null);
  });

  it('should call callback on TOKEN_REFRESHED event', () => {
    const mockSession: Session = {
      access_token: 'new-token',
      refresh_token: 'new-refresh',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User,
    };

    let authCallback: (event: string, session: Session | null) => void = () => {};

    mockOnAuthStateChange.mockImplementation((cb) => {
      authCallback = cb;
      return {
        data: {
          subscription: { unsubscribe: vi.fn() },
        },
      };
    });

    const callback = vi.fn();
    onAuthStateChange(callback);

    // Trigger TOKEN_REFRESHED event
    authCallback('TOKEN_REFRESHED', mockSession);

    expect(callback).toHaveBeenCalledWith('TOKEN_REFRESHED', mockSession);
  });

  it('should ignore irrelevant events', () => {
    let authCallback: (event: string, session: Session | null) => void = () => {};

    mockOnAuthStateChange.mockImplementation((cb) => {
      authCallback = cb;
      return {
        data: {
          subscription: { unsubscribe: vi.fn() },
        },
      };
    });

    const callback = vi.fn();
    onAuthStateChange(callback);

    // Trigger irrelevant event
    authCallback('PASSWORD_RECOVERY', null);

    // Callback should not be called for irrelevant events
    expect(callback).not.toHaveBeenCalled();
  });
});
