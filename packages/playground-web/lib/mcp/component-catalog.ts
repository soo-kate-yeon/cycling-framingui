import { SCREEN_COMPONENT_TYPES } from '../../../core/src/screen-generation/types';

type ScreenComponentType = (typeof SCREEN_COMPONENT_TYPES)[number];

export type McpComponentCategory = 'core' | 'complex' | 'advanced';

export interface McpComponentCatalogItem {
  id: string;
  name: ScreenComponentType;
  category: McpComponentCategory;
  tier: 1 | 2 | 3;
  description: string;
  variantsCount: number;
  hasSubComponents: boolean;
}

interface McpComponentDetailData {
  props: Array<{
    name: string;
    type: string;
    required: boolean;
    defaultValue?: string;
    description: string;
  }>;
  uiImportName?: string;
  subComponents?: string[];
  dependencies?: {
    internal: string[];
    external: string[];
  };
  examples?: Array<{
    title: string;
    code: string;
    description: string;
  }>;
  accessibility?: string;
}

type ComponentRecord = McpComponentCatalogItem & McpComponentDetailData;

const COMPONENT_RECORDS: Record<ScreenComponentType, ComponentRecord> = {
  Button: {
    id: 'button',
    name: 'Button',
    category: 'core',
    tier: 1,
    description: 'Interactive action trigger with variant and size support.',
    variantsCount: 6,
    hasSubComponents: false,
    props: [
      {
        name: 'variant',
        type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
        required: false,
        defaultValue: "'default'",
        description: 'Visual style variant.',
      },
      {
        name: 'size',
        type: "'default' | 'sm' | 'lg' | 'icon'",
        required: false,
        defaultValue: "'default'",
        description: 'Button size.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: false,
        description: 'Visible button label or nested content.',
      },
    ],
    uiImportName: 'Button',
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Primary Action',
        code: `import { Button } from '@framingui/ui';\n\n<Button size="lg">Publish</Button>`,
        description: 'Default CTA button.',
      },
    ],
    accessibility: 'Use descriptive button text and preserve focus-visible styles.',
  },
  Input: {
    id: 'input',
    name: 'Input',
    category: 'core',
    tier: 1,
    description: 'Single-line text input for forms and inline editing.',
    variantsCount: 1,
    hasSubComponents: false,
    props: [
      {
        name: 'type',
        type: 'string',
        required: false,
        defaultValue: "'text'",
        description: 'HTML input type.',
      },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text.' },
      { name: 'value', type: 'string', required: false, description: 'Controlled input value.' },
    ],
    uiImportName: 'Input',
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Email Field',
        code: `import { Input } from '@framingui/ui';\n\n<Input type="email" placeholder="name@example.com" />`,
        description: 'Basic email input.',
      },
    ],
    accessibility: 'Always pair with a visible or programmatic label.',
  },
  Text: {
    id: 'text',
    name: 'Text',
    category: 'core',
    tier: 1,
    description: 'Body copy primitive for paragraphs, captions, and support text.',
    variantsCount: 3,
    hasSubComponents: false,
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Text content to render.',
      },
      {
        name: 'as',
        type: 'ElementType',
        required: false,
        defaultValue: "'p'",
        description: 'Semantic element override.',
      },
      {
        name: 'tone',
        type: 'string',
        required: false,
        description: 'Semantic text tone or variant.',
      },
    ],
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Muted Body Copy',
        code: `// Screen contract primitive\n<Text>Short explanatory content goes here.</Text>`,
        description: 'Basic body text usage.',
      },
    ],
    accessibility: 'Choose semantic tags that match the reading structure.',
  },
  Heading: {
    id: 'heading',
    name: 'Heading',
    category: 'core',
    tier: 1,
    description: 'Typographic heading primitive for section and page titles.',
    variantsCount: 4,
    hasSubComponents: false,
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Heading text.' },
      {
        name: 'level',
        type: '1 | 2 | 3 | 4 | 5 | 6',
        required: false,
        defaultValue: '2',
        description: 'Semantic heading level.',
      },
      {
        name: 'align',
        type: "'left' | 'center' | 'right'",
        required: false,
        description: 'Text alignment.',
      },
    ],
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Section Heading',
        code: `// Screen contract primitive\n<Heading level={2}>Recent activity</Heading>`,
        description: 'Section-level heading.',
      },
    ],
    accessibility: 'Maintain sequential heading levels across the page.',
  },
  Checkbox: {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'core',
    tier: 1,
    description: 'Boolean selection control with checked and indeterminate states.',
    variantsCount: 1,
    hasSubComponents: false,
    props: [
      {
        name: 'checked',
        type: 'boolean',
        required: false,
        description: 'Controlled checked state.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Disabled state.',
      },
      {
        name: 'onCheckedChange',
        type: '(checked: boolean) => void',
        required: false,
        description: 'Change callback.',
      },
    ],
    uiImportName: 'Checkbox',
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Consent Checkbox',
        code: `import { Checkbox } from '@framingui/ui';\n\n<Checkbox aria-label="Accept terms" />`,
        description: 'Standalone checkbox input.',
      },
    ],
    accessibility: 'Attach an accessible label and expose checked state.',
  },
  Radio: {
    id: 'radio',
    name: 'Radio',
    category: 'core',
    tier: 1,
    description: 'Single-select choice control rendered as a radio group.',
    variantsCount: 1,
    hasSubComponents: true,
    props: [
      { name: 'value', type: 'string', required: false, description: 'Current selected value.' },
      {
        name: 'defaultValue',
        type: 'string',
        required: false,
        description: 'Initial selected value.',
      },
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        required: false,
        description: 'Selection callback.',
      },
    ],
    uiImportName: 'RadioGroup',
    subComponents: ['RadioGroupItem'],
    dependencies: { internal: [], external: ['@radix-ui/react-radio-group'] },
    examples: [
      {
        title: 'Radio Group',
        code: `import { RadioGroup, RadioGroupItem } from '@framingui/ui';\n\n<RadioGroup defaultValue="starter">\n  <RadioGroupItem value="starter" />\n</RadioGroup>`,
        description: 'Single-selection radio group.',
      },
    ],
    accessibility: 'Use grouped labels and preserve arrow-key navigation.',
  },
  Switch: {
    id: 'switch',
    name: 'Switch',
    category: 'core',
    tier: 1,
    description: 'Binary on/off toggle for immediate settings changes.',
    variantsCount: 1,
    hasSubComponents: false,
    props: [
      {
        name: 'checked',
        type: 'boolean',
        required: false,
        description: 'Controlled switch state.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Disabled state.',
      },
      {
        name: 'onCheckedChange',
        type: '(checked: boolean) => void',
        required: false,
        description: 'Toggle callback.',
      },
    ],
    uiImportName: 'Switch',
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Notification Toggle',
        code: `import { Switch } from '@framingui/ui';\n\n<Switch aria-label="Enable notifications" />`,
        description: 'Settings toggle.',
      },
    ],
    accessibility: 'Use clear labels that describe the toggled state.',
  },
  Slider: {
    id: 'slider',
    name: 'Slider',
    category: 'complex',
    tier: 2,
    description: 'Range selector for continuous numeric input.',
    variantsCount: 1,
    hasSubComponents: false,
    props: [
      { name: 'value', type: 'number[]', required: false, description: 'Controlled slider value.' },
      {
        name: 'min',
        type: 'number',
        required: false,
        defaultValue: '0',
        description: 'Minimum value.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        defaultValue: '100',
        description: 'Maximum value.',
      },
    ],
    dependencies: { internal: [], external: ['@radix-ui/react-slider'] },
    examples: [
      {
        title: 'Volume Slider',
        code: `// Screen contract primitive\n<Slider value={[40]} />`,
        description: 'Numeric range control.',
      },
    ],
    accessibility: 'Expose labels and current value to assistive technologies.',
  },
  Badge: {
    id: 'badge',
    name: 'Badge',
    category: 'core',
    tier: 1,
    description: 'Compact status or taxonomy label.',
    variantsCount: 4,
    hasSubComponents: false,
    props: [
      {
        name: 'variant',
        type: "'default' | 'secondary' | 'destructive' | 'outline'",
        required: false,
        defaultValue: "'default'",
        description: 'Visual badge style.',
      },
      { name: 'children', type: 'ReactNode', required: true, description: 'Badge content.' },
    ],
    uiImportName: 'Badge',
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Status Badge',
        code: `import { Badge } from '@framingui/ui';\n\n<Badge variant="secondary">Draft</Badge>`,
        description: 'Inline status label.',
      },
    ],
    accessibility: 'Do not rely on color alone to communicate meaning.',
  },
  Avatar: {
    id: 'avatar',
    name: 'Avatar',
    category: 'core',
    tier: 1,
    description: 'User or entity avatar with image and fallback content.',
    variantsCount: 1,
    hasSubComponents: true,
    props: [
      { name: 'src', type: 'string', required: false, description: 'Avatar image URL.' },
      {
        name: 'alt',
        type: 'string',
        required: false,
        description: 'Alternative text for the image.',
      },
      {
        name: 'fallback',
        type: 'string',
        required: false,
        description: 'Fallback initials or label.',
      },
    ],
    uiImportName: 'Avatar',
    subComponents: ['AvatarImage', 'AvatarFallback'],
    dependencies: { internal: [], external: ['@radix-ui/react-avatar'] },
    examples: [
      {
        title: 'User Avatar',
        code: `import { Avatar, AvatarImage, AvatarFallback } from '@framingui/ui';\n\n<Avatar>\n  <AvatarImage src="/profile.png" alt="User avatar" />\n  <AvatarFallback>SY</AvatarFallback>\n</Avatar>`,
        description: 'Image avatar with fallback.',
      },
    ],
    accessibility: 'Provide useful alt text or a meaningful fallback label.',
  },
  Card: {
    id: 'card',
    name: 'Card',
    category: 'complex',
    tier: 2,
    description: 'Structured surface for grouped content and actions.',
    variantsCount: 1,
    hasSubComponents: true,
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes.',
      },
      { name: 'children', type: 'ReactNode', required: false, description: 'Nested card content.' },
    ],
    uiImportName: 'Card',
    subComponents: ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'],
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Summary Card',
        code: `import { Card, CardHeader, CardTitle, CardContent } from '@framingui/ui';\n\n<Card>\n  <CardHeader>\n    <CardTitle>Weekly traffic</CardTitle>\n  </CardHeader>\n  <CardContent>24% up from last week</CardContent>\n</Card>`,
        description: 'Card with header and body copy.',
      },
    ],
    accessibility: 'Use semantic headings inside the card for scannability.',
  },
  Modal: {
    id: 'modal',
    name: 'Modal',
    category: 'complex',
    tier: 2,
    description: 'Focused overlay dialog for blocking tasks and confirmations.',
    variantsCount: 1,
    hasSubComponents: true,
    props: [
      { name: 'open', type: 'boolean', required: false, description: 'Controlled open state.' },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        required: false,
        description: 'Open state callback.',
      },
      { name: 'children', type: 'ReactNode', required: false, description: 'Dialog content.' },
    ],
    uiImportName: 'Dialog',
    subComponents: [
      'DialogTrigger',
      'DialogContent',
      'DialogHeader',
      'DialogTitle',
      'DialogDescription',
    ],
    dependencies: { internal: [], external: ['@radix-ui/react-dialog'] },
    examples: [
      {
        title: 'Confirmation Modal',
        code: `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@framingui/ui';\n\n<Dialog>\n  <DialogTrigger asChild>\n    <Button>Open</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Confirm change</DialogTitle>\n    </DialogHeader>\n  </DialogContent>\n</Dialog>`,
        description: 'Dialog-backed modal surface.',
      },
    ],
    accessibility: 'Trap focus while open and restore it on close.',
  },
  Tabs: {
    id: 'tabs',
    name: 'Tabs',
    category: 'complex',
    tier: 2,
    description: 'Tabbed interface for switching between related panels.',
    variantsCount: 1,
    hasSubComponents: true,
    props: [
      { name: 'value', type: 'string', required: false, description: 'Controlled active tab.' },
      { name: 'defaultValue', type: 'string', required: false, description: 'Initial active tab.' },
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        required: false,
        description: 'Tab change callback.',
      },
    ],
    uiImportName: 'Tabs',
    subComponents: ['TabsList', 'TabsTrigger', 'TabsContent'],
    dependencies: { internal: [], external: ['@radix-ui/react-tabs'] },
    examples: [
      {
        title: 'Content Tabs',
        code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@framingui/ui';\n\n<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">Overview</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">Panel content</TabsContent>\n</Tabs>`,
        description: 'Basic tab set.',
      },
    ],
    accessibility: 'Support keyboard navigation between triggers and panels.',
  },
  Table: {
    id: 'table',
    name: 'Table',
    category: 'complex',
    tier: 2,
    description: 'Structured data table with semantic rows and cells.',
    variantsCount: 1,
    hasSubComponents: true,
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: false,
        description: 'Table structure and rows.',
      },
      { name: 'caption', type: 'string', required: false, description: 'Optional table caption.' },
    ],
    uiImportName: 'Table',
    subComponents: [
      'TableHeader',
      'TableBody',
      'TableRow',
      'TableHead',
      'TableCell',
      'TableCaption',
    ],
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Simple Table',
        code: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@framingui/ui';\n\n<Table>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Name</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow>\n      <TableCell>FramingUI</TableCell>\n    </TableRow>\n  </TableBody>\n</Table>`,
        description: 'Semantic table layout.',
      },
    ],
    accessibility: 'Use headers and captions for readable data relationships.',
  },
  Link: {
    id: 'link',
    name: 'Link',
    category: 'core',
    tier: 1,
    description: 'Inline or standalone navigation link primitive.',
    variantsCount: 2,
    hasSubComponents: false,
    props: [
      { name: 'href', type: 'string', required: true, description: 'Destination URL.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Visible link label.' },
      { name: 'target', type: 'string', required: false, description: 'Navigation target.' },
    ],
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Inline Link',
        code: `// Screen contract primitive\n<Link href="/pricing">View pricing</Link>`,
        description: 'Simple navigational link.',
      },
    ],
    accessibility: 'Make the destination clear from the visible label.',
  },
  List: {
    id: 'list',
    name: 'List',
    category: 'complex',
    tier: 2,
    description: 'Structured ordered or unordered collection of related items.',
    variantsCount: 2,
    hasSubComponents: false,
    props: [
      {
        name: 'items',
        type: 'unknown[]',
        required: false,
        description: 'Source items for the list.',
      },
      {
        name: 'ordered',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Ordered list mode.',
      },
      { name: 'children', type: 'ReactNode', required: false, description: 'Manual list content.' },
    ],
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Feature List',
        code: `// Screen contract primitive\n<List>\n  <Text>Fast setup</Text>\n</List>`,
        description: 'Grouped list content.',
      },
    ],
    accessibility: 'Use ordered lists only when sequence carries meaning.',
  },
  Image: {
    id: 'image',
    name: 'Image',
    category: 'core',
    tier: 1,
    description: 'Responsive image primitive for content and media surfaces.',
    variantsCount: 1,
    hasSubComponents: false,
    props: [
      { name: 'src', type: 'string', required: true, description: 'Image source URL.' },
      { name: 'alt', type: 'string', required: true, description: 'Alternative text.' },
      {
        name: 'aspectRatio',
        type: 'string',
        required: false,
        description: 'Preferred aspect ratio.',
      },
    ],
    dependencies: { internal: [], external: [] },
    examples: [
      {
        title: 'Hero Image',
        code: `// Screen contract primitive\n<Image src="/hero.jpg" alt="Product preview" />`,
        description: 'Responsive media asset.',
      },
    ],
    accessibility: 'Provide useful alt text or mark decorative images accordingly.',
  },
  Form: {
    id: 'form',
    name: 'Form',
    category: 'complex',
    tier: 2,
    description: 'Structured input workflow with validation and messaging.',
    variantsCount: 1,
    hasSubComponents: true,
    props: [
      {
        name: 'onSubmit',
        type: '(event: FormEvent) => void',
        required: false,
        description: 'Submit handler.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: false,
        description: 'Form fields and actions.',
      },
    ],
    uiImportName: 'Form',
    subComponents: ['FormField', 'FormItem', 'FormLabel', 'FormControl', 'FormMessage'],
    dependencies: { internal: [], external: ['react-hook-form'] },
    examples: [
      {
        title: 'Basic Form',
        code: `// Screen contract primitive\n<Form>\n  <Input placeholder="Email address" />\n</Form>`,
        description: 'Input workflow wrapper.',
      },
    ],
    accessibility: 'Associate errors, descriptions, and labels with each field.',
  },
  Dropdown: {
    id: 'dropdown',
    name: 'Dropdown',
    category: 'complex',
    tier: 2,
    description: 'Anchored action menu for contextual item groups.',
    variantsCount: 1,
    hasSubComponents: true,
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: false,
        description: 'Trigger and menu content.',
      },
      { name: 'open', type: 'boolean', required: false, description: 'Controlled open state.' },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        required: false,
        description: 'Open state callback.',
      },
    ],
    uiImportName: 'DropdownMenu',
    subComponents: [
      'DropdownMenuTrigger',
      'DropdownMenuContent',
      'DropdownMenuItem',
      'DropdownMenuSeparator',
    ],
    dependencies: { internal: [], external: ['@radix-ui/react-dropdown-menu'] },
    examples: [
      {
        title: 'Action Dropdown',
        code: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@framingui/ui';\n\n<DropdownMenu>\n  <DropdownMenuTrigger asChild>\n    <Button>Menu</Button>\n  </DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem>Edit</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`,
        description: 'Contextual actions menu.',
      },
    ],
    accessibility: 'Preserve focus management and arrow-key navigation.',
  },
  Progress: {
    id: 'progress',
    name: 'Progress',
    category: 'complex',
    tier: 2,
    description: 'Linear progress indicator for completion state.',
    variantsCount: 1,
    hasSubComponents: false,
    props: [
      { name: 'value', type: 'number', required: false, description: 'Current progress value.' },
      {
        name: 'max',
        type: 'number',
        required: false,
        defaultValue: '100',
        description: 'Maximum progress value.',
      },
    ],
    uiImportName: 'Progress',
    dependencies: { internal: [], external: ['@radix-ui/react-progress'] },
    examples: [
      {
        title: 'Upload Progress',
        code: `import { Progress } from '@framingui/ui';\n\n<Progress value={72} />`,
        description: 'Linear progress bar.',
      },
    ],
    accessibility: 'Expose the current value and overall range to assistive tech.',
  },
};

