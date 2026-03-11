import { describe, expect, it } from 'vitest';

import { Heading, Text } from '../src/index';

describe('@framingui/ui root exports', () => {
  it('exports Heading from the package root', () => {
    expect(Heading).toBeDefined();
  });

  it('exports Text from the package root', () => {
    expect(Text).toBeDefined();
  });
});
