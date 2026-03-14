import type { PlatformTarget } from './schemas/mcp-schemas.js';
import { getActiveProjectContext } from './project-context-state.js';

export interface ResolvedPlatformTarget {
  platform: PlatformTarget;
  source: 'explicit' | 'session-default' | 'legacy-fallback';
}

export function resolvePlatformTarget(explicitPlatform?: PlatformTarget): ResolvedPlatformTarget {
  if (explicitPlatform) {
    return {
      platform: explicitPlatform,
      source: 'explicit',
    };
  }

  const activeProjectContext = getActiveProjectContext();
  if (activeProjectContext) {
    return {
      platform: activeProjectContext.platform,
      source: 'session-default',
    };
  }

  return {
    platform: 'web',
    source: 'legacy-fallback',
  };
}
