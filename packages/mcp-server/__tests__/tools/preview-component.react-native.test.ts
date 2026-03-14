import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/api/data-client.js', () => ({
  fetchComponent: vi.fn(async () => ({
    ok: true,
    data: {
      id: 'button',
      name: 'Button',
      category: 'core',
      description: 'Action button',
      tier: 1,
      props: [{ name: 'variant', type: 'string', required: false }],
      variants: [{ name: 'variant', value: 'primary' }],
      subComponents: [],
      importStatement: "import { Button } from '@framingui/ui';",
      dependencies: { internal: [], external: ['@framingui/ui'] },
      examples: [{ title: 'Default', code: '<Button />' }],
      accessibility: 'Accessible action control',
    },
  })),
  fetchComponentList: vi.fn(async () => ({ ok: true, data: [] })),
}));

import { previewComponentTool } from '../../src/tools/preview-component.js';

describe('previewComponentTool react-native platform', () => {
  it('returns react-native specific support guidance and imports', async () => {
    const result = await previewComponentTool({
      componentId: 'button',
      platform: 'react-native',
      includeDependencies: true,
    });

    expect(result.success).toBe(true);
    expect(result.component?.importStatement).toBe(
      "import { Button } from '@framingui/react-native';"
    );
    expect(result.component?.platformSupport?.target).toBe('react-native');
    expect(result.component?.platformSupport?.recommended).toBe(true);
    expect(result.component?.platformSupport?.recommendedImports).toContain(
      '@framingui/react-native'
    );
    expect(result.component?.dependencies?.external).toContain('@framingui/react-native');
    expect(result.component?.dependencies?.external).toContain('react-native');
  });
});
