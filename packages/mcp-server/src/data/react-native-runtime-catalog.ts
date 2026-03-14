import type {
  ComponentCategory,
  ComponentMeta,
  ContextComponentInfo,
  PreviewComponentOutput,
  PropDefinition,
  UsageExample,
  Variant,
} from '../schemas/mcp-schemas.js';

interface ReactNativeRuntimeComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  tier: number;
  description: string;
  importStatement: string;
  props: PropDefinition[];
  variants?: Variant[];
  examples?: UsageExample[];
  subComponents?: string[];
  accessibility?: string;
}

const RN_IMPORT = '@framingui/react-native';

const component = (
  id: string,
  name: string,
  description: string,
  options: Partial<ReactNativeRuntimeComponent> = {}
): ReactNativeRuntimeComponent => ({
  id,
  name,
  category: options.category ?? 'core',
  tier: options.tier ?? 1,
  description,
  importStatement: `import { ${name} } from '${RN_IMPORT}';`,
  props: options.props ?? [],
  variants: options.variants,
  examples: options.examples ?? [
    {
      title: `${name} example`,
      code: `import { ${name} } from '${RN_IMPORT}';`,
    },
  ],
  subComponents: options.subComponents,
  accessibility: options.accessibility,
});

const runtimeComponents: ReactNativeRuntimeComponent[] = [
  component(
    'screen',
    'Screen',
    'Top-level React Native screen container with inset and safe-area tokens.',
    {
      props: [
        { name: 'scroll', type: 'boolean', required: false, defaultValue: 'true' },
        { name: 'inset', type: "'none' | 'compact' | 'default' | 'roomy'", required: false },
        { name: 'contentWidth', type: "'full' | 'form' | 'prose'", required: false },
      ],
      category: 'complex',
      tier: 2,
    }
  ),
  component(
    'stack',
    'Stack',
    'Layout primitive for vertical or horizontal spacing with token-backed gaps.',
    {
      props: [
        { name: 'direction', type: "'row' | 'column'", required: false, defaultValue: "'column'" },
        { name: 'gap', type: 'SpacingToken', required: false },
      ],
    }
  ),
  component('section', 'Section', 'Reusable section wrapper with title and description support.', {
    category: 'complex',
    tier: 2,
  }),
  component(
    'screen-header',
    'ScreenHeader',
    'Header block for native screens with eyebrow, title, and description.',
    {
      category: 'complex',
      tier: 2,
    }
  ),
  component(
    'form-section',
    'FormSection',
    'Form-oriented section primitive with tokenized rhythm presets.',
    {
      category: 'complex',
      tier: 2,
    }
  ),
  component(
    'list-section',
    'ListSection',
    'List-oriented section primitive for settings and detail screens.',
    {
      category: 'complex',
      tier: 2,
    }
  ),
  component(
    'action-row',
    'ActionRow',
    'Horizontal action group for grouped buttons and affordances.',
    {
      props: [{ name: 'align', type: 'ViewStyle["justifyContent"]', required: false }],
    }
  ),
  component(
    'text',
    'Text',
    'Theme-aware text primitive for body, caption, label, and emphasis copy.',
    {
      props: [
        { name: 'variant', type: 'TypographyToken', required: false, defaultValue: "'body'" },
        { name: 'tone', type: 'TextTone', required: false, defaultValue: "'primary'" },
      ],
    }
  ),
  component(
    'heading',
    'Heading',
    'Theme-aware heading primitive for display, title, and section-level hierarchy.',
    {
      props: [{ name: 'level', type: "'display' | 'title' | 'sectionTitle'", required: false }],
    }
  ),
  component('button', 'Button', 'Primary and secondary action button for native flows.', {
    props: [
      { name: 'label', type: 'string', required: true },
      { name: 'variant', type: "'primary' | 'secondary'", required: false },
    ],
    variants: [
      { name: 'variant', value: 'primary' },
      { name: 'variant', value: 'secondary' },
    ],
  }),
  component(
    'icon-button',
    'IconButton',
    'Compact icon-led action button for supporting actions and dismiss affordances.'
  ),
  component('text-field', 'TextField', 'Single-line input field with invalid and focused states.', {
    props: [
      { name: 'label', type: 'string', required: false },
      { name: 'invalid', type: 'boolean', required: false },
      { name: 'focused', type: 'boolean', required: false },
    ],
  }),
  component(
    'text-area',
    'TextArea',
    'Multi-line input field for notes, descriptions, and longer form content.'
  ),
  component(
    'picker-field',
    'PickerField',
    'Token-backed selection trigger for choosing plans, teams, or filters.'
  ),
  component('checkbox', 'Checkbox', 'Checkbox control with label and optional descriptive copy.'),
  component(
    'radio-group',
    'RadioGroup',
    'Single-select radio group for cadence, billing, and preference choices.'
  ),
  component('switch', 'Switch', 'Native switch control for settings toggles and preference state.'),
  component(
    'card',
    'Card',
    'Surface container for grouped content, paywall tiles, and settings groups.',
    {
      category: 'complex',
      tier: 2,
    }
  ),
  component(
    'list-item',
    'ListItem',
    'Composable list row with leading, description, and trailing affordances.',
    {
      category: 'complex',
      tier: 2,
    }
  ),
  component('badge', 'Badge', 'Small emphasis label for status, plan tier, or membership role.'),
  component(
    'avatar',
    'Avatar',
    'Initial-based avatar primitive for profile and member list contexts.'
  ),
  component(
    'inline-message',
    'InlineMessage',
    'Feedback banner for inline warnings, errors, and supportive copy.'
  ),
  component(
    'modal',
    'Modal',
    'Explicit overlay surface for confirmation, paywall, and upgrade flows.',
    {
      category: 'advanced',
      tier: 3,
    }
  ),
  component(
    'segmented-control',
    'SegmentedControl',
    'Segment switcher for tabs-like selection on native screens.',
    {
      category: 'complex',
      tier: 2,
    }
  ),
  component(
    'empty-state',
    'EmptyState',
    'Empty-state block with title, description, and primary action.',
    {
      category: 'complex',
      tier: 2,
    }
  ),
];

