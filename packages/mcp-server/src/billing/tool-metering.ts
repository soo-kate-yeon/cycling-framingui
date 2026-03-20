export type ToolMeteringClass =
  | 'account'
  | 'discovery'
  | 'context'
  | 'generation'
  | 'guarded'
  | 'execution';

export interface ToolMeteringRule {
  toolName: string;
  billable: boolean;
  toolClass: ToolMeteringClass;
  units: number;
}

const TOOL_METERING_RULES: Record<string, ToolMeteringRule> = {
  whoami: {
    toolName: 'whoami',
    billable: false,
    toolClass: 'account',
    units: 0,
  },
  'detect-project-context': {
    toolName: 'detect-project-context',
    billable: false,
    toolClass: 'account',
    units: 0,
  },
  'list-icon-libraries': {
    toolName: 'list-icon-libraries',
    billable: true,
    toolClass: 'discovery',
    units: 1,
  },
  'preview-icon-library': {
    toolName: 'preview-icon-library',
    billable: true,
    toolClass: 'discovery',
    units: 1,
  },
  'list-themes': {
    toolName: 'list-themes',
    billable: true,
    toolClass: 'discovery',
    units: 1,
  },
  'preview-theme': {
    toolName: 'preview-theme',
    billable: true,
    toolClass: 'context',
    units: 2,
  },
  list_tokens: {
    toolName: 'list_tokens',
    billable: true,
    toolClass: 'discovery',
    units: 1,
  },
  'list-components': {
    toolName: 'list-components',
    billable: true,
    toolClass: 'discovery',
    units: 1,
  },
  'preview-component': {
    toolName: 'preview-component',
    billable: true,
    toolClass: 'discovery',
    units: 1,
  },
  'list-screen-templates': {
    toolName: 'list-screen-templates',
    billable: true,
    toolClass: 'discovery',
    units: 1,
  },
  'preview-screen-template': {
    toolName: 'preview-screen-template',
    billable: true,
    toolClass: 'context',
    units: 2,
  },
  'get-screen-generation-context': {
    toolName: 'get-screen-generation-context',
    billable: true,
    toolClass: 'context',
    units: 2,
  },
  'generate-blueprint': {
    toolName: 'generate-blueprint',
    billable: true,
    toolClass: 'generation',
    units: 4,
  },
  generate_screen: {
    toolName: 'generate_screen',
    billable: true,
    toolClass: 'generation',
    units: 4,
  },
  'export-screen': {
    toolName: 'export-screen',
    billable: true,
    toolClass: 'execution',
    units: 10,
  },
  validate_screen: {
    toolName: 'validate_screen',
    billable: true,
    toolClass: 'guarded',
    units: 6,
  },
  'validate-screen-definition': {
    toolName: 'validate-screen-definition',
    billable: true,
    toolClass: 'guarded',
    units: 6,
  },
  'validate-environment': {
    toolName: 'validate-environment',
    billable: true,
    toolClass: 'guarded',
    units: 6,
  },
};

const DEFAULT_TOOL_RULE: ToolMeteringRule = {
  toolName: 'unknown',
  billable: true,
  toolClass: 'execution',
  units: 10,
};

export function getToolMeteringRule(toolName: string): ToolMeteringRule {
  return (
    TOOL_METERING_RULES[toolName] ?? {
      ...DEFAULT_TOOL_RULE,
      toolName,
    }
  );
}

export function listToolMeteringRules(): ToolMeteringRule[] {
  return Object.values(TOOL_METERING_RULES);
}
