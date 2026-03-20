import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

type RequestHandler = (request: { params: { name: string; arguments?: unknown } }) => Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}>;

const requestHandlers = new Map<object, RequestHandler>();
const connectSpy = vi.fn(async () => undefined);
const listComponentsTool = vi.fn(async () => ({
  success: true,
  components: [],
}));

vi.mock('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: class MockServer {
    setRequestHandler(schema: object, handler: RequestHandler): void {
      requestHandlers.set(schema, handler);
    }

    async connect(): Promise<void> {
      await connectSpy();
    }
  },
}));

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: class MockStdioServerTransport {},
}));

vi.mock('../src/cli/credentials.js', () => ({
  loadCredentials: vi.fn(() => null),
}));

vi.mock('../src/auth/verify.js', () => ({
  verifyApiKey: vi.fn(async () => ({
    valid: true,
    user: { id: 'quota-user', email: 'quota@example.com', plan: 'pro' },
    themes: { licensed: ['pebble'] },
  })),
}));

vi.mock('../src/tools/list-components.js', () => ({
  listComponentsTool,
}));

const AUTH_FIXTURE = {
  valid: true,
  user: {
    id: 'quota-user',
    email: 'quota@example.com',
    plan: 'pro',
  },
  themes: {
    licensed: ['pebble'],
  },
  quotaEntitlement: {
    planId: 'developer',
    status: 'active',
    includedUnits: 10,
    currentPeriodStart: '2026-04-01T00:00:00.000Z',
    currentPeriodEnd: '2026-05-01T00:00:00.000Z',
    totalAllocatedUnits: 10,
    topUpAllocatedUnits: 0,
  },
};

async function loadCallToolHandler(): Promise<RequestHandler> {
  await import('../src/index.ts');
  const handler = requestHandlers.get(CallToolRequestSchema);

  if (!handler) {
    throw new Error('CallTool handler was not registered');
  }

  return handler;
}

describe('MCP server quota enforcement', () => {
  const originalQuotaMode = process.env.FRAMINGUI_QUOTA_ENFORCEMENT;

  beforeEach(async () => {
    vi.resetModules();
    requestHandlers.clear();
    connectSpy.mockClear();
    listComponentsTool.mockClear();

    const { clearAuthData } = await import('../src/auth/state.js');
    const { resetUsageLedger } = await import('../src/billing/usage-ledger');

    clearAuthData();
    resetUsageLedger();
  });

  afterEach(async () => {
    if (originalQuotaMode) {
      process.env.FRAMINGUI_QUOTA_ENFORCEMENT = originalQuotaMode;
    } else {
      delete process.env.FRAMINGUI_QUOTA_ENFORCEMENT;
    }

    const { clearAuthData } = await import('../src/auth/state.js');
    const { resetUsageLedger } = await import('../src/billing/usage-ledger');

    clearAuthData();
    resetUsageLedger();
  });

  it('blocks a billable tool call through the request handler when hard cap mode is exceeded', async () => {
    process.env.FRAMINGUI_QUOTA_ENFORCEMENT = 'hard_cap';

    const { setAuthData } = await import('../src/auth/state.js');
    const { recordToolUsage } = await import('../src/billing/usage-ledger');

    setAuthData(AUTH_FIXTURE);
    for (let index = 0; index < 10; index += 1) {
      recordToolUsage({
        toolName: 'list-components',
        outcome: 'success',
        userId: AUTH_FIXTURE.user.id,
        plan: AUTH_FIXTURE.user.plan,
        timestamp: new Date('2026-04-15T12:00:00.000Z'),
      });
    }

    const handler = await loadCallToolHandler();
    const response = await handler({
      params: {
        name: 'list-components',
        arguments: {},
      },
    });

    expect(response.isError).toBe(true);
    expect(JSON.parse(response.content[0]?.text ?? '{}')).toMatchObject({
      success: false,
      code: 'QUOTA_EXCEEDED',
      retryable: false,
    });
    expect(listComponentsTool).not.toHaveBeenCalled();
  });

  it('returns a quota warning through the request handler in soft cap mode', async () => {
    process.env.FRAMINGUI_QUOTA_ENFORCEMENT = 'soft_cap';

    const { setAuthData } = await import('../src/auth/state.js');
    const { recordToolUsage } = await import('../src/billing/usage-ledger');

    setAuthData(AUTH_FIXTURE);
    for (let index = 0; index < 10; index += 1) {
      recordToolUsage({
        toolName: 'list-components',
        outcome: 'success',
        userId: AUTH_FIXTURE.user.id,
        plan: AUTH_FIXTURE.user.plan,
        timestamp: new Date('2026-04-15T12:00:00.000Z'),
      });
    }

    const handler = await loadCallToolHandler();
    const response = await handler({
      params: {
        name: 'list-components',
        arguments: {},
      },
    });

    expect(response.isError).toBeUndefined();
    expect(listComponentsTool).toHaveBeenCalledTimes(1);

    expect(JSON.parse(response.content[0]?.text ?? '{}')).toMatchObject({
      success: true,
      quotaWarning: expect.stringContaining('soft cap mode'),
    });
  });
});
