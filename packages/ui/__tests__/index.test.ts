import { describe, expect, it } from 'vitest';

import { FramingUIProvider, Heading, Text } from '../src/index';

describe('@framingui/ui root exports', () => {
  it('exports Heading from the package root', () => {
    expect(Heading).toBeDefined();
  });

  it('exports Text from the package root', () => {
    expect(Text).toBeDefined();
  });

  it('exports FramingUIProvider from the package root', () => {
    expect(FramingUIProvider).toBeDefined();
  });
});
