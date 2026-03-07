interface McpServerConfig {
  type: 'stdio';
  command: string;
  args: string[];
}

export interface McpConfig {
  mcpServers?: Record<string, unknown>;
}

export function getCanonicalFraminguiServerConfig(): McpServerConfig {
  return {
    type: 'stdio',
    command: 'npx',
    args: ['-y', '@framingui/mcp-server@latest'],
  };
}

export function isFraminguiServerConfigOutdated(config: unknown): boolean {
  if (!config || typeof config !== 'object') {
    return true;
  }

  const candidate = config as Partial<McpServerConfig>;
  const expected = getCanonicalFraminguiServerConfig();

  if (candidate.type !== expected.type || candidate.command !== expected.command) {
    return true;
  }

  if (!Array.isArray(candidate.args) || candidate.args.length !== expected.args.length) {
    return true;
  }

  return expected.args.some((arg, index) => candidate.args?.[index] !== arg);
}

export function upsertFraminguiServerConfig(config: McpConfig): {
  config: McpConfig;
  created: boolean;
  updated: boolean;
} {
  const nextConfig: McpConfig = {
    ...config,
    mcpServers: {
      ...(config.mcpServers ?? {}),
    },
  };

  const created = !('framingui' in nextConfig.mcpServers!);
  const updated = created || isFraminguiServerConfigOutdated(nextConfig.mcpServers!.framingui);

  if (updated) {
    nextConfig.mcpServers!.framingui = getCanonicalFraminguiServerConfig();
  }

  return {
    config: nextConfig,
    created,
    updated,
  };
}
