/**
 * OAuth Callback Route Tests
 * SPEC-AUTH-001: Supabase 인증 통합
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '@/app/api/auth/callback/route';
import { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';

const { mockCreateOrUpdateUser } = vi.hoisted(() => ({
  mockCreateOrUpdateUser: vi.fn(),
}));

const mockExchangeCodeForSession = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  })),
}));

vi.mock('@/lib/db/users', () => ({
  createOrUpdateUser: mockCreateOrUpdateUser,
}));

describe('GET /api/auth/callback', () => {
  const validCode = 'valid-authorization-code-12345';

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns missing_code when authorization code is absent', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/callback');

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/auth/login?error=missing_code');
    expect(console.error).toHaveBeenCalledWith('[OAuth Callback] Missing authorization code');
  });

  it('passes through provider error parameters', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/auth/callback?error=access_denied&error_description=cancelled'
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/auth/login?error=access_denied');
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
  });

  it('exchanges the code, creates the user, and redirects home by default', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expires_in: 3600,
          user: mockUser,
        },
        user: mockUser,
      },
      error: null,
    });

    mockCreateOrUpdateUser.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    });

    const request = new NextRequest(`http://localhost:3000/api/auth/callback?code=${validCode}`);

    const response = await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith(validCode);
    expect(mockCreateOrUpdateUser).toHaveBeenCalledWith(mockUser);
    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toBe('http://localhost:3000/');
  });

  it('redirects to a cookie-provided internal path when present', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expires_in: 3600,
          user: mockUser,
        },
        user: mockUser,
      },
      error: null,
    });

    mockCreateOrUpdateUser.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    });

    const request = new NextRequest(`http://localhost:3000/api/auth/callback?code=${validCode}`);
    request.cookies.set('oauth_return_url', encodeURIComponent('/pricing'));

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toBe('http://localhost:3000/pricing');
  });

  it('handles exchange failure', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: {
        session: null,
        user: null,
      },
      error: {
        message: 'Invalid authorization code',
        code: '400',
        status: 400,
      },
    });

    const request = new NextRequest('http://localhost:3000/api/auth/callback?code=invalid-code');

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/auth/login?error=exchange_failed');
  });

  it('handles invalid_grant as code_expired', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: {
        session: null,
        user: null,
      },
      error: {
        message: 'Code expired',
        code: 'invalid_grant',
        status: 400,
      },
    });

    const request = new NextRequest('http://localhost:3000/api/auth/callback?code=expired-code');

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/auth/login?error=code_expired');
  });

  it('returns invalid_session when exchange succeeds without session data', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: {
        session: null,
        user: null,
      },
      error: null,
    });

    const request = new NextRequest(`http://localhost:3000/api/auth/callback?code=${validCode}`);

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/auth/login?error=invalid_session');
  });

  it('returns user_creation_failed when profile persistence returns null', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expires_in: 3600,
          user: mockUser,
        },
        user: mockUser,
      },
      error: null,
    });
    mockCreateOrUpdateUser.mockResolvedValue(null);

    const request = new NextRequest(`http://localhost:3000/api/auth/callback?code=${validCode}`);

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/auth/login?error=user_creation_failed');
  });

  it('returns database_error when profile persistence throws', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expires_in: 3600,
          user: mockUser,
        },
        user: mockUser,
      },
      error: null,
    });
    mockCreateOrUpdateUser.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest(`http://localhost:3000/api/auth/callback?code=${validCode}`);

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/auth/login?error=database_error');
  });

  it('handles unexpected errors gracefully', async () => {
    mockExchangeCodeForSession.mockRejectedValue(new Error('Unexpected network error'));

    const request = new NextRequest(`http://localhost:3000/api/auth/callback?code=${validCode}`);

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/auth/login?error=unexpected_error');
  });
});
