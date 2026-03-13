export const PLATFORM_TARGETS = ['web', 'react-native'] as const;

export type PlatformTarget = (typeof PLATFORM_TARGETS)[number];

export interface DirectWriteAuditRule {
  id: string;
  severity: 'warning' | 'error';
  description: string;
  pattern: RegExp;
  guidance: string;
}

export interface PlatformSupportInfo {
  supported: boolean;
  recommended: boolean;
  status: 'full' | 'partial' | 'avoid';
  notes: string[];
  recommendedImports: string[];
  recommendedPackages: string[];
}

const REACT_NATIVE_SUPPORTED_COMPONENTS = new Set([
  'Button',
  'Input',
  'Text',
  'Heading',
  'Checkbox',
  'Radio',
  'Switch',
  'Slider',
  'Badge',
  'Avatar',
  'Card',
  'List',
  'Image',
  'Progress',
]);

const REACT_NATIVE_PARTIAL_COMPONENTS = new Set(['Form', 'Link']);

const REACT_NATIVE_AVOID_COMPONENTS = new Set(['Modal', 'Tabs', 'Table', 'Dropdown']);

const REACT_NATIVE_RECOMMENDED_PACKAGES = ['react-native', 'react-native-safe-area-context'];

const REACT_NATIVE_IMPORT_STATEMENTS: Record<string, string> = {
  Avatar: "import { Image, View } from 'react-native';",
  Badge: "import { Text, View } from 'react-native';",
  Button: "import { Pressable, Text } from 'react-native';",
  Card: "import { View } from 'react-native';",
  Checkbox: "import { Pressable, View } from 'react-native';",
  Form: "import { View } from 'react-native';",
  Heading: "import { Text } from 'react-native';",
  Image: "import { Image } from 'react-native';",
  Input: "import { TextInput } from 'react-native';",
  Link: "import { Pressable, Text } from 'react-native';",
  List: "import { FlatList, View } from 'react-native';",
  Progress: "import { View } from 'react-native';",
  Radio: "import { Pressable, View } from 'react-native';",
  Slider: "import { View } from 'react-native';",
  Switch: "import { Switch } from 'react-native';",
  Text: "import { Text } from 'react-native';",
};

const REACT_NATIVE_AUDIT_RULES: DirectWriteAuditRule[] = [
  {
    id: 'rn-hardcoded-color',
    severity: 'warning',
    description: 'Hardcoded color literal found in a React Native style object',
    pattern: /#[0-9a-fA-F]{3,8}\b|rgba?\(/,
    guidance: 'Replace raw colors with theme or token-backed helpers before handoff.',
  },
  {
    id: 'rn-hardcoded-spacing',
    severity: 'warning',
    description: 'Hardcoded spacing or radius value found in a style declaration',
    pattern:
      /\b(?:margin|padding|gap|top|right|bottom|left|width|height|minWidth|minHeight|maxWidth|maxHeight|borderRadius)\s*:\s*(?:[1-9]\d?|\d{3,})\b/,
    guidance: 'Replace raw spacing and radius values with token-backed spacing helpers.',
  },
  {
    id: 'rn-web-classname',
    severity: 'error',
    description: 'Web-only className usage found in a React Native target file',
    pattern: /\bclassName\s*=/,
    guidance:
      'Use style/style arrays or host app abstractions instead of className in React Native.',
  },
];

export function getSupportedPlatforms(): PlatformTarget[] {
  return [...PLATFORM_TARGETS];
}

export function getPlatformSupportInfo(
  componentName: string,
  platform: PlatformTarget = 'web'
): PlatformSupportInfo {
  if (platform === 'web') {
    return {
      supported: true,
      recommended: true,
      status: 'full',
      notes: ['Use the published FramingUI React components and detected style contract.'],
      recommendedImports: ['@framingui/ui'],
      recommendedPackages: ['@framingui/ui'],
    };
  }

  if (REACT_NATIVE_SUPPORTED_COMPONENTS.has(componentName)) {
    return {
      supported: true,
      recommended: true,
      status: 'full',
      notes: [
        'Write this component directly using React Native primitives or existing app abstractions.',
        'Keep FramingUI as the contract and QC layer rather than importing @framingui/ui.',
      ],
      recommendedImports: ['react-native'],
      recommendedPackages: REACT_NATIVE_RECOMMENDED_PACKAGES,
    };
  }

  if (REACT_NATIVE_PARTIAL_COMPONENTS.has(componentName)) {
    return {
      supported: true,
      recommended: false,
      status: 'partial',
      notes: [
        'This component needs app-specific composition in React Native.',
        'Prefer composing from primitive building blocks instead of assuming web parity.',
      ],
      recommendedImports: ['react-native'],
      recommendedPackages: REACT_NATIVE_RECOMMENDED_PACKAGES,
    };
  }

  if (REACT_NATIVE_AVOID_COMPONENTS.has(componentName)) {
    return {
      supported: false,
      recommended: false,
      status: 'avoid',
      notes: [
        'This component depends on web-only interaction or layout assumptions in the current FramingUI catalog.',
        'Model the UX using native navigation, bottom sheets, or app-specific abstractions instead.',
      ],
      recommendedImports: ['react-native'],
      recommendedPackages: REACT_NATIVE_RECOMMENDED_PACKAGES,
    };
  }

  return {
    supported: false,
    recommended: false,
    status: 'avoid',
    notes: ['No React Native contract is defined yet for this component.'],
    recommendedImports: ['react-native'],
    recommendedPackages: REACT_NATIVE_RECOMMENDED_PACKAGES,
  };
}

export function getReactNativeAuditRules(): DirectWriteAuditRule[] {
  return [...REACT_NATIVE_AUDIT_RULES];
}

export function getImportStatementForPlatform(
  componentName: string,
  platform: PlatformTarget = 'web'
): string {
  if (platform === 'web') {
    return `import { ${componentName} } from '@framingui/ui';`;
  }

  return REACT_NATIVE_IMPORT_STATEMENTS[componentName] || "import { View } from 'react-native';";
}
