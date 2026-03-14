/**
 * MCP Prompts: Screen Generation Workflow
 * Current production workflow for guarded direct-write screen generation
 */

export function getScreenWorkflowPrompt() {
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `# FramingUI Screen Generation Workflow

This is the current production workflow for building screens with FramingUI.

Prerequisite: authenticate with \`framingui-mcp login\` or provide \`FRAMINGUI_API_KEY\`.
Optional: call \`whoami\` to inspect licensed themes before starting.

## Overview

The production workflow is **guarded direct write**:
- ✅ Gather component contracts, theme context, layout hints, and starter structure
- ✅ Validate the Screen Definition before writing code
- ✅ Write React code directly using FramingUI components and props from context
- ✅ Verify dependencies, Tailwind setup, and raw HTML/style escapes before delivery

This is **not** the old \`generate_screen\`-first workflow.
\`generate_screen\` may still be used as an optional helper, but the default production path is:

\`preview-theme\` → \`get-screen-generation-context\` → \`preview-component\` / \`list-icon-libraries\` when needed → \`validate-screen-definition\` → write code directly → \`validate-environment\`

## React Native Note

For Expo or React Native projects:
- pass \`"platform": "react-native"\` to \`get-screen-generation-context\`
- prefer \`@framingui/react-native\` exports over app-local wrappers for common UI
- write code directly with \`StyleSheet.create\`
- run \`validate-environment\` with \`sourceFiles\` to catch web-only imports, \`className\`, and raw token drift

## Step 1/4: Gather Context

**Primary tool:** \`get-screen-generation-context\`

Use this at the start of every screen task.

**Recommended input:**
\`\`\`json
{
  "description": "Blog main page with square-minimalism theme, mobile optimized",
  "themeId": "square-minimalism",
  "includeExamples": false
}
\`\`\`

Set \`includeExamples: false\` when you want a smaller response and do not need example screen definitions.

**What to review from the response:**
- \`templateMatch\` as a layout hint only
- \`components\` as the source of truth for imports, props, and variants
- \`schema.screenDefinition\`
- \`themeRecipes\`
- \`hints\`
- \`workflow\`

**Escalate to discovery tools when needed:**
- Call \`preview-theme\` if theme application is still unclear
- Call \`preview-component\` when a component contract is ambiguous
- Call \`list-icon-libraries\` if the screen needs icons and the icon set is still undecided

## Critical Handling Rule

Treat MCP tool responses as structured tool output, not as shell text.

- Do **not** copy MCP transcript text into a file and run \`python\`, \`node\`, \`jq\`, or \`json.loads(...)\` against it
- Do **not** parse rendered transcript blocks such as \`⎿ { ... }\`, truncation markers, or console summaries
- Do **not** treat UI-expanded output or chat transcript text as canonical JSON
- Use the tool result directly in the agent context

If you must persist data, write **only the raw JSON object** from the tool result, with no surrounding transcript text.

## Step 2/4: Create and Validate a Screen Definition

**Tool:** \`validate-screen-definition\`

Create a Screen Definition JSON object using the schema and starter guidance from Step 1, then validate it before writing React code.

**Validation input:**
\`\`\`json
{
  "definition": {
    "id": "blog-home",
    "shell": "shell.web.marketing",
    "page": "page.blog",
    "themeId": "square-minimalism",
    "sections": [
      {
        "id": "hero",
        "pattern": "section.container",
        "components": []
      }
    ]
  },
  "strict": true
}
\`\`\`

**Expect from validation:**
- \`valid\`
- \`errors\`
- \`warnings\`
- \`suggestions\`
- \`autoFixPatches\`

Always apply validation fixes before writing code.

## Step 3/4: Write React Code Directly

Write production React code directly after validation passes.

**Required rules:**
- Prefer FramingUI components from \`@framingui/ui\`
- Use the exact import statements, props, and variants provided in the Step 1 context
- Use semantic HTML wrappers like \`header\`, \`main\`, \`section\`, and \`footer\` only for document structure
- Do not replace available FramingUI interactive or form primitives with raw HTML
- Do not claim a component is unavailable unless the catalog or preview tools confirmed that

**Styling rules:**
- Respect the detected style contract
- If the project is using FramingUI native styles, ensure \`@import '@framingui/ui/styles';\` is present in global CSS
- If the project is preserving host utilities, still prefer token-backed utilities and theme recipes over arbitrary raw values
- Avoid hardcoded design values when FramingUI tokens, variants, or recipes already exist

## Step 4/4: Validate the Target Environment and Output

**Tool:** \`validate-environment\`

Run this after writing code when the target package path is known.

Use it to verify:
- missing dependencies
- install commands
- Tailwind setup
- raw HTML primitives or styling escapes in generated source files

If the tool reports missing setup or raw primitive drift, fix the code before delivery.

## Best Practices

1. Start with \`get-screen-generation-context\`
2. Use \`includeExamples: false\` unless examples are actually needed
3. Treat \`templateMatch\` as a hint, not a hard constraint
4. Treat \`components\` as the source of truth
5. Validate the definition before writing JSX
6. Never parse MCP transcript text with shell or Python JSON tooling
7. Run \`validate-environment\` before handoff

## Optional Helper Path

\`generate_screen\` remains available as an optional helper for reference code generation, but it is not the default production workflow and should not replace validation plus direct writing.`,
        },
      },
    ],
  };
}
