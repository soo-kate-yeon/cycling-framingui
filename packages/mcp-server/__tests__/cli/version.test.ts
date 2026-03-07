import { describe, expect, it } from 'vitest';
import { getCliVersion } from '../../src/cli/version.ts';
import pkg from '../../package.json';

describe('cli version', () => {
  it('reads the package version without starting the MCP server', () => {
    expect(getCliVersion()).toBe(pkg.version);
  });
});
