import type {
  ComponentCategory,
  ComponentMeta,
  PreviewComponentOutput,
  PropDefinition,
  UsageExample,
  Variant,
} from '../schemas/mcp-schemas.js';

interface FallbackComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  tier: number;
  description: string;
  props?: PropDefinition[];
  variants?: Variant[];
  subComponents?: string[];
  importStatement?: string;
  dependencies?: { internal: string[]; external: string[] };
  examples?: UsageExample[];
  accessibility?: string;
}

const web = (
  id: string,
  name: string,
  category: ComponentCategory,
  description: string,
  options: Partial<FallbackComponent> = {}
): FallbackComponent => ({
  id,
  name,
  category,
  tier: options.tier ?? (category === 'advanced' ? 3 : category === 'complex' ? 2 : 1),
  description,
  props: options.props ?? [],
  variants: options.variants,
  subComponents: options.subComponents,
  importStatement: options.importStatement ?? `import { ${name} } from '@framingui/ui';`,
  dependencies: options.dependencies ?? {
    internal: ['@framingui/ui'],
    external: ['react'],
  },
  examples: options.examples ?? [
    { title: `${name} example`, code: `import { ${name} } from '@framingui/ui';` },
  ],
  accessibility: options.accessibility ?? 'Follow FramingUI semantics and ARIA guidance.',
});

const fallbackComponents: FallbackComponent[] = [
  web('button', 'Button', 'core', 'Action button for primary and secondary actions.', {
    props: [
      { name: 'variant', type: 'string', required: false, defaultValue: 'default' },
      { name: 'size', type: 'string', required: false, defaultValue: 'default' },
      { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false' },
    ],
    variants: [
      { name: 'variant', value: 'default' },
      { name: 'variant', value: 'secondary' },
      { name: 'variant', value: 'outline' },
    ],
    examples: [
      {
        title: 'Primary button',
        code: 'import { Button } from \'@framingui/ui\';\n<Button variant="default">Continue</Button>',
      },
    ],
  }),
  web('input', 'Input', 'core', 'Single-line form input control.'),
  web('textarea', 'Textarea', 'core', 'Multi-line form input control.'),
  web('checkbox', 'Checkbox', 'core', 'Checkbox form control.'),
  web('switch', 'Switch', 'core', 'Toggle switch control.'),
  web('badge', 'Badge', 'core', 'Status label or metadata badge.'),
  web('avatar', 'Avatar', 'core', 'Avatar primitive for people and organizations.'),
  web('heading', 'Heading', 'core', 'Heading and title typography component.'),
  web('text', 'Text', 'core', 'Body and supporting typography component.'),
  web('link', 'Link', 'core', 'Navigational text link component.'),
  web('separator', 'Separator', 'core', 'Visual separator between sections or controls.'),
  web('label', 'Label', 'core', 'Form label component.'),
  web('icon', 'Icon', 'core', 'Icon wrapper for system icons.'),
  web('progress', 'Progress', 'core', 'Progress indicator component.'),
  web('slider', 'Slider', 'core', 'Range slider control.'),
  web('radio-group', 'RadioGroup', 'core', 'Single-select radio control group.'),
  web('card', 'Card', 'complex', 'Surface container with header, content, and footer slots.', {
    subComponents: ['CardHeader', 'CardContent', 'CardFooter'],
    importStatement: "import { Card, CardHeader, CardContent, CardFooter } from '@framingui/ui';",
  }),
  web('dialog', 'Dialog', 'complex', 'Modal dialog and overlay surface.', {
    description: 'Modal dialog component with overlay, trigger, and content areas.',
    subComponents: ['DialogTrigger', 'DialogContent', 'DialogHeader', 'DialogFooter'],
    importStatement:
      "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@framingui/ui';",
  }),
  web('popover', 'Popover', 'complex', 'Anchored floating surface for contextual content.'),
  web('select', 'Select', 'complex', 'Select input with trigger and option list.'),
  web('tabs', 'Tabs', 'complex', 'Tabs container for segmenting related content.'),
  web('table', 'Table', 'complex', 'Structured data table surface.'),
  web('form', 'Form', 'complex', 'Composable form wrapper and field grouping.', {
    props: [{ name: 'control', type: 'Control', required: true }],
  }),
  web('list', 'List', 'complex', 'List layout primitive for repeated rows.'),
  web('dropdown-menu', 'DropdownMenu', 'complex', 'Menu surface for contextual actions.'),
  web('navigation-menu', 'NavigationMenu', 'complex', 'Composable navigation menu surface.'),
  web('toast', 'Toast', 'complex', 'Transient feedback notification surface.'),
  web('sheet', 'Sheet', 'complex', 'Side sheet / drawer overlay surface.'),
  web('calendar', 'Calendar', 'advanced', 'Date-picker and calendar grid surface.'),
  web('command', 'Command', 'advanced', 'Command palette surface for search-driven actions.'),
  web('chart', 'Chart', 'advanced', 'Chart and visualization wrapper.'),
  web('data-table', 'DataTable', 'advanced', 'Rich data table with sorting and filtering.'),
  web('file-upload', 'FileUpload', 'advanced', 'File upload and dropzone surface.'),
];

export function listFallbackWebComponents(
  options: {
    category?: ComponentCategory | 'all';
    search?: string;
  } = {}
): ComponentMeta[] {
  const { category = 'all', search } = options;
  const lowerSearch = search?.toLowerCase();

  return fallbackComponents
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

export function getFallbackWebComponent(componentId: string): FallbackComponent | undefined {
  return fallbackComponents.find(component => component.id === componentId);
}

export function buildFallbackWebPreview(componentId: string): PreviewComponentOutput | null {
  const component = getFallbackWebComponent(componentId);
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
      props: component.props ?? [],
      variants: component.variants,
      subComponents: component.subComponents,
      importStatement:
        component.importStatement ?? `import { ${component.name} } from '@framingui/ui';`,
      dependencies: component.dependencies,
      examples: component.examples,
      accessibility: component.accessibility,
    },
  };
}
