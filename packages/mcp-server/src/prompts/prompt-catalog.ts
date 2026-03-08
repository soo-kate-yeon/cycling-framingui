import { getA11yWorkflowPrompt } from './a11y-workflow.js';
import { getCommandHelpPrompt } from './command-help.js';
import { getDraftCommandPrompt } from './draft-command.js';
import { getDoctorWorkflowPrompt } from './doctor-workflow.js';
import { getGettingStartedPrompt } from './getting-started.js';
import { getResponsiveWorkflowPrompt } from './responsive-workflow.js';
import { getScreenCommandPrompt } from './screen-command.js';
import { getScreenWorkflowPrompt } from './screen-workflow.js';
import { getSlashCommandsPrompt } from './slash-commands.js';
import { getThemeSwapWorkflowPrompt } from './theme-swap-workflow.js';
import { getUpdateWorkflowPrompt } from './update-workflow.js';

export interface PromptArgumentDefinition {
  name: string;
  required?: boolean;
  description: string;
}

export interface PromptDefinition {
  name: string;
  description: string;
  arguments: PromptArgumentDefinition[];
  getPrompt: (args?: Record<string, string>) => {
    messages: Array<{
      role: string;
      content: {
        type: string;
        text: string;
      };
    }>;
  };
}

const promptCatalog: PromptDefinition[] = [
  {
    name: 'getting-started',
    description:
      'Complete getting started guide for FramingUI including authentication, theme exploration, slash command discovery, and screen generation workflow',
    arguments: [],
    getPrompt: () => getGettingStartedPrompt(),
  },
  {
    name: 'screen-workflow',
    description: 'Detailed screen generation workflow for /screen, /section, and /draft flows',
    arguments: [],
    getPrompt: () => getScreenWorkflowPrompt(),
  },
  {
    name: 'screen',
    description: 'Alias prompt for /screen usage and workflow contract',
    arguments: [],
    getPrompt: () => getScreenCommandPrompt(),
  },
  {
    name: 'draft',
    description: 'Alias prompt for /draft usage and workflow contract',
    arguments: [],
    getPrompt: () => getDraftCommandPrompt(),
  },
  {
    name: 'responsive-workflow',
    description: 'Responsive optimization workflow backing the /responsive command',
    arguments: [],
    getPrompt: () => getResponsiveWorkflowPrompt(),
  },
  {
    name: 'a11y-workflow',
    description: 'Accessibility audit workflow backing the /a11y command',
    arguments: [],
    getPrompt: () => getA11yWorkflowPrompt(),
  },
  {
    name: 'theme-swap-workflow',
    description: 'Theme application workflow backing the /theme-swap command',
    arguments: [],
    getPrompt: () => getThemeSwapWorkflowPrompt(),
  },
  {
    name: 'doctor-workflow',
    description: 'Environment and setup diagnosis workflow backing /doctor and /install-check',
    arguments: [],
    getPrompt: () => getDoctorWorkflowPrompt(),
  },
  {
    name: 'update-workflow',
    description: 'Package update workflow backing the /update command',
    arguments: [],
    getPrompt: () => getUpdateWorkflowPrompt(),
  },
  {
    name: 'slash-commands',
    description: 'Slash command catalog for FramingUI design workflows',
    arguments: [],
    getPrompt: () => getSlashCommandsPrompt(),
  },
  {
    name: 'command-help',
    description: 'Detailed help metadata for one slash command',
    arguments: [
      {
        name: 'command',
        required: true,
        description: 'Slash command name such as /screen, /responsive, or /update',
      },
    ],
    getPrompt: args => getCommandHelpPrompt(args?.command),
  },
];

export function listPromptDefinitions(): Array<{
  name: string;
  description: string;
  arguments: PromptArgumentDefinition[];
}> {
  return promptCatalog.map(({ name, description, arguments: args }) => ({
    name,
    description,
    arguments: args,
  }));
}

export function getPromptDefinition(name: string): PromptDefinition | undefined {
  return promptCatalog.find(prompt => prompt.name === name);
}