export const MCP_COMPONENT_CATALOG: McpComponentCatalogItem[] = SCREEN_COMPONENT_TYPES.map(
  (componentType) => {
    const record = COMPONENT_RECORDS[componentType];
    return {
      id: record.id,
      name: record.name,
      category: record.category,
      tier: record.tier,
      description: record.description,
      variantsCount: record.variantsCount,
      hasSubComponents: record.hasSubComponents,
    };
  }
);

export function getMcpComponentCatalog(): McpComponentCatalogItem[] {
  return [...MCP_COMPONENT_CATALOG];
}

export function getMcpComponentCategories(): Record<McpComponentCategory, number> {
  return {
    core: MCP_COMPONENT_CATALOG.filter((component) => component.category === 'core').length,
    complex: MCP_COMPONENT_CATALOG.filter((component) => component.category === 'complex').length,
    advanced: MCP_COMPONENT_CATALOG.filter((component) => component.category === 'advanced').length,
  };
}

export function getMcpComponentById(componentId: string) {
  const record = Object.values(COMPONENT_RECORDS).find((component) => component.id === componentId);
  if (!record) {
    return null;
  }

  const importName = record.uiImportName ?? record.name;
  const importStatement = record.subComponents?.length
    ? `import { ${importName}, ${record.subComponents.join(', ')} } from '@framingui/ui';`
    : `import { ${importName} } from '@framingui/ui';`;

  return {
    id: record.id,
    name: record.name,
    category: record.category,
    description: record.description,
    tier: record.tier,
    props: record.props,
    variants: undefined,
    subComponents: record.subComponents,
    importStatement,
    dependencies: record.dependencies ?? { internal: [], external: [] },
    examples: record.examples ?? [],
    accessibility: record.accessibility,
  };
}
