import { describe, expect, it } from 'vitest';
import {
  getPlatformSupportInfo,
  getReactNativeAuditRules,
  getSupportedPlatforms,
} from '../platform-support.js';
import {
  GetScreenGenerationContextInputSchema,
  ListComponentsInputSchema,
  PreviewComponentInputSchema,
  ValidateEnvironmentInputSchema,
} from '../schemas/mcp-schemas.js';

describe('React Native direct-write contract', () => {
  it('exposes web and react-native platform targets', () => {
    expect(getSupportedPlatforms()).toEqual(['web', 'react-native']);
  });

  it('marks primitive components as recommended for react-native direct write', () => {
    const info = getPlatformSupportInfo('Button', 'react-native');

    expect(info.supported).toBe(true);
    expect(info.recommended).toBe(true);
    expect(info.status).toBe('full');
    expect(info.recommendedImports).toContain('react-native');
  });

  it('marks web-centric components as avoid for react-native direct write', () => {
    const info = getPlatformSupportInfo('Table', 'react-native');

    expect(info.supported).toBe(false);
    expect(info.status).toBe('avoid');
    expect(info.notes[0]).toContain('web-only');
  });

  it('defines react-native audit rules for direct-write qc', () => {
    const rules = getReactNativeAuditRules();

    expect(rules.map(rule => rule.id)).toEqual([
      'rn-hardcoded-color',
      'rn-hardcoded-spacing',
      'rn-web-classname',
    ]);
  });

  it('accepts react-native as a schema input target', () => {
    expect(ListComponentsInputSchema.parse({ platform: 'react-native' }).platform).toBe(
      'react-native'
    );
    expect(
      PreviewComponentInputSchema.parse({ componentId: 'button', platform: 'react-native' })
        .platform
    ).toBe('react-native');
    expect(
      GetScreenGenerationContextInputSchema.parse({
        description: 'profile screen',
        platform: 'react-native',
      }).platform
    ).toBe('react-native');
    expect(
      ValidateEnvironmentInputSchema.parse({
        projectPath: '/tmp/project',
        requiredPackages: [],
        platform: 'react-native',
        sourceFiles: ['/tmp/App.tsx'],
      }).platform
    ).toBe('react-native');
  });
});
