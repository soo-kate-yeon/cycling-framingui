import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/api/data-client.js', () => ({
  fetchComponentList: vi.fn(async () => ({
    ok: true,
    data: [
      {
        id: 'button',
        name: 'Button',
        category: 'core',
        description: 'Action button',
        variantsCount: 3,
        hasSubComponents: false,
        tier: 1,
      },
      {
        id: 'table',
        name: 'Table',
        category: 'complex',
        description: 'Tabular data layout',
        variantsCount: 1,
        hasSubComponents: true,
        tier: 2,
      },
    ],
  })),
}));

import { listComponentsTool } from '../../src/tools/list-components.js';

describe('listComponentsTool react-native platform', () => {
  it('filters out unsupported web-centric components for react-native', async () => {
    const result = await listComponentsTool({ category: 'all', platform: 'react-native' });

    expect(result.success).toBe(true);
    expect(result.components?.map(component => component.id)).toEqual(['button']);
    expect(result.components?.[0]?.platformSupport?.reactNative?.status).toBe('full');
  });
});
