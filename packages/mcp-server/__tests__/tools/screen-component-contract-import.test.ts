import { describe, expect, it } from 'vitest';
import {
  getScreenComponentTypes,
  isSupportedScreenComponentType,
} from '../../src/tools/screen-component-contract.ts';

describe('screen component contract import boundary', () => {
  it('loads screen component types through the published @framingui/core export', () => {
    const types = getScreenComponentTypes();

    expect(types.length).toBeGreaterThan(0);
    expect(types).toContain('Heading');
    expect(isSupportedScreenComponentType('Text')).toBe(true);
  });
});
