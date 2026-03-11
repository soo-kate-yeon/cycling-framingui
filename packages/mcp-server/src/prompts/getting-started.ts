/**
 * MCP Prompts: Getting Started with Framingui
 * Universal guidance for all MCP clients (Claude Code, OpenAI Codex, etc.)
 */

/**
 * Getting Started prompt for Framingui workflow
 * Provides authentication guidance, theme exploration, and screen generation workflow
 */
export function getGettingStartedPrompt() {
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `# Getting Started with FramingUI

## Step 1: Authentication (Required)

Before generating screens, authenticate with your Framingui account:

\`\`\`bash
framingui-mcp login
\`\`\`

This opens your browser for OAuth authentication. Your credentials are stored in \`~/.framingui/credentials.json\`.

**Why authentication is required:**
- All 6 themes require valid licenses
- No free themes are available
- Authentication verifies your license status

## Step 2: Call whoami (Recommended Session Check)

**Call the \`whoami\` tool when you want to inspect the current session.**
It is useful right after login or when debugging theme access, but it is no longer a required first step.

\`\`\`
Call whoami (no parameters needed)
\`\`\`

**What it returns:**
- Your subscription plan (free/pro/enterprise/master)
- List of licensed themes you can access
- MCP tool support period and renewal status

**IMPORTANT:** Only use themes listed in \`licensedThemes\` from the whoami response.
Attempting to use unlicensed themes will fail.

## Step 3: Explore Available Themes

Use MCP tools to discover themes:

\`\`\`
1. Call list-themes to see your licensed themes
2. Call preview-theme with a themeId to see design tokens
3. Choose a theme for your project
\`\`\`

You can call \`list-themes\` and \`preview-theme\` directly after authentication without calling \`whoami\` first.

**Available themes (all require license):**
- classic-magazine - Classic magazine style
- dark-boldness - Fitness & wellness
- minimal-workspace - Minimal workspace
- neutral-workspace - Neutral humanism
- pebble - Round minimal
- square-minimalism - Square minimalism

## Step 4: Check Component Availability

Before creating screen definitions:

\`\`\`
1. Call list-components to see 30+ available UI components
2. Call preview-component for specific component props and variants
3. Identify components needed for your screen
\`\`\`

## Step 5: Generate Your First Screen

Follow the 3-step workflow:

**Step 1/3:** Call \`get-screen-generation-context\` with your screen description
- Returns: Template hints, component suggestions with inline props, schema
- Use \`includeExamples: false\` when you want a smaller response and do not need sample screen definitions

**Step 2/3:** Create Screen Definition JSON, then call \`validate-screen-definition\`
- Returns: Validation results, errors with auto-fix patches, suggestions

**After validation passes:** Write React code directly using the components and props from Step 1

**Step 3/3 (Optional):** Call \`validate-environment\` with project path
- Returns: Missing packages, install commands, Tailwind config status

## Common Mistakes to Avoid

1. ❌ Skipping authentication - All themes require licenses
2. ❌ Assuming whoami is a hard prerequisite - it is optional session inspection, not a hidden unlock step
3. ❌ Using non-existent theme IDs - Only 6 themes exist
4. ❌ Skipping validate-screen-definition - Always validate before writing code
5. ❌ Ignoring dependencies warnings - Check required packages before running code
6. ❌ Using unlicensed themes - Only use themes from whoami licensedThemes list
7. ❌ Parsing MCP transcript text with shell/python/json tools - Use tool output directly instead
8. ❌ Treating templateMatch as the source of truth - components and preview tools are the contract

## Need Help?

- Check \`FRAMINGUI-GUIDE.md\` in your project root
- Read \`CLAUDE.md\` for Claude Code specific patterns (if available)
- Read \`AGENTS.md\` for generic AI agent guidance (if available)`,
        },
      },
    ],
  };
}
