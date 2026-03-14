import { packageId } from '../src/index.js';

describe('@framingui/react-native package scaffold', () => {
  it('exports a loadable entrypoint', () => {
    expect(packageId).toBe('@framingui/react-native');
  });
});
