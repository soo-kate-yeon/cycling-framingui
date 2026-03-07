export type SlashCommandName =
  | '/screen'
  | '/section'
  | '/draft'
  | '/responsive'
  | '/a11y'
  | '/theme-swap'
  | '/doctor'
  | '/install-check'
  | '/export'
  | '/update';

export interface SlashCommandArgument {
  name: string;
  required: boolean;
  description: string;
}

export interface SlashCommandOption {
  name: string;
  description: string;
  values?: string[];
}

export interface SlashCommandDefinition {
  name: SlashCommandName;
  summary: string;
  usage: string;
  args: SlashCommandArgument[];
  options: SlashCommandOption[];
  examples: string[];
  workflow: string[];
  promptRecipe: string;
}

const slashCommandRegistry: SlashCommandDefinition[] = [
  {
    name: '/screen',
    summary: 'Generate a full screen from a natural-language description.',
    usage:
      '/screen <description> [--theme <themeId>] [--platform web|mobile] [--template <id>] [--output draft|code]',
    args: [
      {
        name: 'description',
        required: true,
        description: 'Natural-language screen description.',
      },
    ],
    options: [
      {
        name: '--theme',
        description: 'Apply a specific FramingUI theme.',
      },
      {
        name: '--platform',
        description: 'Target platform.',
        values: ['web', 'mobile'],
      },
      {
        name: '--template',
        description: 'Prefer a specific screen template id when one is known.',
      },
      {
        name: '--output',
        description: 'Return only a draft or full generated code.',
        values: ['draft', 'code'],
      },
    ],
    examples: [
      '/screen "B2B analytics dashboard with KPI cards and recent activity" --theme minimal-workspace',
      '/screen "mobile login screen with social auth" --platform mobile',
    ],
    workflow: [
      'get-screen-generation-context',
      'validate-screen-definition',
      'generate_screen',
      'validate-environment',
    ],
    promptRecipe: 'screen-workflow',
  },
  {
    name: '/section',
    summary: 'Generate or replace a section inside an existing screen.',
    usage:
      '/section <description> [--slot header|main|sidebar|footer] [--into <screen-id|file>] [--replace <section-id>]',
    args: [
      {
        name: 'description',
        required: true,
        description: 'Natural-language section description.',
      },
    ],
    options: [
      {
        name: '--slot',
        description: 'Preferred layout slot for the section.',
        values: ['header', 'main', 'sidebar', 'footer'],
      },
      {
        name: '--into',
        description: 'Target screen id or file path.',
      },
      {
        name: '--replace',
        description: 'Existing section id to replace.',
      },
    ],
    examples: [
      '/section "stats summary with 4 KPI cards" --slot main --into dashboard.json',
      '/section "pricing comparison table" --replace hero-pricing',
    ],
    workflow: [
      'list-components',
      'preview-component',
      'validate-screen-definition',
      'generate_screen',
    ],
    promptRecipe: 'screen-workflow',
  },
  {
    name: '/draft',
    summary: 'Create a screen draft before code generation.',
    usage: '/draft <description> [--theme <themeId>] [--platform web|mobile] [--variants <n>]',
    args: [
      {
        name: 'description',
        required: true,
        description: 'Natural-language screen description.',
      },
    ],
    options: [
      {
        name: '--theme',
        description: 'Apply a specific FramingUI theme.',
      },
      {
        name: '--platform',
        description: 'Target platform.',
        values: ['web', 'mobile'],
      },
      {
        name: '--variants',
        description: 'Number of draft alternatives to propose.',
      },
    ],
    examples: [
      '/draft "settings page for team permissions" --theme neutral-workspace',
      '/draft "creator profile page" --variants 3',
    ],
    workflow: ['get-screen-generation-context', 'list-screen-templates', 'preview-screen-template'],
    promptRecipe: 'screen-workflow',
  },
  {
    name: '/responsive',
    summary: 'Optimize an existing screen for responsive layouts.',
    usage:
      '/responsive <target> [--mode mobile-first|tablet-safe|touch-optimized] [--density preserve|denser|lighter] [--breakpoint sm|md|lg]',
    args: [
      {
        name: 'target',
        required: true,
        description: 'Screen file, definition, or current selection context.',
      },
    ],
    options: [
      {
        name: '--mode',
        description: 'Primary responsive optimization strategy.',
        values: ['mobile-first', 'tablet-safe', 'touch-optimized'],
      },
      {
        name: '--density',
        description: 'Information density strategy.',
        values: ['preserve', 'denser', 'lighter'],
      },
      {
        name: '--breakpoint',
        description: 'Primary breakpoint to focus on first.',
        values: ['sm', 'md', 'lg'],
      },
    ],
    examples: [
      '/responsive ./screen.json --mode mobile-first',
      '/responsive dashboard.tsx --mode touch-optimized --density lighter',
    ],
    workflow: ['list_tokens', 'validate-screen-definition', 'generate_screen'],
    promptRecipe: 'responsive-workflow',
  },
  {
    name: '/a11y',
    summary: 'Audit and optionally fix accessibility issues.',
    usage: '/a11y <target> [--fix] [--scope full|form|dialog|nav]',
    args: [
      {
        name: 'target',
        required: true,
        description: 'Screen file, definition, or current selection context.',
      },
    ],
    options: [
      {
        name: '--fix',
        description: 'Regenerate output or return a patch when safe fixes are available.',
      },
      {
        name: '--scope',
        description: 'Limit the audit to a subset of the UI.',
        values: ['full', 'form', 'dialog', 'nav'],
      },
    ],
    examples: ['/a11y ./screen.json', '/a11y app/dashboard/page.tsx --fix --scope form'],
    workflow: ['validate-screen-definition', 'preview-component', 'generate_screen'],
    promptRecipe: 'a11y-workflow',
  },
  {
    name: '/theme-swap',
    summary: 'Reapply the same screen structure under a different theme.',
    usage: '/theme-swap <target> --to <themeId> [--from <themeId>] [--output code|diff]',
    args: [
      {
        name: 'target',
        required: true,
        description: 'Screen file, definition, or current selection context.',
      },
    ],
    options: [
      {
        name: '--to',
        description: 'Target theme id.',
      },
      {
        name: '--from',
        description: 'Current theme id if known.',
      },
      {
        name: '--output',
        description: 'Return full code or only a diff-style summary.',
        values: ['code', 'diff'],
      },
    ],
    examples: [
      '/theme-swap ./screen.json --to classic-magazine',
      '/theme-swap dashboard.tsx --from minimal-workspace --to square-minimalism --output diff',
    ],
    workflow: ['list-themes', 'preview-theme', 'generate_screen', 'validate-environment'],
    promptRecipe: 'theme-swap-workflow',
  },
  {
    name: '/doctor',
    summary: 'Diagnose whether the current project is ready for FramingUI workflows.',
    usage: '/doctor [<project-path>] [--auth] [--tailwind] [--themes] [--fix-hints]',
    args: [
      {
        name: 'project-path',
        required: false,
        description: 'Project path or package.json path. Defaults to the current workspace.',
      },
    ],
    options: [
      {
        name: '--auth',
        description: 'Inspect authentication and session status.',
      },
      {
        name: '--tailwind',
        description: 'Inspect Tailwind configuration for FramingUI compatibility.',
      },
      {
        name: '--themes',
        description: 'Inspect theme access and previewability.',
      },
      {
        name: '--fix-hints',
        description: 'Return prioritized next actions and install hints.',
      },
    ],
    examples: ['/doctor', '/doctor . --tailwind --fix-hints'],
    workflow: ['whoami', 'list-themes', 'validate-environment'],
    promptRecipe: 'doctor-workflow',
  },
  {
    name: '/install-check',
    summary: 'Check install and environment prerequisites for generated output.',
    usage: '/install-check [<project-path>] [--for <screen|section|file>] [--packages-only]',
    args: [
      {
        name: 'project-path',
        required: false,
        description: 'Project path or package.json path. Defaults to the current workspace.',
      },
    ],
    options: [
      {
        name: '--for',
        description: 'Reference artifact to derive package requirements from.',
        values: ['screen', 'section', 'file'],
      },
      {
        name: '--packages-only',
        description: 'Skip deeper config checks and only report packages.',
      },
    ],
    examples: ['/install-check . --for ./screen.json', '/install-check . --packages-only'],
    workflow: ['validate-environment'],
    promptRecipe: 'doctor-workflow',
  },
  {
    name: '/export',
    summary: 'Export a draft or screen artifact to a concrete output format.',
    usage: '/export <target> [--format tsx|jsx|json] [--out <path>]',
    args: [
      {
        name: 'target',
        required: true,
        description: 'Blueprint, draft, screen definition, or current selection context.',
      },
    ],
    options: [
      {
        name: '--format',
        description: 'Output format.',
        values: ['tsx', 'jsx', 'json'],
      },
      {
        name: '--out',
        description: 'Suggested output file path.',
      },
    ],
    examples: ['/export ./screen.json --format tsx', '/export draft-landing.json --format json'],
    workflow: ['export-screen', 'generate_screen'],
    promptRecipe: 'screen-workflow',
  },
  {
    name: '/update',
    summary: 'Update installed FramingUI packages in the current project.',
    usage: '/update [<project-path>] [--check]',
    args: [
      {
        name: 'project-path',
        required: false,
        description: 'Project path. Defaults to the current workspace.',
      },
    ],
    options: [
      {
        name: '--check',
        description: 'Show the detected package-manager update command without running it.',
      },
    ],
    examples: ['/update', '/update . --check'],
    workflow: ['doctor-workflow'],
    promptRecipe: 'update-workflow',
  },
];

export function listSlashCommands(): SlashCommandDefinition[] {
  return slashCommandRegistry;
}

export function normalizeSlashCommandName(command: string): string {
  if (!command) {
    return command;
  }

  return command.startsWith('/') ? command : `/${command}`;
}

export function getSlashCommand(command: string): SlashCommandDefinition | undefined {
  const normalized = normalizeSlashCommandName(command.trim());
  return slashCommandRegistry.find(entry => entry.name === normalized);
}
