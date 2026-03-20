import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BillingPage from '@/app/settings/billing/page';

const { mockUseAuth } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

describe('BillingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
    });
  });

  it('renders quota overview from the quota API', async () => {
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);

      if (url === '/api/user/licenses') {
        return {
          ok: true,
          json: async () => ({ licenses: [] }),
        } as Response;
      }

      if (url === '/api/user/quota') {
        return {
          ok: true,
          json: async () => ({
            quota: {
              entitlement: {
                id: 'qe_1',
                user_id: 'user-1',
                plan_id: 'developer',
                status: 'active',
                included_units: 2000,
                current_period_start: '2026-04-01T00:00:00.000Z',
                current_period_end: '2026-05-01T00:00:00.000Z',
                paddle_subscription_id: 'sub_1',
                created_at: '2026-03-20T00:00:00.000Z',
                updated_at: '2026-03-20T00:00:00.000Z',
              },
              total_allocated_units: 3000,
              plan_allocated_units: 2000,
              top_up_allocated_units: 1000,
              latest_allocation_at: '2026-04-05T00:00:00.000Z',
              legacy_transition_allowance: null,
            },
          }),
        } as Response;
      }

      if (url === '/api/user/usage') {
        return {
          ok: true,
          json: async () => ({
            usage: {
              total_used_units: 8,
              total_calls: 3,
              by_tool_class: [
                { tool_class: 'guarded', used_units: 6, calls: 1 },
                { tool_class: 'discovery', used_units: 2, calls: 2 },
              ],
              latest_event_at: '2026-03-20T02:00:00.000Z',
            },
          }),
        } as Response;
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    render(<BillingPage />);

    await waitFor(() => {
      expect(screen.getByText('Quota Overview')).toBeInTheDocument();
      expect(screen.getByText('developer')).toBeInTheDocument();
      expect(screen.getByText('3,000')).toBeInTheDocument();
      expect(screen.getByText('1,000')).toBeInTheDocument();
      expect(screen.getByText('Usage Breakdown')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('Guarded Validation')).toBeInTheDocument();
    });
  });

  it('renders a legacy migration allowance for grandfathered creator customers', async () => {
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);

      if (url === '/api/user/licenses') {
        return {
          ok: true,
          json: async () => ({
            licenses: [
              {
                id: 'lic_1',
                user_id: 'user-1',
                theme_id: 'creator-all-access',
                tier: 'creator',
                paddle_subscription_id: 'sub_legacy',
                purchased_at: '2026-01-01T00:00:00.000Z',
                expires_at: '2026-12-31T00:00:00.000Z',
                is_active: true,
              },
            ],
          }),
        } as Response;
      }

      if (url === '/api/user/quota') {
        return {
          ok: true,
          json: async () => ({
            quota: {
              entitlement: null,
              total_allocated_units: 0,
              plan_allocated_units: 0,
              top_up_allocated_units: 0,
              latest_allocation_at: null,
              legacy_transition_allowance: {
                source: 'creator_all_access',
                units: 2000,
                description:
                  'Grandfathered transition allowance for legacy all-access customers while quota plans roll out.',
              },
            },
          }),
        } as Response;
      }

      if (url === '/api/user/usage') {
        return {
          ok: true,
          json: async () => ({
            usage: {
              total_used_units: 0,
              total_calls: 0,
              by_tool_class: [],
              latest_event_at: null,
            },
          }),
        } as Response;
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    render(<BillingPage />);

    await waitFor(() => {
      expect(screen.getByText('Legacy Migration Allowance')).toBeInTheDocument();
      expect(screen.getByText('2,000')).toBeInTheDocument();
    });
  });
});