const aliasMap: Record<string, string> = {
  input: 'text-field',
  textarea: 'text-area',
  select: 'picker-field',
  dialog: 'modal',
  tabs: 'segmented-control',
  alert: 'inline-message',
};

export function listReactNativeRuntimeComponents(
  options: {
    category?: ComponentCategory | 'all';
    search?: string;
  } = {}
): ComponentMeta[] {
  const { category = 'all', search } = options;
  const lowerSearch = search?.toLowerCase();

  return runtimeComponents
    .filter(component => (category === 'all' ? true : component.category === category))
    .filter(component => {
      if (!lowerSearch) {
        return true;
      }

      return (
        component.id.includes(lowerSearch) ||
        component.name.toLowerCase().includes(lowerSearch) ||
        component.description.toLowerCase().includes(lowerSearch)
      );
    })
    .map(component => ({
      id: component.id,
      name: component.name,
      category: component.category,
      description: component.description,
      variantsCount: component.variants?.length ?? 0,
      hasSubComponents: Boolean(component.subComponents?.length),
      tier: component.tier,
    }));
}

export function getReactNativeRuntimeComponent(
  componentId: string
): ReactNativeRuntimeComponent | undefined {
  const normalized = aliasMap[componentId] ?? componentId;
  return runtimeComponents.find(component => component.id === normalized);
}

export function buildReactNativePreview(componentId: string): PreviewComponentOutput | null {
  const component = getReactNativeRuntimeComponent(componentId);
  if (!component) {
    return null;
  }

  return {
    success: true,
    component: {
      id: component.id,
      name: component.name,
      category: component.category,
      description: component.description,
      tier: component.tier,
      props: component.props,
      variants: component.variants,
      subComponents: component.subComponents,
      importStatement: component.importStatement,
      dependencies: {
        internal: [],
        external: ['@framingui/react-native', 'react', 'react-native'],
      },
      examples: component.examples,
      accessibility:
        component.accessibility ??
        'Use React Native accessibilityRole and accessibilityState props where appropriate.',
    },
  };
}

export function toReactNativeContextComponent(componentId: string): ContextComponentInfo | null {
  const component = getReactNativeRuntimeComponent(componentId);
  if (!component) {
    return null;
  }

  return {
    id: component.id,
    name: component.name,
    category: component.category,
    description: component.description,
    importStatement: component.importStatement,
    props: component.props,
    variants: component.variants,
  };
}

export function recommendReactNativeRuntimeComponents(
  description: string,
  category?: string
): string[] {
  const lower = description.toLowerCase();

  if (category === 'auth' || /(login|sign up|signup|auth|password|email)/.test(lower)) {
    return [
      'screen',
      'stack',
      'screen-header',
      'form-section',
      'text-field',
      'button',
      'inline-message',
    ];
  }

  if (/(settings|notification|toggle|switch|preferences)/.test(lower)) {
    return [
      'screen',
      'stack',
      'screen-header',
      'list-section',
      'list-item',
      'switch',
      'segmented-control',
    ];
  }

  if (/(billing|paywall|pricing|upgrade|plan)/.test(lower)) {
    return [
      'screen',
      'stack',
      'card',
      'heading',
      'text',
      'segmented-control',
      'badge',
      'button',
      'modal',
    ];
  }

  if (/(empty|no data|invite|teammate|member)/.test(lower)) {
    return [
      'screen',
      'stack',
      'screen-header',
      'card',
      'list-item',
      'avatar',
      'badge',
      'empty-state',
    ];
  }

  return ['screen', 'stack', 'screen-header', 'section', 'text', 'heading', 'button', 'card'];
}
