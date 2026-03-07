import { describe, expect, it } from 'vitest';
import {
  getCanonicalFraminguiServerConfig,
  isFraminguiServerConfigOutdated,
  upsertFraminguiServerConfig,
} from '../../src/cli/mcp-config.ts';

describe('mcp config helpers', () => {
  it('returns the canonical latest stdio config', () => {
    expect(getCanonicalFraminguiServerConfig()).toEqual({
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@framingui/mcp-server@latest'],
    });
  });

  it('marks pinned or incomplete framingui configs as outdated', () => {
    expect(
      isFraminguiServerConfigOutdated({
        type: 'stdio',
        command: 'npx',
        args: ['@framingui/mcp-server@0.6.1'],
      })
    ).toBe(true);

    expect(
      isFraminguiServerConfigOutdated({
        type: 'stdio',
        command: 'npx',
        args: ['-y', '@framingui/mcp-server@latest'],
      })
    ).toBe(false);
  });

  it('upserts framingui config without removing other MCP servers', () => {
    const result = upsertFraminguiServerConfig({
      mcpServers: {
        context7: {
          type: 'stdio',
          command: 'npx',
          args: ['-y', '@upstash/context7-mcp@latest'],
        },
        framingui: {
          type: 'stdio',
          command: 'npx',
          args: ['@framingui/mcp-server@0.6.1'],
        },
      },
    });

    expect(result.created).toBe(false);
    expect(result.updated).toBe(true);
    expect(result.config.mcpServers?.context7).toBeDefined();
    expect(result.config.mcpServers?.framingui).toEqual(getCanonicalFraminguiServerConfig());
  });
});
